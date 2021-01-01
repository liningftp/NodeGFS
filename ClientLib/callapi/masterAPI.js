
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_ClientLib
 * @copyright: liningftp@qq.com
 * @name: masterAPI
 * @desc: call API of Master
 * @file: /callapi/masterAPI.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START
const {comm, clog, utilarray, utilfs} = require('../../base');
// END
// REQUIRE_END


// PUBLIC_METHOD_START [open]
/**
 * open system file
 * @filePath   {String} file path of system, @example "/use/data/001"
 * @flags      {String} open flags, O_RDONLY, O_WRONLY, O_RDWR, @example "O_RDONLY"
 * @mode       {String} type mode, O_APPEND whe flags is O_RDWR, @example "O_APPEND"
 * @masterHost {String} host of Master server, @example "127.0.0.1"
 * @masterPort {Number} port of Master server, @example 3000
 * @return     {Array}  Return value, @example [{"code":0, "data":{"fd":3}, "msg":""}]
 */
exports.open = async function( filePath, flags, mode, masterHost, masterPort ){
// START
  let result, bigData;

  let [host, port] = [masterHost, masterPort];

  // SOCKET_API OPEN [GFS2_Master.handler.open] {tabCount=1}
  /* open file */
  /* @return {Array} 返回值 [{"code":0, "data":{"fd":3}, "msg":""}] */
  [result, bigData] = await comm.clientRequest(host, port, 
    comm.encodeMessageData({
      "method": "open",
      "filePath": filePath,
      "flags": flags,
      "mode": mode,
    })
  );
  // SOCKET_API CLOSE

  return [result];
// END
};
// PUBLIC_METHOD_END [open]


// PUBLIC_METHOD_START [close]
/**
 * close system file
 * @filePath   {String} file path of system, @example "/usr/data/001"
 * @fd         {Number} file describe as timestamp when file is opened, @example 1606102127166
 * @masterHost {String} host of Master server, @example "127.0.0.1"
 * @masterPort {Number} port of Master server, @example 3000
 * @return     {Array}  Return value, @example [{"code":0, "msg":""}]
 */
exports.close = async function( filePath, fd, masterHost, masterPort ){
// START
  let result, bigData;

  let [host, port] = [masterHost, masterPort];

  // SOCKET_API OPEN [GFS2_Master.handler.close] {tabCount=1}
  /* close file */
  /* @return {Array} 返回值 [{"code":0, "msg":""}] */
  [result, bigData] = await comm.clientRequest(host, port, 
    comm.encodeMessageData({
      "method": "close",
      "filePath": filePath,
      "fd": fd,
    })
  );
  // SOCKET_API CLOSE

  return [result];
// END
};
// PUBLIC_METHOD_END [close]


// PUBLIC_METHOD_START [createDir]
/**
 * Create directory
 * @filePath   {String} file path of system, @example "/use/data"
 * @masterHost {String} host of Master server, @example "127.0.0.1"
 * @masterPort {Number} port of Master server, @example 3000
 * @return     {Array}  Return value, @example [{"code":0, "msg":""}]
 */
exports.createDir = async function( filePath, masterHost, masterPort ){
// START
  let result, bigData;

  let [host, port] = [masterHost, masterPort];
  // SOCKET_API OPEN [GFS2_Master.handler.createDir] {tabCount=1}
  /* create namespace directory */
  /* @return {Array} 返回值 [{"code":0, "msg":""}] */
  [result, bigData] = await comm.clientRequest(host, port, 
    comm.encodeMessageData({
      "method": "createDir",
      "filePath": filePath,
    })
  );
  // SOCKET_API CLOSE

  return [result];
// END
};
// PUBLIC_METHOD_END [createDir]


// PUBLIC_METHOD_START [deleteDir]
/**
 * Delete directory
 * @filePath   {String} file path of system, @example "/use/data"
 * @fd         {Number} file describe as timestamp when file is opened, @example 1606961159937
 * @masterHost {String} host of Master server, @example "127.0.0.1"
 * @masterPort {Number} port of Master server, @example 3000
 * @return     {Array}  Return value, @example [{"code":0, "msg":""}]
 */
exports.deleteDir = async function( filePath, fd, masterHost, masterPort ){
// START
  let result, bigData;

  let [host, port] = [masterHost, masterPort];
  // SOCKET_API OPEN [GFS2_Master.handler.deleteDir] {tabCount=1}
  /* delete namespace directory */
  /* @return {Array} 返回值 [{"code":0, "msg":""}] */
  [result, bigData] = await comm.clientRequest(host, port, 
    comm.encodeMessageData({
      "method": "deleteDir",
      "filePath": filePath,
      "fd": fd,
    })
  );
  // SOCKET_API CLOSE

  return [result];
// END
};
// PUBLIC_METHOD_END [deleteDir]


// PUBLIC_METHOD_START [createFile]
/**
 * create file
 * @filePath     {String} file path of system, @example "/use/data/001"
 * @replicaCount {Number} count of relipcas, @example 
 * @masterHost   {String} host of Master server, @example "127.0.0.1"
 * @masterPort   {Number} port of Master server, @example 3000
 * @return       {Array}  Return value, @example [{"code":0, "msg":""}]
 */
exports.createFile = async function( filePath, replicaCount, masterHost, masterPort ){
// START
  let result, bigData;

  let [host, port] = [masterHost, masterPort];
  // SOCKET_API OPEN [GFS2_Master.handler.createFile] {tabCount=1}
  /* create namespace file */
  /* @return {Array} 返回值 [{"code":0, "msg":""}] */
  [result, bigData] = await comm.clientRequest(host, port, 
    comm.encodeMessageData({
      "method": "createFile",
      "filePath": filePath,
      "replicaCount": replicaCount,
    })
  );
  // SOCKET_API CLOSE

  return [result];
// END
};
// PUBLIC_METHOD_END [createFile]


// PUBLIC_METHOD_START [deleteFile]
/**
 * delete file
 * @filePath   {String} file path of system, @example "/use/data/001"
 * @fd         {Number} file describe as timestamp when file is opened, @example 1606909907287
 * @masterHost {String} host of Master server, @example "127.0.0.1"
 * @masterPort {Number} port of Master server, @example 3000
 * @return     {Array}  Return value, @example [{"code":0, "msg":""}]
 */
exports.deleteFile = async function( filePath, fd, masterHost, masterPort ){
// START
  let result, bigData;

  let [host, port] = [masterHost, masterPort];
  // SOCKET_API OPEN [GFS2_Master.handler.deleteFile] {tabCount=1}
  /* delete namespace file */
  /* @return {Array} 返回值 [{"code":0, "msg":""}] */
  [result, bigData] = await comm.clientRequest(host, port, 
    comm.encodeMessageData({
      "method": "deleteFile",
      "filePath": filePath,
      "fd": fd,
    })
  );
  // SOCKET_API CLOSE

  return [result];
// END
};
// PUBLIC_METHOD_END [deleteFile]


// PUBLIC_METHOD_START [getWriteServerList]
/**
 * get serverList where write on
 * @filePath   {String} file path of system, @example "/usr/data/001"
 * @fd         {Number} file describe as timestamp when file is opened, @example 1606102127166
 * @index      {Number} index of chunk, @example 2
 * @masterHost {String} host of Master server, @example "127.0.0.1"
 * @masterPort {Number} port of Master server, @example 3000
 * @return     {Array}  Return value, @example [{}]
 */
exports.getWriteServerList = async function( filePath, fd, index, masterHost, masterPort ){
// START
  let result, bigData;

  let [host, port] = [masterHost, masterPort];
  // SOCKET_API OPEN [GFS2_Master.handler.getWriteServerList] {tabCount=1}
  /* get list of chunkserver to be appended */
  /* @return {Array} Return value [{"code":0,"msg":"","data":{"version":1,"primary":"127.0.0.1:3001","serverList":["127.0.0.1:3001","127.0.0.1:3002","127.0.0.1:3003"]}}] */
  [result, bigData] = await comm.clientRequest(host, port, 
    comm.encodeMessageData({
      "method": "getWriteServerList",
      "filePath": filePath,
      "index": index,
      "fd": fd,
    })
  );
  // SOCKET_API CLOSE

  return [result];
// END
};
// PUBLIC_METHOD_END [getWriteServerList]


// PUBLIC_METHOD_START [getAppendServerList]
/**
 * get serverList where to append
 * @filePath   {String} file path of system, @example "/usr/data/001"
 * @fd         {Number} file describe as timestamp when file is opened, @example 1606961159937
 * @masterHost {String} host of Master server, @example "127.0.0.1"
 * @masterPort {Number} port of Master server, @example 3000
 * @return     {Array}  Return value, @example [{}]
 */
exports.getAppendServerList = async function( filePath, fd, masterHost, masterPort ){
// START
  let result, bigData;

  let [host, port] = [masterHost, masterPort];
  // SOCKET_API OPEN [GFS2_Master.handler.getAppendServerList] {tabCount=1}
  /* 获取记录追加操作的服务器 */
  /* @return {Array} Return value [{"code":0,"msg":"","data":{"version":1,"primary":"127.0.0.1:3001","serverList":["127.0.0.1:3001","127.0.0.1:3002","127.0.0.1:3003"]}}] */
  [result, bigData] = await comm.clientRequest(host, port, 
    comm.encodeMessageData({
      "method": "getAppendServerList",
      "filePath": filePath,
      "fd": fd,
    })
  );
  // SOCKET_API CLOSE

  return [result];
// END
};
// PUBLIC_METHOD_END [getAppendServerList]


// PUBLIC_METHOD_START [getReadServerList]
/**
 * get serverList where read from
 * @filePath   {String} file path of system, @example "/usr/data/001"
 * @fd         {Number} file describe as timestamp when file is opened, @example 1607151913750
 * @index      {Number} index of chunk, @example 1
 * @count      {Number} count, @example 3
 * @masterHost {String} host of Master server, @example "127.0.0.1"
 * @masterPort {Number} port of Master server, @example 3000
 */
exports.getReadServerList = async function( filePath, fd, index, count, masterHost, masterPort ){
// START
  let result, bigData;

  let [host, port] = [masterHost, masterPort];
  // SOCKET_API OPEN [GFS2_Master.handler.getReadServerList] {tabCount=1}
  /* 获取指定块所属的服务器信息 */
  /* @return {Array} Return value [{"code":0,"data":{"3":{"chunkName":"aabbccdd","version":6,"serverList":["127.0.0.1:3001","127.0.0.1:3002","127.0.0.1:3003"]}},"msg":""}] */
  [result, bigData] = await comm.clientRequest(host, port, 
    comm.encodeMessageData({
      "method": "getReadServerList",
      "filePath": filePath,
      "fd": fd,
      "index": index,
      "count": count,
    })
  );
  // SOCKET_API CLOSE

  return [result];
// END
};
// PUBLIC_METHOD_END [getReadServerList]


