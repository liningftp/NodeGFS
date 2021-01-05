
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Master
 * @copyright: liningftp@qq.com
 * @name: handler
 * @desc: handle all request from client or chunkserver
 * @file: /handler.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START
const {
  namespace,
  namespaceDelete,
  chunkdata,
  chunkfull,
  chunklost,
  chunkrepair,
  file2chunk,
  file2chunkDelete,
  serverdata,
  startupdata,
  waitlease,
} = require('./metadata');

const config = require('./config.js');

const {clientHandler, primaryHandler, heartbeatHandler} = require('./business');
// END
// REQUIRE_END


// PUBLIC_METHOD_START [open]
/**
 * open file
 * @head   {JSON}   request params, @example {"method":"open","filePath":"/usr/data/001","flags":"O_RDWR","mode":"O_APPEND"}
 * @body   {Buffer} request body, @example Buffer.from("")
 * @return {Array}  return value, @example [{"code":0, "data":{"fd":3}, "msg":""}]
 */
exports.open = async function( head, body ){
// START
  // CALL_MODULE_METHOD OPEN [GFS2_Master.clientHandler.open] {tabCount=1}
  let namespaceData = namespace.get(); // Internal
  let filePath = head.filePath; // Extra
  let flags = head.flags; // Extra
  let mode = head.mode; // Extra
  let timestamp = Date.now();
  let lockDuration = config.LOCK_DURATION; // Internal
  
  let [result] = await clientHandler.open(
    namespaceData,
    filePath,
    flags,
    mode,
    timestamp,
    lockDuration
  );
  
  return [result];
  // CALL_MODULE_METHOD CLOSE
// END
};
// PUBLIC_METHOD_END [open]


// PUBLIC_METHOD_START [close]
/**
 * close file
 * @head   {JSON}   request params, @example {"method":"close","filePath":"/usr/data/001","fd":"1600765377526"}
 * @body   {Buffer} request body, @example Buffer.from("")
 * @return {Array}  return value, @example [{"code":0, "msg":""}]
 */
exports.close = async function( head, body ){
// START
  // CALL_MODULE_METHOD OPEN [GFS2_Master.clientHandler.close] {tabCount=1}
  let namespaceData = namespace.get(); // Internal
  let filePath = head.filePath; // Extra
  let fd = head.fd; // Extra
  
  let [result] = await clientHandler.close(
    namespaceData,
    filePath,
    fd
  );
  
  return [result];
  // CALL_MODULE_METHOD CLOSE
// END
};
// PUBLIC_METHOD_END [close]


// PUBLIC_METHOD_START [getReadServerList]
/**
 * get list of chunkserver to read
 * @head   {JSON}   request params, @example {"method":"getReadServerList","filePath":"/usr/data/001","fd":1607151913750,"index":1,"count":"3"}
 * @body   {Buffer} request body, @example Buffer.from("")
 * @return {Array}  return value, @example [{"code":0,"data":{"3":{"chunkName":"aabbccdd","version":6,"serverList":["127.0.0.1:3001","127.0.0.1:3002","127.0.0.1:3003"]}},"msg":""}]
 */
exports.getReadServerList = async function( head, body ){
// START
  // CALL_MODULE_METHOD OPEN [GFS2_Master.clientHandler.getReadServerList] {tabCount=1}
  let namespaceData = namespace.get(); // Internal
  let file2chunkData = file2chunk.get(); // Internal
  let chunkData = chunkdata.get(); // Internal
  let filePath = head.filePath; // Extra
  let fd = head.fd; // Extra
  let index = head.index; // Extra
  let count = head.count; // Extra
  let timestamp = Date.now();
  let lockDuration = config.LOCK_DURATION; // Internal
  
  let [result] = await clientHandler.getReadServerList(
    namespaceData,
    file2chunkData,
    chunkData,
    filePath,
    fd,
    index,
    count,
    timestamp,
    lockDuration
  );
  
  return [result];
  // CALL_MODULE_METHOD CLOSE
// END
};
// PUBLIC_METHOD_END [getReadServerList]


// PUBLIC_METHOD_START [createFile]
/**
 * create namespace file
 * @head   {JSON}   request params, @example {"method":"createFile","filePath":"/usr/data/001","replicaCount":3}
 * @body   {Buffer} request body, @example Buffer.from("")
 * @return {Array}  return value, @example [{"code":0, "msg":""}]
 */
exports.createFile = async function( head, body ){
// START
  // CALL_MODULE_METHOD OPEN [GFS2_Master.clientHandler.createFile] {tabCount=1}
  let namespaceData = namespace.get(); // Internal
  let file2chunkData = file2chunk.get(); // Internal
  let chunkData = chunkdata.get(); // Internal
  let serverData = serverdata.get(); // Internal
  let waitleaseData = waitlease.get(); // Internal
  let filePath = head.filePath; // Extra
  let replicaCount = head.replicaCount; // Extra
  let avgUseRate = config.STORE_AVG_USE_RATE; // Internal
  let heartbeatTime = config.HEARTBEAT_TIME; // Internal
  let timestamp = Date.now();
  let recordPath = config.RECORD_PATH; // Internal
  
  let [result] = await clientHandler.createFile(
    namespaceData,
    file2chunkData,
    chunkData,
    serverData,
    waitleaseData,
    filePath,
    replicaCount,
    avgUseRate,
    heartbeatTime,
    timestamp,
    recordPath
  );
  
  return [result];
  // CALL_MODULE_METHOD CLOSE
// END
};
// PUBLIC_METHOD_END [createFile]


// PUBLIC_METHOD_START [createDir]
/**
 * create namespace directory
 * @head   {JSON}   request params, @example {"method":"createDir","filePath":"/usr/data/001"}
 * @body   {Buffer} request body, @example Buffer.from("")
 * @return {Array}  return value, @example [{"code":0, "msg":""}]
 */
exports.createDir = async function( head, body ){
// START
  // CALL_MODULE_METHOD OPEN [GFS2_Master.clientHandler.createDir] {tabCount=1}
  let namespaceData = namespace.get(); // Internal
  let filePath = head.filePath; // Extra
  let timestamp = Date.now();
  let recordPath = config.RECORD_PATH; // Internal
  
  let [result] = await clientHandler.createDir(
    namespaceData,
    filePath,
    timestamp,
    recordPath
  );
  
  return [result];
  // CALL_MODULE_METHOD CLOSE
// END
};
// PUBLIC_METHOD_END [createDir]


// PUBLIC_METHOD_START [getAppendServerList]
/**
 * get list of chunkserver to append
 * @head   {JSON}   request params, @example {"method":"getAppendServerList","filePath":"/usr/data/001","fd":1606961159937}
 * @body   {Buffer} request body, @example Buffer.from("")
 * @return {Array}  return value, @example [{"code":0,"msg":"","data":{"version":1,"primary":"127.0.0.1:3001","serverList":["127.0.0.1:3001","127.0.0.1:3002","127.0.0.1:3003"]}}]
 */
exports.getAppendServerList = async function( head, body ){
// START
  // CALL_MODULE_METHOD OPEN [GFS2_Master.clientHandler.getAppendServerList] {tabCount=1}
  let namespaceData = namespace.get(); // Internal
  let chunkData = chunkdata.get(); // Internal
  let chunkfullData = chunkfull.get(); // Internal
  let file2chunkData = file2chunk.get(); // Internal
  let serverData = serverdata.get(); // Internal
  let waitleaseData = waitlease.get(); // Internal
  let filePath = head.filePath; // Extra
  let fd = head.fd; // Extra
  let maxUseRate = config.STORE_MAX_USE_RATE; // Internal
  let timestamp = Date.now();
  let heartbeatTime = config.HEARTBEAT_TIME; // Internal
  let chunkDeadTime = config.CHUNK_DEAD_TIME; // Internal
  let lockDuration = config.LOCK_DURATION; // Internal
  let recordPath = config.RECORD_PATH; // Internal
  
  let [result] = await clientHandler.getAppendServerList(
    namespaceData,
    chunkData,
    chunkfullData,
    file2chunkData,
    serverData,
    waitleaseData,
    filePath,
    fd,
    maxUseRate,
    timestamp,
    heartbeatTime,
    chunkDeadTime,
    lockDuration,
    recordPath
  );
  
  return [result];
  // CALL_MODULE_METHOD CLOSE
// END
};
// PUBLIC_METHOD_END [getAppendServerList]


// PUBLIC_METHOD_START [getWriteServerList]
/**
 * get list of chunkserver to write
 * @head   {JSON}   request params, @example {"method":"getWriteServerList","filePath":"/usr/data/001","index":0,"fd":1606961159937}
 * @body   {Buffer} request body, @example Buffer.from("")
 * @return {Array}  return value, @example [{"code":0,"msg":"","data":{"version":1,"primary":"127.0.0.1:3001","serverList":["127.0.0.1:3001","127.0.0.1:3002","127.0.0.1:3003"]}}]
 */
exports.getWriteServerList = async function( head, body ){
// START
  // CALL_MODULE_METHOD OPEN [GFS2_Master.clientHandler.getWriteServerList] {tabCount=1}
  let namespaceData = namespace.get(); // Internal
  let file2chunkData = file2chunk.get(); // Internal
  let chunkData = chunkdata.get(); // Internal
  let serverData = serverdata.get(); // Internal
  let waitleaseData = waitlease.get(); // Internal
  let filePath = head.filePath; // Extra
  let fd = head.fd; // Extra
  let index = head.index; // Extra
  let maxUseRate = config.STORE_MAX_USE_RATE; // Internal
  let timestamp = Date.now();
  let heartbeatTime = config.HEARTBEAT_TIME; // Internal
  let chunkDeadTime = config.CHUNK_DEAD_TIME; // Internal
  let lockDuration = config.LOCK_DURATION; // Internal
  let recordPath = config.RECORD_PATH; // Internal
  
  let [result] = await clientHandler.getWriteServerList(
    namespaceData,
    file2chunkData,
    chunkData,
    serverData,
    waitleaseData,
    filePath,
    fd,
    index,
    maxUseRate,
    timestamp,
    heartbeatTime,
    chunkDeadTime,
    lockDuration,
    recordPath
  );
  
  return [result];
  // CALL_MODULE_METHOD CLOSE
// END
};
// PUBLIC_METHOD_END [getWriteServerList]


// PUBLIC_METHOD_START [snapshot]
/**
 * run snapshot
 * @head   {JSON}   request params, @example {"method":"snapshot","filePath":"/usr/data/1.txt"}
 * @body   {Buffer} request body, @example Buffer.from("")
 * @return {Array}  return value, @example [{"code":0}, ""]
 */
exports.snapshot = async function( head, body ){
// START
  // CALL_MODULE_METHOD OPEN [GFS2_Master.clientHandler.snapshot] {tabCount=1}
  let namespaceData = namespace.get(); // Internal
  let filePath = head.filePath; // Extra
  let recordPath = config.RECORD_PATH; // Internal
  
  let [result, bigData] = await clientHandler.snapshot(
    namespaceData,
    filePath,
    recordPath
  );
  
  return [result, bigData];
  // CALL_MODULE_METHOD CLOSE
// END
};
// PUBLIC_METHOD_END [snapshot]


// PUBLIC_METHOD_START [recvFullChunk]
/**
 * receive fullchunk from primary
 * @head   {JSON}   request params, @example {"method":"recvFullChunk","chunkName":"ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b","startTime":1602228234877,"pair":"127.0.0.1:3001"}
 * @body   {Buffer} request body, @example Buffer.from("")
 * @return {Array}  return value, @example [{"code":0, "msg":""}]
 */
exports.recvFullChunk = async function( head, body ){
// START
  // CALL_MODULE_METHOD OPEN [GFS2_Master.primaryHandler.recvFullChunk] {tabCount=1}
  let chunkfullData = chunkfull.get(); // Internal
  let chunkName = head.chunkName; // Extra
  let pair = head.pair; // Extra
  let startTime = head.startTime; // Extra
  let timestamp = Date.now();
  
  let [result] = await primaryHandler.recvFullChunk(
    chunkfullData,
    chunkName,
    pair,
    startTime,
    timestamp
  );
  
  return [result];
  // CALL_MODULE_METHOD CLOSE
// END
};
// PUBLIC_METHOD_END [recvFullChunk]


// PUBLIC_METHOD_START [recvErrorChunk]
/**
 * receive error chunk from primary
 * @head   {JSON}   request params, @example {"method":"recvErrorChunk","chunkName":"ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b","startTime":1602228234877,"pair":"127.0.0.1:3001"}
 * @body   {Buffer} request body, @example Buffer.from("")
 * @return {Array}  return value, @example [{"code":0, "msg":""}]
 */
exports.recvErrorChunk = async function( head, body ){
// START
  // CALL_MODULE_METHOD OPEN [GFS2_Master.primaryHandler.recvErrorChunk] {tabCount=1}
  let chunkData = chunkdata.get(); // Internal
  let chunklostData = chunklost.get(); // Internal
  let chunkName = head.chunkName; // Extra
  let pair = head.pair; // Extra
  let startTime = head.startTime; // Extra
  let timestamp = Date.now();
  
  let [result] = await primaryHandler.recvErrorChunk(
    chunkData,
    chunklostData,
    chunkName,
    pair,
    startTime,
    timestamp
  );
  
  return [result];
  // CALL_MODULE_METHOD CLOSE
// END
};
// PUBLIC_METHOD_END [recvErrorChunk]


// PUBLIC_METHOD_START [getLastChunkName]
/**
 * chunkserver request the last chunkName of file
 * @head   {JSON}   request params, @example {"method":"getLastChunkName","filePath":"/usr/data/001","startTime":1602228234877}
 * @body   {Buffer} request body, @example Buffer.from("")
 * @return {Array}  return value, @example [{"code":0, "msg":"", "data":{"startTime":1596367828794,"chunkName":"eeffhhii"}}, ""]
 */
exports.getLastChunkName = async function( head, body ){
// START
  // CALL_MODULE_METHOD OPEN [GFS2_Master.primaryHandler.getLastChunkName] {tabCount=1}
  let namespaceData = namespace.get(); // Internal
  let file2chunkData = file2chunk.get(); // Internal
  let filePath = head.filePath; // Extra
  let startTime = head.startTime; // Extra
  let lockDuration = config.LOCK_DURATION; // Internal
  let timestamp = Date.now();
  
  let [result, bigData] = await primaryHandler.getLastChunkName(
    namespaceData,
    file2chunkData,
    filePath,
    startTime,
    lockDuration,
    timestamp
  );
  
  return [result, bigData];
  // CALL_MODULE_METHOD CLOSE
// END
};
// PUBLIC_METHOD_END [getLastChunkName]


// PUBLIC_METHOD_START [recvHeartbeat]
/**
 * receive heartbeat package
 * @head   {JSON}   request params, @example {"method":"recvHeartbeat","pair":"127.0.0.1:3002","useRate":28,"collectList":["aabbccdd,3","eeffgghh,10"],"errorList":["eeffgghh"],"leaseList":["aabbccdd"],"startTime":1593947506381}
 * @body   {Buffer} request body, @example Buffer.from("")
 * @return {Array}  return value, @example [ {"code":0}, {"deleteList":[], "cloneList":[]} ]
 */
exports.recvHeartbeat = async function( head, body ){
// START
  // CALL_MODULE_METHOD OPEN [GFS2_Master.heartbeatHandler.recvHeartbeat] {tabCount=1}
  let chunkData = chunkdata.get(); // Internal
  let serverData = serverdata.get(); // Internal
  let chunkrepairData = chunkrepair.get(); // Internal
  let startupData = startupdata.get(); // Internal
  let pair = head.pair; // Extra
  let useRate = head.useRate; // Extra
  let collectList = head.collectList; // Extra
  let errorList = head.errorList; // Extra
  let leaseList = head.leaseList; // Extra
  let startTime = head.startTime; // Extra
  let timestamp = Date.now();
  let heartbeatTime = config.HEARTBEAT_TIME; // Internal
  let chunkDeadTime = config.CHUNK_DEAD_TIME; // Internal
  
  let [result, bigData] = await heartbeatHandler.recvHeartbeat(
    chunkData,
    serverData,
    chunkrepairData,
    startupData,
    pair,
    useRate,
    collectList,
    errorList,
    leaseList,
    startTime,
    timestamp,
    heartbeatTime,
    chunkDeadTime
  );
  
  return [result, bigData];
  // CALL_MODULE_METHOD CLOSE
// END
};
// PUBLIC_METHOD_END [recvHeartbeat]


// PUBLIC_METHOD_START [deleteFile]
/**
 * delete namespace file
 * @head   {JSON}   request params, @example {"method":"deleteFile","filePath":"/usr/data/001","fd":1606909907287}
 * @body   {Buffer} request body, @example Buffer.from("")
 * @return {Array}  return value, @example [{"code":0, "msg":""}]
 */
exports.deleteFile = async function( head, body ){
// START
  // CALL_MODULE_METHOD OPEN [GFS2_Master.clientHandler.deleteFile] {tabCount=1}
  let namespaceData = namespace.get(); // Internal
  let namespaceDeleteData = namespaceDelete.get(); // Internal
  let file2chunkData = file2chunk.get(); // Internal
  let file2chunkDeleteData = file2chunkDelete.get(); // Internal
  let filePath = head.filePath; // Extra
  let fd = head.fd; // Extra
  let timestamp = Date.now();
  let lockDuration = config.LOCK_DURATION; // Internal
  let recordPath = config.RECORD_PATH; // Internal
  
  let [result] = await clientHandler.deleteFile(
    namespaceData,
    namespaceDeleteData,
    file2chunkData,
    file2chunkDeleteData,
    filePath,
    fd,
    timestamp,
    lockDuration,
    recordPath
  );
  
  return [result];
  // CALL_MODULE_METHOD CLOSE
// END
};
// PUBLIC_METHOD_END [deleteFile]


// PUBLIC_METHOD_START [deleteDir]
/**
 * delete namespace directory
 * @head   {JSON}   request params, @example {"method":"deleteDir","filePath":"/usr/data","fd":1606961159937}
 * @body   {Buffer} request body, @example Buffer.from("")
 * @return {Array}  return value, @example [{"code":0, "msg":""}]
 */
exports.deleteDir = async function( head, body ){
// START
  // CALL_MODULE_METHOD OPEN [GFS2_Master.clientHandler.deleteDir] {tabCount=1}
  let namespaceData = namespace.get(); // Internal
  let namespaceDeleteData = namespaceDelete.get(); // Internal
  let filePath = head.filePath; // Extra
  let fd = head.fd; // Extra
  let timestamp = Date.now();
  let lockDuration = config.LOCK_DURATION; // Internal
  let recordPath = config.RECORD_PATH; // Internal
  
  let [result] = await clientHandler.deleteDir(
    namespaceData,
    namespaceDeleteData,
    filePath,
    fd,
    timestamp,
    lockDuration,
    recordPath
  );
  
  return [result];
  // CALL_MODULE_METHOD CLOSE
// END
};
// PUBLIC_METHOD_END [deleteDir]


// PUBLIC_METHOD_START [recvBootData]
/**
 * receive boot data from chunkserver
 * @head   {JSON}   request params, @example {"method":"recvBootData","chunkList":["aabbccdd,2","eeffgghh,3"],"pair":"127.0.0.1:3001","useRate":25}
 * @body   {Buffer} request body, @example Buffer.from("")
 * @return {Array}  return value, @example [{"code":0, "msg":""}]
 */
exports.recvBootData = async function( head, body ){
// START
  // CALL_MODULE_METHOD OPEN [GFS2_Master.primaryHandler.recvBootData] {tabCount=1}
  let chunkData = chunkdata.get(); // Internal
  let serverData = serverdata.get(); // Internal
  let chunkList = head.chunkList; // Extra
  let pair = head.pair; // Extra
  let useRate = head.useRate; // Extra
  let timestamp = Date.now();
  let chunkDeadTime = config.CHUNK_DEAD_TIME; // Internal
  
  let [result] = await primaryHandler.recvBootData(
    chunkData,
    serverData,
    chunkList,
    pair,
    useRate,
    timestamp,
    chunkDeadTime
  );
  
  return [result];
  // CALL_MODULE_METHOD CLOSE
// END
};
// PUBLIC_METHOD_END [recvBootData]


