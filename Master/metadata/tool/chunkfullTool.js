
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Master
 * @copyright: liningftp@qq.com
 * @name: chunkfullTool
 * @desc: chunkfull manage tool
 * @file: /metadata/tool/chunkfullTool.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START
const DURATION = 300000; // 5分钟
// END
// REQUIRE_END


// PUBLIC_METHOD_START [add]
/**
 * 添加填满块的信息
 * @chunkfullData {JSON}   full filled of chunk, @example {}
 * @chunkName     {String} name of chunk, @example "aabbccdd"
 * @timestamp     {Number} time stamp, @example 1603201500764
 */
exports.add = function( chunkfullData, chunkName, timestamp ){
// START
  chunkfullData[chunkName] = timestamp;

  return chunkfullData;
// END
};
// PUBLIC_METHOD_END [add]


// PUBLIC_METHOD_START [isFull]
/**
 * 指定的块是否为满块
 * @chunkfullData {JSON}   full filled of chunk, @example {"aabbccdd":1603201500764}
 * @chunkName     {String} name of chunk, @example "aabbccdd"
 */
exports.isFull = function( chunkfullData, chunkName ){
// START
  return chunkfullData.hasOwnProperty(chunkName);
// END
};
// PUBLIC_METHOD_END [isFull]


// PUBLIC_METHOD_START [delete]
/**
 * 删除指定的块
 * @chunkfullData {JSON}   full filled of chunk, @example {"aabbccdd":1603201500764}
 * @chunkName     {String} name of chunk, @example "aabbccdd"
 */
exports.delete = function( chunkfullData, chunkName ){
// START
  delete chunkfullData[chunkName];
// END
};
// PUBLIC_METHOD_END [delete]


// PUBLIC_METHOD_START [clear]
/**
 * 清除过时块
 * @chunkfullData {JSON}   full filled of chunk, @example {"aabbccdd":1603201500764}
 * @timestamp     {Number} time stamp, @example 1603202299410
 */
exports.clear = function( chunkfullData, timestamp ){
// START
  for( const [chunkName, tm] of Object.entries(chunkfullData) ){
    if( tm + DURATION < timestamp){
      delete chunkfullData[chunkName];
    }
  }

  return chunkfullData;
// END
};
// PUBLIC_METHOD_END [clear]


