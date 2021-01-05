
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Chunkserver
 * @copyright: liningftp@qq.com
 * @name: handler
 * @desc: handle all request
 * @file: /handler.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START
const config = require('./config');

const {
  cachedata,
  checksum,
  checksumFree,
  chunkdata,
  chunkversion,
  chunkversionFree,
  errordata,
  leasedata,
  masterdata,

  cachedataTool,
  checksumTool,
  checksumFreeTool,
  chunkdataTool,
  chunkversionTool,
  chunkversionFreeTool,
  errordataTool,
  leasedataTool,
  masterdataTool,
} = require('./metadata');

const clientHandler = require('./business/clientHandler.js');
const primaryHandler = require('./business/primaryHandler.js');
const masterHandler = require('./business/masterHandler.js');
// END
// REQUIRE_END


// PUBLIC_METHOD_START [readChunk]
/**
 * client read chunk content
 * @head   {JSON}   request params, @example {"method":"readChunk","chunkName":"ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b","startPos":2,"length":4,"version":66}
 * @body   {Buffer} big data, @example Buffer.from("")
 * @return {Array}  return value, @example [{"code":0, "msg":""}, []]
 */
exports.readChunk = async function( head, body ){
// START
	// CALL_MODULE_METHOD OPEN [GFS2_Chunkserver.clientHandler.readChunk] {tabCount=1}
  let chunkData = chunkdata.get(); // Internal
  let checksumData = checksum.get(); // Internal
  let chunkversionData = chunkversion.get(); // Internal
  let errorData = errordata.get(); // Internal
  let chunkRoot = config.CHUNK_ROOT; // Internal
  let chunkName = head.chunkName; // Extra
  let version = head.version; // Extra
  let startPos = head.startPos; // Extra
  let length = head.length; // Extra
  let blockSize = config.BLOCK_SIZE; // Internal
  
  let [result, bigData] = await clientHandler.readChunk(
    chunkData,
    checksumData,
    chunkversionData,
    errorData,
    chunkRoot,
    chunkName,
    version,
    startPos,
    length,
    blockSize
  );
  
  return [result, bigData];
	// CALL_MODULE_METHOD CLOSE
// END
};
// PUBLIC_METHOD_END [readChunk]


// PUBLIC_METHOD_START [primaryAppend]
/**
 * client request primary append content
 * @head   {JSON}   request params, @example {"method":"primaryAppend","filePath":"/usr/data/1.txt","secondServerList":["127.0.0.1:3002","127.0.0.1:3003"],"cacheKey":"key123456","version":1}
 * @body   {Buffer} big data, @example Buffer.from("")
 * @return {Array}  return value, @example [ {"code":0,"data":{"startPos":0}} ]
 */
exports.primaryAppend = async function( head, body ){
// START
	// CALL_MODULE_METHOD OPEN [GFS2_Chunkserver.clientHandler.primaryAppend] {tabCount=1}
  let chunkData = chunkdata.get(); // Internal
  let cacheData = cachedata.get(); // Internal
  let checksumData = checksum.get(); // Internal
  let chunkversionData = chunkversion.get(); // Internal
  let errorData = errordata.get(); // Internal
  let masterData = masterdata.get(); // Internal
  let filePath = head.filePath; // Extra
  let cacheRoot = config.CACHE_ROOT; // Internal
  let cacheKey = head.cacheKey; // Extra
  let chunkRoot = config.CHUNK_ROOT; // Internal
  let version = head.version; // Extra
  let secondServerList = head.secondServerList; // Extra
  let timestamp = Date.now();
  let blockSize = config.BLOCK_SIZE; // Internal
  let maxChunkSize = config.MAX_CHUNK_SIZE; // Internal
  let masterHost = config.MASTER_HOST; // Internal
  let masterPort = config.MASTER_PORT; // Internal
  let checksumPath = config.CHECKSUM_PATH; // Internal
  
  let [result] = await clientHandler.primaryAppend(
    chunkData,
    cacheData,
    checksumData,
    chunkversionData,
    errorData,
    masterData,
    filePath,
    cacheRoot,
    cacheKey,
    chunkRoot,
    version,
    secondServerList,
    timestamp,
    blockSize,
    maxChunkSize,
    masterHost,
    masterPort,
    checksumPath
  );
  
  return [result];
	// CALL_MODULE_METHOD CLOSE
// END
};
// PUBLIC_METHOD_END [primaryAppend]


// PUBLIC_METHOD_START [primaryPushData]
/**
 * client push data to primary
 * @head   {JSON}   request params, @example {"method":"primaryPushData","secondServerList":["127.0.0.1:3003"]}
 * @body   {Buffer} big data, @example Buffer.from("hello girl")
 * @return {Array}  return value, @example [{"code":0, "data":{"cacheKey":"key123456"}}]
 */
exports.primaryPushData = async function( head, body ){
// START
	// CALL_MODULE_METHOD OPEN [GFS2_Chunkserver.clientHandler.primaryPushData] {tabCount=1}
  let cacheData = cachedata.get(); // Internal
  let cacheRoot = config.CACHE_ROOT; // Internal
  let secondServerList = head.secondServerList; // Extra
  let timestamp = Date.now();
  let maxChunkSize = config.MAX_CHUNK_SIZE; // Internal
  
  let [result] = await clientHandler.primaryPushData(
    cacheData,
    cacheRoot,
    body,
    secondServerList,
    timestamp,
    maxChunkSize
  );
  
  return [result];
	// CALL_MODULE_METHOD CLOSE
// END
};
// PUBLIC_METHOD_END [primaryPushData]


// PUBLIC_METHOD_START [secondAppend]
/**
 * append content data to chunk according to primary
 * @head   {JSON}   request params, @example {"method":"secondAppend","chunkName":"ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b","secondServerList":["127.0.0.1:3003"],"cacheKey":"key123456"}
 * @body   {Buffer} big data, @example Buffer.from("")
 * @return {Array}  return value, @example [{"code":0, "data":{"startPos":0}}]
 */
exports.secondAppend = async function( head, body ){
// START
	// CALL_MODULE_METHOD OPEN [GFS2_Chunkserver.primaryHandler.secondAppend] {tabCount=1}
  let chunkData = chunkdata.get(); // Internal
  let checksumData = checksum.get(); // Internal
  let cacheData = cachedata.get(); // Internal
  let cacheRoot = config.CACHE_ROOT; // Internal
  let cacheKey = head.cacheKey; // Extra
  let chunkRoot = config.CHUNK_ROOT; // Internal
  let chunkName = head.chunkName; // Extra
  let secondServerList = head.secondServerList; // Extra
  let timestamp = Date.now();
  let blockSize = config.BLOCK_SIZE; // Internal
  let checksumPath = config.CHECKSUM_PATH; // Internal
  
  let [result] = await primaryHandler.secondAppend(
    chunkData,
    checksumData,
    cacheData,
    cacheRoot,
    cacheKey,
    chunkRoot,
    chunkName,
    secondServerList,
    timestamp,
    blockSize,
    checksumPath
  );
  
  return [result];
	// CALL_MODULE_METHOD CLOSE
// END
};
// PUBLIC_METHOD_END [secondAppend]


// PUBLIC_METHOD_START [secondPushData]
/**
 * primay push data to secondary
 * @head   {JSON}   request params, @example {"method":"secondPushData","secondServerList":["127.0.0.1:3002","127.0.0.1:3003"],"cacheKey":"key123456"}
 * @body   {Buffer} big data, @example Buffer.from("fefe")
 * @return {Array}  return value, @example [{"code":0, "data":10}]
 */
exports.secondPushData = async function( head, body ){
// START
	// CALL_MODULE_METHOD OPEN [GFS2_Chunkserver.primaryHandler.secondPushData] {tabCount=1}
  let cacheData = cachedata.get(); // Internal
  let cacheRoot = config.CACHE_ROOT; // Internal
  let cacheKey = head.cacheKey; // Extra
  let secondServerList = head.secondServerList; // Extra
  let timestamp = Date.now();
  
  let [result] = await primaryHandler.secondPushData(
    cacheData,
    cacheRoot,
    cacheKey,
    body,
    secondServerList,
    timestamp
  );
  
  return [result];
	// CALL_MODULE_METHOD CLOSE
// END
};
// PUBLIC_METHOD_END [secondPushData]


// PUBLIC_METHOD_START [primaryWrite]
/**
 * primary receive client request to write
 * @head   {JSON}   request params, @example {"method":"primaryWrite","secondServerList":["127.0.0.1:3002","127.0.0.1:3003"],"cacheKey":"key123456","chunkName":"ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b","startPos":0,"version":1}
 * @body   {Buffer} big data, @example Buffer.from("")
 * @return {Array}  return value, @example [ {"code":0,"msg":""} ]
 */
exports.primaryWrite = async function( head, body ){
// START
	// CALL_MODULE_METHOD OPEN [GFS2_Chunkserver.clientHandler.primaryWrite] {tabCount=1}
  let chunkData = chunkdata.get(); // Internal
  let cacheData = cachedata.get(); // Internal
  let checksumData = checksum.get(); // Internal
  let chunkversionData = chunkversion.get(); // Internal
  let errorData = errordata.get(); // Internal
  let cacheRoot = config.CACHE_ROOT; // Internal
  let cacheKey = head.cacheKey; // Extra
  let chunkRoot = config.CHUNK_ROOT; // Internal
  let chunkName = head.chunkName; // Extra
  let version = head.version; // Extra
  let startPos = head.startPos; // Extra
  let secondServerList = head.secondServerList; // Extra
  let timestamp = Date.now();
  let blockSize = config.BLOCK_SIZE; // Internal
  let checksumPath = config.CHECKSUM_PATH; // Internal
  let versionPath = config.VERSION_PATH; // Internal
  
  let [result] = await clientHandler.primaryWrite(
    chunkData,
    cacheData,
    checksumData,
    chunkversionData,
    errorData,
    cacheRoot,
    cacheKey,
    chunkRoot,
    chunkName,
    version,
    startPos,
    secondServerList,
    timestamp,
    blockSize,
    checksumPath,
    versionPath
  );
  
  return [result];
	// CALL_MODULE_METHOD CLOSE
// END
};
// PUBLIC_METHOD_END [primaryWrite]


// PUBLIC_METHOD_START [secondWrite]
/**
 * write content data according to primary
 * @head   {JSON}   request params, @example {"method":"secondWrite","secondServerList":["127.0.0.1:3003"],"cacheKey":"key123456","chunkName":"ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b","version":1,"startPos":0}
 * @body   {Buffer} big data, @example Buffer.from("")
 * @return {Array}  return value, @example [{"code":0, "data":10}]
 */
exports.secondWrite = async function( head, body ){
// START
	// CALL_MODULE_METHOD OPEN [GFS2_Chunkserver.primaryHandler.secondWrite] {tabCount=1}
  let chunkData = chunkdata.get(); // Internal
  let checksumData = checksum.get(); // Internal
  let chunkversionData = chunkversion.get(); // Internal
  let cacheData = cachedata.get(); // Internal
  let errorData = errordata.get(); // Internal
  let cacheRoot = config.CACHE_ROOT; // Internal
  let cacheKey = head.cacheKey; // Extra
  let chunkRoot = config.CHUNK_ROOT; // Internal
  let chunkName = head.chunkName; // Extra
  let version = head.version; // Extra
  let startPos = head.startPos; // Extra
  let secondServerList = head.secondServerList; // Extra
  let blockSize = config.BLOCK_SIZE; // Internal
  let timestamp = Date.now();
  let checksumPath = config.CHECKSUM_PATH; // Internal
  
  let [result] = await primaryHandler.secondWrite(
    chunkData,
    checksumData,
    chunkversionData,
    cacheData,
    errorData,
    cacheRoot,
    cacheKey,
    chunkRoot,
    chunkName,
    version,
    startPos,
    secondServerList,
    blockSize,
    timestamp,
    checksumPath
  );
  
  return [result];
	// CALL_MODULE_METHOD CLOSE
// END
};
// PUBLIC_METHOD_END [secondWrite]


// PUBLIC_METHOD_START [secondSetVersion]
/**
 * set version to secondary
 * @head   {JSON}   request params, @example {"method":"secondSetVersion","chunkName":"ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b","version":66,"secondServerList":["127.0.0.1:3003"]}
 * @body   {Buffer} big data, @example Buffer.from("")
 * @return {Array}  return value, @example [{"code":0, "msg":""}]
 */
exports.secondSetVersion = async function( head, body ){
// START
	// CALL_MODULE_METHOD OPEN [GFS2_Chunkserver.primaryHandler.secondSetVersion] {tabCount=1}
  let chunkData = chunkdata.get(); // Internal
  let chunkversionData = chunkversion.get(); // Internal
  let chunkName = head.chunkName; // Extra
  let version = head.version; // Extra
  let secondServerList = head.secondServerList; // Extra
  let timestamp = Date.now();
  let versionPath = config.VERSION_PATH; // Internal
  
  let [result] = await primaryHandler.secondSetVersion(
    chunkData,
    chunkversionData,
    chunkName,
    version,
    secondServerList,
    timestamp,
    versionPath
  );
  
  return [result];
	// CALL_MODULE_METHOD CLOSE
// END
};
// PUBLIC_METHOD_END [secondSetVersion]


// PUBLIC_METHOD_START [revokeLease]
/**
 * master revoke lease
 * @head   {JSON}   request params, @example {"method":"revokeLease","chunkName":"eeffgghh"}
 * @body   {Buffer} big data, @example Buffer.from("")
 * @return {Array}  return value, @example [{"code":0, "data":"aabbccdd"}]
 */
exports.revokeLease = async function( head, body ){
// START
	// CALL_MODULE_METHOD OPEN [GFS2_Chunkserver.masterHandler.revokeLease] {tabCount=1}
  let chunkData = chunkdata.get(); // Internal
  let leaseData = leasedata.get(); // Internal
  let chunkName = head.chunkName; // Extra
  
  let [result] = await masterHandler.revokeLease(
    chunkData,
    leaseData,
    chunkName
  );
  
  return [result];
	// CALL_MODULE_METHOD CLOSE
// END
};
// PUBLIC_METHOD_END [revokeLease]


// PUBLIC_METHOD_START [secondGuarantee]
/**
 * guaranteeing size of all replica are same
 * @head   {JSON}   request params, @example {"method":"secondGuarantee","chunkName":"ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b","privSize":10,"secondServerList":["127.0.0.1:3003"],"version":1,"cacheKey":"key123456"}
 * @body   {Buffer} big data, @example Buffer.from("")
 * @return {Array}  return value, @example [{"code":0, "data":{"maxSize":10}}]
 */
exports.secondGuarantee = async function( head, body ){
// START
  // CALL_MODULE_METHOD OPEN [GFS2_Chunkserver.primaryHandler.secondGuarantee] {tabCount=1}
  let chunkData = chunkdata.get(); // Internal
  let cacheData = cachedata.get(); // Internal
  let checksumData = checksum.get(); // Internal
  let chunkversionData = chunkversion.get(); // Internal
  let errorData = errordata.get(); // Internal
  let chunkRoot = config.CHUNK_ROOT; // Internal
  let chunkName = head.chunkName; // Extra
  let cacheKey = head.cacheKey; // Extra
  let privSize = head.privSize; // Extra
  let version = head.version; // Extra
  let secondServerList = head.secondServerList; // Extra
  let blockSize = config.BLOCK_SIZE; // Internal
  let maxChunkSize = config.MAX_CHUNK_SIZE; // Internal
  
  let [result] = await primaryHandler.secondGuarantee(
    chunkData,
    cacheData,
    checksumData,
    chunkversionData,
    errorData,
    chunkRoot,
    chunkName,
    cacheKey,
    privSize,
    version,
    secondServerList,
    blockSize,
    maxChunkSize
  );
  
  return [result];
  // CALL_MODULE_METHOD CLOSE
// END
};
// PUBLIC_METHOD_END [secondGuarantee]


// PUBLIC_METHOD_START [secondCreateChunk]
/**
 * create a empty chunk
 * @head   {JSON}   request params, @example {"method":"secondCreateChunk","chunkName":"ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b","version":1,"secondServerList":["127.0.0.1:3002","127.0.0.1:3003"]}
 * @body   {Buffer} big data, @example Buffer.from("")
 * @return {Array}  return value, @example [{"code":0}]
 */
exports.secondCreateChunk = async function( head, body ){
// START
  // CALL_MODULE_METHOD OPEN [GFS2_Chunkserver.primaryHandler.secondCreateChunk] {tabCount=1}
  let chunkData = chunkdata.get(); // Internal
  let checksumData = checksum.get(); // Internal
  let checksumFreeData = checksumFree.get(); // Internal
  let chunkversionData = chunkversion.get(); // Internal
  let chunkversionFreeData = chunkversionFree.get(); // Internal
  let chunkName = head.chunkName; // Extra
  let version = head.version; // Extra
  let secondServerList = head.secondServerList; // Extra
  let blockSize = config.BLOCK_SIZE; // Internal
  let chunkRoot = config.CHUNK_ROOT; // Internal
  let localHost = config.LOCAL_HOST; // Internal
  let localPort = config.LOCAL_PORT; // Internal
  let checksumPath = config.CHECKSUM_PATH; // Internal
  let versionPath = config.VERSION_PATH; // Internal
  
  let [result] = await primaryHandler.secondCreateChunk(
    chunkData,
    checksumData,
    checksumFreeData,
    chunkversionData,
    chunkversionFreeData,
    chunkName,
    version,
    secondServerList,
    blockSize,
    chunkRoot,
    localHost,
    localPort,
    checksumPath,
    versionPath
  );
  
  return [result];
  // CALL_MODULE_METHOD CLOSE
// END
};
// PUBLIC_METHOD_END [secondCreateChunk]


// PUBLIC_METHOD_START [secondPadding]
/**
 * padding chunk to target size with "0"
 * @head   {JSON}   request params, @example {"method":"secondPadding","chunkName":"aabbccdd","targetSize":30,"secondServerList":["127.0.0.1:3003"]}
 * @body   {Buffer} big data, @example Buffer.from("")
 * @return {Array}  return value, @example [{"code":0, "msg":""}]
 */
exports.secondPadding = async function( head, body ){
// START
  // CALL_MODULE_METHOD OPEN [GFS2_Chunkserver.primaryHandler.secondPadding] {tabCount=1}
  let chunkRoot = config.CHUNK_ROOT; // Internal
  let chunkName = head.chunkName; // Extra
  let targetSize = head.targetSize; // Extra
  let secondServerList = head.secondServerList; // Extra
  
  let [result] = await primaryHandler.secondPadding(
    chunkRoot,
    chunkName,
    targetSize,
    secondServerList
  );
  
  return [result];
  // CALL_MODULE_METHOD CLOSE
// END
};
// PUBLIC_METHOD_END [secondPadding]


// PUBLIC_METHOD_START [recvLease]
/**
 * receive lease of Master grant to primary
 * @head   {JSON}   request params, @example {"method":"recvLease","chunkName":"ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b","version":1,"primary":"127.0.0.1:3001","serverList":["127.0.0.1:3001","127.0.0.1:3002","127.0.0.1:3003"],"isNew":1}
 * @body   {Buffer} big data, @example Buffer.from("")
 * @return {Array}  return value, @example [{"code":0}]
 */
exports.recvLease = async function( head, body ){
// START
  // CALL_MODULE_METHOD OPEN [GFS2_Chunkserver.masterHandler.recvLease] {tabCount=1}
  let chunkData = chunkdata.get(); // Internal
  let checksumData = checksum.get(); // Internal
  let checksumFreeData = checksumFree.get(); // Internal
  let chunkversionData = chunkversion.get(); // Internal
  let chunkversionFreeData = chunkversionFree.get(); // Internal
  let leaseData = leasedata.get(); // Internal
  let chunkName = head.chunkName; // Extra
  let version = head.version; // Extra
  let primary = head.primary; // Extra
  let serverList = head.serverList; // Extra
  let isNew = head.isNew; // Extra
  let timestamp = Date.now();
  let blockSize = config.BLOCK_SIZE; // Internal
  let chunkRoot = config.CHUNK_ROOT; // Internal
  let checksumPath = config.CHECKSUM_PATH; // Internal
  let versionPath = config.VERSION_PATH; // Internal
  
  let [result] = await masterHandler.recvLease(
    chunkData,
    checksumData,
    checksumFreeData,
    chunkversionData,
    chunkversionFreeData,
    leaseData,
    chunkName,
    version,
    primary,
    serverList,
    isNew,
    timestamp,
    blockSize,
    chunkRoot,
    checksumPath,
    versionPath
  );
  
  return [result];
  // CALL_MODULE_METHOD CLOSE
// END
};
// PUBLIC_METHOD_END [recvLease]


