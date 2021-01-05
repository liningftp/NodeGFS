
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Master
 * @copyright: liningftp@qq.com
 * @name: namespaceDeleteTool
 * @desc: manage namespace has delete flag
 * @file: /metadata/tool/namespaceDeleteTool.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START
const {utilfs, clog, log, jsons} = require('../../../base');
// END
// REQUIRE_END


// PUBLIC_METHOD_START [add]
/**
 * add file path
 * @namespaceDeleteData {JSON}   delete tree of namespace, @example {}
 * @filePath            {String} file path of system, @example "/usr/data/001"
 * @timestamp           {Number} time stamp, @example 1599188987628
 * @tree                {JSON}   tree, @example {"/usr":{"_type":"dir","_lock":{"r":[],"w":[]},"/data":{"_type":"dir","_lock":{"r":[],"w":[]},"/001":{"_type":"file","_lock":{"r":[],"w":[]}},"/002":{"_type":"file","_lock":{"r":[],"w":[]}}},"/photo":{"_type":"dir","_lock":{"r":[],"w":[]},"/2020":{"_type":"file","_lock":{"r":[],"w":[]}}}}}
 * @return              {JSON}   return value, @example {}
 */
exports.add = function( namespaceDeleteData, filePath, timestamp, tree ){
// START
  log.args( Error(), arguments );
  namespaceDeleteData[filePath] = namespaceDeleteData[filePath] || {};

  namespaceDeleteData[filePath][timestamp] = tree;

  log.info( Error(), jsons(namespaceDeleteData) );
  return namespaceDeleteData;
// END
};
// PUBLIC_METHOD_END [add]


// PUBLIC_METHOD_START [get]
/**
 * get namespace
 * @namespaceDeleteData {JSON}   delete tree of namespace, @example {"/usr/data":{"1597879274447":{"/usr":{"_type":"dir","_lock":{"r":[],"w":[]},"/data":{"_type":"dir","_lock":{"r":[],"w":[]},"/001":{"_type":"file","_lock":{"r":[],"w":[]}},"/002":{"_type":"file","_lock":{"r":[],"w":[]}}},"/photo":{"_type":"dir","_lock":{"r":[],"w":[]},"/2020":{"_type":"file","_lock":{"r":[],"w":[]}}}}}}}
 * @filePath            {String} file path of system, @example "/usr/data"
 * @timestamp           {Number} time stamp, @example 1597879274447
 * @return              {JSON}   return value, @example {}
 */
exports.get = function( namespaceDeleteData, filePath, timestamp ){
// START
  log.args( Error(), arguments );
  let data = namespaceDeleteData[filePath] || {};
  log.info( Error(), jsons(data[timestamp]) );
  return data[timestamp];
// END
};
// PUBLIC_METHOD_END [get]


// PUBLIC_METHOD_START [delete]
/**
 * delete file path
 * @namespaceDeleteData {JSON}   delete tree of namespace, @example {"/usr/data":{"1597879274447":{"/usr":{"_type":"dir","_lock":{"r":[],"w":[]},"/data":{"_type":"dir","_lock":{"r":[],"w":[]},"/001":{"_type":"file","_lock":{"r":[],"w":[]}},"/002":{"_type":"file","_lock":{"r":[],"w":[]}}},"/photo":{"_type":"dir","_lock":{"r":[],"w":[]},"/2020":{"_type":"file","_lock":{"r":[],"w":[]}}}}}}}
 * @filePath            {String} file path of system, @example "/usr/data"
 * @timestamp           {Number} time stamp, @example 1597879274447
 */
exports.delete = function( namespaceDeleteData, filePath, timestamp ){
// START
  log.args( Error(), arguments );
  if( namespaceDeleteData.hasOwnProperty(filePath) ) {
    delete namespaceDeleteData[filePath][timestamp];

    if( !Object.keys(namespaceDeleteData[filePath]).length ){
      delete namespaceDeleteData[filePath];
    }
  }
  log.info( Error(), jsons(namespaceDeleteData) );
  return namespaceDeleteData;
// END
};
// PUBLIC_METHOD_END [delete]


// PUBLIC_METHOD_START [getExpireList]
/**
 * get expire list
 * @namespaceDeleteData {JSON}   delete tree of namespace, @example {"/usr/data":{"1597879274447":{"/usr":{"_type":"dir","_lock":{"r":[],"w":[]},"/data":{"_type":"dir","_lock":{"r":[],"w":[]},"/001":{"_type":"file","_lock":{"r":[],"w":[]}},"/002":{"_type":"file","_lock":{"r":[],"w":[]}}},"/photo":{"_type":"dir","_lock":{"r":[],"w":[]},"/2020":{"_type":"file","_lock":{"r":[],"w":[]}}}}}}}
 * @retainTime          {Number} retain time after deleted, @example 259200000
 * @timestamp           {Number} time stamp, @example 1601278486787
 * @return              {Array}  return value, @example []
 */
exports.getExpireList = function( namespaceDeleteData, retainTime, timestamp ){
// START
  log.args( Error(), arguments );
  let expireList = [];

  for(const [filePath, tmObj] of Object.entries(namespaceDeleteData)){
    let tmList = Object.keys(tmObj).map(key => parseInt(key));
    let list = tmList.filter(tm => tm + retainTime <= timestamp);
    if(list.length){
      expireList.push([filePath, list]);
    }
  }

  log.info( Error(), jsons(expireList) );
  return expireList;
// END
};
// PUBLIC_METHOD_END [getExpireList]


