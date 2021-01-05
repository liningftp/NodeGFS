
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Master
 * @copyright: liningftp@qq.com
 * @name: file2chunkSnapshotTool
 * @desc: manage file2chunk snapshot
 * @file: /metadata/tool/file2chunkSnapshotTool.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START

// END
// REQUIRE_END


// PUBLIC_METHOD_START [add]
/**
 * manage file2chunk snapshot
 * @file2chunkSnapshotData {JSON}   file2chunkData to snapshot, @example {}
 * @filePath               {String} file path of system, @example "/usr/data/001"
 * @timestamp              {Number} time stamp, @example 1597879274447
 * @chunkNameList          {Array}  list of chunkName, @example ['aabbcdd', 'eeffgghh']
 */
exports.add = function( file2chunkSnapshotData, filePath, timestamp, chunkNameList ){
// START
  file2chunkSnapshotData[filePath] = file2chunkSnapshotData[filePath] || {};

  file2chunkSnapshotData[filePath][timestamp] = chunkNameList;

  return file2chunkSnapshotData;
// END
};
// PUBLIC_METHOD_END [add]


// PUBLIC_METHOD_START [get]
/**
 * get chunk list of file path
 * @file2chunkSnapshotData {JSON}   file2chunkData to snapshot, @example {"/usr/data/001":{"1597879274447":["aabbcdd","eeffgghh"]}}
 * @filePath               {String} file path of system, @example "/usr/data/001"
 * @timestamp              {Number} time stamp, @example 1597879274447
 * @return                 {JSON}   return value, @example {}
 */
exports.get = function( file2chunkSnapshotData, filePath, timestamp ){
// START
  file2chunkSnapshotData[filePath] = file2chunkSnapshotData[filePath] || {};

  return file2chunkSnapshotData[filePath][timestamp];
// END
};
// PUBLIC_METHOD_END [get]


// PUBLIC_METHOD_START [delete]
/**
 * delete file path
 * @file2chunkSnapshotData {JSON}   file2chunkData to snapshot, @example {"/usr/data/001":{"1597879274447":["aabbcdd","eeffgghh"]}}
 * @filePath               {String} file path of system, @example "/usr/data/001"
 * @timestamp              {Number} time stamp, @example 1597879274447
 * @return                 {JSON}   return value, @example {}
 */
exports.delete = function( file2chunkSnapshotData, filePath, timestamp ){
// START
  file2chunkSnapshotData[filePath] = file2chunkSnapshotData[filePath] || {};

  delete file2chunkSnapshotData[filePath][timestamp];

  return file2chunkSnapshotData;
// END
};
// PUBLIC_METHOD_END [delete]


