
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Chunkserver
 * @copyright: liningftp@qq.com
 * @name: clientHandler
 * @desc: handle client request
 * @file: /business/clientHandler.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START
const path = require('path');
const {comm, util, utilfs, clog, log, jsonlog, jsons} = require('../../base');
const {
  cachedataTool,
  checksumTool,
  chunkdataTool,
  chunkversionTool,
  errordataTool,
  leasedataTool,
  masterdataTool,
} = require('../metadata');

const {
  cachedataPersist,
  chunkdataPersist,
  checksumPersist,
} = require('../store');

const {
  masterAPI,
  secondaryAPI
} = require('../callapi');

const boot = require('../boot/boot.js');
// END
// REQUIRE_END


// PUBLIC_METHOD_START [primaryPushData]
/**
 * client push data to primary
 * @cacheData        {JSON}   cache data, @example {}
 * @cacheRoot        {String} root directory where the cache is stored, @example "C:\work\GFS2\AppData\chunkserver\cache1\"
 * @body             {Buffer} big data, @example Buffer.from("hello girl")
 * @secondServerList {Array}  list of secondary chunkservers, @example ["127.0.0.1:3003"]
 * @timestamp        {Number} current timestamp, @example 1603680283034
 * @maxChunkSize     {Number} max size of chunk, @example 3
 * @return           {Array}  返回值, @example [{"code":0, "data":{"cacheKey":"key123456"}}]
 */
exports.primaryPushData = async function( cacheData, cacheRoot, body, secondServerList, timestamp, maxChunkSize ){
// START
  log.args( Error(), arguments );

  let result = {}, bigData;

  let cacheContent = Buffer.from(body);
  let size = cacheContent.byteLength;

  /* check size */
  if( maxChunkSize < size){
    util.error( result, 'SIZE_OVERFLOW', `contentCache size bigger than maxChunkSize` );
    return [result];
  }

  /* save cache content */
  cachedataTool.clear(cacheData, timestamp);
  let cacheKey = cachedataTool.createKey(cacheData);
  result = cachedataPersist.write(cacheContent, cacheRoot, cacheKey); /* to disk */
  if(0 != result.code){ return [result]; }
  cachedataTool.add(cacheData, cacheKey, size, timestamp); /* to memory */

  /* pass to next chunkserver */
  if(secondServerList.length){
    [result] = await secondaryAPI.secondPushData(secondServerList, cacheKey, cacheContent);
    if(0 != result.code){ return [result]; }
  }

  util.success( result, '', {cacheKey} );

  log.end( Error(), `${jsons([result])}` );
  return [result];
// END
};
// PUBLIC_METHOD_END [primaryPushData]


// PUBLIC_METHOD_START [primaryWrite]
/**
 * primary receive client request to write
 * @chunkData        {JSON}   base info of all chunk on local, @example {"ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b":[0, 1602691021717]}
 * @cacheData        {JSON}   cache data, @example {"key123456":[10, 1603641721707, 0]}
 * @checksumData     {JSON}   checksumdata of all chunk on local, @example {"ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b":[ 0, [0] ] }
 * @chunkversionData {JSON}   chunkversion of all chunk on local, @example {"ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b":[0, 1]}
 * @errorData        {JSON}   chunk checksum is inconsistent, @example {}
 * @cacheRoot        {String} root directory where the cache is stored, @example "C:\work\GFS2\AppData\chunkserver\cache1\"
 * @cacheKey         {String} key of cache, @example "key123456"
 * @chunkRoot        {String} root directory where the chunk is stored, @example "C:\work\GFS2\AppData\chunkserver\chunk1\"
 * @chunkName        {String} name of chunk, @example "ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b"
 * @version          {Number} version number, @example 1
 * @startPos         {Number} start position in chunk, @example 0
 * @secondServerList {Array}  list of secondary chunkservers, @example ["127.0.0.1:3002", "127.0.0.1:3003"]
 * @timestamp        {Number} current timestamp, @example 1603641721707
 * @blockSize        {Number} block size for checksum, @example 65536
 * @checksumPath     {String} path of file to save checksum of chunk, @example "C:\work\GFS2\AppData\chunkserver\checksum1\data"
 * @versionPath      {String} path of file to save version of chunk, @example "C:\work\GFS2\AppData\chunkserver\version1\data"
 * @return           {Array}  Return value, @example [ {"code":0,"msg":""} ]
 */
exports.primaryWrite = async function( chunkData, cacheData, checksumData, chunkversionData, errorData, cacheRoot, cacheKey, chunkRoot, chunkName, version, startPos, secondServerList, timestamp, blockSize, checksumPath, versionPath ){
// START
  log.args( Error(), arguments );

  let result = {}, cacheContent, chunkContent;

  /****************************************************************************/
  /*                             check memory data                            */
  /****************************************************************************/

  /* check chunkName is exists or not */
  if( !chunkdataTool.has(chunkData, chunkName) ){
    util.result( result, -1, 'NOT_EXISTS', `chunk is not exists, ${chunkName}` );
    log.error( Error(), jsons([result]) );
    return [result];
  }

  /* check cache is empty or not */
  let cacheSize = cachedataTool.getSize(cacheData, cacheKey);
  if(!cacheSize){
    util.result( result, -1, 'CACHE_EMPTY', `${cacheKey} is empty` );
    log.error( Error(), jsons([result]) );
    return [result];
  }

  /* check version is consistent or not */
  if( version != chunkversionTool.getVersion(chunkversionData, chunkName) ){
    errordataTool.add(errorData, chunkName);
    util.result( result, -1, 'VERSION_ERROR', `${chunkName} version inconsistent` );
    log.error( Error(), jsons([result]) );
    return [result];
  }

  /* check start position is overflow or not */
  let chunkSize = chunkdataTool.getSize(chunkData, chunkName);
  if(chunkSize < startPos){
    // test
    jsonlog( {chunkData, chunkName, chunkSize} );
    util.result( result, -1, 'START_OVERFLOW', `${chunkName} startPos is overflow` );
    log.error( Error(), jsons([result]) );
    return [result];
  }

  /****************************************************************************/
  /*                             check from disk                              */
  /****************************************************************************/

  /* read chunk content from disk */
  result = chunkdataPersist.read(chunkRoot, chunkName);
  if( 0 != result.code ){
    log.error( Error(), jsons([result]) );
    return [result];
  }
  chunkContent = result.data;

  /* check target chunk content is integrity or not */
  if( !checksumTool.compare(checksumData, chunkName, chunkContent, blockSize) ){
    errordataTool.add(errorData, chunkName);
    util.result( result, -1, 'CHECKSUM_ERROR', `${chunkName} checksum inconsistent` );
    log.error( Error(), jsons([result]) );
    return [result];
  }

  /****************************************************************************/
  /*                             write and update                             */
  /****************************************************************************/

  /* write to disk */
  result = cachedataPersist.read(cacheRoot, cacheKey);
  if( 0 != result.code ){
    log.error( Error(), jsons([result]) );
    return [result];
  }
  cacheContent = result.data;

  result = chunkdataPersist.write(chunkRoot, chunkName, cacheContent, startPos);
  if(0 != result.code){
    log.error( Error(), jsons([result]) );
    return [result];
  }

  /* read the whole chunk */
  result = chunkdataPersist.read(chunkRoot, chunkName);
  if(0 != result.code){
    log.error( Error(), jsons([result]) );
    return [result];
  }
  chunkContent = result.data;

  /* recalc checksum and update */
  let checksumList = checksumTool.createChecksum(chunkContent, blockSize);
  checksumTool.setChecksum(checksumData, chunkName, checksumList); /* 更新内存校验和 */
  let itemIndex = checksumTool.getChunkIndex(checksumData, chunkName);
  result = checksumPersist.setChecksum(chunkName, checksumList, checksumPath, itemIndex); /* 更新磁盘校验和 */
  if(0 != result.code){
    log.error( Error(), jsons([result]) );
    return [result];
  }

  /* update checkData */
  chunkSize = chunkContent.byteLength;
  chunkdataTool.setSize(chunkData, chunkName, chunkSize);

  /* pass to next chunkserver */
  if(secondServerList.length){
    [result] = await secondaryAPI.secondWrite(secondServerList, cacheKey, chunkName, startPos, version);
    if(0 != result.code){
      log.error( Error(), jsons([result]) );
      return [result];
    }
  }

  /* update cache used time */
  cachedataTool.setUsedTime(cacheData, cacheKey, timestamp);

  util.result(result, 0, '');

  log.info( Error(), `${jsons([result])}` );
  return [result];
// END
};
// PUBLIC_METHOD_END [primaryWrite]


// PUBLIC_METHOD_START [primaryAppend]
/**
 * client request primary append content
 * @chunkData        {JSON}   base info of all chunk on local, @example {"ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b":[0, 1602691021717]}
 * @cacheData        {JSON}   cache data, @example {"key123456":[10, 1603641721707, 0]}
 * @checksumData     {JSON}   checksumdata of all chunk on local, @example {"ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b":[ 0, [0] ] }
 * @chunkversionData {JSON}   chunkversion of all chunk on local, @example {"ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b":[0, 1]}
 * @errorData        {JSON}   chunk checksum is inconsistent, @example {}
 * @masterData       {JSON}   data of Master server, @example {"startTime":1603641721707}
 * @filePath         {String} file path of NodeGFS system, @example "/usr/data/1.txt"
 * @cacheRoot        {String} root directory where the cache is stored, @example "C:\work\GFS2\AppData\chunkserver\cache1\"
 * @cacheKey         {String} key of cache, @example "key123456"
 * @chunkRoot        {String} root directory where the chunk is stored, @example "C:\work\GFS2\AppData\chunkserver\chunk1\"
 * @version          {Number} version number, @example 1
 * @secondServerList {Array}  list of secondary chunkservers, @example ["127.0.0.1:3002", "127.0.0.1:3003"]
 * @timestamp        {Number} current timestamp, @example 1603641721707
 * @blockSize        {Number} block size for checksum, @example 65536
 * @maxChunkSize     {Number} max size of chunk, @example 100
 * @masterHost       {String} host of Master server, @example "127.0.0.1"
 * @masterPort       {Number} port of Master server, @example 3000
 * @checksumPath     {String} path of file to save checksum of chunk, @example "C:\work\GFS2\AppData\chunkserver\checksum1\data"
 * @return           {Array}  Return value, @example [ {"code":0,"data":{"startPos":0}} ]
 */
exports.primaryAppend = async function( chunkData, cacheData, checksumData, chunkversionData, errorData, masterData, filePath, cacheRoot, cacheKey, chunkRoot, version, secondServerList, timestamp, blockSize, maxChunkSize, masterHost, masterPort, checksumPath ){
// START
  log.args( Error(), arguments );

  let result = {}, cacheContent, chunkContent;
  let chunkName, chunkSize, maxSize, startPos;

  /****************************************************************************/
  /*                             check memory data                            */
  /****************************************************************************/

  /* check cache is empty or not */
  let cacheSize = cachedataTool.getSize( cacheData, cacheKey );
  if( 0 == cacheSize ){
    util.error(result, `CACHE_EMPTY`, `Error: cahce is Empty, ${cacheKey}`);
    log.error( Error(), jsons([result]) );
    return [result];
  }

  /* check cache size is bigger or not */
  if( cacheSize > ( maxChunkSize / 4 ) ){
    util.error(result, `SIZE_BIGGER`, `Error: Push data size is bigger than chunk_max / 4`);
    log.error( Error(), jsons([result]) );
    return [result];
  }

  /* get last chunkname of the filePath */
  let startTime = masterdataTool.getTime( masterData );
  [result] = await masterAPI.getLastChunkName( masterHost, masterPort, filePath, startTime );
  if(0 != result.code){
    log.error( Error(), jsons([result]) );
    return [result];
  }

  /* check chunk is exists or not */
  chunkName = result.data.chunkName;
  if( !chunkdataTool.has( chunkData, chunkName ) ){
    util.error(result, `NO_CHUNK`, `Error: chunk is not exists, ${chunkName}`);
    log.error( Error(), jsons([result]) );
    return [result];
  }

  /* check the version is same or not */
  if( version != chunkversionTool.getVersion( chunkversionData, chunkName ) ){
    errordataTool.add( errorData, chunkName );
    util.error(result, `VERION_ERROR`, `Error: ${chunkName} version inconsistent`);
    log.error( Error(), jsons([result]) );
    return [result];
  }

  /* check the checksum is coincident or not */
  result = chunkdataPersist.read( chunkRoot, chunkName );
  if( 0 != result.code ){
    log.error( Error(), jsons([result]) );
    return result;
  }
  chunkContent = result.data;
  if( !checksumTool.compare( checksumData, chunkName, chunkContent, blockSize) ){
    errordataTool.add( errorData, chunkName );
    util.error(result, `CHECKSUM_ERROR`, `Error: checksum inconsistent, ${chunkName}`);
    log.error( Error(), jsons([result]) );
    return [result];
  }

  /* pass to secondary chunkserver, keep the same size and version */
  chunkSize = chunkContent.byteLength;
  maxSize = chunkSize;
  if( secondServerList.length ){
    [result] = await secondaryAPI.secondGuarantee( secondServerList, chunkName, cacheKey, maxSize, version );
    if( 0 != result.code ){
      log.error( Error(), jsons([result]) );
      return [result];
    }
    maxSize = result.data.maxSize;
  }

  /* align the return size */
  if(chunkSize < maxSize){
    result = chunkdataPersist.padding( chunkRoot, chunkName, maxSize );
    if( 0 != result.code ){
      util.error(result, `PADDING_FAIL`, `Error: primaryPadding fail, ${chunkName}`);
      log.error( Error(), jsons([result]) );
      return [result];
    }
    chunkSize = maxSize;
  }

  /****************************************************************************/
  /*                             check available size                         */
  /****************************************************************************/

  /* chunk has free, but not enough */
  // jsonlog( {chunkSize, cacheSize, maxChunkSize} );
  if( chunkSize < maxChunkSize && chunkSize + cacheSize > maxChunkSize ){
    result = chunkdataPersist.padding( chunkRoot, chunkName, maxSize );
    if( 0 != result.code ){
      util.error(result, `PADDING_FAIL`, `Error: primaryPadding fail, ${chunkName}`);
      log.error( Error(), jsons([result]) );
      return [result];
    }

    [result] = await secondaryAPI.secondPadding( secondServerList, chunkName, maxChunkSize );
    if( 0 != result.code ){
      util.error(result, `PADDING_FAIL`, `Error: secondPadding fail, ${chunkName}`);
      log.error( Error(), jsons([result]) );
      return [result];
    }
    chunkSize = maxChunkSize;
  }

  /* chunk is full */
  if( chunkSize === maxChunkSize ){
    let startTime = masterdataTool.getTime( masterData );
    [result] = await masterAPI.setChunkFull( masterHost, masterPort, chunkName, startTime );
    if( 0 != result.code ){
      util.error( result, 'CHUNK_FULL', `Error: chunk full, please retry from Master!`);
      log.error( Error(), jsons([result]) );
      return [result];
    }
    log.info( Error(), `${jsons([result])}` );
    return [result];
  }

  /****************************************************************************/
  /*                                run append                                */
  /****************************************************************************/

  /* read cache, from disk */
  result = cachedataPersist.read( cacheRoot, cacheKey );
  if( 0 != result.code ){
    log.error( Error(), jsons([result]) );
    return [result];
  }
  cacheContent = result.data;

  /* append chunk by cache, in disk */
  result = chunkdataPersist.append( chunkRoot, chunkName, cacheContent );
  if( 0 != result.code ){
    log.error( Error(), jsons([result]) );
    return [result];
  }
  startPos = result.data.startPos;

  /* read the chunk, from disk */
  result = chunkdataPersist.read( chunkRoot, chunkName );
  if( 0 != result.code ){
    log.error( Error(), jsons([result]) );
    return [result];
  }
  chunkContent = result.data;

  /* update chunk size, in memory */
  chunkSize = chunkContent.byteLength;
  chunkdataTool.setSize( chunkData, chunkName, chunkSize );

  /* update checksum */
  let checksumList = checksumTool.createChecksum( chunkContent, blockSize );
  checksumTool.setChecksum( checksumData, chunkName, checksumList );
  let itemIndex = checksumTool.getChunkIndex( checksumData, chunkName );
  result = checksumPersist.setChecksum( chunkName, checksumList, checksumPath, itemIndex );
  if( 0 != result.code ){
    log.error( Error(), jsons([result]) );
    return [result];
  }

  /* update cache, in memory */
  cachedataTool.setUsedTime( cacheData, cacheKey, timestamp );

  /* pass to next chunkserver */
  if( secondServerList.length ){
    [result] = await secondaryAPI.secondAppend( secondServerList, cacheKey, chunkName );
    if( 0 != result.code ){
      log.error( Error(), jsons([result]) );
      return [result];
    }
  }

  util.success( result, '', {startPos} );

  log.info( Error(), `${jsons([result])}` );
  return [result];
// END
};
// PUBLIC_METHOD_END [primaryAppend]


// PUBLIC_METHOD_START [readChunk]
/**
 * client read chunk content
 * @chunkData        {JSON}   base info of all chunk on local, @example {"ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b":[11, 1602691021717]}
 * @checksumData     {JSON}   checksumdata of all chunk on local, @example {"ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b":[ 0, [2089148645] ] }
 * @chunkversionData {JSON}   chunkversion of all chunk on local, @example {"ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b":[0, 66]}
 * @errorData        {JSON}   chunk checksum is inconsistent, @example {}
 * @chunkRoot        {String} root directory where the chunk is stored, @example "C:\work\GFS2\AppData\chunkserver\chunk2\"
 * @chunkName        {String} name of chunk, @example "ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b"
 * @version          {Number} version number, @example 66
 * @startPos         {Number} start position in chunk, @example 2
 * @length           {Number} length of content, @example 4
 * @blockSize        {Number} block size for checksum, @example 65536
 * @return           {Array}  Return value, @example [{"code":0, "msg":""}, []]
 */
exports.readChunk = async function( chunkData, checksumData, chunkversionData, errorData, chunkRoot, chunkName, version, startPos, length, blockSize ){
// START
  log.args( Error(), arguments );
  let result = {}, chunkContent, bigData;
  startPos = parseInt( startPos );
  length = parseInt( length );

  /* check chunkName is exists or not */
  if( !chunkdataTool.has(chunkData, chunkName) ){
    util.error( result, 'NOT_EXISTS', `chunk is not exists, ${chunkName}` );
    log.info( Error(), `${jsons([result])}` );
    return [result];
  }

  /* check start porsition is overflow */
  let start = startPos;
  let end = start + length;
  let chunkSize = chunkdataTool.getSize(chunkData, chunkName);
  if( start >= chunkSize ){
    util.error( result, 'RANGE_OVERFLOW', `start overflow, start->${start}, chunkSize->${end}, ${chunkName}` );
    log.error( Error(), jsons([result]) );
    return [result];
  }
  if( end > chunkSize ){
    log.warn( Error(), `WARN, end overflow, end->${end}, chunkSize->${chunkSize}, but only read ${chunkSize}, ${chunkName}` );
    end = chunkSize;
  }

  /* check version is consistent or not */
  if( version != chunkversionTool.getVersion(chunkversionData, chunkName) ){
    errordataTool.add(errorData, chunkName);
    util.error( result, 'VERSION_ERROR', `chunk version inconsistent, ${chunkName}` );
    log.error( Error(), jsons([result]) );
    return [result];
  }

  /* check checksum is consistent or not */
  result = chunkdataPersist.read(chunkRoot, chunkName);
  if( 0 != result.code ){ return [result]; }
  chunkContent = result.data;
  if( !checksumTool.compare(checksumData, chunkName, chunkContent, blockSize) ){
    errordataTool.add(errorData, chunkName);
    util.error( result, 'CHECKSUM_ERROR', `chunk checksum inconsistent, ${chunkName}`);
    log.error( Error(), jsons([result]) );
    return [result];
  }

  /* read chunk content in range */
  util.success(result);
  bigData = chunkContent.slice(start, end);

  log.end( Error(), jsons([result, bigData]) );
  return [result, bigData];
// END
};
// PUBLIC_METHOD_END [readChunk]


