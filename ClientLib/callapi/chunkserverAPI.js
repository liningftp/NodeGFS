
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_ClientLib
 * @copyright: liningftp@qq.com
 * @name: chunkserverAPI
 * @desc: call API of chunkserver
 * @file: /callapi/chunkserverAPI.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START
const {comm, clog, jsonlog, utilarray, utilfs} = require('../../base');
// END
// REQUIRE_END


// PUBLIC_METHOD_START [primaryPushData]
/**
 * Client push data to chunkserver
 * @chunkserverList {Array}  all server of chunk, @example ["127.0.0.1:3001", "127.0.0.1:3002", "127.0.0.1:3003"]
 * @contentData     {Buffer} data of content, @example Buffer.from("hello girl")
 * @return          {Array}  Return value, @example [{"code":0, "data":{"cacheKey":"key123456"}}]
 */
exports.primaryPushData = async function( chunkserverList, contentData ){
// START
  let result, bigData;

  let secondServerList = Object.assign([], chunkserverList);
  let [host, port] = secondServerList.shift().split(':');
  let body = Buffer.from(contentData);
  // SOCKET_API OPEN [GFS2_Chunkserver.handler.primaryPushData] {tabCount=1}
  /* client push data to primary */
  /* @return {Array} 返回值 [{"code":0, "data":{"cacheKey":"key123456"}}] */
  [result, bigData] = await comm.clientRequest(host, port, 
    comm.encodeMessageData({
      "method": "primaryPushData",
      "secondServerList": secondServerList,
    }, body)
  );
  // SOCKET_API CLOSE

  return [result];
// END
};
// PUBLIC_METHOD_END [primaryPushData]


// PUBLIC_METHOD_START [primaryWrite]
/**
 * Primary run control order to write
 * @chunkserverList {Array}  all server of chunk, @example ["127.0.0.1:3001", "127.0.0.1:3002", "127.0.0.1:3003"]
 * @cacheKey        {String} key of cache, @example "de960194c26946bd2873a3378020f32e"
 * @chunkName       {String} name of chunk, @example "ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b"
 * @startPos        {Number} start position in chunk, @example 6
 * @version         {Number} version number, @example 1
 * @return          {Array}  Return value, @example [{}]
 */
exports.primaryWrite = async function( chunkserverList, cacheKey, chunkName, startPos, version ){
// START
  let result, bigData;

  let secondServerList = Object.assign([], chunkserverList);
  let [host, port] = secondServerList.shift().split(':');
  // SOCKET_API OPEN [GFS2_Chunkserver.handler.primaryWrite] {tabCount=1}
  /* primary receive client request to write */
  /* @return {Array} Return value [ {"code":0,"msg":""} ] */
  [result, bigData] = await comm.clientRequest(host, port, 
    comm.encodeMessageData({
      "method": "primaryWrite",
      "secondServerList": secondServerList,
      "cacheKey": cacheKey,
      "chunkName": chunkName,
      "startPos": startPos,
      "version": version,
    })
  );
  // SOCKET_API CLOSE

  return [result];
// END
};
// PUBLIC_METHOD_END [primaryWrite]


// PUBLIC_METHOD_START [primaryAppend]
/**
 * Record append
 * @chunkserverList {Array}  all server of chunk, @example ["127.0.0.1:3001", "127.0.0.1:3002", "127.0.0.1:3003"]
 * @filePath        {String} file path of system, @example "/usr/data/001"
 * @primary         {String} primary of chunkserver, @example "127.0.0.1:3000"
 * @cacheKey        {String} key of cache, @example "de960194c26946bd2873a3378020f32e"
 * @version         {Number} version number, @example 1
 * @return          {Array}  Return value, @example [{}]
 */
exports.primaryAppend = async function( chunkserverList, filePath, primary, cacheKey, version ){
// START
  let result, bigData;

  let secondServerList = Object.assign([], chunkserverList);
  let [host, port] = secondServerList.shift().split(':');
  // SOCKET_API OPEN [GFS2_Chunkserver.handler.primaryAppend] {tabCount=1}
  /* client指令primary追加 */
  /* @return {Array} Return value [ {"code":0,"data":{"startPos":0}} ] */
  [result, bigData] = await comm.clientRequest(host, port, 
    comm.encodeMessageData({
      "method": "primaryAppend",
      "filePath": filePath,
      "secondServerList": secondServerList,
      "cacheKey": cacheKey,
      "version": version,
    })
  );
  // SOCKET_API CLOSE

  return [result];
// END
};
// PUBLIC_METHOD_END [primaryAppend]


// PUBLIC_METHOD_START [readChunk]
/**
 * Read chunk from chunkserver
 * @chunkserverList {Array}  all server of chunk, @example ["127.0.0.1:3001", "127.0.0.1:3002", "127.0.0.1:3003"]
 * @chunkName       {String} name of chunk, @example "ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b"
 * @version         {Number} version number, @example 1
 * @startPos        {Number} start position in chunk, @example 100
 * @length          {Number} length of content, @example 1
 * @return          {Array}  Return value, @example [{}]
 */
exports.readChunk = async function( chunkserverList, chunkName, version, startPos, length ){
// START
  let result, bigData;

  let secondServerList = Object.assign([], chunkserverList);
  let [host, port] = secondServerList.shift().split(':');

  // SOCKET_API OPEN [GFS2_Chunkserver.handler.readChunk] {tabCount=1}
  /* client读取块中内容 */
  /* @return {Array} Return value [{"code":0, "msg":""}, []] */
  [result, bigData] = await comm.clientRequest(host, port, 
    comm.encodeMessageData({
      "method": "readChunk",
      "chunkName": chunkName,
      "startPos": startPos,
      "length": length,
      "version": version,
    })
  );
  // SOCKET_API CLOSE

  return [result, bigData];
// END
};
// PUBLIC_METHOD_END [readChunk]


