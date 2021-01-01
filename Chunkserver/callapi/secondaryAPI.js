
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Chunkserver
 * @copyright: liningftp@qq.com
 * @name: secondaryAPI
 * @desc: request to secondary
 * @file: /callapi/secondaryAPI.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START
const {comm, clog, log, jsons} = require('../../base/index.js');
// END
// REQUIRE_END


// PUBLIC_METHOD_START [secondPushData]
/**
 * push data to secondary
 * @secondServerList {Array}  list of secondary chunkservers, @example ['127.0.0.1:3002', '127.0.0.1:3003']
 * @cacheKey         {String} key of cache, @example "key123456"
 * @contentData      {Buffer} buffer content data, @example Buffer.from("hello")
 */
exports.secondPushData = async function( secondServerList, cacheKey, contentData ){
// START
  log.args( Error(), arguments );

  let result = {}, bigData;

  secondServerList = Object.assign([], secondServerList);
  let [host, port] = secondServerList.shift().split(':');
  let body = contentData;
  // SOCKET_API OPEN [GFS2_Chunkserver.handler.secondPushData] {tabCount=1}
  /* primay push data to secondary */
  /* @return {Array} 返回值 [{"code":0, "data":10}] */
  [result, bigData] = await comm.clientRequest(host, port, 
    comm.encodeMessageData({
      "method": "secondPushData",
      "secondServerList": secondServerList,
      "cacheKey": cacheKey,
    }, body)
  );
  // SOCKET_API CLOSE

  log.info( Error(), `${jsons([result])}` );
  return [result, bigData];
// END
};
// PUBLIC_METHOD_END [secondPushData]


// PUBLIC_METHOD_START [secondCreateChunk]
/**
 * secondary create chunk
 * @secondServerList {Array}  list of secondary chunkservers, @example ["127.0.0.1:3002", "127.0.0.1:3003"]
 * @chunkName        {String} name of chunk, @example "ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b"
 * @version          {Number} version number, @example 66
 * @return           {Array}  返回值, @example [{"code":0}]
 */
exports.secondCreateChunk = async function( secondServerList, chunkName, version ){
// START
  log.args( Error(), arguments );

  let result = {}, bigData;

  secondServerList = Object.assign([], secondServerList);
  let [host, port] = secondServerList.shift().split(':');

  // SOCKET_API OPEN [GFS2_Chunkserver.handler.secondCreateChunk] {tabCount=1}
  /* create a empty chunk */
  /* @return {Array} 返回值 [{"code":0}] */
  [result, bigData] = await comm.clientRequest(host, port, 
    comm.encodeMessageData({
      "method": "secondCreateChunk",
      "chunkName": chunkName,
      "version": version,
      "secondServerList": secondServerList,
    })
  );
  // SOCKET_API CLOSE

  log.info( Error(), `${jsons([result])}` );
  return [result, bigData];
// END
};
// PUBLIC_METHOD_END [secondCreateChunk]


// PUBLIC_METHOD_START [secondWrite]
/**
 * secondary write
 * @secondServerList {Array}  list of secondary chunkservers, @example ["127.0.0.1:3003"]
 * @cacheKey         {String} key of cache, @example "key123456"
 * @chunkName        {String} name of chunk, @example "aabbccdd"
 * @startPos         {Number} start position in chunk, @example 1
 * @version          {Number} version number, @example 1
 */
exports.secondWrite = async function( secondServerList, cacheKey, chunkName, startPos, version ){
// START
  log.args( Error(), arguments );

  let result = {}, bigData;

  secondServerList = Object.assign([], secondServerList);
  let [host, port] = secondServerList.shift().split(':');
  // SOCKET_API OPEN [GFS2_Chunkserver.handler.secondWrite] {tabCount=1}
  /* write content data according to primary */
  /* @return {Array} 返回值 [{"code":0, "data":10}] */
  [result, bigData] = await comm.clientRequest(host, port, 
    comm.encodeMessageData({
      "method": "secondWrite",
      "secondServerList": secondServerList,
      "cacheKey": cacheKey,
      "chunkName": chunkName,
      "version": version,
      "startPos": startPos,
    })
  );
  // SOCKET_API CLOSE

  log.info( Error(), `${jsons([result])}` );
  return [result, bigData];
// END
};
// PUBLIC_METHOD_END [secondWrite]


// PUBLIC_METHOD_START [secondGuarantee]
/**
 * chunk size guarantee
 * @secondServerList {Array}  list of secondary chunkservers, @example ['127.0.0.1:3003']
 * @chunkName        {String} name of chunk, @example "aabbccdd"
 * @cacheKey         {String} key of cache, @example "key123456"
 * @privSize         {Number} size of previous chunk, @example 5
 * @version          {Number} version number, @example 2
 * @return           {JSON}   返回值, @example {"code":0, "data":{"maxSize":10}
 */
exports.secondGuarantee = async function( secondServerList, chunkName, cacheKey, privSize, version ){
// START
  log.args( Error(), arguments );

  let result = {}, bigData;

  secondServerList = Object.assign([], secondServerList);
  let [host, port] = secondServerList.shift().split(':');
  // SOCKET_API OPEN [GFS2_Chunkserver.handler.secondGuarantee] {tabCount=1}
  /* guaranteeing size of all replica are same */
  /* @return {Array} 返回值 [{"code":0, "data":{"maxSize":10}}] */
  [result, bigData] = await comm.clientRequest(host, port, 
    comm.encodeMessageData({
      "method": "secondGuarantee",
      "chunkName": chunkName,
      "privSize": privSize,
      "secondServerList": secondServerList,
      "version": version,
      "cacheKey": cacheKey,
    })
  );
  // SOCKET_API CLOSE

  log.info( Error(), `${jsons([result])}` );
  return [result, bigData];
// END
};
// PUBLIC_METHOD_END [secondGuarantee]


// PUBLIC_METHOD_START [secondPadding]
/**
 * secondary padding char 0 to chunk
 * @secondServerList {Array}  list of secondary chunkservers, @example ["127.0.0.1:3002", "127.0.0.1:3003"]
 * @chunkName        {String} name of chunk, @example "aabbccdd"
 * @targetSize       {Number} the target size to padding to, @example 65536
 * @return           {Array}  返回值, @example [{"code":0, "msg":""}]
 */
exports.secondPadding = async function( secondServerList, chunkName, targetSize ){
// START
  log.args( Error(), arguments );

  let result = {}, bigData;

  secondServerList = Object.assign([], secondServerList);
  let [host, port] = secondServerList.shift().split(':');
  // SOCKET_API OPEN [GFS2_Chunkserver.handler.secondPadding] {tabCount=1}
  /* padding chunk to target size with "0" */
  /* @return {Array} 返回值 [{"code":0, "msg":""}] */
  [result, bigData] = await comm.clientRequest(host, port, 
    comm.encodeMessageData({
      "method": "secondPadding",
      "chunkName": chunkName,
      "targetSize": targetSize,
      "secondServerList": secondServerList,
    })
  );
  // SOCKET_API CLOSE

  log.info( Error(), `${jsons([result])}` );
  return [result, bigData];
// END
};
// PUBLIC_METHOD_END [secondPadding]


// PUBLIC_METHOD_START [secondAppend]
/**
 * secondary record append
 * @secondServerList {Array}  list of secondary chunkservers, @example ["127.0.0.1:3002", "127.0.0.1:3003"]
 * @cacheKey         {String} key of cache, @example "key123456"
 * @chunkName        {String} name of chunk, @example "aabbccdd"
 */
exports.secondAppend = async function( secondServerList, cacheKey, chunkName ){
// START
  log.args( Error(), arguments );

  let result = {}, bigData;

  secondServerList = Object.assign([], secondServerList);
  let [host, port] = secondServerList.shift().split(':');
  // SOCKET_API OPEN [GFS2_Chunkserver.handler.secondAppend] {tabCount=1}
  /* append content data to chunk according to primary */
  /* @return {Array} Return value [{"code":0, "data":{"startPos":0}}] */
  [result, bigData] = await comm.clientRequest(host, port, 
    comm.encodeMessageData({
      "method": "secondAppend",
      "chunkName": chunkName,
      "secondServerList": secondServerList,
      "cacheKey": cacheKey,
    })
  );
  // SOCKET_API CLOSE

  log.info( Error(), `${jsons([result])}` );
  return [result, bigData];
// END
};
// PUBLIC_METHOD_END [secondAppend]


// PUBLIC_METHOD_START [secondSetVersion]
/**
 * set secondary version
 * @secondServerList {Array}  list of secondary chunkservers, @example ["127.0.0.1:3002", "127.0.0.1:3003"]
 * @chunkName        {String} name of chunk, @example "aabbccdd"
 * @version          {String} version number, @example "21"
 */
exports.secondSetVersion = async function( secondServerList, chunkName, version ){
// START
  log.args( Error(), arguments );

  let result = {}, bigData;

  secondServerList = Object.assign([], secondServerList);
  let [host, port] = secondServerList.shift().split(':');
  // SOCKET_API OPEN [GFS2_Chunkserver.handler.secondSetVersion] {tabCount=1}
  /* set version to secondary */
  /* @return {Array} 返回值 [{"code":0, "msg":""}] */
  [result, bigData] = await comm.clientRequest(host, port, 
    comm.encodeMessageData({
      "method": "secondSetVersion",
      "chunkName": chunkName,
      "version": version,
      "secondServerList": secondServerList,
    })
  );
  // SOCKET_API CLOSE

  log.info( Error(), `${jsons([result])}` );
  return [result, bigData];
// END
};
// PUBLIC_METHOD_END [secondSetVersion]


