
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Master
 * @copyright: liningftp@qq.com
 * @name: serverProcess
 * @desc: chunkserver monitor process
 * @file: /daemon/process/serverProcess.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START
const {schedule, clog} = require('../../../base/index.js');
const {serverdataTool} = require('../../metadata/index.js');

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
    let {serverData, heartbeatTime} = message;
    state.working = true;
    exports._start(serverData, heartbeatTime, state);
    state.working = false;
  }

});
// END
// REQUIRE_END


// PUBLIC_METHOD_START [_start]
/**
 * find timeout chunkserver
 * @serverData    {Array}  data of server, @example {"127.0.0.1:3001":[12,1599033406152],"127.0.0.1:3002":[22,1599033406152],"127.0.0.1:3003":[79,1599033677924]}
 * @heartbeatTime {Number} time of heartbeat, @example 60000
 * @timestamp     {Number} time stamp, @example 1599033406152
 */
exports._start = function( serverData, heartbeatTime, timestamp ){
// START

  let maxAliveTime = 1.2 * heartbeatTime;
  let list = serverdataTool.getExpireList(serverData, maxAliveTime, timestamp);

  // TODO

  return list;
// END
};
// PUBLIC_METHOD_END [_start]


