
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Chunkserver
 * @copyright: liningftp@qq.com
 * @name: daemon
 * @desc: manage all subprocess
 * @file: /daemon/daemon.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START
const path = require('path');
const child_process = require("child_process");

const { schedule, comm, utilfs, clog, log, jsons } = require('../../base');

const {
  checksumTool,
  checksumFreeTool,
  chunkdataTool,
  chunkversionTool,
  chunkversionFreeTool,
  errordataTool,
  leasedataTool,
  masterdataTool
} = require('../metadata');

const {
  checksumPersist,
  chunkdataPersist,
  chunkversionPersist
} = require('../store');

const boot = require('../boot/boot.js');
// END
// REQUIRE_END


// PUBLIC_METHOD_START [start]
/**
 * start
 * @checksumData         {JSON}   checksumdata of all chunk on local, @example {}
 * @checksumFreeData     {JSON}   free position of checksum file, @example {}
 * @chunkData            {JSON}   base info of all chunk on local, @example {}
 * @chunkversionData     {JSON}   chunkversion of all chunk on local, @example {}
 * @chunkversionFreeData {JSON}   free position of chunkversion file, @example {}
 * @errorData            {JSON}   chunk checksum is inconsistent, @example {}
 * @leaseData            {JSON}   lease of primary chunk, @example {}
 * @masterData           {JSON}   data of Master server, @example {"startTime":1602907450469}
 * @checksumPath         {String} path of file to save checksum of chunk, @example "C:\work\GFS2\AppData\chunkserver\checksum1\data"
 * @chunkRoot            {String} root directory where the chunk is stored, @example "C:\work\GFS2\AppData\chunkserver\chunk1\"
 * @versionPath          {String} path of file to save version of chunk, @example "C:\work\GFS2\AppData\chunkserver\version1\data"
 * @blockSize            {Number} block size for checksum, @example 65536
 * @maxChunkSize         {Number} max size of chunk, @example 67108864
 * @maxChunkCount        {Number} max chunk count of chunkserver, @example 25
 * @masterHost           {String} host of Master server, @example "127.0.0.1"
 * @masterPort           {Number} port of Master server, @example 3000
 * @localHost            {String} local host ip, @example "127.0.0.1"
 * @localPort            {Number} local port, @example 3001
 * @logPath              {String} log path to save, @example "C:\work\GFS2\AppData\chunkserver\log.log"
 */
exports.start = async function( checksumData, checksumFreeData, chunkData, chunkversionData, chunkversionFreeData, errorData, leaseData, masterData, checksumPath, chunkRoot, versionPath, blockSize, maxChunkSize, maxChunkCount, masterHost, masterPort, localHost, localPort, logPath ){
// START
  log.args( Error(), arguments );

  // 1 clone sub process
  let cloneWorker = child_process.fork( path.join(__dirname, './process/cloneProcess.js') );
  cloneWorker.on('message', message => {
    let {flag} = message;
    if( 'cloneData' == flag ){
      log.info( new Error(), jsons( message ) );
      let {cloneData} = message;
      exports._handleClone( checksumData, checksumFreeData, chunkData, chunkversionData, chunkversionFreeData, cloneData, checksumPath, versionPath );
    }
  });
  cloneWorker.send({
    'flag':'init',
    chunkRoot,
    logPath,
    blockSize,
    maxChunkSize
  });

  // 2 heartbeat sub process
  let heartbeatWorker = child_process.fork( path.join(__dirname, './process/heartbeatProcess.js') );
  heartbeatWorker.on('message', async (message) => {
    let {flag} = message;
    if('reboot' == flag){
      let result = await boot.reportBootData( chunkData, chunkversionData, masterData, maxChunkCount, masterHost, masterPort, localHost, localPort );
      if(0 == result.code){
        heartbeatWorker.send({
          'flag': 'RESTART'
        });
      }
    }
    else if('mainData' == flag){
      let collectList = chunkdataTool.getReport(chunkData).map(
          (chunkName) => `${chunkName},${chunkversionTool.getVersion(chunkversionData, chunkName)}`
        );
      let errorList = errordataTool.getReport(errorData);

      /* remove duplication and remove error chunk  */
      collectList = collectList.filter( item => {
        let [chunkName, version] = item.split(',');
        return !errorList.includes( chunkName );
      } );

      errordataTool.delete( errorData, errorList );

      /* remove chunk of errorList */
      let deleteList = errorList;
      exports._handleDelete( checksumData, checksumFreeData, chunkData, chunkversionData, chunkversionFreeData, deleteList, chunkRoot, checksumPath, versionPath );

      heartbeatWorker.send({
        flag,
        collectList,
        errorList,
        'leaseList': leasedataTool.getRenewList(leaseData),
        'useRate': chunkdataTool.getUseRate(chunkData, maxChunkCount),
        'startTime': masterdataTool.getTime(masterData),
        masterHost,
        masterPort,
        localHost,
        localPort
      });
    }
    else if('taskData' == flag){
      log.info( Error(), `${jsons( message )}` );

      let {deleteList, cloneList} = message;

      // run delete chunk
      if( deleteList && deleteList.length ){
        clog( {deleteList} );
        exports._handleDelete( checksumData, checksumFreeData, chunkData, chunkversionData, chunkversionFreeData, deleteList, chunkRoot, checksumPath, versionPath );
      }

      // pass to cloneProcess to clone chunk from other chunkserver
      if( cloneList && cloneList.length ){
        clog( {cloneList} );
        cloneWorker.send({
          'flag':'start',
          'cloneList': cloneList,
          'maxChunkSize': maxChunkSize
        });
      }
    }
  });
  // init process
  heartbeatWorker.send({
    'flag':'init',
    logPath
  });


  // 3 scan sub process
  let scanWorker = child_process.fork( path.join(__dirname, './process/scanProcess.js') );
  scanWorker.send({
    'flag': 'start',
    chunkRoot,
    logPath,
    blockSize,
  });
  scanWorker.on('message', message => {
    let {flag} = message;
    if('mainData' == flag){
      let {startIndex, endIndex} = message;
      scanWorker.send({
        'flag': 'mainData',
        'checksumData': checksumData
      });
    }
    else if('errorList' == flag){
      let {errorList} = message;
      let timestamp = Date.now();
      for(const chunkName of errorList){
        errordataTool.add(errorData, chunkName);
      }
    }
  });
// END
};
// PUBLIC_METHOD_END [start]


// PUBLIC_METHOD_START [_handleClone]
/**
 * handle clone data after chunk has be cloned to disk
 * @checksumData         {JSON}   checksumdata of all chunk on local, @example {"5964d672f56753389f3d89906ab238fbc680359229015a15a4ca66e466b128bc":[0,[12345679]]}
 * @checksumFreeData     {Array}  free position of checksum file, @example []
 * @chunkData            {JSON}   base info of all chunk on local, @example {"5964d672f56753389f3d89906ab238fbc680359229015a15a4ca66e466b128bc":[1024,0]}
 * @chunkversionData     {JSON}   chunkversion of all chunk on local, @example {"5964d672f56753389f3d89906ab238fbc680359229015a15a4ca66e466b128bc":[0,3]}
 * @chunkversionFreeData {Array}  free position of chunkversion file, @example []
 * @cloneData            {JSON}   list of chunk to complete clone, @example {"5964d672f56753389f3d89906ab238fbc680359229015a15a4ca66e466b128bc": {"version":3003, "checksumList":[123456799], "size":2024}}
 * @checksumPath         {String} path of file to save checksum of chunk, @example "C:\work\GFS2\AppData\chunkserver\checksum1\data"
 * @versionPath          {String} path of file to save version of chunk, @example "C:\work\GFS2\AppData\chunkserver\version1\data"
 */
exports._handleClone = function( checksumData, checksumFreeData, chunkData, chunkversionData, chunkversionFreeData, cloneData, checksumPath, versionPath ){
// START
  log.args( Error(), arguments );

  for( const [chunkName, item] of Object.entries(cloneData) ){
    let {checksumList, version, size} = item;

    if( !chunkdataTool.has(chunkData, chunkName) ){
      // 1 add chunk
      chunkdataTool.add(chunkData, chunkName, size);

      // 2 add checksum
      let freeIndex = checksumFreeTool.getFreeIndex(checksumFreeData);
      if( -1 == freeIndex){
        freeIndex = checksumTool.getCount(checksumData);
      }
      checksumTool.addChunk(checksumData, chunkName, checksumList, freeIndex);
      checksumPersist.addChunk(chunkName, checksumList, checksumPath, freeIndex);
      checksumFreeTool.delete(checksumFreeData, freeIndex);

      // 3 add version
      freeIndex = chunkversionFreeTool.getFreeIndex(chunkversionFreeData);
      if( -1 == freeIndex){
        freeIndex = chunkversionTool.getCount(chunkversionData);
      }
      chunkversionTool.addChunk(chunkversionData, chunkName, version, freeIndex);
      chunkversionPersist.addChunk(chunkName, version, versionPath, freeIndex);
      chunkversionFreeTool.delete(chunkversionFreeData, freeIndex);
    }
    else{
      // 1 size
      chunkdataTool.setSize(chunkData, chunkName, size);

      // 2 checksum
      let itemIndex = checksumTool.getChunkIndex(checksumData, chunkName);
      if( -1 < itemIndex ){
        checksumTool.setChecksum(checksumData, chunkName, checksumList);
        checksumPersist.setChecksum(chunkName, checksumList, checksumPath, itemIndex);
      }
      else{
        // Report Error
      }

      // 3 version
      itemIndex = chunkversionTool.getChunkIndex(chunkversionData, chunkName);
      if( -1 < itemIndex ){
        chunkversionTool.setVersion(chunkversionData, chunkName, version);
        chunkversionPersist.setVersion(chunkName, version, versionPath, itemIndex);
      }
      else{
        // Report Error
      }
    }
  }

  log.end( Error(), jsons( [checksumData, chunkData, chunkversionData] ) );
  return [checksumData, chunkData, chunkversionData];
// END
};
// PUBLIC_METHOD_END [_handleClone]


// PUBLIC_METHOD_START [_handleDelete]
/**
 * handle delete chunk from master
 * @checksumData         {JSON}   checksumdata of all chunk on local, @example {"5964d672f56753389f3d89906ab238fbc680359229015a15a4ca66e466b128bc":[0,[12345679]]}
 * @checksumFreeData     {Array}  free position of checksum file, @example []
 * @chunkData            {JSON}   base info of all chunk on local, @example {"5964d672f56753389f3d89906ab238fbc680359229015a15a4ca66e466b128bc":[1024,0]}
 * @chunkversionData     {JSON}   chunkversion of all chunk on local, @example {"5964d672f56753389f3d89906ab238fbc680359229015a15a4ca66e466b128bc":[0,3]}
 * @chunkversionFreeData {Array}  free position of chunkversion file, @example []
 * @deleteList           {Array}  list of chunk to delete, @example ["5964d672f56753389f3d89906ab238fbc680359229015a15a4ca66e466b128bc"]
 * @chunkRoot            {String} root directory where the chunk is stored, @example "C:\work\GFS2\AppData\chunkserver\chunk1\"
 * @checksumPath         {String} path of file to save checksum of chunk, @example "C:\work\GFS2\AppData\chunkserver\checksum1\data"
 * @versionPath          {String} path of file to save version of chunk, @example "C:\work\GFS2\AppData\chunkserver\version1\data"
 */
exports._handleDelete = function( checksumData, checksumFreeData, chunkData, chunkversionData, chunkversionFreeData, deleteList, chunkRoot, checksumPath, versionPath ){
// START
  log.args( Error(), arguments );

  if(!deleteList || !deleteList.length){
    log.end( Error(), `deleteList is empty` );
    return;
  }

  for(const chunkName of deleteList){
    // 1 chunkName
    chunkdataTool.delete(chunkData, chunkName);
    if( utilfs.hasFilePath( path.join(chunkRoot, chunkName) ) ){
      chunkdataPersist.delete(chunkRoot, chunkName);
    }

    // 2 checksum
    let itemIndex = checksumTool.getChunkIndex(checksumData, chunkName);
    if(-1 < itemIndex){
      checksumPersist.deleteChunk(itemIndex, checksumPath);
      checksumTool.deleteChunk(checksumData, chunkName);
      checksumFreeTool.add(checksumFreeData, itemIndex);
    }

    // 3 version
    itemIndex = chunkversionTool.getChunkIndex(chunkversionData, chunkName);
    if(-1 < itemIndex){
      chunkversionPersist.deleteChunk(itemIndex, versionPath);
      chunkversionTool.deleteChunk(chunkversionData, chunkName);
      chunkversionFreeTool.add(chunkversionFreeData, itemIndex);
    }
  }

// END
};
// PUBLIC_METHOD_END [_handleDelete]


