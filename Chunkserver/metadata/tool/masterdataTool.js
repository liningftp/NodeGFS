
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Chunkserver
 * @copyright: liningftp@qq.com
 * @name: masterdataTool
 * @desc: manage master data
 * @file: /metadata/tool/masterdataTool.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START
const {lodash, clog, log, jsons} = require('../../../base');
// END
// REQUIRE_END


// PUBLIC_METHOD_START [setTime]
/**
 * set time of master
 * @masterData {JSON}   data of Master server, @example {}
 * @startTime  {Number} start time of Master server, @example 1593783888581
 * @return     {JSON}   返回值, @example {}
 */
exports.setTime = function( masterData, startTime ){
// START
  log.args( Error(), arguments );
	masterData['startTime'] = startTime;

  log.end( Error(), jsons(masterData) );
	return masterData;
// END
};
// PUBLIC_METHOD_END [setTime]


// PUBLIC_METHOD_START [checkTime]
/**
 * check is master reboot
 * @masterData {JSON}   data of Master server, @example {"startTime":1593783888581}
 * @startTime  {Number} start time of Master server, @example 1593783888581
 * @return     {Number} 返回值, @example 1
 */
exports.checkTime = function( masterData, startTime ){
// START
	return masterData['startTime'] == startTime;
// END
};
// PUBLIC_METHOD_END [checkTime]


// PUBLIC_METHOD_START [getTime]
/**
 * get start time of master
 * @masterData {JSON}   data of Master server, @example {"startTime":1593783888581}
 * @return     {Number} 返回值, @example 1593783888581
 */
exports.getTime = function( masterData ){
// START
	return masterData['startTime'];
// END
};
// PUBLIC_METHOD_END [getTime]


