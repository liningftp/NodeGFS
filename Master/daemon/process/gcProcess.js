
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Master
 * @copyright: liningftp@qq.com
 * @name: gcProcess
 * @desc: garbage collection process
 * @file: /daemon/process/gcProcess.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START
const {schedule, clog} = require('../../../base');
const {namespaceDeleteTool} = require('../../metadata');

let scheduleRule = new schedule.RecurrenceRule();
scheduleRule.second = [1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51, 56];
// scheduleRule.second = [1,16,31,46];
// scheduleRule.minute = [1,6,11,16,21,26,31,36,41,46,51,56];
// scheduleRule.hour = [1,5,9,13,17,21];

// 状态标志
const state = {};

// 绑定主线程通讯接口
process.on('message', (message) => {
  let {flag} = message;
  // 主线程触发启动
  if('start' == flag){
    // 启动crontab
    schedule.scheduleJob(scheduleRule, () => {
      if(!state.working){
        // 向主进程请求上报数据
        process.send({
          'flag': 'getMainData',
        });
      }
    });
  }
  // 主线程返回需要上报到Master的数据
  else if('getMainData' == flag){
    let {namespaceDeleteData, retainTime} = message;

    state.working = true;
    let timestamp = Date.now();
    let expireList = exports._start(namespaceDeleteData, retainTime, timestamp);
    state.working = false;

    if(expireList.length){
      // 向主进程返回到期回收的命名空间
      process.send({
        'flag': 'reclaim',
        'expireList': expireList
      });
    }
  }
});
// END
// REQUIRE_END


// PUBLIC_METHOD_START [_start]
/**
 * run check
 * @namespaceDeleteData {JSON}   delete tree of namespace, @example {"/usr/data":{"1597879274447":{"/usr":{"_type":"dir","_lock":{"r":[],"w":[]},"/data":{"_type":"dir","_lock":{"r":[],"w":[]},"/001":{"_type":"file","_replicaCount":3,"_lock":{"r":[],"w":[]}},"/002":{"_type":"file","_replicaCount":3,"_lock":{"r":[],"w":[]}}},"/photo":{"_type":"dir","_lock":{"r":[],"w":[]},"/2020":{"_type":"file","_replicaCount":3,"_lock":{"r":[],"w":[]}}}}}}}
 * @retainTime          {Number} retain time after deleted, @example 259200000
 * @timestamp           {Number} time stamp, @example 1601278486787
 * @return              {Array}  返回值, @example [filePath, [tm0, tm1]]
 */
exports._start = function( namespaceDeleteData, retainTime, timestamp ){
// START
  let list = namespaceDeleteTool.getExpireList(namespaceDeleteData, retainTime, timestamp);
  return list;
// END
};
// PUBLIC_METHOD_END [_start]


