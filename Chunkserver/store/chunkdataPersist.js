
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Chunkserver
 * @copyright: liningftp@qq.com
 * @name: chunkdataPersist
 * @desc: manage store of chunk data
 * @file: /store/chunkdataPersist.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START
const fs = require('fs');
const path = require('path');
const {utilfs, util, clog, log, jsons} = require('../../base');
// END
// REQUIRE_END


// PUBLIC_METHOD_START [load]
/**
 * load chunk from disk
 * @chunkData {JSON}   base info of all chunk on local, @example {}
 * @chunkRoot {String} root directory where the chunk is stored, @example "C:\work\GFS2\AppData\chunkserver\chunk1"
 */
exports.load = function( chunkData, chunkRoot ){
// START
  log.args( Error(), arguments );

  let result = {};

  let [code, msg, data, totalSize] = utilfs.getAllFiles(chunkRoot);
  if(0 != code){
    util.result( result, -1, 'LOAD_ERROR', `${msg}`);
    return result;
  }

  for(const item of data){
    let chunkName = item.fileName;
    chunkData[chunkName] = [item.size, 0];
  }
  util.result( result, 0);

  log.end( Error(), jsons(result) );
  return result;
// END
};
// PUBLIC_METHOD_END [load]


// PUBLIC_METHOD_START [create]
/**
 * create new chunk
 * @chunkRoot {String} root directory where the chunk is stored, @example "C:\work\GFS2\AppData\chunkserver\chunk1"
 * @chunkName {String} name of chunk, @example "aabbccdd"
 */
exports.create = function( chunkRoot, chunkName ){
// START
  log.args( Error(), arguments );

  let result = {};

  let chunkPath = path.join( chunkRoot, chunkName );
  [result.code, result.msg] = utilfs.makeFile( chunkPath );

  log.end( Error(), jsons(result) );
  return result;
// END
};
// PUBLIC_METHOD_END [create]


// PUBLIC_METHOD_START [write]
/**
 * write content to chunk in disk
 * @chunkRoot   {String} root directory where the chunk is stored, @example "C:\work\GFS2\AppData\chunkserver\chunk1"
 * @chunkName   {String} name of chunk, @example "aabbccdd"
 * @contentData {Buffer} buffer content data, @example Buffer.from("hello")
 * @position    {Number} position of content, @example 0
 */
exports.write = function( chunkRoot, chunkName, contentData, position ){
// START
  log.args( Error(), arguments );

  let result = {};

  position = position || 0;
  try{
    let chunkPath = path.join( chunkRoot, chunkName );

    if( !fs.existsSync(chunkPath) ){
      [result.code, result.msg] = utilfs.writeFileSync( chunkPath, contentData );
    }
    else{
      if( Buffer.isBuffer(contentData) ){
        [result.code, result.msg] = utilfs.overrideBuffer(chunkPath, contentData, position);
      }
      else{
        [result.code, result.msg] = utilfs.override(chunkPath, contentData, position);
      }
    }
  }
  catch( e ){
    log.error( Error(), jsons(e.message) );
  }

  log.end( Error(), jsons(result) );


  return result;
// END
};
// PUBLIC_METHOD_END [write]


// PUBLIC_METHOD_START [append]
/**
 * append content to chunk in disk
 * @chunkRoot   {String} root directory where the chunk is stored, @example "C:\work\GFS2\AppData\chunkserver\chunk1"
 * @chunkName   {String} name of chunk, @example "aabbccdd"
 * @contentData {Number} buffer content data, @example hello
 */
exports.append = function( chunkRoot, chunkName, contentData ){
// START
  log.args( Error(), arguments );

  let result = {}, startPos, length;

  let chunkPath = path.join(chunkRoot, chunkName);
  [result.code, result.msg, startPos, length] = utilfs.appendSync(chunkPath, contentData);
  result.data = {startPos, length};

  log.end( Error(), jsons(result) );
  return result;
// END
};
// PUBLIC_METHOD_END [append]


// PUBLIC_METHOD_START [read]
/**
 * read chunk
 * @chunkRoot {String} root directory where the chunk is stored, @example "C:\work\GFS2\AppData\chunkserver\chunk1"
 * @chunkName {String} name of chunk, @example "aabbccdd"
 * @startPos  {Number} start position in chunk, @example 0
 * @length    {Number} length of content, @example 12
 */
exports.read = function( chunkRoot, chunkName, startPos, length ){
// START
  log.args( Error(), arguments );

  let result = {}, chunkContent;

  let chunkPath = path.join(chunkRoot, chunkName);

  if( !utilfs.existsSync(chunkPath) ){
    util.error( result, 'NOT_EXISTS' );
    log.end( Error(), jsons(result) );
    return result;
  }

  [result.code, result.msg, chunkContent] = utilfs.readSync(chunkPath);
  if(0 != result.code){
    log.end( Error(), jsons(result) );
    return result;
  }

  let contentData;
  if( ('number' == typeof startPos) && ('number' == typeof length) ){
    contentData = chunkContent.slice(startPos, startPos + length);
  }
  else{
    contentData = chunkContent;
  }

  util.success( result, '', contentData );

  log.end( Error(), jsons(result) );
  return result;
// END
};
// PUBLIC_METHOD_END [read]


// PUBLIC_METHOD_START [delete]
/**
 * delete chunk
 * @chunkRoot {String} root directory where the chunk is stored, @example "C:\work\GFS2\AppData\chunkserver\chunk1"
 * @chunkName {String} name of chunk, @example "aabbccdd"
 */
exports.delete = function( chunkRoot, chunkName ){
// START
  log.args( Error(), arguments );
  let result = {};

  let chunkPath = path.join(chunkRoot, chunkName);
  [result.code, result.msg] = utilfs.deleteSync(chunkPath);

  log.end( Error(), jsons(result) );
  return result;
// END
};
// PUBLIC_METHOD_END [delete]


// PUBLIC_METHOD_START [getSize]
/**
 * get chunk size
 * @chunkRoot {String} root directory where the chunk is stored, @example "C:\work\GFS2\AppData\chunkserver\chunk1"
 * @chunkName {String} name of chunk, @example "aabbccdd"
 * @return    {Number} 返回值, @example 1
 */
exports.getSize = function( chunkRoot, chunkName ){
// START
  log.args( Error(), arguments );
  let result = {};

  let chunkPath = path.join(chunkRoot, chunkName);
  let res = utilfs.statSync(chunkPath);

  if(0 == res.code){
    let size = res.stat.size;
    [result.code, result.msg, result.data] = [0, '', {size}];
  }
  else{
    [result.code, result.msg] = [-1, res.msg];
  }

  log.end( Error(), jsons(result) );
  return result;
// END
};
// PUBLIC_METHOD_END [getSize]


// PUBLIC_METHOD_START [padding]
/**
 * padding char 0 to chunk
 * @chunkRoot  {String} root directory where the chunk is stored, @example "C:\work\GFS2\AppData\chunkserver\chunk1"
 * @chunkName  {String} name of chunk, @example "aabbccdd"
 * @targetSize {Number} the target size to padding to, @example 20
 */
exports.padding = function( chunkRoot, chunkName, targetSize ){
// START
  log.args( Error(), arguments );
  let result = {};

  let chunkPath = path.join(chunkRoot, chunkName);
  [result.code, result.msg] = utilfs.fillToByZero(chunkPath, targetSize);

  log.end( Error(), jsons(result) );
  return result;
// END
};
// PUBLIC_METHOD_END [padding]


