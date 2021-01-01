
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

  // 1 创建GC子进程
  let gcWorker = child_process.fork( path.join(__dirname, './process/gcProcess.js') );
  // 监听子进程
  gcWorker.on('message', message => {
    if('getMainData' == message.flag){
      gcWorker.send({
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
  // 启动子进程
  gcWorker.send({ 'flag':'start' });

  // 2 创建块服务器监控子进程（只做告警，修复转人工）
  let serverWorker = child_process.fork( path.join(__dirname, './process/serverProcess.js') );
  // 监听子进程
  serverWorker.on('message', message => {
    if('getMainData' == message.flag){
      serverWorker.send({
        'flag': 'getMainData',
        serverData,
        heartbeatTime
      });
    }
  });
  // 启动子进程
  serverWorker.send({ 'flag':'start' });


  // // 3 快照子进程
  // let snapshotWorker = child_process.fork( path.join(__dirname, './process/snapshotProcess.js') );
  // // 监听子进程
  // snapshotWorker.on('message', message => {
  //   let {flag} = message;
  //   if('getMainData' == flag){
  //     snapshotWorker.send({
  //       'flag': 'getMainData',
  //       chunkData,
  //       serverData
  //     });
  //   }
  // });
  // // 启动子进程
  // snapshotWorker.send({
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
      // 获取待删除块
      let chunkNameList = file2chunkDeleteTool.get(file2chunkDeleteData, filePath, tm);

      // 删除命名空间
      namespaceDeleteTool.delete(namespaceDeleteData, filePath, tm);
      // 删除文件到块映射数据
      file2chunkDeleteTool.delete(file2chunkDeleteData, filePath, tm);
      // 删除块数据
      chunkdataTool.delete(chunkData, chunkNameList);
    }
  }

  // clog( {namespaceDeleteData, file2chunkDeleteData, chunkData} );

  return {namespaceDeleteData, file2chunkDeleteData, chunkData};
// END
};
// PUBLIC_METHOD_END [_reclaim]


