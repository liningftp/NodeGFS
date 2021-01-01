
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Master
 * @copyright: liningftp@qq.com
 * @name: lauchOrder
 * @desc: master request chunkserver
 * @file: /daemon/lauchOrder.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START

const {comm, log, clog, jsonlog, jsons} = require('../../base');

const {
  chunkdataTool,
  file2chunkTool,
  namespaceTool,
  waitleaseTool,
  serverdataTool
} = require('../metadata');

// END
// REQUIRE_END


// PUBLIC_METHOD_START [setNewChunk]
/**
 * set new chunk to metadata and persist data
 * @file2chunkData {JSON}   map data of filePath to chunkName, @example {"/usr/data/001":["aabbccdd"], "/usr/data/002":["eeffgghh"]}
 * @chunkData      {JSON}   base info of all chunk on local, @example {}
 * @filePath       {String} file path of system, @example "/usr/data/001"
 * @chunkName      {String} name of chunk, @example "aabbccdd"
 * @serverList     {Array}  all server of chunk, @example ["127.0.0.1:3001", "127.0.0.1:3002", "127.0.0.1:3003"]
 * @primary        {String} primary of chunkserver, @example "127.0.0.1:3001"
 * @version        {Number} version number, @example 1
 * @replicaCount   {Number} count of relipcas, @example 3
 * @timestamp      {Number} time stamp, @example 1602252811319
 */
exports.setNewChunk = function( file2chunkData, chunkData, filePath, chunkName, serverList, primary, version, replicaCount, timestamp ){
// START
  log.args( Error(), arguments );
  // B 存入文件块映射
  file2chunkTool.add( file2chunkData, filePath, chunkName );
  // C 存入块数据中
  chunkdataTool.add( chunkData, chunkName, version, replicaCount, serverList, timestamp );
  chunkdataTool.setPrimary( chunkData, chunkName, primary, timestamp );
  chunkdataTool.setVersion( chunkData, chunkName, version );
  log.info( Error(), 'end' );
// END
};
// PUBLIC_METHOD_END [setNewChunk]


// PUBLIC_METHOD_START [grantLease]
/**
 * grant lease to primary
 * @waitleaseData {JSON}   waitting for chunkserver confirm lease, @example {}
 * @chunkName     {String} name of chunk, @example "ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b"
 * @serverList    {Array}  all server of chunk, @example ["127.0.0.1:3001", "127.0.0.1:3002", "127.0.0.1:3003"]
 * @primary       {String} primary of chunkserver, @example "127.0.0.1:3001"
 * @version       {Number} version number, @example 1
 * @timestamp     {Number} time stamp, @example 1606639653647
 * @isNew         {Number} if chunk is new then will be created, @example 0
 * @return        {JSON}   返回值, @example {"code":0, "msg":""}
 */
exports.grantLease = async function( waitleaseData, chunkName, serverList, primary, version, timestamp, isNew ){
// START
  log.args( Error(), arguments );
  waitleaseTool.clear(waitleaseData, timestamp);

  return new Promise( async (resolve, reject) => {
    if( waitleaseTool.has(waitleaseData, chunkName) ){
      waitleaseTool.add(waitleaseData, chunkName, {
        'resolve': resolve
      }, timestamp);
    }
    else{
      waitleaseTool.add(waitleaseData, chunkName, {
        'resolve': resolve,
        'isRunner': 1
      }, timestamp);

      let result = {}, bigData;
      isNew = isNew || 0;

      let [host, port] = primary.split(':');
      serverList = serverList.filter( item => item != primary);
      // SOCKET_API OPEN [GFS2_Chunkserver.handler.recvLease] {tabCount=3}
      /* receive lease of Master grant to primary */
      /* @return {Array} Return value [{"code":0}] */
      [result, bigData] = await comm.clientRequest(host, port, 
        comm.encodeMessageData({
          "method": "recvLease",
          "chunkName": chunkName,
          "version": version,
          "primary": primary,
          "serverList": serverList,
          "isNew": isNew,
        })
      );
      // SOCKET_API CLOSE

      let list = waitleaseTool.get(waitleaseData, chunkName);
      for(const item of list){
        let _result = {'code': 0};
        if(item.isRunner){
          _result.isRunner = 1;
        }
        log.info( Error(), jsons(_result) );
        item.resolve(_result);
      }

      // 删除该块对应的等待队列
      waitleaseTool.delete(waitleaseData, chunkName);
    }
  });
// END
};
// PUBLIC_METHOD_END [grantLease]


// PUBLIC_METHOD_START [revokeLease]
/**
 * revoke lease of primary to run snapshot
 * @chunkData {JSON}   base info of all chunk on local, @example {"aabbccdd":[1,20,3,"127.0.0.1:3001,1600247712022","127.0.0.1:3002,1600247712022","127.0.0.1:3003,1600247712022,P"]}
 * @chunkName {String} name of chunk, @example "aabbccdd"
 * @return    {JSON}   返回值, @example {"code":0, "msg":""}
 */
exports.revokeLease = async function( chunkData, chunkName ){
// START
  // revokeLease
// END
};
// PUBLIC_METHOD_END [revokeLease]


