
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Chunkserver
 * @copyright: liningftp@qq.com
 * @name: checksumPersist
 * @desc: chunkName(64B),checksumCount(4B),checksumList(1024 * 12B);
 * @file: /store/checksumPersist.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START
const {utilfs, util, clog} = require('../../base');

const nameLen = 64; // 块名称占用字节数, 64
const countLen = 4; // 校验和个数占用的字节数, 4 // 块最大64M，每个block为64K，所以最多有1024个校验和，4个字节来表示

const sumLen = 12; // 每个校验和值占用字节数, 12
const maxCount = 1024; //校验和的最大数量
// 每个块所有校验和占用的总字节数, 固定长度值12359，其中的1是标点符号字节数
const unitLen = nameLen + 1 + countLen + 1 + (sumLen * maxCount) + 1;
// END
// REQUIRE_END


// PUBLIC_METHOD_START [load]
/**
 * load content from disk
 * @checksumData     {JSON}   checksumdata of all chunk on local, @example {}
 * @checksumFreeData {Array}  free position of checksum file, @example []
 * @checksumPath     {String} path of file to save checksum of chunk, @example "C:\work\GFS2\AppData\chunkserver\checksum1\data"
 */
exports.load = function( checksumData, checksumFreeData, checksumPath ){
// START
  let result = {}, contentData;

  [result.code, result.msg, contentData] = utilfs.readSync(checksumPath);
  if(0 != result.code){
    util.result( result, -1, 'LOAD_ERROR', `${checksumPath}, ${result.msg}` );
    return result;
  }

  if( !Buffer.isBuffer(contentData) ){
    contentData = Buffer.from(contentData);
  }

  let index = 0;
  while(true){
    let start = unitLen * index;
    let end = start + unitLen;
    let item = contentData.slice(start, end);

    if(!item || !item.byteLength){
      break;
    }

    if( item && item.byteLength === unitLen ){
      let [chunkName, checksumList] = exports.decode(item);
      if( chunkName ){
        checksumData[chunkName] = [index, checksumList];
      }
      else{
        checksumFreeData.push(index);
      }
    }

    index++;
  }

  return [checksumData, checksumFreeData];
// END
};
// PUBLIC_METHOD_END [load]


// PUBLIC_METHOD_START [addChunk]
/**
 * add new chunk to disk
 * @chunkName    {String} name of chunk, @example "ab83e19265655130b208def31e0c483ecb835a24a9a7508eaec0df0e62e65870"
 * @checksumList {Array}  list of checksum, @example [-1234567890, 1234567890]
 * @checksumPath {String} path of file to save checksum of chunk, @example "C:\work\GFS2\AppData\chunkserver\checksum1\data"
 * @freeIndex    {Number} index of free item, @example 0
 */
exports.addChunk = function( chunkName, checksumList, checksumPath, freeIndex ){
// START
  let result = {};

  if(!checksumList || !checksumList.length){
    [result.code, result.msg]  = [-1, 'ERROR: checksumList is Empty!'];
    return result;
  }

  let content = exports.encode(chunkName, checksumList);
  if( /^\d+$/.test(freeIndex) ){
    let baseStart = parseInt(freeIndex) * unitLen;
    // 在指定位置写入该chunk的校验和信息
    [result.code, result.msg] = utilfs.override(checksumPath, content, baseStart);
  }
  else{
    // 写入磁盘文件
    [result.code, result.msg] = utilfs.appendSync(checksumPath, content);
  }

  if(0 != result.code){
    result.msg = `Error: addChunk checksum fail! Detail: freeIndex->${freeIndex}, chunkName->${chunkName}, ${result.msg}`;
  }

  return result;
// END
};
// PUBLIC_METHOD_END [addChunk]


// PUBLIC_METHOD_START [deleteChunk]
/**
 * delete chunk
 * @itemIndex    {Number} index of item, @example 0
 * @checksumPath {String} path of file to save checksum of chunk, @example "C:\work\GFS2\AppData\chunkserver\checksum1\data"
 */
exports.deleteChunk = function( itemIndex, checksumPath ){
// START
  let result = {};

  let baseStart = itemIndex * unitLen;
  let content = '0'.repeat(unitLen - 1) + ';';
  // 重新写入该chunk的校验和信息
  [result.code, result.msg] = utilfs.override(checksumPath, content, baseStart);

  return result;
// END
};
// PUBLIC_METHOD_END [deleteChunk]


// PUBLIC_METHOD_START [setChecksum]
/**
 * set checksum
 * @chunkName    {String} name of chunk, @example "ab83e19265655130b208def31e0c483ecb835a24a9a7508eaec0df0e62e65870"
 * @checksumList {Array}  list of checksum, @example [-1, 2]
 * @checksumPath {String} path of file to save checksum of chunk, @example "C:\work\GFS2\AppData\chunkserver\checksum1\data"
 * @itemIndex    {Number} index of item, @example 0
 */
exports.setChecksum = function( chunkName, checksumList, checksumPath, itemIndex ){
// START
  let result = {};

  if(!checksumList || !checksumList.length){
    [result.code, result.msg]  = [-1, 'ERROR: checksumList is Empty!'];
    return result;
  }

  let baseStart = parseInt(itemIndex) * unitLen;
  let content = exports.encode(chunkName, checksumList);
  // 在指定位置写入该chunk的校验和信息
  [result.code, result.msg] = utilfs.override( checksumPath, content, baseStart );

  if(0 != result.code){
    result.msg = `Error: addChunk checksum fail! Detail: itemIndex->${itemIndex}, chunkName->${chunkName}, ${result.msg}`;
  }

  return result;
// END
};
// PUBLIC_METHOD_END [setChecksum]


// PUBLIC_METHOD_START [encode]
/**
 * encode
 * @chunkName    {String} name of chunk, @example "ab83e19265655130b208def31e0c483ecb835a24a9a7508eaec0df0e62e65870"
 * @checksumList {Array}  list of checksum, @example [0]
 * @return       {Array}  返回值, @example 
 */
exports.encode = function( chunkName, checksumList ){
// START

  // 对校验和个数进行包装对齐
  let count = checksumList.length;
  let countStr = ('0'.repeat(countLen) + count).slice(-1 * countLen);

  // 对校验和的值进行包装对齐
  // -1234567890 -> 0-1234567890
  // 1234567890  -> 001234567890
  let checksumStrList = checksumList.map(checksum => {
    return ('0'.repeat(sumLen) + checksum).slice(-1 * sumLen);
  });

  let paddingEnd = '-'.repeat( sumLen * (maxCount-count) );
  // 整体内容
  let content = `${chunkName},${countStr},${checksumStrList.join('')}${paddingEnd};`;

  return content;
// END
};
// PUBLIC_METHOD_END [encode]


// PUBLIC_METHOD_START [decode]
/**
 * decode
 * @encodedContent {Buffer} encoded content, @example Buffer.from("ab83e19265655130b208def31e0c483ecb835a24a9a7508eaec0df0e62e65870,0001,000000000000------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------;")
 * @return         {JSON}   返回值, @example 解码后的数据对象
 */
exports.decode = function( encodedContent ){
// START
  let contentStr = Buffer.isBuffer(encodedContent) ? encodedContent.toString() : encodedContent;

  let nameStart = 0;
  let countStart = nameStart + nameLen + 1;
  let checksumStart = countStart + countLen + 1;

  let chunkName = contentStr.slice(nameStart, nameStart + nameLen);
  let checksumList = [];

  // 块名位置全为0，表示块被擦除后，空闲出来的位置，可以重复使用
  if( /^0+$/.test(chunkName) ){
    chunkName = '';
  }
  else{
    let count = contentStr.slice(countStart, countStart + countLen) - 0;
    let sumListStr = contentStr.slice(checksumStart, checksumStart + sumLen * count);
    for(let i = 0; i < count; i++){
      let start = i * sumLen;
      let end = start + sumLen;
      let sum = (sumListStr.slice(start, end).replace(/^0*/, '') || 0) - 0; /* 要考虑校验和值为0的情况 */
      checksumList.push(sum);
    }
  }

  return [chunkName, checksumList];
// END
};
// PUBLIC_METHOD_END [decode]

