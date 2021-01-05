
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Master
 * @copyright: liningftp@qq.com
 * @name: startupdataTool
 * @desc: manage startup data
 * @file: /metadata/tool/startupdataTool.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START
const {clog, log, jsons} = require('../../../base');
// END
// REQUIRE_END


// PUBLIC_METHOD_START [init]
/**
 * init
 * @startupData     {JSON}   data of Master startup, @example {"startTime":1}
 * @startTime       {Number} start time of Master server, @example 1593783888581
 * @serverChecklist {Array}  white list of chunkserver, @example ["127.0.0.1:3001", "127.0.0.1:3002", "127.0.0.1:3003"]
 * @return          {JSON}   return value, @example {}
 */
exports.init = function( startupData, startTime, serverChecklist ){
// START
  startupData['startTime'] = startTime;
  startupData['serverChecklist'] = serverChecklist;

  return startupData;
// END
};
// PUBLIC_METHOD_END [init]


// PUBLIC_METHOD_START [getState]
/**
 * get state, init or work
 * @startupData   {JSON}   data of Master startup, @example {"startTime":1603864865087, "state":"init"}
 * @timestamp     {Number} time stamp, @example 1603864865087
 * @heartbeatTime {Number} time of heartbeat, @example 60000
 */
exports.getState = function( startupData, timestamp, heartbeatTime ){
// START
  log.args( Error(), arguments );

  let state = 'init';

  let startTime = startupData['startTime'];
  if( 1 * heartbeatTime < ( timestamp - startTime ) ){
    state = 'work';
  }

  log.end( Error(), jsons(state) );
  return state;
// END
};
// PUBLIC_METHOD_END [getState]


// PUBLIC_METHOD_START [getTime]
/**
 * get startup time
 * @startupData {JSON}  data of Master startup, @example {"startTime":1593783888581}
 * @return      {Array} return value, @example master latest start time
 */
exports.getTime = function( startupData ){
// START
  return startupData['startTime'];
// END
};
// PUBLIC_METHOD_END [getTime]


// PUBLIC_METHOD_START [checkTime]
/**
 * check start time of master and chunkserver is consistent
 * @startupData {JSON}   data of Master startup, @example {"startTime":1593783888581}
 * @startTime   {Number} start time of Master server, @example 1593783888581
 * @return      {Number} return value, @example 1
 */
exports.checkTime = function( startupData, startTime ){
// START
  return startupData['startTime'] == startTime;
// END
};
// PUBLIC_METHOD_END [checkTime]


