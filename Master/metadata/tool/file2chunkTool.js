
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Master
 * @copyright: liningftp@qq.com
 * @name: file2ChunkTool
 * @desc: file to chunk mapping
 * @file: /metadata/tool/file2chunkTool.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START
const {util, clog, jsonlog, log, jsons} = require('../../../base');
// END
// REQUIRE_END


// PUBLIC_METHOD_START [add]
/**
 * add chunk
 * @file2chunkData {JSON}   map data of filePath to chunkName, @example {"/usr/data/001":["aabbccdd"]}
 * @filePath       {String} file path of system, @example "/usr/data/001"
 * @chunkName      {String} name of chunk, @example "eeffgghh"
 * @return         {Array}  return value, @example [1, "eeffgghh"]
 */
exports.add = function( file2chunkData, filePath, chunkName ){
// START
  log.args( Error(), arguments );
  file2chunkData[filePath] = file2chunkData[filePath] || [];

  if( !file2chunkData[filePath].includes(chunkName) ){
    file2chunkData[filePath].push(chunkName);
  }

  let chunkIndex = file2chunkData[filePath].length - 1;

  log.info( Error(), jsons(file2chunkData) );
  log.end( Error(), jsons(chunkIndex) );
  return chunkIndex;
// END
};
// PUBLIC_METHOD_END [add]


// PUBLIC_METHOD_START [delete]
/**
 * delete file path
 * @file2chunkData {JSON}   map data of filePath to chunkName, @example {"/usr/data/001":["aabbccdd"], "/usr/data/002":["eeffgghh"]}
 * @filePath       {String} file path of system, @example "/usr/data/001"
 * @return         {JSON}   return value, @example {"code":0, "msg":""}
 */
exports.delete = function( file2chunkData, filePath ){
// START
  log.args( Error(), arguments );
  let chunkNameList = file2chunkData[filePath];

  delete file2chunkData[filePath];

  log.end( Error(), jsons(file2chunkData) );
  return chunkNameList;
// END
};
// PUBLIC_METHOD_END [delete]


// PUBLIC_METHOD_START [getChunkNameList]
/**
 * get list of chunk name of file path
 * @file2chunkData {JSON}   map data of filePath to chunkName, @example {"/usr/data/001":["aabbccdd", "eeffgghh"]}
 * @filePath       {String} file path of system, @example "/usr/data/001"
 * @return         {Array}  return value, @example ["aabbccdd", "eeffgghh"]
 */
exports.getChunkNameList = function( file2chunkData, filePath ){
// START
  log.args( Error(), arguments );
  let item = file2chunkData[filePath];

  log.end( Error(), jsons(item) );
  return item;
// END
};
// PUBLIC_METHOD_END [getChunkNameList]


// PUBLIC_METHOD_START [getByIndex]
/**
 * get chunk name by index
 * @file2chunkData {JSON}   map data of filePath to chunkName, @example {"/usr/data/001":["aabbccdd", "eeffgghh"]}
 * @filePath       {String} file path of system, @example "/usr/data/001"
 * @index          {Number} index of chunk, @example 1
 */
exports.getByIndex = function( file2chunkData, filePath, index ){
// START
  log.args( Error(), arguments );
  let chunkName;

  if( file2chunkData.hasOwnProperty(filePath) ){
    let list = file2chunkData[filePath];
    return list[index];
  }

  log.end( Error(), chunkName );
  return chunkName;
// END
};
// PUBLIC_METHOD_END [getByIndex]


// PUBLIC_METHOD_START [getByIndexList]
/**
 * get list of chunk name by index arange
 * @file2chunkData {JSON}   map data of filePath to chunkName, @example {"/usr/data/001":["aabbccdd", "eeffgghh"]}
 * @filePath       {String} file path of system, @example "/usr/data/001"
 * @index          {Number} index of chunk, @example 0
 * @count          {Number} count, @example 1
 * @return         {Array}  return value, @example []
 */
exports.getByIndexList = function( file2chunkData, filePath, index, count ){
// START
  log.args( Error(), arguments );

  let list = [];
  let chunkNameList = file2chunkData[filePath] || [];

  for(let i = index; i < chunkNameList.length; i++ ){
    let chunkName = chunkNameList[i];
    if( chunkName && list.length < count ){
      list.push( chunkName );
    }
  }

  log.end( Error(), jsons(list) );
  return list;
// END
};
// PUBLIC_METHOD_END [getByIndexList]


// PUBLIC_METHOD_START [getCount]
/**
 * get chunk count of file path
 * @file2chunkData {JSON}   map data of filePath to chunkName, @example {"/usr/data/001":["aabbccdd", "eeffgghh"]}
 * @filePath       {String} file path of system, @example "/usr/data/001"
 */
exports.getCount = function( file2chunkData, filePath ){
// START
  log.args( Error(), arguments );
  let count;

  if( file2chunkData.hasOwnProperty(filePath) ){
    let list = file2chunkData[filePath];
    count = list.length;
  }

  log.end( Error(), jsons(count) );
  return count;
// END
};
// PUBLIC_METHOD_END [getCount]


// PUBLIC_METHOD_START [getLast]
/**
 * get last chunk
 * @file2chunkData {JSON}   map data of filePath to chunkName, @example {"/usr/data/001":["aabbccdd", "eeffgghh"]}
 * @filePath       {String} file path of system, @example "/usr/data/001"
 */
exports.getLast = function( file2chunkData, filePath ){
// START
  log.args( Error(), arguments );
  let lastName;

  let chunks = file2chunkData[filePath] || [];
  lastName = chunks[chunks.length - 1];

  log.end( Error(), lastName );
  return lastName;
// END
};
// PUBLIC_METHOD_END [getLast]


// PUBLIC_METHOD_START [getLastChunkName]
/**
 * get last chunk name of file path
 * @file2chunkData {JSON}   map data of filePath to chunkName, @example {"/usr/data/001":["aabbccdd", "eeffgghh"]}
 * @filePath       {String} file path of system, @example "/usr/data/001"
 * @return         {String} return value, @example eeffgghh
 */
exports.getLastChunkName = function( file2chunkData, filePath ){
// START
  log.args( Error(), arguments );
  let lastName;

  let chunks = file2chunkData[filePath] || [];
  lastName = chunks[chunks.length - 1];

  log.end( Error(), lastName );
  return lastName;
// END
};
// PUBLIC_METHOD_END [getLastChunkName]


