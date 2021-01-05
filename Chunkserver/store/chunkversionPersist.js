
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Chunkserver
 * @copyright: liningftp@qq.com
 * @name: chunkversionPersist
 * @desc: manage store of chunk version
 * @file: /store/chunkversionPersist.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START
const {utilfs, clog, jsonlog} = require('../../base');

const nameLen = 64;
const verLen = 8;
const unitLen = nameLen + 1 + verLen + 1;
// END
// REQUIRE_END


// PUBLIC_METHOD_START [load]
/**
 * load version file to memory
 * @chunkversionData     {JSON}   chunkversion of all chunk on local, @example {}
 * @chunkversionFreeData {Array}  free position of chunkversion file, @example []
 * @versionPath          {String} path of file to save version of chunk, @example "C:\work\GFS2\AppData\chunkserver\version1\data"
 */
exports.load = function( chunkversionData, chunkversionFreeData, versionPath ){
// START
  let [code, msg, content] = utilfs.readSync(versionPath);
  if(0 != code){
    msg = `versionPersist.js load Error:${msg}`;
    return [code, msg];
  }

  content = Buffer.from(content);

  let index = 0;
  while(true){
    let start = unitLen * index;
    let end = unitLen * (index + 1);
    let item = content.slice(start, end);

    if( !item || !item.byteLength ){
      break;
    }

    if( item && item.byteLength === unitLen ){
      let [chunkName, version] = exports.decode(item);
      if( chunkName ){
        chunkversionData[chunkName] = [index, version];
      }
      else{
        chunkversionFreeData.push(index);
      }
    }

    index++;
  }

  return [chunkversionData, chunkversionFreeData];
// END
};
// PUBLIC_METHOD_END [load]


// PUBLIC_METHOD_START [addChunk]
/**
 * add chunk
 * @chunkName   {String} name of chunk, @example "ab83e19265655130b208def31e0c483ecb835a24a9a7508eaec0df0e62e65870"
 * @version     {Number} version number, @example 1
 * @versionPath {String} path of file to save version of chunk, @example "C:\work\GFS2\AppData\chunkserver\version1\data"
 * @itemIndex   {Number} index of item, @example 0
 */
exports.addChunk = function( chunkName, version, versionPath, itemIndex ){
// START
  let result = {};

  let content = exports.encode(chunkName, version);
  if( /^\d+$/.test(itemIndex) ){
    let baseStart = parseInt(itemIndex) * unitLen;
    [result.code, result.msg] = utilfs.override(versionPath, content, baseStart);
  }
  else{
    [result.code, result.msg] = utilfs.appendSync(versionPath, content);
  }

  if(0 != result.code){
    result.msg = `Error: addChunk version fail! Detail: itemIndex->${itemIndex}, chunkName->${chunkName}, ${msg}`;
  }

  return result;
// END
};
// PUBLIC_METHOD_END [addChunk]


// PUBLIC_METHOD_START [deleteChunk]
/**
 * delete chunk
 * @itemIndex   {Number} index of item, @example 0
 * @versionPath {String} path of file to save version of chunk, @example "C:\work\GFS2\AppData\chunkserver\version1\data"
 */
exports.deleteChunk = function( itemIndex, versionPath ){
// START
  let result = {};

  let baseStart = itemIndex * unitLen;
  let content = '0'.repeat(unitLen - 1) + ';';
  [result.code, result.msg] = utilfs.override(versionPath, content, baseStart);

  return result;
// END
};
// PUBLIC_METHOD_END [deleteChunk]


// PUBLIC_METHOD_START [setVersion]
/**
 * set version
 * @chunkName   {String} name of chunk, @example "ab83e19265655130b208def31e0c483ecb835a24a9a7508eaec0df0e62e65870"
 * @version     {Number} version number, @example 80
 * @versionPath {String} path of file to save version of chunk, @example "C:\work\GFS2\AppData\chunkserver\version1\data"
 * @itemIndex   {Number} index of item, @example 0
 */
exports.setVersion = function( chunkName, version, versionPath, itemIndex ){
// START
  let result = {};

  let baseStart = parseInt(itemIndex) * unitLen;
  let content = exports.encode(chunkName, version);
  [result.code, result.msg] = utilfs.override( versionPath, content, baseStart );

  if(0 != result.code){
    result.msg = `Error: setVersion version fail! Detail: itemIndex->${itemIndex}, chunkName->${chunkName}, ${result.msg}`;
  }

  return result;
// END
};
// PUBLIC_METHOD_END [setVersion]


// PUBLIC_METHOD_START [encode]
/**
 * encode
 * @chunkName {String} name of chunk, @example "ab83e19265655130b208def31e0c483ecb835a24a9a7508eaec0df0e62e65870"
 * @version   {Number} version number, @example 3
 */
exports.encode = function( chunkName, version ){
// START
  let versionStr = ('0'.repeat(verLen) + version).slice(-1 * verLen);

  let content = `${chunkName},${versionStr};`;

  return content;
// END
};
// PUBLIC_METHOD_END [encode]


// PUBLIC_METHOD_START [decode]
/**
 * decode
 * @encodedContent {Buffer} encoded content, @example Buffer.from("ab83e19265655130b208def31e0c483ecb835a24a9a7508eaec0df0e62e65870,00000008;")
 */
exports.decode = function( encodedContent ){
// START
  let contentStr = Buffer.isBuffer(encodedContent) ? encodedContent.toString() : encodedContent;

  let nameStart = 0;
  let verStart = nameStart + nameLen + 1;

  let chunkName = contentStr.slice(nameStart, nameStart + nameLen);
  let version = 0;
  if( /^0+$/.test(chunkName) ){
    chunkName = '';
  }
  else{
    version = contentStr.slice(verStart, verStart + verLen).replace(/^0+/, '') - 0
  }

  return [chunkName, version];
// END
};
// PUBLIC_METHOD_END [decode]


