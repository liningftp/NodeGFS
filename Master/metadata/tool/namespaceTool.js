
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Master
 * @copyright: liningftp@qq.com
 * @name: namespaceTool
 * @desc: namespace manage tool
 * @file: /metadata/tool/namespaceTool.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START

const {lodash, utilfs, utilstr, jsonlog, jsons, clog, log} = require('../../../base');

const emptyDir = {
  '_type': 'dir',
  '_lock': {
    'r': [],
    'w': [],
    'a': [],
    'snap': []
  }
};

const emptyFile = {
  '_type': 'file',
  '_replicaCount': 3,
  '_lock': {
    'r': [],
    'w': [],
    'a': [],
    'snap': []
  }
};

// END
// REQUIRE_END


// PUBLIC_METHOD_START [add]
/**
 * add file path
 * @namespaceData {JSON}   tree of namespace, @example {}
 * @filePath      {String} file path of system, @example "/usr/data/001"
 * @fileType      {String} file type, @example "file"
 * @return        {JSON}   返回值, @example {}
 */
exports.add = function( namespaceData, filePath, fileType ){
// START
  log.args( Error(), arguments );
  if('/' === filePath){
    console.log(`Error: filePath can not be "/" `);
    return namespaceData;
  }

  let arr = utilstr.splitPath(filePath);

  // 剥离出最后一项
  let lastItem = arr.splice(-1);

  let data = namespaceData;

  for(const p of arr){
    data = data[p] = data[p] || Object.assign({}, emptyDir);
  }

  if('dir' === fileType){
    data = data[lastItem] = data[lastItem] || Object.assign({}, emptyDir);
  }
  else if('file' === fileType){
    data = data[lastItem] = data[lastItem] || Object.assign({}, emptyFile);
  }

  log.info( Error(), jsons(namespaceData) );
  return namespaceData;
// END
};
// PUBLIC_METHOD_END [add]


// PUBLIC_METHOD_START [clone]
/**
 * clone the part namespace of file path
 * @namespaceData {JSON}   tree of namespace, @example {"/usr":{"_type":"dir","_lock":{"r":[],"w":[]},"/data":{"_type":"dir","_lock":{"r":[],"w":[]},"/001":{"_type":"file","_replicaCount":3,"_lock":{"r":[],"w":[]}}}}}
 * @filePath      {String} file path of system, @example "/usr/data/001"
 * @return        {JSON}   返回值, @example {}
 */
exports.clone = function( namespaceData, filePath ){
// START
  log.args( Error(), arguments );
  if('/' === filePath){
    clog(`Error: filePath can not be "/" `);
    return namespaceData;
  }

  if( !exports.hasPath(namespaceData, filePath) ){
    clog(`Error: ${filePath} is not exists`);
    return namespaceData;
  }

  let tree = {};
  let _tree = tree;

  let arr = utilstr.splitPath(filePath);

  // 剥离出最后一项
  let lastItem = arr.splice(-1);

  let data = namespaceData;
  for(const p of arr){
    data = data[p]; // 跟着空溜圈
    _tree = _tree[p] = Object.assign({}, emptyDir);
  }

  _tree[lastItem] = exports._copy(data[lastItem]);

  log.info( Error(), jsons(tree) );
  return tree;
// END
};
// PUBLIC_METHOD_END [clone]


// PUBLIC_METHOD_START [delete]
/**
 * delete file path
 * @namespaceData {JSON}   tree of namespace, @example {"/usr":{"_type":"dir","_lock":{},"/data":{"_type":"dir","_lock":{},"/001":{"_type":"file","_replicaCount":3,"_lock":{}}}}}
 * @filePath      {String} file path of system, @example "/usr/data/001/xx/yy"
 * @return        {JSON}   返回值, @example {}
 */
exports.delete = function( namespaceData, filePath ){
// START
  log.args( Error(), arguments );
  if('/' === filePath){
    console.log(`Error: filePath can not be "/" `);
    return namespaceData;
  }

  let arr = utilstr.splitPath(filePath);

  // 剥离出最后一项
  let lastItem = arr.splice(-1);

  let data = namespaceData;

  for(const p of arr){
    data = data[p];
    if(!data){
      break;
    }
  }

  if(data){
    delete data[lastItem];
  }

  log.info( Error(), jsons(namespaceData) );
  return namespaceData;
// END
};
// PUBLIC_METHOD_END [delete]


// PUBLIC_METHOD_START [hasPath]
/**
 * has path or not
 * @namespaceData {JSON}   tree of namespace, @example {"/usr":{"_type":"dir","_lock":{},"/data":{"_type":"dir","_lock":{},"/001":{"_type":"file","_replicaCount":3,"_lock":{}}}}}
 * @filePath      {String} file path of system, @example "/usr/data/001"
 * @return        {Number} 返回值, @example 1
 */
exports.hasPath = function( namespaceData, filePath ){
// START
  log.args( Error(), arguments );
  let b = true;

  let data = namespaceData;

  filePath = utilfs.formatFilePath(filePath);

  let arr = utilstr.splitPath(filePath);

  if(arr.length){
    for(const p of arr){
      data = data[p];
      if(!data){
        b = false;
        break;
      }
    }
  }
  else{
    b = false;
  }

  log.info( Error(), jsons(b) );
  return b;
// END
};
// PUBLIC_METHOD_END [hasPath]


// PUBLIC_METHOD_START [getReplicaCount]
/**
 * get chunk replica count
 * @namespaceData {JSON}   tree of namespace, @example {"/usr":{"_type":"dir","_lock":{"r":[],"w":[]},"/data":{"_type":"dir","_lock":{"r":[],"w":[]},"/001":{"_type":"file","_replicaCount":3,"_lock":{"r":[],"w":[]}}}}}
 * @filePath      {String} file path of system, @example "/usr/data/001"
 * @return        {Number} 返回值, @example 3
 */
exports.getReplicaCount = function( namespaceData, filePath ){
// START
  log.args( Error(), arguments );
  if('/' === filePath){
    console.log(`Error: filePath can not be "/" `);
    return namespaceData;
  }

  let replicaCount;

  let arr = utilstr.splitPath(filePath);

  // 剥离出最后一项
  let lastItem = arr.splice(-1);

  let data = namespaceData;

  for(const p of arr){
    data = data[p];
    if(!data){
      break;
    }
  }

  if(data){
    replicaCount = data[lastItem]['_replicaCount'];
  }

  log.info( Error(), jsons(replicaCount) );
  return replicaCount;
// END
};
// PUBLIC_METHOD_END [getReplicaCount]


// PUBLIC_METHOD_START [getFilePathList]
/**
 * get list of file path from namespace
 * @namespaceData {JSON}  tree of namespace, @example {"/usr":{"_type":"dir","_lock":{},"/data":{"_type":"dir","_lock":{},"/001":{"_type":"file","_replicaCount":3,"_lock":{}},"/002":{"_type":"file","_replicaCount":3,"_lock":{}}},"/etc":{"_type":"dir","_lock":{},"/nginx":{"_type":"file","_replicaCount":3,"_lock":{}}}}}
 * @return        {Array} Return value, @example []
 */
exports.getFilePathList = function( namespaceData ){
// START
  log.args( Error(), arguments );
  let list = [];

  namespaceData = namespaceData || {};

  function f(data){
    let list = [];
    for(const p in data){
      let node = data[p];
      let _type = node._type;
      let name;
      for(const key in node){
        if( /^\/\w+$/.test(key) ){
          name = key;
          break;
        }
      }

      if("file" === _type){
        list.push( [p].join('') );
      }
      else if("dir" === _type){
        let _list = f(node);
        for(const s of _list){
          list.push( [p, s].join('') );
        }
      }
    }
    return list;
  }

  list = f(namespaceData);

  log.info( Error(), jsons(list) );
  return list;
// END
};
// PUBLIC_METHOD_END [getFilePathList]


// PUBLIC_METHOD_START [lock]
/**
 * add lock
 * @namespaceData {JSON}   tree of namespace, @example {"/usr":{"_type":"dir","_lock":{"r":[1600676278653],"w":[],"snap":[]},"/000":{"_type":"file","_replicaCount":3,"_lock":{"r":[1600676278653],"w":[],"a":[],"snap":[]}}}}
 * @filePath      {String} file path of system, @example "/usr/000"
 * @lockType      {String} lock type, "a", "r", "w", "snap", @example "w"
 * @timestamp     {Number} time stamp, @example 1600676278653
 * @lockDuration  {Number} lock duration, @example 300000
 */
exports.lock = function( namespaceData, filePath, lockType, timestamp, lockDuration ){
// START
  log.args( Error(), arguments );
  let data = namespaceData;
  let arr = utilstr.splitPath( filePath );
  let lastName = arr.splice( -1 );

  /* create new fd */
  let fd = timestamp;
  let max = exports._findMaxFD( data, filePath );
  if( fd <= max ){
    fd = max + 1;
  }

  /* add path lock */
  for( const name of arr ){
    data = data[name];
    data._lock['r'].push( fd );
  }

  /* add target lock */
  data = data[lastName];
  if( data ){
    data._lock[lockType].push( fd );
  }

  log.info( Error(), jsons(fd) );
  return fd;
// END
};
// PUBLIC_METHOD_END [lock]


// PUBLIC_METHOD_START [unlock]
/**
 * release lock
 * @namespaceData {JSON}   tree of namespace, @example {"/usr":{"_type":"dir","_lock":{"r":[1600676278653,1606184682394],"w":[],"snap":[]},"/000":{"_type":"file","_replicaCount":3,"_lock":{"r":[1600676278653],"w":[],"a":[],"snap":[]}}}}
 * @filePath      {String} file path of system, @example "/usr/000"
 * @fd            {Number} file describe as timestamp when file is opened, @example 1600676278653
 */
exports.unlock = function( namespaceData, filePath, fd ){
// START
  log.args( Error(), arguments );
  let data = namespaceData;
  let arr = utilstr.splitPath( filePath );

  for(const name of arr){
    data = data[name];
    if( !data ){
      break;
    }
    for( const lockType in data._lock ){ /* remove fd from data */
      data._lock[lockType] = data._lock[lockType].filter( tm => tm != fd );
    }
  }

  log.info( Error(), jsons(namespaceData) );
  return namespaceData;
// END
};
// PUBLIC_METHOD_END [unlock]


// PUBLIC_METHOD_START [isLock]
/**
 * check lock is exists or not
 * @namespaceData {JSON}   tree of namespace, @example {"/usr":{"_type":"dir","_lock":{"r":[1601781089737],"w":[],"snap":[1601781089737]},"/000":{"_type":"file","_replicaCount":3,"_lock":{"r":[1601781089737],"w":[],"a":[],"snap":[1601781089737]}}}}
 * @filePath      {String} file path of system, @example "/usr/000"
 * @lockType      {String} lock type, "a", "r", "w", "snap", @example "a"
 * @timestamp     {Number} time stamp, @example 1601781089737
 * @lockDuration  {Number} lock duration, @example 300000
 * @return        {Array}  Return value, @example [1, ""]
 */
exports.isLock = function( namespaceData, filePath, lockType, timestamp, lockDuration ){
// START
  log.args( Error(), arguments );
  let lock = false, error = '';

  let data = namespaceData;
  let arr = utilstr.splitPath(filePath);

  exports._clearLock( data, filePath, timestamp, lockDuration );

  if( 'r' === lockType ){
    for( const name of arr ){
      data = data[name];
      if( data._lock.w.length ){
        lock = true;
        error = 'WRITE_LOCKED';
        break;
      }
    }
  }
  else if( 'w' === lockType ){
    lock = true;
    for( const name of arr ){
      data = data[name];
      if( data._lock.r.length ){
        error = 'READ_LOCKED';
      }
      else if( data._lock.w.length ){
        error = 'WRITE_LOCKED';
      }
      else if( data._lock.a.length ){
        error = 'APPEND_LOCKED';
      }
      else if( data._lock.snap.length ){
        error = 'SNAP_LOCKED';
        break;
      }
      else if( 0 == (data._lock.r.length + data._lock.w.length + data._lock.a.length + data._lock.snap.length) ){
        lock = false;
        break;
      }
    }
  }
  else if( 'a' === lockType ){
    lock = false;

    for( const name of arr ){
      data = data[name];
      if( data._lock.w.length ){
        lock = true;
        error = 'WRITE_LOCKED';
        break;
      }
      else if( data._lock.snap.length ){
        lock = true;
        error = 'SNAP_LOCKED';
        break;
      }
    }
  }
  else if( 'snap' === lockType ){
    for( const name of arr ){
      data = data[name];
      if( data._lock.w.length ){
        lock = true;
        error = 'WRITE_LOCKED';
        break;
      }
      else if( data._lock.snap.length ){
        lock = false;
        error = 'SNAP_LOCKED';
        break;
      }
    }
  }

  log.info( Error(), jsons([lock, error]) );
  return [lock, error];
// END
};
// PUBLIC_METHOD_END [isLock]


// PUBLIC_METHOD_START [hasAuth]
/**
 * has authority to run
 * @namespaceData {JSON}   tree of namespace, @example {"/usr":{"_type":"dir","_lock":{"r":[1601781089737],"w":[],"snap":[1601781089737]},"/000":{"_type":"file","_replicaCount":3,"_lock":{"r":[1601781089737],"w":[],"a":[],"snap":[1601781089737]}}}}
 * @filePath      {String} file path of system, @example "/usr/000"
 * @fd            {Number} file describe as timestamp when file is opened, @example 1601781089737
 * @timestamp     {Number} time stamp, @example 1601781089737
 * @lockDuration  {Number} lock duration, @example 300000
 * @return        {Number} Return value, @example 1
 */
exports.hasAuth = function( namespaceData, filePath, fd, timestamp, lockDuration ){
// START
  log.args( Error(), arguments );
  let auth = true;
  let data = namespaceData;

  exports._clearLock( data, filePath, timestamp, lockDuration );

  let arr = utilstr.splitPath(filePath);

  for( const name of arr ){
    data = data[name];

    let list = [];
    for( const lockType in data._lock ){
      list.push( ...data._lock[lockType] );
    }

    if( !list.includes( fd ) ){
      auth = false;
      break;
    }
  }

  log.info( Error(), jsons(auth) );
  return auth;
// END
};
// PUBLIC_METHOD_END [hasAuth]


// PUBLIC_METHOD_START [_clearLock]
/**
 * clear expire lock
 * @treeData     {JSON}   tree node data, @example {"/usr":{"_type":"dir","_lock":{"r":[1600676278653],"w":[1600675878500],"snap":[]},"/000":{"_type":"file","_replicaCount":3,"_lock":{"r":[1600676278653],"w":[],"a":[1606181904980],"snap":[]}}}}
 * @filePath     {String} file path of system, @example "/usr/000"
 * @timestamp    {Number} time stamp, @example 1606181904980
 * @lockDuration {Number} lock duration, @example 300000
 */
exports._clearLock = function( treeData, filePath, timestamp, lockDuration ){
// START
  log.args( Error(), arguments );
  let data = treeData;
  let arr = utilstr.splitPath( filePath );

  /* remove expire from data */
  for( const name of arr ){
    data = data[name];
    for( const lockType in data._lock ){
      data._lock[lockType] = data._lock[lockType].filter( tm => tm + lockDuration > timestamp );
    }
  }

  log.info( Error(), jsons(treeData) );
  return treeData;
// END
};
// PUBLIC_METHOD_END [_clearLock]


// PUBLIC_METHOD_START [_findMaxFD]
/**
 * find max fd of tree data
 * @treeData {JSON}   tree node data, @example {"/usr":{"_type":"dir","_lock":{"r":[1600676278653],"w":[1606179635164],"snap":[]},"/000":{"_type":"file","_replicaCount":3,"_lock":{"r":[1600676278653],"w":[],"a":[],"snap":[]}}}}
 * @filePath {String} file path of system, @example "/usr/000"
 * @return   {Number} Return value, @example 1606179635164
 */
exports._findMaxFD = function( treeData, filePath ){
// START
  log.args( Error(), arguments );
  let max = 0;

  let data = treeData;
  let arr = utilstr.splitPath( filePath );

  /* 清除data中的指定锁 */
  for( const name of arr ){
    data = data[name];
    for( const lockType in data._lock ){
      let list = data._lock[lockType];
      max = Math.max( max, ...list );
    }
  }

  log.info( Error(), jsons(max) );
  return max;
// END
};
// PUBLIC_METHOD_END [_findMaxFD]


// PUBLIC_METHOD_START [_copy]
/**
 * copy tree data
 * @src    {JSON} source tree, @example {"/usr":{"_type":"dir","_lock":{"r":[1600765363449,1600765377526],"w":[]},"/data":{"_type":"dir","_lock":{"r":[1600765363449,1600765377526],"w":[]},"/001":{"_type":"file","_replicaCount":3,"_lock":{"r":[],"w":[1600765363449]}}}}}
 * @return {JSON} 返回值, @example {}
 */
exports._copy = function( src ){
// START
  log.args( Error(), arguments );
  let t = {};

  let _type = src._type;
  if( 'dir' == _type ){
    t = Object.assign({}, emptyDir);
  }
  else if( 'file' == _type ){
    t = Object.assign({}, emptyFile);
  }

  let next;
  for(const key in src){
    if( /^\/\w+$/.test(key) ){
      next = key;
      break;
    }
  }

  if(next){
    t[next] = exports._copy( src[next] );
  }

  log.info( Error(), jsons(t) );
  return t;
// END
};
// PUBLIC_METHOD_END [_copy]


