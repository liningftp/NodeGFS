
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Chunkserver
 * @copyright: liningftp@qq.com
 * @name: errordataTool
 * @desc: manage error chunk
 * @file: /metadata/tool/errordataTool.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START
const {lodash, clog} = require('../../../base/index');

const MAX_REPORT_COUNT = 1024;
// END
// REQUIRE_END


// PUBLIC_METHOD_START [add]
/**
 * add error chunk
 * @errorData {JSON}   chunk checksum is inconsistent, @example {}
 * @chunkName {String} name of chunk, @example "aabbccdd"
 */
exports.add = function( errorData, chunkName ){
// START
  if( !errorData.hasOwnProperty(chunkName) ){
    errorData[chunkName] = 0;
  }

  return errorData;
// END
};
// PUBLIC_METHOD_END [add]


// PUBLIC_METHOD_START [delete]
/**
 * delete chunk which is reported
 * @errorData     {JSON}  chunk checksum is inconsistent, @example {"aabbccdd":1602494497551, "eeffgghh":0}
 * @chunkNameList {Array} list of chunkName, @example []
 */
exports.delete = function( errorData, chunkNameList ){
// START
  for( const chunkName of chunkNameList ){
    delete errorData[chunkName];
  }

  return errorData;
// END
};
// PUBLIC_METHOD_END [delete]


// PUBLIC_METHOD_START [setTime]
/**
 * set report time
 * @errorData {JSON}   chunk checksum is inconsistent, @example {"aabbccdd":1602494497551, "eeffgghh":0}
 * @chunkName {String} name of chunk, @example "aabbccdd"
 * @timestamp {Number} current timestamp, @example 1602494497551
 */
exports.setTime = function( errorData, chunkName, timestamp ){
// START
  if( errorData.hasOwnProperty(chunkName) ){
    errorData[chunkName] = timestamp;
  }

  return errorData;
// END
};
// PUBLIC_METHOD_END [setTime]


// PUBLIC_METHOD_START [clear]
/**
 * clear chunk after report
 * @errorData     {JSON}  chunk checksum is inconsistent, @example {"aabbccdd":1602494497551, "eeffgghh":0}
 * @chunkNameList {Array} list of chunkName, @example ["aabbccdd"]
 */
exports.clear = function( errorData, chunkNameList ){
// START
  for(const chunkName of chunkNameList){
    if(0 < errorData[chunkName]){
      delete errorData[chunkName];
    }
  }

  return errorData;
// END
};
// PUBLIC_METHOD_END [clear]


// PUBLIC_METHOD_START [getReport]
/**
 * get list of chunk to report
 * @errorData {JSON} chunk checksum is inconsistent, @example {"aabbccdd":1602494497551, "eeffgghh":0}
 */
exports.getReport = function( errorData ){
// START
  let list = Object.entries(errorData);

  // 按升序排列
  let result = lodash.sortBy(list, (item) => {
    return item[1][1];
  });

  return result.slice(0, MAX_REPORT_COUNT).map(item => item[0]);
// END
};
// PUBLIC_METHOD_END [getReport]


