
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Master
 * @copyright: liningftp@qq.com
 * @name: namespaceSnapshotTool
 * @desc: manage namespace snapshot
 * @file: /metadata/tool/namespaceSnapshotTool.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START
const {utilfs, clog} = require('../../../base');
// END
// REQUIRE_END


// PUBLIC_METHOD_START [add]
/**
 * add file path
 * @namespaceSnapshotData {Array}  snapshot tree of namespace, @example {}
 * @filePath              {String} file path of system, @example "/usr/data/001"
 * @timestamp             {Number} time stamp, @example 1600959455031
 * @tree                  {JSON}   tree, @example {"/usr":{"_type":"dir","_lock":{"r":[],"w":[]},"/data":{"_type":"dir","_lock":{"r":[],"w":[]},"/001":{"_type":"file","_lock":{"r":[],"w":[]}}}}}
 */
exports.add = function( namespaceSnapshotData, filePath, timestamp, tree ){
// START
  namespaceSnapshotData[filePath] = namespaceSnapshotData[filePath] || {};

  namespaceSnapshotData[filePath][timestamp] = tree;

  return namespaceSnapshotData;
// END
};
// PUBLIC_METHOD_END [add]


// PUBLIC_METHOD_START [get]
/**
 * get namespace
 * @namespaceSnapshotData {JSON}   snapshot tree of namespace, @example {"/usr/data/001":{"1600959455031":{"/usr":{"_type":"dir","_lock":{"r":[],"w":[]},"/data":{"_type":"dir","_lock":{"r":[],"w":[]},"/001":{"_type":"file","_lock":{"r":[],"w":[]}}}}}}}
 * @filePath              {String} file path of system, @example "/usr/data/001"
 * @timestamp             {String} time stamp, @example "1600959455031"
 * @return                {JSON}   返回值, @example {}
 */
exports.get = function( namespaceSnapshotData, filePath, timestamp ){
// START
  let data = namespaceSnapshotData[filePath] || {};
  return data[timestamp];
// END
};
// PUBLIC_METHOD_END [get]


// PUBLIC_METHOD_START [getList]
/**
 * get timestamp list
 * @namespaceSnapshotData {Array}  snapshot tree of namespace, @example {"/usr/data/001":{"1600959455031":{"/usr":{"_type":"dir","_lock":{"r":[],"w":[]},"/data":{"_type":"dir","_lock":{"r":[],"w":[]},"/001":{"_type":"file","_lock":{"r":[],"w":[]}}}}}}}
 * @filePath              {String} file path of system, @example "/usr/data/001"
 * @return                {Array}  返回值, @example [15978792744472,1597879295305]
 */
exports.getList = function( namespaceSnapshotData, filePath ){
// START

  let data = namespaceSnapshotData[filePath] || {};

  return Object.keys(data);
// END
};
// PUBLIC_METHOD_END [getList]


