
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Chunkserver
 * @copyright: liningftp@qq.com
 * @name: masterAPI
 * @desc: all request to master
 * @file: /callapi/masterAPI.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START
const {comm, util, clog, jsonlog} = require('../../base');
// END
// REQUIRE_END


// PUBLIC_METHOD_START [getLastChunkName]
/**
 * get last chunkName of file from Master
 * @masterHost {String} host of Master server, @example "127.0.0.1"
 * @masterPort {Number} port of Master server, @example 3000
 * @filePath   {String} file path of NodeGFS system, @example "/usr/data/001"
 * @startTime  {Number} start time of Master server, @example 1606358756826
 */
exports.getLastChunkName = async function( masterHost, masterPort, filePath, startTime ){
// START
  let result = {}, bigData;

	let [host, port] = [masterHost, masterPort];
	// SOCKET_API OPEN [GFS2_Master.handler.getLastChunkName] {tabCount=1}
  /* chunkserver request the last chunkName of file */
  /* @return {Array} 返回值 [{"code":0, "msg":"", "data":{"startTime":1596367828794,"chunkName":"eeffhhii"}}, ""] */
  [result, bigData] = await comm.clientRequest(host, port, 
    comm.encodeMessageData({
      "method": "getLastChunkName",
      "filePath": filePath,
      "startTime": startTime,
    })
  );
	// SOCKET_API CLOSE

	return [result];
// END
};
// PUBLIC_METHOD_END [getLastChunkName]


// PUBLIC_METHOD_START [reportBootData]
/**
 * 向Master报告启动数据
 * @chunkList  {Array}  list of chunk and version, @example ["ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b,2"]
 * @useRate    {Number} use rate of disk, @example 25
 * @masterHost {String} host of Master server, @example "127.0.0.1"
 * @masterPort {Number} port of Master server, @example 3000
 * @localHost  {String} local host ip, @example "127.0.0.1"
 * @localPort  {Number} local port, @example 3001
 */
exports.reportBootData = async function( chunkList, useRate, masterHost, masterPort, localHost, localPort ){
// START
  let result = {}, bigData;

  let [host, port] = [masterHost, masterPort];
  let pair = `${localHost}:${localPort}`;
  // SOCKET_API OPEN [GFS2_Master.handler.recvBootData] {tabCount=1}
  /* receive boot data from chunkserver */
  /* @return {Array} 返回值 [{"code":0, "msg":""}] */
  [result, bigData] = await comm.clientRequest(host, port, 
    comm.encodeMessageData({
      "method": "recvBootData",
      "chunkList": chunkList,
      "pair": pair,
      "useRate": useRate,
    })
  );
  // SOCKET_API CLOSE

  return [result, bigData];
// END
};
// PUBLIC_METHOD_END [reportBootData]


// PUBLIC_METHOD_START [reportErrorChunk]
/**
 * 向Master上报错误块
 * @masterHost {String} host of Master server, @example "127.0.0.1"
 * @masterPort {Number} port of Master server, @example 3000
 * @chunkName  {String} name of chunk, @example "ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b"
 * @localHost  {String} local host ip, @example "127.0.0.1"
 * @localPort  {Number} local port, @example 3002
 * @startTime  {Number} start time of Master server, @example 1606363070335
 */
exports.reportErrorChunk = async function( masterHost, masterPort, chunkName, localHost, localPort, startTime ){
// START
  let result = {}, bigData;

  let [host, port] = [masterHost, masterPort];
  let pair = `${localHost}:${localPort}`;
  // SOCKET_API OPEN [GFS2_Master.handler.recvErrorChunk] {tabCount=1}
  /* receive error chunk from primary */
  /* @return {Array} 返回值 [{"code":0, "msg":""}] */
  [result, bigData] = await comm.clientRequest(host, port, 
    comm.encodeMessageData({
      "method": "recvErrorChunk",
      "chunkName": chunkName,
      "startTime": startTime,
      "pair": pair,
    })
  );
  // SOCKET_API CLOSE

  return [result];
// END
};
// PUBLIC_METHOD_END [reportErrorChunk]


// PUBLIC_METHOD_START [reportFullChunk]
/**
 * report chunk filled full to Master
 * @masterHost {String} host of Master server, @example "127.0.0.1"
 * @masterPort {Number} port of Master server, @example 3000
 * @chunkName  {String} name of chunk, @example "aabbccdd"
 * @localHost  {String} local host ip, @example "127.0.0.1"
 * @localPort  {Number} local port, @example 3002
 * @startTime  {Number} start time of Master server, @example 1606376977109
 */
exports.reportFullChunk = async function( masterHost, masterPort, chunkName, localHost, localPort, startTime ){
// START
  let result = {}, bigData;

  let [host, port] = [masterHost, masterPort];
  let pair = `${localHost}:${localPort}`;
  // SOCKET_API OPEN [GFS2_Master.handler.recvFullChunk] {tabCount=1}
  /* receive fullchunk from primary */
  /* @return {Array} 返回值 [{"code":0, "msg":""}] */
  [result, bigData] = await comm.clientRequest(host, port, 
    comm.encodeMessageData({
      "method": "recvFullChunk",
      "chunkName": chunkName,
      "startTime": startTime,
      "pair": pair,
    })
  );
  // SOCKET_API CLOSE

  return [result];
// END
};
// PUBLIC_METHOD_END [reportFullChunk]


// PUBLIC_METHOD_START [reportHeatbeat]
/**
 * 向Master上报心跳
 * @collectList {Array}  list of chunk heartbeat, @example ["ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b,12","be6ed3c858a45021b916388572d1081975c27961763e567db6bcd21db2827b05,6"]
 * @leaseList   {Array}  list of primary to continue lease, @example ["ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b"]
 * @errorList   {Array}  list of error chunk, @example ["be6ed3c858a45021b916388572d1081975c27961763e567db6bcd21db2827b05"]
 * @useRate     {Number} use rate of disk, @example 26
 * @startTime   {Number} start time of Master server, @example 1606470128122
 * @masterHost  {String} host of Master server, @example "127.0.0.1"
 * @masterPort  {Number} port of Master server, @example 3000
 * @localHost   {String} local host ip, @example "127.0.0.1"
 * @localPort   {Number} local port, @example 3001
 */
exports.reportHeatbeat = async function( collectList, leaseList, errorList, useRate, startTime, masterHost, masterPort, localHost, localPort ){
// START
  let result = {}, bigData;

  let [host, port] = [masterHost, masterPort];
  let pair = `${localHost}:${localPort}`;
  try{
    // SOCKET_API OPEN [GFS2_Master.handler.recvHeartbeat] {tabCount=1}
  /* receive heartbeat package */
  /* @return {Array} 返回值 [ {"code":0}, {"deleteList":[], "cloneList":[]} ] */
  [result, bigData] = await comm.clientRequest(host, port, 
    comm.encodeMessageData({
      "method": "recvHeartbeat",
      "pair": pair,
      "useRate": useRate,
      "collectList": collectList,
      "errorList": errorList,
      "leaseList": leaseList,
      "startTime": startTime,
    })
  );
    // SOCKET_API CLOSE
  }
  catch( e ){
    util.error( result, '', `${e.message}, ${e.track}` );
  }

  return [result, bigData];
// END
};
// PUBLIC_METHOD_END [reportHeatbeat]


