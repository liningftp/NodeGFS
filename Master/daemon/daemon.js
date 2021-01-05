
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Master
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

const {clog, log} = require('../../base');
const {
  chunkdataTool,
  chunklostTool,
  file2chunkDeleteTool,
  namespaceDeleteTool
} = require('../metadata');

const lauchOrder = require('./lauchOrder.js');

// END
// REQUIRE_END


// PUBLIC_METHOD_START [start]
/**
 * start daemon
 * @namespaceDeleteData  {JSON}   delete tree of namespace, @example {"/usr/data/001":{"1597879274447":{"/usr":{"_type":"dir","_lock":{"r":[],"w":[]},"/data":{"_type":"dir","_lock":{"r":[],"w":[]},"/001":{"_type":"file","_replicaCount":3,"_lock":{"r":[],"w":[]}}}}}}}
 * @file2chunkDeleteData {JSON}   file2chunkData to be deleted, @example {"/usr/data/001":{"1597879274447":["aabbccdd","eeffgghh"]}}
 * @chunkData            {JSON}   base info of all chunk on local, @example {"aabbccdd":[1,20,"127.0.0.1:3001,1600348059891","127.0.0.1:3002,1600347939891","127.0.0.1:3003,1600261659800,P"]}
 * @serverData           {Array}  data of server, @example {"127.0.0.1:3001":[12,1600348059891],"127.0.0.1:3002":[22,1599033664421],"127.0.0.1:3003":[18,1599033677924]}
 * @retainTime           {Number} retain time after deleted, @example 259200000
 * @heartbeatTime        {Number} time of heartbeat, @example 60000
 * @chunkDeadTime        {Number} chunk is damage after the time, @example 86400000
 */
exports.start = async function( namespaceDeleteData, file2chunkDeleteData, chunkData, serverData, retainTime, heartbeatTime, chunkDeadTime ){
// START

  // 1 gc sub process
  let gcProcess = child_process.fork( path.join(__dirname, './process/gcProcess.js') );
  gcProcess.on('message', message => {
    if('getMainData' == message.flag){
      gcProcess.send({
        'flag': 'getMainData',
        namespaceDeleteData,
        retainTime
      });
    }
    else if('reclaim' == message.flag){
      let {expireList} = message;
      exports._reclaim(namespaceDeleteData, file2chunkDeleteData, chunkData, expireList);
    }
  });
  gcProcess.send({ 'flag':'start' });

  // 2 server sub process
  let serverProcess = child_process.fork( path.join(__dirname, './process/serverProcess.js') );
  serverProcess.on('message', message => {
    if('getMainData' == message.flag){
      serverProcess.send({
        'flag': 'getMainData',
        serverData,
        heartbeatTime
      });
    }
  });
  serverProcess.send({ 'flag':'start' });


  // // 3 snapshot sub process
  // let snapshotProcess = child_process.fork( path.join(__dirname, './process/snapshotProcess.js') );
  // snapshotProcess.on('message', message => {
  //   let {flag} = message;
  //   if('getMainData' == flag){
  //     snapshotProcess.send({
  //       'flag': 'getMainData',
  //       chunkData,
  //       serverData
  //     });
  //   }
  // });
  // snapshotProcess.send({
  //   'flag':'start'
  // });

// END
};
// PUBLIC_METHOD_END [start]


// PUBLIC_METHOD_START [_reclaim]
/**
 * reclaim gc
 * @namespaceDeleteData  {JSON}  delete tree of namespace, @example {"/usr/data/001":{"1597879274447":{"/usr":{"_type":"dir","_lock":{"r":[],"w":[]},"/data":{"_type":"dir","_lock":{"r":[],"w":[]},"/001":{"_type":"file","_replicaCount":3,"_lock":{"r":[],"w":[]}}}}}}}
 * @file2chunkDeleteData {JSON}  file2chunkData to be deleted, @example {"/usr/data/001":{"1597879274447":["aabbccdd","eeffgghh"]}}
 * @chunkData            {JSON}  base info of all chunk on local, @example {"aabbccdd":[], "eeffgghh":[], "ooxxkkmm":[], "jjyyuuvv":[]}
 * @expireList           {Array} list of expire after deleted, @example [["/usr/data/001",[1597879274447]]]
 */
exports._reclaim = function( namespaceDeleteData, file2chunkDeleteData, chunkData, expireList ){
// START

  for(const [filePath, tmList] of expireList){
    for(const tm of tmList){
      let chunkNameList = file2chunkDeleteTool.get(file2chunkDeleteData, filePath, tm);

      namespaceDeleteTool.delete(namespaceDeleteData, filePath, tm);
      file2chunkDeleteTool.delete(file2chunkDeleteData, filePath, tm);
      chunkdataTool.delete(chunkData, chunkNameList);
    }
  }

  // clog( {namespaceDeleteData, file2chunkDeleteData, chunkData} );

  return {namespaceDeleteData, file2chunkDeleteData, chunkData};
// END
};
// PUBLIC_METHOD_END [_reclaim]


