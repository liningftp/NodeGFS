
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

const state = {};

process.on('message', (message) => {
  let {flag} = message;
  if('start' == flag){
    schedule.scheduleJob(scheduleRule, () => {
      if(!state.working){
        process.send({
          'flag': 'getMainData',
        });
      }
    });
  }
  else if('getMainData' == flag){
    let {namespaceDeleteData, retainTime} = message;

    state.working = true;
    let timestamp = Date.now();
    let expireList = exports._start(namespaceDeleteData, retainTime, timestamp);
    state.working = false;

    if(expireList.length){
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
 * @return              {Array}  return value, @example [filePath, [tm0, tm1]]
 */
exports._start = function( namespaceDeleteData, retainTime, timestamp ){
// START
  let list = namespaceDeleteTool.getExpireList(namespaceDeleteData, retainTime, timestamp);
  return list;
// END
};
// PUBLIC_METHOD_END [_start]


