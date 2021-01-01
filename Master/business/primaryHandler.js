
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Master
 * @copyright: liningftp@qq.com
 * @name: primaryHandler
 * @desc: handle request from primary
 * @file: /business/primaryHandler.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START

const {util, clog, log, jsonlog, jsons} = require('../../base');

const {
  startupdata,

  chunkdataTool,
  chunkfullTool,
  chunklostTool,
  file2chunkTool,
  namespaceTool,
  startupdataTool,
  serverdataTool,
} = require('../metadata');

const operationLog = require('../store/operationLog.js');

// END
// REQUIRE_END


// PUBLIC_METHOD_START [getLastChunkName]
/**
 * chunkserver request the last chunkName of file
 * @namespaceData  {JSON}   tree of namespace, @example {"/usr":{"_type":"dir","_lock":{"r":[1606226758420,1600765377526],"w":[],"a":[],"snap":[]},"/data":{"_type":"dir","_lock":{"r":[1606226758420,1600765377526],"w":[],"a":[],"snap":[]},"/001":{"_type":"file","_replicaCount":3,"_lock":{"r":[],"w":[],"a":[],"snap":[1606226758420]}}}}}
 * @file2chunkData {JSON}   map data of filePath to chunkName, @example {"/usr/data/001":["aabbccdd"], "/usr/data/002":["eeffgghh"]}
 * @filePath       {String} file path of system, @example "/usr/data/001"
 * @startTime      {Number} start time of Master server, @example 1602228234877
 * @lockDuration   {Number} lock duration, @example 300000
 * @timestamp      {Number} time stamp, @example 1602228234877
 * @return         {Array}  返回值, @example [{"code":0, "msg":"", "data":{"startTime":1596367828794,"chunkName":"eeffhhii"}}, ""]
 */
exports.getLastChunkName = async function( namespaceData, file2chunkData, filePath, startTime, lockDuration, timestamp ){
// START
  log.args( Error(), arguments );
  let result = {};

  /* get chunkName */
  let chunkName = file2chunkTool.getLastChunkName(file2chunkData, filePath);
  util.result( result, 0, '', 'success', {chunkName} );

  log.end( Error(), jsons([result]) );
  return [result];
// END
};
// PUBLIC_METHOD_END [getLastChunkName]


// PUBLIC_METHOD_START [recvBootData]
/**
 * receive boot data from chunkserver
 * @chunkData     {JSON}   base info of all chunk on local, @example {"aabbccdd":[1,10,3,"127.0.0.1:3001,1585471730177","127.0.0.1:3002,1585471730177","127.0.0.1:3003,1585471730177"]}
 * @serverData    {JSON}   data of server, @example {}
 * @chunkList     {Array}  list of chunk and version, @example ["aabbccdd,2", "eeffgghh,3"]
 * @pair          {String} chunkserver host and port, @example "127.0.0.1:3001"
 * @useRate       {Number} use rate of disk, @example 25
 * @timestamp     {Number} time stamp, @example 1602228234877
 * @chunkDeadTime {Number} chunk damage after the time, @example 7200000
 * @return        {Array}  返回值, @example [{"code":0, "msg":""}]
 */
exports.recvBootData = async function( chunkData, serverData, chunkList, pair, useRate, timestamp, chunkDeadTime ){
// START
  log.args( Error(), arguments );
  let result = {};

  /* handle chunkData */
  for( const item of chunkList ){
    let [chunkName, version] = item.split(',');

    /* chunkData must contain chunkName, or not is error */
    if( chunkdataTool.has( chunkData, chunkName ) ){
      if( chunkdataTool.hasPair( chunkData, chunkName, pair ) ){
        chunkdataTool.updateTime( chunkData, chunkName, pair, timestamp );
      }
      else{
        chunkdataTool.clearExpire( chunkData, chunkName, timestamp, chunkDeadTime );
        let isGood = chunkdataTool.isGood( chunkData, chunkName, timestamp, chunkDeadTime );
        if( !isGood ){
          chunkdataTool.addPair( chunkData, chunkName, pair, timestamp );
        }
      }
    }
  }

  /* handle serverData */
  if( serverdataTool.hasServer(serverData, pair) ){
    serverdataTool.update( serverData, pair, useRate, timestamp );
  }
  else{
    serverdataTool.add( serverData, pair, useRate, timestamp );
  }

  util.success( result );

  log.end( Error(), jsons([result]) );
  return [result];
// END
};
// PUBLIC_METHOD_END [recvBootData]


// PUBLIC_METHOD_START [recvErrorChunk]
/**
 * receive error chunk from primary
 * @chunkData     {JSON}   base info of all chunk on local, @example {"ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b":[1,10,"127.0.0.1:3001,1585471730177","127.0.0.1:3002,1585471730177","127.0.0.1:3003,1585471730177"]}
 * @chunklostData {JSON}   replica of chunk is less, @example {}
 * @chunkName     {String} name of chunk, @example "ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b"
 * @pair          {String} chunkserver host and port, @example "127.0.0.1:3001"
 * @startTime     {Number} start time of Master server, @example 1602228234877
 * @timestamp     {Number} time stamp, @example 1602228234877
 * @return        {Array}  返回值, @example [{"code":0, "msg":""}]
 */
exports.recvErrorChunk = async function( chunkData, chunklostData, chunkName, pair, startTime, timestamp ){
// START
  log.args( Error(), arguments );
  let result = {};

  /* remove pair of chunk from chunkData */
  chunkdataTool.removePair( chunkData, chunkName, pair );

  /* add chunkName to chunklostData */
  chunklostTool.add( chunklostData, [chunkName], timestamp );

  util.success( result );

  log.end( Error(), jsons([result]) );
  return [result];
// END
};
// PUBLIC_METHOD_END [recvErrorChunk]


// PUBLIC_METHOD_START [recvFullChunk]
/**
 * receive fullchunk from primary
 * @chunkfullData {JSON}   full filled of chunk, @example {"ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b":1603201500764}
 * @chunkName     {String} name of chunk, @example "ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b"
 * @pair          {String} chunkserver host and port, @example "127.0.0.1:3001"
 * @startTime     {Number} start time of Master server, @example 1602228234877
 * @timestamp     {Number} time stamp, @example 1602228234877
 * @return        {Array}  返回值, @example [{"code":0, "msg":""}]
 */
exports.recvFullChunk = async function( chunkfullData, chunkName, pair, startTime, timestamp ){
// START
  log.args( Error(), arguments );
  let result = {};

  chunkfullTool.clear(chunkfullData, timestamp);
  chunkfullTool.add(chunkfullData, chunkName, timestamp);

  util.success( result );

  log.end( Error(), jsons([result]) );
  return [result];
// END
};
// PUBLIC_METHOD_END [recvFullChunk]


