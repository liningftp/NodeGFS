
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Chunkserver
 * @copyright: liningftp@qq.com
 * @name: cachedataPersist
 * @desc: manage cache data in disk
 * @file: /store/cachedataPersist.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START
const path = require('path');
const {utilfs, clog} = require('../../base');

const {cachedataTool} = require('../metadata');
// END
// REQUIRE_END


// PUBLIC_METHOD_START [load]
/**
 * load cache from disk
 * @cacheData {JSON}   cache data, @example {}
 * @cacheRoot {String} root directory where the cache is stored, @example "C:\work\GFS2\AppData\chunkserver\cache1"
 * @timestamp {Number} current timestamp, @example 1602989732263
 */
exports.load = function( cacheData, cacheRoot, timestamp ){
// START
  let result = {};

  let [code, msg, data, totalSize] = utilfs.getAllFiles(cacheRoot);
  if(0 != code){
    [result.code, result.msg] = [-1, `Error: loading chunk error, ${msg}`];
    return result;
  }
  for(const item of data){
    let cacheKey = item.fileName;
    let size = item.size;
    cachedataTool.add(cacheData, cacheKey, size, timestamp);
  }
  [result.code, result.msg] = [0, ''];

  return result;
// END
};
// PUBLIC_METHOD_END [load]


// PUBLIC_METHOD_START [write]
/**
 * write cache data to disk
 * @cacheContent {Buffer} content of cache, @example Buffer.from("hello world")
 * @cacheRoot    {String} root directory where the cache is stored, @example "C:\work\GFS2\AppData\chunkserver\cache1"
 * @cacheKey     {String} key of cache, @example "key1234567"
 */
exports.write = function( cacheContent, cacheRoot, cacheKey ){
// START
  let result = {};

  let cachePath = path.join(cacheRoot, cacheKey);
  [result.code, result.msg] = utilfs.writeFileSync(cachePath, cacheContent);

  return result;
// END
};
// PUBLIC_METHOD_END [write]


// PUBLIC_METHOD_START [read]
/**
 * read content of cache key
 * @cacheRoot {String} root directory where the cache is stored, @example "C:\work\GFS2\AppData\chunkserver\cache1"
 * @cacheKey  {String} key of cache, @example "key1234567"
 */
exports.read = function( cacheRoot, cacheKey ){
// START
  let result = {};

  let cachePath = path.join(cacheRoot, cacheKey);
  [result.code, result.msg, result.data] = utilfs.readSync(cachePath);

  return result;
// END
};
// PUBLIC_METHOD_END [read]


// PUBLIC_METHOD_START [delete]
/**
 * delete content of cache key
 * @cacheRoot {String} root directory where the cache is stored, @example "C:\work\GFS2\AppData\chunkserver\cache1\"
 * @cacheKey  {String} key of cache, @example "key1234567"
 */
exports.delete = function( cacheRoot, cacheKey ){
// START
  let cachePath = path.join(cacheRoot, cacheKey);

  clog(cachePath);

  utilfs.deleteSync(cachePath);
// END
};
// PUBLIC_METHOD_END [delete]


