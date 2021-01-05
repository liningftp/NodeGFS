
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Master
 * @copyright: liningftp@qq.com
 * @name: waitleaseTool
 * @desc: wait result of chunkserver is receiving lease
 * @file: /metadata/tool/waitleaseTool.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START
const DURATION = 60000; // 60s
// END
// REQUIRE_END


// PUBLIC_METHOD_START [add]
/**
 * add
 * @waitleaseData {JSON}   waitting for chunkserver confirm lease, @example {}
 * @chunkName     {String} name of chunk, @example "aabbccdd"
 * @clientObject  {JSON}   client wrapper object, @example {"sock":3}
 * @timestamp     {Number} time stamp, @example 1603366654864
 */
exports.add = function( waitleaseData, chunkName, clientObject, timestamp ){
// START
  if( waitleaseData.hasOwnProperty(chunkName) ){
    waitleaseData[chunkName].push(clientObject);
  }
  else{
    waitleaseData[chunkName] = [timestamp, clientObject];
  }

  return waitleaseData;
// END
};
// PUBLIC_METHOD_END [add]


// PUBLIC_METHOD_START [has]
/**
 * has chunk name or not
 * @waitleaseData {JSON}   waitting for chunkserver confirm lease, @example {"aabbccdd":[1603366654864,{"sock":3}]}
 * @chunkName     {String} name of chunk, @example "aabbccdd"
 */
exports.has = function( waitleaseData, chunkName ){
// START
  return waitleaseData.hasOwnProperty(chunkName);
// END
};
// PUBLIC_METHOD_END [has]


// PUBLIC_METHOD_START [get]
/**
 * get list
 * @waitleaseData {JSON}   waitting for chunkserver confirm lease, @example {"aabbccdd":[1603366654864,{"sock":3}]}
 * @chunkName     {String} name of chunk, @example "aabbccdd"
 */
exports.get = function( waitleaseData, chunkName ){
// START
  if( waitleaseData[chunkName] ){
    return waitleaseData[chunkName].slice(1);
  }
// END
};
// PUBLIC_METHOD_END [get]


// PUBLIC_METHOD_START [delete]
/**
 * delete from queue
 * @waitleaseData {JSON}   waitting for chunkserver confirm lease, @example {"aabbccdd":[1603366654864,{"sock":3}]}
 * @chunkName     {String} name of chunk, @example "aabbccdd"
 */
exports.delete = function( waitleaseData, chunkName ){
// START
  delete waitleaseData[chunkName];
// END
};
// PUBLIC_METHOD_END [delete]


// PUBLIC_METHOD_START [clear]
/**
 * clear expire
 * @waitleaseData {JSON}   waitting for chunkserver confirm lease, @example {"aabbccdd":[1603366654864,{"sock":3}], "eeffgghh":[1603367094445,{"sock":3}]}
 * @timestamp     {Number} time stamp, @example 1603367094445
 */
exports.clear = function( waitleaseData, timestamp ){
// START
  for( const [chunkName, [tm]] of Object.entries(waitleaseData) ){
    if(tm + DURATION < timestamp){
      delete waitleaseData[chunkName];
    }
  }

  return waitleaseData;
// END
};
// PUBLIC_METHOD_END [clear]


