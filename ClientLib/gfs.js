
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_ClientLib
 * @copyright: liningftp@qq.com
 * @name: gfs
 * @desc: system API
 * @file: gfs.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START
const {comm, util, clog, jsonlog, log, jsons} = require('../base');

const {masterAPI, chunkserverAPI} = require('./callapi');

const maxChunkSize = 67108864; // 64MByte
// END
// REQUIRE_END


// PUBLIC_METHOD_START [open]
/**
 * open file path
 * @filePath   {String} file path of system, @example "/usr/data/001"
 * @flags      {String} open flags, O_RDONLY, O_WRONLY, O_RDWR, @example "O_RDWR"
 * @mode       {String} type mode, O_APPEND whe flags is O_RDWR, @example "O_APPEND"
 * @masterHost {String} host of Master server, @example "127.0.0.1"
 * @masterPort {Number} port of Master server, @example 3000
 * @return     {JSON}   return value, @example {"code":0,"msg":""}
 */
exports.open = async function( filePath, flags, mode, masterHost, masterPort ){
// START
  let [result] = await masterAPI.open(filePath, flags, mode, masterHost, masterPort);

  return result;
// END
};
// PUBLIC_METHOD_END [open]


// PUBLIC_METHOD_START [close]
/**
 * close file path
 * @filePath   {String} file path of system, @example "/use/data/001"
 * @fd         {String} file describe as timestamp when file is opened, @example "1606226758420"
 * @masterHost {String} host of Master server, @example "127.0.0.1"
 * @masterPort {Number} port of Master server, @example 3000
 * @return     {JSON}   return value, @example {"code":0,"msg":""}
 */
exports.close = async function( filePath, fd, masterHost, masterPort ){
// START
  let [result] = await masterAPI.close(filePath, fd, masterHost, masterPort);

  return result;
// END
};
// PUBLIC_METHOD_END [close]


// PUBLIC_METHOD_START [createDir]
/**
 * create directory
 * @filePath   {String} file path of system, @example "/usr/data/001"
 * @masterHost {String} host of Master server, @example "127.0.0.1"
 * @masterPort {Number} port of Master server, @example 3000
 * @return     {JSON}   return value, @example {"code":0, "msg":""}
 */
exports.createDir = async function( filePath, masterHost, masterPort ){
// START

  let [result] = await masterAPI.createDir(filePath, masterHost, masterPort);

  return result;
// END
};
// PUBLIC_METHOD_END [createDir]


// PUBLIC_METHOD_START [deleteDir]
/**
 * delete directory
 * @filePath   {String} file path of system, @example "/usr/data"
 * @fd         {Number} file describe as timestamp when file is opened, @example 1606961159937
 * @masterHost {String} host of Master server, @example "127.0.0.1"
 * @masterPort {Number} port of Master server, @example 3000
 * @return     {JSON}   return value, @example {"code":0,"msg":""}
 */
exports.deleteDir = async function( filePath, fd, masterHost, masterPort ){
// START
  let [result] = await masterAPI.deleteDir(filePath, fd, masterHost, masterPort);

  return result;
// END
};
// PUBLIC_METHOD_END [deleteDir]


// PUBLIC_METHOD_START [createFile]
/**
 * create file path
 * @filePath     {String} file path of system, @example "/usr/data/001"
 * @replicaCount {Number} count of relipcas, @example 3
 * @masterHost   {String} host of Master server, @example "127.0.0.1"
 * @masterPort   {Number} port of Master server, @example 3000
 * @return       {JSON}   return value, @example {"code":0, "msg":""}
 */
exports.createFile = async function( filePath, replicaCount, masterHost, masterPort ){
// START
  let [result] = await masterAPI.createFile(filePath, replicaCount, masterHost, masterPort);

  return result;
// END
};
// PUBLIC_METHOD_END [createFile]


// PUBLIC_METHOD_START [deleteFile]
/**
 * delete file path
 * @filePath   {String} file path of system, @example "/usr/data/001"
 * @fd         {Number} file describe as timestamp when file is opened, @example 1606909907287
 * @masterHost {String} host of Master server, @example "127.0.0.1"
 * @masterPort {Number} port of Master server, @example 3000
 * @return     {JSON}   return value, @example {"code":0,"msg":""}
 */
exports.deleteFile = async function( filePath, fd, masterHost, masterPort ){
// START
  let [result] = await masterAPI.deleteFile(filePath, fd, masterHost, masterPort);

  return result;
// END
};
// PUBLIC_METHOD_END [deleteFile]


// PUBLIC_METHOD_START [write]
/**
 * write file
 * @filePath   {String} file path of system, @example "/usr/data/001"
 * @fd         {Number} file describe as timestamp when file is opened, @example 1607151913750
 * @content    {String} content data, @example "999"
 * @position   {Number} position of content, @example 2
 * @masterHost {String} host of Master server, @example "127.0.0.1"
 * @masterPort {Number} port of Master server, @example 3000
 * @return     {JSON}   return value, @example {"code":0,"data":[{"chunkIndex":0,"startPos":0,"length":3}]}
 */
exports.write = async function( filePath, fd, content, position, masterHost, masterPort ){
// START
  let result = {}, bigData;

  clog('--------gfs.write->start');

  let contentData = Buffer.from(content);

  clog(1);

  let index = Math.floor( position / maxChunkSize );
  let startPos = position % maxChunkSize;
  jsonlog( {position, index, startPos} );

  if( maxChunkSize < startPos + contentData.byteLength ){
    util.error( result, 'LENGTH_OVERFLOW', `position add content length beyond maxChunkSize(${maxChunkSize})` );
    return result;
  }

  [result] = await masterAPI.getWriteServerList( filePath, fd, index, masterHost, masterPort );
  if(0 != result.code){ return result; }

  jsonlog( result );

  let {chunkName, primary, serverList, version} = result.data;

  clog(2);
  [result, bigData] = await chunkserverAPI.primaryPushData( serverList, contentData );
  if(0 != result.code){ return result; }

  let {cacheKey} = result.data;

  clog(3);
  jsonlog( {serverList, cacheKey, chunkName, startPos, version} );
  [result, bigData] = await chunkserverAPI.primaryWrite( serverList, cacheKey, chunkName, startPos, version );
  if(0 != result.code){ return result; }

  clog('--------gfs.write->end');

  return result;
// END
};
// PUBLIC_METHOD_END [write]


// PUBLIC_METHOD_START [append]
/**
 * record append
 * @filePath   {String} file path of system, @example "/use/data/001"
 * @fd         {Number} file describe as timestamp when file is opened, @example 1606961159937
 * @content    {Buffer} content data, @example Buffer.from("999")
 * @masterHost {String} host of Master server, @example "127.0.0.1"
 * @masterPort {Number} port of Master server, @example 3000
 * @return     {JSON}   return value, @example {"code":0,"data":{"chunkIndex":0,"startPos":0,"length":3}}
 */
exports.append = async function( filePath, fd, content, masterHost, masterPort ){
// START
  clog('------gfs.append->start');

  let result = {}, bigData;

  let contentData = Buffer.from(content);

  clog(1);
  /* get list of chunkserver for append */
  [result] = await masterAPI.getAppendServerList(filePath, fd, masterHost, masterPort);
  if(0 != result.code){ return result; }
  jsonlog( {result} );

  clog(2);
  /* push data to primary */
  let {primary, serverList, version} = result.data;
  [result, bigData] = await chunkserverAPI.primaryPushData(serverList, contentData);
  if(0 != result.code){ return result; }
  jsonlog( {result} );

  clog(3);
  /* let primary execute append */
  let {cacheKey} = result.data;
  [result, bigData] = await chunkserverAPI.primaryAppend(serverList, filePath, primary, cacheKey, version);
  jsonlog( {result, bigData} );

  clog('------gfs.append->end');
  return result;
// END
};
// PUBLIC_METHOD_END [append]


// PUBLIC_METHOD_START [read]
/**
 * read file
 * @filePath     {String} file path of system, @example "/use/data/001"
 * @fd           {Number} file describe as timestamp when file is opened, @example 1607151913750
 * @position     {Number} position of content, @example 1
 * @length       {Number} length of content, @example 0
 * @maxChunkSize {Number} max size of chunk, @example 67108864
 * @masterHost   {String} host of Master server, @example "127.0.0.1"
 * @masterPort   {Number} port of Master server, @example 3000
 * @return       {JSON}   return value, @example {"code":0,"data":"123"}
 */
exports.read = async function( filePath, fd, position, length, maxChunkSize, masterHost, masterPort ){
// START
  clog('------gfs.read->start');
  let result = {}, bigData;
  position = parseInt( position );
  length = parseInt( length );

  clog(1);
  /* check range */
  let index = Math.floor( position / maxChunkSize );
  let startPos = position % maxChunkSize;
  if( startPos + length > maxChunkSize ){
    util.error( result, 'RANGE_ERROR', `position:${position}, length:${length}, maxChunkSize:${maxChunkSize}, ${filePath}` );
    return [result];
  }

  clog(2);
  /* get chunkservers to read */
  let count = 3;
  [result] = await masterAPI.getReadServerList( filePath, fd, index, count, masterHost, masterPort );
  clog( jsons( result ) );
  clog(3);
  if(0 != result.code){ return [result]; }
  let {chunks} = result.data;

  clog(4);
  /* read content from a chunkserver */
  let {chunkName, version, serverList} = chunks[0]; /* use the first, the rest for cache */
  [result, bigData] = await chunkserverAPI.readChunk( serverList, chunkName, version, startPos, length );

  clog('------gfs.read->end');
  return [result, bigData];
// END
};
// PUBLIC_METHOD_END [read]


// PUBLIC_METHOD_START [snapshot]
/**
 * snapshot ( TODO )
 * @filePath {String} file path of system, @example "/use/data/1.txt"
 * @return   {JSON}   return value, @example {"code":0,"msg":""}
 */
exports.snapshot = async function( filePath ){
// START
  // open
  console.log( `TODO` );
// END
};
// PUBLIC_METHOD_END [snapshot]


