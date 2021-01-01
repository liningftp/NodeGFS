
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Master
 * @copyright: liningftp@qq.com
 * @name: file2chunkDeleteTool
 * @desc: store file2chunk data to deleted
 * @file: /metadata/tool/file2chunkDeleteTool.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START
const {clog, log, jsons} = require('../../../base');
// END
// REQUIRE_END


// PUBLIC_METHOD_START [add]
/**
 * add
 * @file2chunkDeleteData {JSON}   file2chunkData to be deleted, @example {}
 * @filePath             {String} file path of system, @example "/usr/data/001"
 * @chunkNameList        {Array}  list of chunkName, @example ["aabbccdd", "eeffgghh"]
 * @timestamp            {Number} time stamp, @example 1599221725369
 * @return               {String} 返回值, @example /usr/data/001|1597879274447
 */
exports.add = function( file2chunkDeleteData, filePath, chunkNameList, timestamp ){
// START
  log.args( Error(), arguments );

  file2chunkDeleteData[filePath] = file2chunkDeleteData[filePath] || {};
  file2chunkDeleteData[filePath][timestamp] = chunkNameList;

  log.info( Error(), jsons(file2chunkDeleteData) );
  return file2chunkDeleteData;
// END
};
// PUBLIC_METHOD_END [add]


// PUBLIC_METHOD_START [get]
/**
 * get list of chunk name with file path
 * @file2chunkDeleteData {JSON}   file2chunkData to be deleted, @example {"/usr/data/001":{"1597879274447":["aabbcdd","eeffgghh"]}}
 * @filePath             {String} file path of system, @example "/usr/data/001"
 * @timestamp            {Number} time stamp, @example 1597879274447
 * @return               {Array}  返回值, @example ['aabbcdd', 'eeffgghh']
 */
exports.get = function( file2chunkDeleteData, filePath, timestamp ){
// START
  log.args( Error(), arguments );
  file2chunkDeleteData[filePath] = file2chunkDeleteData[filePath] || {};

  let list = file2chunkDeleteData[filePath][timestamp];

  log.info( Error(), jsons(list) );
  return Object.assign([], list);
// END
};
// PUBLIC_METHOD_END [get]


// PUBLIC_METHOD_START [delete]
/**
 * delete
 * @file2chunkDeleteData {JSON}   file2chunkData to be deleted, @example {"/usr/data/001":{"1597879274447":["aabbcdd","eeffgghh"]}}
 * @filePath             {String} file path of system, @example "/usr/data/001"
 * @timestamp            {Number} time stamp, @example 1597879274447
 */
exports.delete = function( file2chunkDeleteData, filePath, timestamp ){
// START
  log.args( Error(), arguments );
  file2chunkDeleteData[filePath] = file2chunkDeleteData[filePath] || {};

  delete file2chunkDeleteData[filePath][timestamp];

  if( !Object.keys(file2chunkDeleteData[filePath]).length ){
    delete file2chunkDeleteData[filePath];
  }

  log.info( Error(), jsons(file2chunkDeleteData) );
  return file2chunkDeleteData;
// END
};
// PUBLIC_METHOD_END [delete]


