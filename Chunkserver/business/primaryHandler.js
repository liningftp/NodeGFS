
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Chunkserver
 * @copyright: liningftp@qq.com
 * @name: primaryHandler
 * @desc: handle request to primary
 * @file: /business/primaryHandler.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START
const fs = require("fs");
const path = require("path");

const { util, utilfs, comm, clog, jsonlog, log, jsons } = require('../../base');

const {
  cachedataTool,
  checksumTool,
  checksumFreeTool ,
  chunkdataTool,
  chunkversionTool,
  chunkversionFreeTool,
  errordataTool,
  leasedataTool,
  masterdataTool,
} = require('../metadata');

const {
  cachedataPersist,
  chunkdataPersist,
  checksumPersist,
  chunkversionPersist,
} = require('../store');

const {secondaryAPI} = require('../callapi');
// END
// REQUIRE_END


// PUBLIC_METHOD_START [secondCreateChunk]
/**
 * create a empty chunk
 * @chunkData            {JSON}   base info of all chunk on local, @example {}
 * @checksumData         {JSON}   checksumdata of all chunk on local, @example {}
 * @checksumFreeData     {JSON}   free position of checksum file, @example []
 * @chunkversionData     {JSON}   chunkversion of all chunk on local, @example {}
 * @chunkversionFreeData {Array}  free position of chunkversion file, @example []
 * @chunkName            {String} name of chunk, @example "ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b"
 * @version              {Number} version number, @example 1
 * @secondServerList     {Array}  list of secondary chunkservers, @example ["127.0.0.1:3002", "127.0.0.1:3003"]
 * @blockSize            {Number} block size for checksum, @example 65536
 * @chunkRoot            {String} root directory where the chunk is stored, @example "C:\work\GFS2\AppData\chunkserver\chunk2\"
 * @localHost            {String} local host ip, @example "127.0.0.1"
 * @localPort            {Number} local port, @example 3002
 * @checksumPath         {String} path of file to save checksum of chunk, @example "C:\work\GFS2\AppData\chunkserver\checksum2\data"
 * @versionPath          {String} path of file to save version of chunk, @example "C:\work\GFS2\AppData\chunkserver\version2\data"
 * @return               {Array}  return value, @example [{"code":0}]
 */
exports.secondCreateChunk = async function( chunkData, checksumData, checksumFreeData, chunkversionData, chunkversionFreeData, chunkName, version, secondServerList, blockSize, chunkRoot, localHost, localPort, checksumPath, versionPath ){
// START
  log.args( Error(), arguments );

  let result = {};

  /* the same chunkName MUST is not exists */
  if( chunkdataTool.has( chunkData, chunkName ) ){
    util.error( result, 'HAS_EXISTS', `chunk already exists, ${chunkName}` );
    return [result];
  }

  /* create new empty chunk */
  result = chunkdataPersist.create( chunkRoot, chunkName );
  if( 0 != result.code ){
    return [result];
  }
  chunkdataTool.add( chunkData, chunkName, 0 );

  /* create checksum of chunk */
  let contentData = Buffer.from('');
  let checksumList = checksumTool.createChecksum( contentData, blockSize );

  /* save checksum to disk and memory */
  let freeIndex = checksumFreeTool.getFreeIndex( checksumFreeData );
  if( -1 === freeIndex ){
    freeIndex = checksumTool.getCount( checksumData );
  }
  checksumTool.addChunk( checksumData, chunkName, checksumList, freeIndex );
  result = checksumPersist.addChunk( chunkName, checksumList, checksumPath, freeIndex );
  if( 0 != result.code ){
    return [result];
  }

  /* save version to disk and memory */
  freeIndex = chunkversionFreeTool.getFreeIndex( chunkversionFreeData );
  if( -1 === freeIndex ){
    freeIndex = chunkversionTool.getCount( chunkversionData );
  }
  chunkversionTool.addChunk( chunkversionData, chunkName, version, freeIndex );
  result = chunkversionPersist.addChunk( chunkName, version, versionPath, freeIndex );
  if( 0 != result.code ){
    return [result];
  }

  /* pass to next secondary */
  let pair = `${localHost}:${localPort}`;
  secondServerList = secondServerList.filter( item => item != pair );
  if(secondServerList.length){
    [result] = await secondaryAPI.secondCreateChunk( secondServerList, chunkName, version );
  }

  log.end( Error(), `${jsons([result])}` );
  return [result];
// END
};
// PUBLIC_METHOD_END [secondCreateChunk]


// PUBLIC_METHOD_START [secondPushData]
/**
 * primay push data to secondary
 * @cacheData        {JSON}   cache data, @example {}
 * @cacheRoot        {String} root directory where the cache is stored, @example "C:\work\GFS2\AppData\chunkserver\cache2\"
 * @cacheKey         {String} key of cache, @example "key123456"
 * @body             {Buffer} big data, @example Buffer.from("fefe")
 * @secondServerList {Array}  list of secondary chunkservers, @example ["127.0.0.1:3002", "127.0.0.1:3003"]
 * @timestamp        {Number} current timestamp, @example 1605446899821
 * @return           {Array}  return value, @example [{"code":0, "data":10}]
 */
exports.secondPushData = async function( cacheData, cacheRoot, cacheKey, body, secondServerList, timestamp ){
// START
  log.args( Error(), arguments );

  let result = {};

  /* clear timeout or used data */
  cachedataTool.clear(cacheData, timestamp);

  /* save data to disk */
  let contentData = Buffer.from(body);
  result = cachedataPersist.write(contentData, cacheRoot, cacheKey);
  if(0 != result.code){
    return [result];
  }

  /* add cache info to cacheData  */
  let size = contentData.byteLength;
  cachedataTool.add(cacheData, cacheKey, size, timestamp);

  /* pass to next chunkserver */
  if(secondServerList.length){
    [result] = await secondaryAPI.secondPushData(secondServerList, cacheKey, contentData);
    if(0 != result.code){
      return [result];
    }
  }

  util.success(result, '', {cacheKey});

  log.end( Error(), `${jsons([result])}` );
  return [result];
// END
};
// PUBLIC_METHOD_END [secondPushData]


// PUBLIC_METHOD_START [secondWrite]
/**
 * write content data according to primary
 * @chunkData        {JSON}   base info of all chunk on local, @example {"ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b":[0, 1602691021717]}
 * @checksumData     {JSON}   checksumdata of all chunk on local, @example {"ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b":[ 0, [0] ] }
 * @chunkversionData {JSON}   chunkversion of all chunk on local, @example {"ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b":[0, 1]}
 * @cacheData        {JSON}   cache data, @example {"key123456":[10, 1603641721707, 0]}
 * @errorData        {JSON}   chunk checksum is inconsistent, @example {}
 * @cacheRoot        {String} root directory where the cache is stored, @example "C:\work\GFS2\AppData\chunkserver\cache2\"
 * @cacheKey         {String} key of cache, @example "key123456"
 * @chunkRoot        {String} root directory where the chunk is stored, @example "C:\work\GFS2\AppData\chunkserver\chunk2\"
 * @chunkName        {String} name of chunk, @example "ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b"
 * @version          {Number} version number, @example 1
 * @startPos         {Number} start position in chunk, @example 0
 * @secondServerList {Array}  list of secondary chunkservers, @example ["127.0.0.1:3003"]
 * @blockSize        {Number} block size for checksum, @example 65536
 * @timestamp        {Number} current timestamp, @example 1603641721707
 * @checksumPath     {String} path of file to save checksum of chunk, @example "C:\work\GFS2\AppData\chunkserver\checksum2\data"
 * @return           {Array}  return value, @example [{"code":0, "data":10}]
 */
exports.secondWrite = async function( chunkData, checksumData, chunkversionData, cacheData, errorData, cacheRoot, cacheKey, chunkRoot, chunkName, version, startPos, secondServerList, blockSize, timestamp, checksumPath ){
// START
  log.args( Error(), arguments );

  clog( '----primaryHandler.secondWrite->start' );

  let result = {}, cacheContent, contentData;
  let checksumList, itemIndex;

  /****************************************************************************/
  /*                             check from memory                            */
  /****************************************************************************/

  /* check chunkName is exists or not */
  if( !chunkdataTool.has(chunkData, chunkName) ){
    util.error( result, 'NOT_EXISTS', `${chunkName} is not exists` );
    return [result];
  }

  /* check cache data is empty or not */
  let cacheSize = cachedataTool.getSize( cacheData, cacheKey );
  if( !cacheSize ){
    util.error( result, 'CACHE_EMPTY', `cache content is empty, ${cacheKey}` );
    return [result];
  }

  /* check version is consistent or not */
  if( version != chunkversionTool.getVersion(chunkversionData, chunkName) ){
    util.error( result, 'VERION_ERROR', `version is inconsistent, ${chunkName}`);
    return [result];
  }

  /* check start position is overflow or not */
  let chunkSize = chunkdataTool.getSize(chunkData, chunkName);
  if(chunkSize < startPos){
    // test
    jsonlog( {chunkData, chunkName, chunkSize} );
    util.error( result, 'START_OVERFLOW', `start position is overflow, ${chunkName}` );
    return [result];
  }

  /****************************************************************************/
  /*                             check from disk                              */
  /****************************************************************************/

  /* check checksum is consistent or not */
  result = chunkdataPersist.read( chunkRoot, chunkName );
  if( 0 != result.code){ return [result]; }
  contentData = result.data;

  if( !checksumTool.compare( checksumData, chunkName, contentData, blockSize ) ){
    errordataTool.add( errorData, chunkName );
    [result.code, result.msg] = [-1, `Error: ${chunkName} checksum inconsistent`];
    return [result];
  }

  /****************************************************************************/
  /*                             write and update                             */
  /****************************************************************************/

  /* read cache content */
  result = cachedataPersist.read( cacheRoot, cacheKey );
  if( 0 != result.code ){ return [result]; }
  cacheContent = result.data;

  /* write data to disk */
  result = chunkdataPersist.write( chunkRoot, chunkName, cacheContent, startPos );
  if( 0 != result.code ){ return [result]; }

  /* set chunk size in memory */
  chunkSize = startPos + cacheContent.byteLength;
  chunkdataTool.setSize( chunkData, chunkName, chunkSize) ;

  /* read chunk content */
  result = chunkdataPersist.read( chunkRoot, chunkName );
  if( 0 != result.code){ return [result]; }
  contentData = result.data;

  /* create new checksum of chunk */
  checksumList = checksumTool.createChecksum( contentData, blockSize );
  itemIndex = checksumTool.getChunkIndex( checksumData, chunkName );

  /* save checksum to disk and memory */
  result = checksumPersist.setChecksum( chunkName, checksumList, checksumPath, itemIndex );
  if( 0 != result.code ){ return [result]; }
  checksumTool.setChecksum( checksumData, chunkName, checksumList );

  /* pass to next chunkserver */
  if( secondServerList.length ){
    [result] = await secondaryAPI.secondWrite( secondServerList, cacheKey, chunkName, startPos, version );
    if( 0 != result.code ){ return [result]; }
  }

  /* set cache used time */
  cachedataTool.setUsedTime( cacheData, cacheKey, timestamp );

  util.success( result );

  clog( '----primaryHandler.secondWrite->end' );

  log.end( Error(), `${jsons([result])}` );
  return [result];
// END
};
// PUBLIC_METHOD_END [secondWrite]


// PUBLIC_METHOD_START [secondGuarantee]
/**
 * guaranteeing size of all replica are same
 * @chunkData        {JSON}   base info of all chunk on local, @example {"ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b":[10, 1602691021717]}
 * @cacheData        {JSON}   cache data, @example {"key123456":[10, 1603641721707, 0]}
 * @checksumData     {JSON}   checksumdata of all chunk on local, @example {"ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b":[0, [2089148645]]}
 * @chunkversionData {JSON}   chunkversion of all chunk on local, @example {"ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b":[0, 1]}
 * @errorData        {JSON}   chunk checksum is inconsistent, @example {}
 * @chunkRoot        {String} root directory where the chunk is stored, @example "C:\work\GFS2\AppData\chunkserver\chunk2\"
 * @chunkName        {String} name of chunk, @example "ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b"
 * @cacheKey         {String} key of cache, @example "key123456"
 * @privSize         {Number} size of previous chunk, @example 10
 * @version          {Number} version number, @example 1
 * @secondServerList {Array}  list of secondary chunkservers, @example ["127.0.0.1:3003"]
 * @blockSize        {Number} block size for checksum, @example 65536
 * @maxChunkSize     {Number} max size of chunk, @example 65536
 * @return           {Array}  return value, @example [{"code":0, "data":{"maxSize":10}}]
 */
exports.secondGuarantee = async function( chunkData, cacheData, checksumData, chunkversionData, errorData, chunkRoot, chunkName, cacheKey, privSize, version, secondServerList, blockSize, maxChunkSize ){
// START
  log.args( Error(), arguments );

  let result = {}, contentData, chunkContent;

  /* check cache is empty or not */
  let cacheSize = cachedataTool.getSize(cacheData, cacheKey);
  if( 0 == cacheSize ){
    util.error( result, `CACHE_EMPTY`, `Error: cahce is Empty, ${cacheKey}`)
    return [result];
  }

  /* check cache size is bigger or not */
  if( cacheSize > (maxChunkSize / 4) ){
    util.error(result, `SIZE_BIGGER`, `Error: Push data size is bigger than chunk_max / 4, ${cacheKey}`);
    return [result];
  }

  /* check chunk is exists or not */
  if( !chunkdataTool.has(chunkData, chunkName) ){
    util.error( result, 'NOT_EXISTS', `chunk is not exists, ${chunkName}` );
    return [result];
  }

  /* check the version is same or not */
  if( version != chunkversionTool.getVersion(chunkversionData, chunkName) ){
    errordataTool.add(errorData, chunkName);
    util.error( result, 'VERION_ERROR', `version is inconsistent, ${chunkName}` );
    return [result];
  }

  /* check the checksum is coincident or not */
  result = chunkdataPersist.read(chunkRoot, chunkName);
  if( 0 != result.code ){ return [result]; }
  chunkContent = result.data;
  if( !checksumTool.compare(checksumData, chunkName, chunkContent, blockSize) ){
    errordataTool.add(errorData, chunkName);
    util.error( result, 'CHECKSUM_ERROR', `chunk checksum inconsistent, ${chunkName}` );
    return [result];
  }

  /* assign size with previous chunkserver */
  let maxSize = privSize;
  let chunkSize = chunkContent.byteLength;
  if(maxSize < chunkSize){
    maxSize = chunkSize;
  }

  /* pass to secondary chunkserver, keep the same size and version */
  if( secondServerList.length ){
    [result] = await secondaryAPI.secondGuarantee(secondServerList, chunkName, cacheKey, maxSize, version);
    if(0 != result.code){ return [result]; }
    maxSize = result.data.maxSize;
  }

  /* align the return size */
  if(chunkSize < maxSize){
    let chunkPath = path.join(chunkRoot, chunkName);
    [result.code, result.msg] = utilfs.fillToByZero(chunkPath, maxSize);
    if(0 != result.code){ return [result]; }
  }

  util.success( result, '', {maxSize} );

  log.end( Error(), `${jsons([result])}` );
  return [result];
// END
};
// PUBLIC_METHOD_END [secondGuarantee]


// PUBLIC_METHOD_START [secondPadding]
/**
 * padding chunk to target size with "0"
 * @chunkRoot        {String} root directory where the chunk is stored, @example "C:\work\GFS2\AppData\chunkserver\chunk2\"
 * @chunkName        {String} name of chunk, @example "aabbccdd"
 * @targetSize       {Number} the target size to padding to, @example 30
 * @secondServerList {Array}  list of secondary chunkservers, @example ["127.0.0.1:3003"]
 * @return           {Array}  return value, @example [{"code":0, "msg":""}]
 */
exports.secondPadding = async function( chunkRoot, chunkName, targetSize, secondServerList ){
// START
  log.args( Error(), arguments );

  let result = {};

  /* padding */
  let chunkPath = path.resolve(chunkRoot, chunkName);
  [result.code, result.msg] = utilfs.fillToByZero(chunkPath, targetSize);
  if(0 != result.code){
    return [result];
  }

  /* pass to next chunkserver */
  if(secondServerList.length){
    [result] = await secondaryAPI.secondPadding(secondServerList, chunkName, targetSize);
    if(0 != result.code){
      return [result];
    }
  }

  util.success( result );

  log.end( Error(), `${jsons([result])}` );
  return [result];
// END
};
// PUBLIC_METHOD_END [secondPadding]


// PUBLIC_METHOD_START [secondAppend]
/**
 * append content data to chunk according to primary
 * @chunkData        {JSON}   base info of all chunk on local, @example {"ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b":[0, 1602691021717]}
 * @checksumData     {JSON}   checksumdata of all chunk on local, @example {"ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b":[ 0, [0] ] }
 * @cacheData        {JSON}   cache data, @example {"key123456":[10, 1603641721707, 0]}
 * @cacheRoot        {String} root directory where the cache is stored, @example "C:\work\GFS2\AppData\chunkserver\cache2\"
 * @cacheKey         {String} key of cache, @example "key123456"
 * @chunkRoot        {String} root directory where the chunk is stored, @example "C:\work\GFS2\AppData\chunkserver\chunk2\"
 * @chunkName        {String} name of chunk, @example "ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b"
 * @secondServerList {Array}  list of secondary chunkservers, @example ["127.0.0.1:3003"]
 * @timestamp        {Number} current timestamp, @example 1603641721707
 * @blockSize        {Number} block size for checksum, @example 65536
 * @checksumPath     {String} path of file to save checksum of chunk, @example "C:\work\GFS2\AppData\chunkserver\checksum2\data"
 * @return           {Array}  return value, @example [{"code":0, "data":{"startPos":0}}]
 */
exports.secondAppend = async function( chunkData, checksumData, cacheData, cacheRoot, cacheKey, chunkRoot, chunkName, secondServerList, timestamp, blockSize, checksumPath ){
// START
  log.args( Error(), arguments );

  let result = {}, contentCache, startPos;

  /* check cache is empty or not */
  let cacheSize = cachedataTool.getSize(cacheData, cacheKey);
  if(!cacheSize){
    util.error( result, 'CACHE_EMPTY', `cache content is empty, ${cacheKey}` );
    return [result];
  }
  result = cachedataPersist.read(cacheRoot, cacheKey);
  if( 0 != result.code ){ return [result]; }
  contentCache = result.data;

  /* handle content data */
  result = chunkdataPersist.append(chunkRoot, chunkName, contentCache);
  if(0 != result.code){ return [result]; }

  /* set chunk size to memory */
  startPos = result.data.startPos;
  let chunkSize = chunkdataTool.getSize(chunkData, chunkName) + contentCache.byteLength;
  chunkdataTool.setSize(chunkData, chunkName, chunkSize);

  /* handle checksum */
  result = chunkdataPersist.read(chunkRoot, chunkName);
  if(0 != result.code){ return [result]; }
  let contentData = result.data;
  /* save to memory */
  let checksumList = checksumTool.createChecksum(contentData, blockSize);
  checksumTool.setChecksum(checksumData, chunkName, checksumList);
  /* save to disk */
  let itemIndex = checksumTool.getChunkIndex(checksumData, chunkName);
  result = checksumPersist.setChecksum(chunkName, checksumList, checksumPath, itemIndex);
  if(0 != result.code){ return [result]; }

  /* set cache use time */
  cachedataTool.setUsedTime(cacheData, cacheKey, timestamp);

  /* pass to next chunkserver */
  if( secondServerList.length ){
    [result] = await secondaryAPI.secondAppend(secondServerList, cacheKey, chunkName);
    if(0 != result.code){
      return [result];
    }
  }

  util.success( result, '', {startPos} );

  log.end( Error(), `${jsons([result])}` );
  return [result];
// END
};
// PUBLIC_METHOD_END [secondAppend]


// PUBLIC_METHOD_START [secondSetVersion]
/**
 * set version to secondary
 * @chunkData        {JSON}   base info of all chunk on local, @example {"ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b":[10, 1602691021717]}
 * @chunkversionData {JSON}   chunkversion of all chunk on local, @example {"ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b":[0, 1]}
 * @chunkName        {String} name of chunk, @example "ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b"
 * @version          {Number} version number, @example 66
 * @secondServerList {Array}  list of secondary chunkservers, @example ["127.0.0.1:3003"]
 * @timestamp        {Number} current timestamp, @example 1602576896653
 * @versionPath      {String} path of file to save version of chunk, @example "C:\work\GFS2\AppData\chunkserver\version2\data"
 * @return           {Array}  return value, @example [{"code":0, "msg":""}]
 */
exports.secondSetVersion = async function( chunkData, chunkversionData, chunkName, version, secondServerList, timestamp, versionPath ){
// START
  log.args( Error(), arguments );

  let result = {};

  /* check chunkName is exists or not */
  if( !chunkdataTool.has( chunkData, chunkName ) ){
    uitl.error( result, 'NOT_EXISTS', ` no chunk, ${chunkName}` );
    return [result];
  }

  /* handle version */
  let itemIndex = chunkversionTool.setVersion( chunkversionData, chunkName, version );
  result = chunkversionPersist.setVersion( chunkName, version, versionPath, itemIndex );
  if( 0 != result.code ){
    return [result];
  };

  /* set version */
  if( secondServerList.length ){
    [result] = await secondaryAPI.secondSetVersion( secondServerList, chunkName, version) ;
  }

  util.success( result );

  log.end( Error(), `${jsons([result])}` );
  return [result];
// END
};
// PUBLIC_METHOD_END [secondSetVersion]


