
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Chunkserver
 * @copyright: liningftp@qq.com
 * @name: checksumTool
 * @desc: manage checksum metadata
 * @file: /metadata/tool/checksumTool.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START

const path = require('path');
const {lodash, crc32, utilfs, clog, log, jsons} = require('../../../base');

// END
// REQUIRE_END


// PUBLIC_METHOD_START [addChunk]
/**
 * add new chunk
 * @checksumData {JSON}   checksumdata of all chunk on local, @example {}
 * @chunkName    {String} name of chunk, @example "ab83e19265655130b208def31e0c483ecb835a24a9a7508eaec0df0e62e65870"
 * @checksumList {Array}  list of checksum, @example [-810311648]
 * @itemIndex    {Number} index of item, @example 2
 */
exports.addChunk = function( checksumData, chunkName, checksumList, itemIndex ){
// START
  log.args( Error(), arguments );
  checksumData[chunkName] = [itemIndex, checksumList];

  log.end( Error(), `${jsons(checksumData)}` );
  return checksumData;
// END
};
// PUBLIC_METHOD_END [addChunk]


// PUBLIC_METHOD_START [deleteChunk]
/**
 * delete chunk
 * @checksumData {JSON}   checksumdata of all chunk on local, @example {"aabbccdd":[0, [-1234567890, 123456789012]], "eegghhii":[1, [-1234567890, 123456789012]]}
 * @chunkName    {String} name of chunk, @example "eegghhii"
 */
exports.deleteChunk = function( checksumData, chunkName ){
// START
  log.args( Error(), arguments );

  delete checksumData[chunkName];

  log.end( Error(), `${jsons(checksumData)}` );
  return checksumData;
// END
};
// PUBLIC_METHOD_END [deleteChunk]


// PUBLIC_METHOD_START [getChecksum]
/**
 * get checksum
 * @checksumData {JSON}   checksumdata of all chunk on local, @example {"aabbccdd":[0, [-1234567890, 123456789012]], "eegghhii":[1, [-1234567890, 123456789012]]}
 * @chunkName    {String} name of chunk, @example "eegghhii"
 */
exports.getChecksum = function( checksumData, chunkName ){
// START
  log.args( Error(), arguments );
  let checksumList;

  if( checksumData.hasOwnProperty(chunkName) ){
    checksumList = checksumData[chunkName][1];
  }

  log.end( Error(), `${jsons(checksumList)}` );
  return checksumList;
// END
};
// PUBLIC_METHOD_END [getChecksum]


// PUBLIC_METHOD_START [setChecksum]
/**
 * set checksum
 * @checksumData {JSON}   checksumdata of all chunk on local, @example {"aabbccdd":[0, [-1234567890, 123456789012]], "eegghhii":[1, [-1234567890, 123456789012]]}
 * @chunkName    {String} name of chunk, @example "aabbccdd"
 * @checksumList {Array}  list of checksum, @example [-810311648]
 */
exports.setChecksum = function( checksumData, chunkName, checksumList ){
// START
  log.args( Error(), arguments );
  // 块信息不存在，不能直接进行设置，必须先添加
  if( checksumData.hasOwnProperty(chunkName) ){
    checksumData[chunkName][1] = checksumList;
  }

  log.end( Error(), `${jsons(checksumData)}` );
  return checksumData;
// END
};
// PUBLIC_METHOD_END [setChecksum]


// PUBLIC_METHOD_START [compare]
/**
 * compare checksum
 * @checksumData {JSON}   checksumdata of all chunk on local, @example {"aabbccdd":[0, [-1234567890, 123456789012]], "eegghhii":[1, [-1234567890, 123456789012]]}
 * @chunkName    {String} name of chunk, @example "aabbccdd"
 * @contentData  {Buffer} buffer content data, @example Buffer.from("hello wolrd")
 * @blockSize    {Number} block size for checksum, @example 65536
 */
exports.compare = function( checksumData, chunkName, contentData, blockSize ){
// START
  log.args( Error(), arguments );
  let b;

  if( checksumData.hasOwnProperty(chunkName) ){
    // 取出原来的校验和
    let checksumList = checksumData[chunkName][1];

    // 重新计算内容的校验和
    let data = exports.createChecksum(contentData, blockSize);

    // 比对结算和提供的校验和是否一致
    b = lodash.isEqual(checksumList, data);
  }

  log.end( Error(), `${jsons(b)}` );
  return b;
// END
};
// PUBLIC_METHOD_END [compare]


// PUBLIC_METHOD_START [createChecksum]
/**
 * calculate checksum
 * @contentData {Buffer} buffer content data, @example Buffer.from("")
 * @blockSize   {Number} block size for checksum, @example 65536
 */
exports.createChecksum = function( contentData, blockSize ){
// START
  log.args( Error(), arguments );
  let checksumData = [];

  contentData = Buffer.from(contentData);

  let index = 0;
  while(true){
    if( 0 == contentData.length ){
      checksumData[index] = crc32.buf(contentData);
      break;
    }
    let start = index * blockSize;
    let end = start + blockSize;
    let data = contentData.slice(start, end);
    if(!data || !data.byteLength){
      break;
    }
    checksumData[index++] = crc32.buf(data);
  }

  log.end( Error(), `${jsons(checksumData)}` );
  return checksumData;
// END
};
// PUBLIC_METHOD_END [createChecksum]


// PUBLIC_METHOD_START [getCount]
/**
 * get checksum count
 * @checksumData {JSON}   checksumdata of all chunk on local, @example {"aabbccdd":[1, 65530, [-1234567890, 123456789012]], "eegghhii":[1, 1234, [-1234567890, 123456789012]]}
 * @return       {Number} 返回值, @example 3
 */
exports.getCount = function( checksumData ){
// START
  log.args( Error(), arguments );

  let count = Object.keys(checksumData).length;

  log.end( Error(), `${jsons(count)}` );
  return count;
// END
};
// PUBLIC_METHOD_END [getCount]


// PUBLIC_METHOD_START [getChunkIndex]
/**
 * get chunk index
 * @checksumData {JSON}   checksumdata of all chunk on local, @example {"aabbccdd":[0, [-1234567890, 123456789012]], "eegghhii":[1, [-1234567890, 123456789012]]}
 * @chunkName    {String} name of chunk, @example "aabbccdd"
 */
exports.getChunkIndex = function( checksumData, chunkName ){
// START
  log.args( Error(), arguments );

  let chunkIndex  = -1;

  if( checksumData.hasOwnProperty(chunkName) ){
    chunkIndex = checksumData[chunkName][0];
  }

  log.end( Error(), `${jsons(chunkIndex)}` );
  return chunkIndex;
// END
};
// PUBLIC_METHOD_END [getChunkIndex]


