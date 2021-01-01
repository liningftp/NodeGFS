
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Chunkserver
 * @copyright: liningftp@qq.com
 * @name: cachedataTool
 * @desc: manage cache data
 * @file: /metadata/tool/cachedataTool.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START
const {util, clog} = require('../../../base/index.js');

const CACHE_DURATION = 3600 * 1000; // 保留1小时
// END
// REQUIRE_END


// PUBLIC_METHOD_START [createKey]
/**
 * generate cache key
 * @cacheData {JSON} cache data, @example {"7f92ae0d99f850c4889e2b2c5594fcc6":[1024,1602985006457, 0],"16002e61fe175e03a0306849afeb457e":[30,1602985099686,1602985108213]}
 */
exports.createKey = function( cacheData ){
// START
  let cacheKey;

  while(!cacheKey){
    cacheKey = util.getKey();
    if( cacheData.hasOwnProperty(cacheKey) ){
      cacheKey = '';
    }
  }

  return cacheKey;
// END
};
// PUBLIC_METHOD_END [createKey]


// PUBLIC_METHOD_START [add]
/**
 * add cache info
 * @cacheData {JSON}   cache data, @example {}
 * @cacheKey  {String} key of cache, @example "key123456"
 * @size      {Number} size of content, @example 1024
 * @timestamp {Number} current timestamp, @example 1602985444175
 */
exports.add = function( cacheData, cacheKey, size, timestamp ){
// START
  if( !cacheData.hasOwnProperty(cacheKey) ){
    cacheData[cacheKey] = [size, timestamp, 0];
  }

  return cacheData;
// END
};
// PUBLIC_METHOD_END [add]


// PUBLIC_METHOD_START [getSize]
/**
 * get cache size of content
 * @cacheData {JSON}   cache data, @example {"key123456":[1024,1602985006457, 0]}
 * @cacheKey  {String} key of cache, @example "key123456"
 * @return    {Number} 返回值, @example 1024
 */
exports.getSize = function( cacheData, cacheKey ){
// START
  let len;

  if( cacheData.hasOwnProperty(cacheKey) ){
    len = cacheData[cacheKey][0];
  }

  return len;
// END
};
// PUBLIC_METHOD_END [getSize]


// PUBLIC_METHOD_START [setUsedTime]
/**
 * set cache used time
 * @cacheData {JSON}   cache data, @example {"7f92ae0d99f850c4889e2b2c5594fcc6":[1024,1602985006457, 0],"16002e61fe175e03a0306849afeb457e":[30,1602985099686,1602985108213]}
 * @cacheKey  {String} key of cache, @example "7f92ae0d99f850c4889e2b2c5594fcc6"
 * @timestamp {Number} current timestamp, @example 1602985444175
 */
exports.setUsedTime = function( cacheData, cacheKey, timestamp ){
// START
  if( cacheData.hasOwnProperty(cacheKey) ){
    cacheData[cacheKey][2] = timestamp;
  }

  return cacheData;
// END
};
// PUBLIC_METHOD_END [setUsedTime]


// PUBLIC_METHOD_START [clear]
/**
 * clear cache according to LRU
 * @cacheData {JSON}   cache data, @example {"7f92ae0d99f850c4889e2b2c5594fcc6":[1024,1602985006457, 0],"16002e61fe175e03a0306849afeb457e":[30,1602985099686,1602985108213]}
 * @timestamp {Number} current timestamp, @example 1602986926188
 */
exports.clear = function( cacheData, timestamp ){
// START
  let list = [];

  for( const [key, [size, startTime, usedTime]] of Object.entries(cacheData) ){
    if( (startTime + CACHE_DURATION < timestamp) || (0 < usedTime) ){
      delete cacheData[key];
      list.push(key);
    }
  }

  return list;
// END
};
// PUBLIC_METHOD_END [clear]


