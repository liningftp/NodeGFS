
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Master
 * @copyright: liningftp@qq.com
 * @name: clientHandler
 * @desc: handle client request
 * @file: /business/clientHandler.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START
const {comm, util, clog, log, jsonlog, jsons} = require('../../base');

const operationLog = require('../store/operationLog.js');

const {
  chunkdataTool,
  chunkfullTool,
  file2chunkTool,
  file2chunkDeleteTool,
  namespaceTool,
  namespaceDeleteTool,
  serverdataTool
} = require('../metadata');

const lauchOrder = require('../daemon/lauchOrder.js');

// END
// REQUIRE_END


// PUBLIC_METHOD_START [open]
/**
 * open file
 * @namespaceData {JSON}   tree of namespace, @example {"/usr":{"_type":"dir","_lock":{"r":[1606225901838,1600765377526],"w":[],"a":[],"snap":[]},"/data":{"_type":"dir","_lock":{"r":[1606225901838,1600765377526],"w":[],"a":[],"snap":[]},"/001":{"_type":"file","_replicaCount":3,"_lock":{"r":[],"w":[],"a":[],"snap":[1606225901838]}}}}}
 * @filePath      {String} file path of system, @example "/usr/data/001"
 * @flags         {String} open flags, O_RDONLY, O_WRONLY, O_RDWR, @example "O_RDWR"
 * @mode          {String} type mode, O_APPEND whe flags is O_RDWR, @example "O_APPEND"
 * @timestamp     {Number} time stamp, @example 1606225666536
 * @lockDuration  {Number} lock duration, @example 300000
 * @return        {Array}  返回值, @example [{"code":0, "data":{"fd":3}, "msg":""}]
 */
exports.open = async function( namespaceData, filePath, flags, mode, timestamp, lockDuration ){
// START
  log.args( Error(), arguments );
  let result = {};

  flags = (flags || '').trim().toUpperCase();
  mode = (mode || '').trim().toUpperCase();

  /* file path is not exists */
  if( !namespaceTool.hasPath(namespaceData, filePath) ){
    let level = 'info';
    if( 'O_RDONLY' === flags ){
      util.error(result, 'NOT_EXISTS', `filePath is not exists, ${filePath}`);
      log.error( Error(), jsons([result]) );
      return [result];
    }
    else if( 'O_WRONLY' === flags ){
      util.success(result, 'SUCCESS', {"fd":0});
    }
    else if( ['O_RDWR'].includes(flags) ){
      if( 'O_APPEND' === mode ){
        util.success(result, 'SUCCESS', {"fd":0});
      }
    }
    else{
      util.success(result, 'SUCCESS', {"fd":0});
    }

    log.info( Error(), jsons([result]) );
    return [result];
  }

  /* open namespace file with flags and mode */
  let fd = 0;
  if( 'O_RDONLY' === flags ){
    let [lock, error] = namespaceTool.isLock(namespaceData, filePath, 'r', timestamp, lockDuration);
    if( lock ){
      util.error(result, error, 'FAIL');
      log.error( Error(), jsons([result]) );
      return [result];
    }

    /* get fd for close */
    fd = namespaceTool.lock(namespaceData, filePath, 'r', timestamp, lockDuration);
  }
  else if( 'O_WRONLY' === flags ){
    let [lock, error] = namespaceTool.isLock(namespaceData, filePath, 'w', timestamp, lockDuration);
    if( lock ){
      util.error(result, error, `filePath is locked, ${filePath}`);
      log.error( Error(), jsons([result]) );
      return [result];
    }

    fd = namespaceTool.lock(namespaceData, filePath, 'w', timestamp, lockDuration);
  }
  else if( 'O_RDWR' === flags && 'O_APPEND' === mode ){
    let [lock, error] = namespaceTool.isLock(namespaceData, filePath, 'a', timestamp, lockDuration);
    if( lock ){
      util.error(result, error, 'filePath is locked, ${filePath}');
      log.error( Error(), jsons([result]) );
      return [result];
    }

    fd = namespaceTool.lock(namespaceData, filePath, 'a', timestamp, lockDuration);
  }

  util.success(result, 'OPEN success', {fd});

  log.end( Error(), jsons([result]) );
  return [result];
// END
};
// PUBLIC_METHOD_END [open]


// PUBLIC_METHOD_START [close]
/**
 * close file
 * @namespaceData {JSON}   tree of namespace, @example {"/usr":{"_type":"dir","_lock":{"r":[1600765363449,1600765377526],"w":[],"a":[],"snap":[]},"/data":{"_type":"dir","_lock":{"r":[1600765363449,1600765377526],"w":[],"a":[],"snap":[]},"/001":{"_type":"file","_replicaCount":3,"_lock":{"r":[1600765363449],"w":[],"a":[],"snap":[]}}}}}
 * @filePath      {String} file path of system, @example "/usr/data/001"
 * @fd            {String} file describe as timestamp when file is opened, @example "1600765377526"
 * @return        {Array}  返回值, @example [{"code":0, "msg":""}]
 */
exports.close = async function( namespaceData, filePath, fd ){
// START
  log.args( Error(), arguments );
  let result = {};

  namespaceTool.unlock(namespaceData, filePath, fd);

  util.success(result, 'CLOSE success');

  log.end( Error(), jsons([result]) );
  return [result];
// END
};
// PUBLIC_METHOD_END [close]


// PUBLIC_METHOD_START [createDir]
/**
 * create namespace directory
 * @namespaceData {JSON}   tree of namespace, @example {}
 * @filePath      {String} file path of system, @example "/usr/data/001"
 * @timestamp     {Number} time stamp, @example 1603423714256
 * @recordPath    {String} path of operate record, @example "C:\work\GFS2\AppData\master\operation.log"
 * @return        {Array}  返回值, @example [{"code":0, "msg":""}]
 */
exports.createDir = async function( namespaceData, filePath, timestamp, recordPath ){
// START
  log.args( Error(), arguments );
  let result = {};

  /* check filePath is exists or not */
  if( namespaceTool.hasPath(namespaceData, filePath) ){
    util.error( result, 'HAS_EXISTS', `filePath is exists, ${filePath}` );
    log.error( Error(), jsons([result]) );
    return [result];
  }

  /* add file to namespace */
  namespaceTool.add(namespaceData, filePath, 'dir');

  /* save operate log */
  result = operationLog.createDir(timestamp, filePath, recordPath);

  log.end( Error(), jsons([result]) );
  return [result];
// END
};
// PUBLIC_METHOD_END [createDir]


// PUBLIC_METHOD_START [deleteDir]
/**
 * delete namespace directory
 * @namespaceData       {JSON}   tree of namespace, @example {"/usr":{"_type":"dir","_lock":{"r":[1601782516188],"w":[]},"/data":{"_type":"dir","_lock":{"r":[1601782516188],"w":[]},"/001":{"_type":"file","_replicaCount":3,"_lock":{"r":[],"w":[]}}}}}
 * @namespaceDeleteData {JSON}   delete tree of namespace, @example {}
 * @filePath            {String} file path of system, @example "/usr/data"
 * @fd                  {Number} file describe as timestamp when file is opened, @example 1606961159937
 * @timestamp           {Number} time stamp, @example 1604366129450
 * @lockDuration        {Number} lock duration, @example 300000
 * @recordPath          {String} path of operate record, @example "C:\work\GFS2\AppData\master\operation.log"
 * @return              {Array}  返回值, @example [{"code":0, "msg":""}]
 */
exports.deleteDir = async function( namespaceData, namespaceDeleteData, filePath, fd, timestamp, lockDuration, recordPath ){
// START
  log.args( Error(), arguments );
  let result = {};

  /* check filePath is exists or not */
  if( !namespaceTool.hasPath(namespaceData, filePath) ){
    util.error( result, 'NOT_EXISTS', `filePath is not exists, ${filePath}` );
    log.error( Error(), jsons([result]) );
    return [result];
  }

  /* check filePath is locked or not */
  let opType = 'dd';
  let [lock, error] = namespaceTool.isLock(namespaceData, filePath, opType, timestamp, lockDuration);
  if( true === lock ){
    util.error( result, error, `filePath is locked, ${filePath}` );
    log.error( Error(), jsons([result]) );
    return [result];
  }

  /* delete file namespace */
  let tree = namespaceTool.clone(namespaceData, filePath);
  namespaceTool.delete(namespaceData, filePath);

  /* add sub tree deleted to namespaceDeleteData */
  namespaceDeleteTool.add(namespaceDeleteData, filePath, timestamp, tree);

  /* save operate log */
  operationLog.delete(timestamp, filePath, opType, recordPath);

  util.success( result );

  log.end( Error(), jsons([result]) );
  return [result];
// END
};
// PUBLIC_METHOD_END [deleteDir]


// PUBLIC_METHOD_START [createFile]
/**
 * create namespace file
 * @namespaceData  {JSON}   tree of namespace, @example {"/usr":{"_type":"dir","_lock":{"r":[],"w":[]},"/data":{"_type":"dir","_lock":{"r":[],"w":[]}}}}
 * @file2chunkData {JSON}   map data of filePath to chunkName, @example {}
 * @chunkData      {JSON}   base info of all chunk on local, @example {}
 * @serverData     {JSON}   data of server, @example {"127.0.0.1:3001":[12,1599033406152],"127.0.0.1:3002":[22,1599033664421],"127.0.0.1:3003":[18,1599033677924]}
 * @waitleaseData  {JSON}   waitting for chunkserver confirm lease, @example {}
 * @filePath       {String} file path of system, @example "/usr/data/001"
 * @replicaCount   {Number} count of relipcas, @example 3
 * @avgUseRate     {Number} avg use rate, @example 50
 * @heartbeatTime  {Number} time of heartbeat, @example 60000
 * @timestamp      {Number} time stamp, @example 1599033406152
 * @recordPath     {String} path of operate record, @example "C:\work\GFS2\AppData\master\operation.log"
 * @return         {Array}  返回值, @example [{"code":0, "msg":""}]
 */
exports.createFile = async function( namespaceData, file2chunkData, chunkData, serverData, waitleaseData, filePath, replicaCount, avgUseRate, heartbeatTime, timestamp, recordPath ){
// START
  log.args( Error(), arguments );
  let result = {};

  /* check filePath is exists or not */
  if( namespaceTool.hasPath(namespaceData, filePath) ){
    util.error( result, 'HAS_EXISTS', `filePath is exists, ${filePath}`);
    log.error( Error(), jsons([result]) );
    return [result];
  }

  /* select free chunkserver for new chunk */
  let chunkName = chunkdataTool.getNewChunkName(chunkData);
  let serverList = serverdataTool.getFree( serverData, avgUseRate, 1.5 * heartbeatTime, timestamp, [], replicaCount ); // 新选几台服务器

  if( serverList.length < replicaCount ){
    util.error( result, 'SERVER_COUNT_LESS', '');
    log.error( Error(), jsons([result]) );
    return [result];
  }

  /* select one chunkserver as primary */
  let primary = serverList[timestamp % replicaCount];
  let version = 1;
  let isNew = 1;

  /* distribute to primary */
  result = await lauchOrder.grantLease(waitleaseData, chunkName, serverList, primary, version, timestamp, isNew);
  if(0 === result.code && result.isRunner){
    let fileType = 'file';
    /* add filePath to namespace */
    namespaceTool.add(namespaceData, filePath, fileType);
    /* set memory about new chunk */
    lauchOrder.setNewChunk(file2chunkData, chunkData, filePath, chunkName, serverList, primary, version, replicaCount, timestamp);
    /* save operate log*/
    result = operationLog.createFile(timestamp, filePath, replicaCount, recordPath);
    log.error( Error(), jsons([result]) );
    if(0 != result.code){ return [result] }

    result = operationLog.setVersion(timestamp, filePath, chunkName, version, recordPath);
    log.error( Error(), jsons([result]) );
    if(0 != result.code){ return [result] }
  }
  else{
    log.error( Error(), jsons([result]) );
    if(0 != result.code){ return [result] }
  }

  log.end( Error(), jsons([result]) );
  return [result];
// END
};
// PUBLIC_METHOD_END [createFile]


// PUBLIC_METHOD_START [deleteFile]
/**
 * delete namespace file
 * @namespaceData        {JSON}   tree of namespace, @example {"/usr":{"_type":"dir","_lock":{"r":[1601782516188],"w":[]},"/data":{"_type":"dir","_lock":{"r":[1601782516188],"w":[]},"/001":{"_type":"file","_replicaCount":3,"_lock":{"r":[],"w":[]}}}}}
 * @namespaceDeleteData  {JSON}   delete tree of namespace, @example {}
 * @file2chunkData       {JSON}   map data of filePath to chunkName, @example {}
 * @file2chunkDeleteData {JSON}   file2chunkData to be deleted, @example {}
 * @filePath             {String} file path of system, @example "/usr/data/001"
 * @fd                   {Number} file describe as timestamp when file is opened, @example 1606909907287
 * @timestamp            {Number} time stamp, @example 1604366129450
 * @lockDuration         {Number} lock duration, @example 300000
 * @recordPath           {String} path of operate record, @example "C:\work\GFS2\AppData\master\operation.log"
 * @return               {Array}  返回值, @example [{"code":0, "msg":""}]
 */
exports.deleteFile = async function( namespaceData, namespaceDeleteData, file2chunkData, file2chunkDeleteData, filePath, fd, timestamp, lockDuration, recordPath ){
// START
  log.args( Error(), arguments );
  let result = {};

  /* check filePath is exists or not */
  if( !namespaceTool.hasPath(namespaceData, filePath) ){
    util.error( result, 'NOT_EXISTS', `filePath is not exists, ${filePath}` );
    log.result( logID, Error(), [result] );
    return [result];
  }

  /* check fd is exists or not */
  if( !fd ){
    util.error( result, 'NO_FD', `must has fd, ${filePath}` );
    log.error( Error(), jsons([result]) );
    return [result];
  }

  /* check file is locked or not */
  let auth = namespaceTool.hasAuth( namespaceData, filePath, fd, timestamp, lockDuration );
  if( !auth ){
    util.error( result, 'NO_AUTH', `has no delete file authority, ${filePath}, ${fd}` );
    log.error( Error(), jsons([result]) );
    return [result];
  }

  /* handle namesapce */
  let tree = namespaceTool.clone(namespaceData, filePath);
  namespaceTool.delete(namespaceData, filePath);
  namespaceDeleteTool.add(namespaceDeleteData, filePath, timestamp, tree);

  /* handle file map to chunk */
  let chunkNameList = file2chunkTool.getChunkNameList(file2chunkData, filePath);
  file2chunkTool.delete(file2chunkData, filePath);
  file2chunkDeleteTool.add(file2chunkDeleteData, filePath, chunkNameList, timestamp);

  log.info( Error(), jsons( {namespaceData, namespaceDeleteData, file2chunkData, file2chunkDeleteData} ) );

  /* save operate log */
  let opType = 'df';
  operationLog.delete(timestamp, filePath, opType, recordPath);

  util.success( result );

  log.end( Error(), jsons([result]) );
  return [result];
// END
};
// PUBLIC_METHOD_END [deleteFile]


// PUBLIC_METHOD_START [getWriteServerList]
/**
 * get list of chunkserver to write
 * @namespaceData  {JSON}   tree of namespace, @example {"/usr":{"_type":"dir","_lock":{"r":[1601782516188],"w":[]},"/data":{"_type":"dir","_lock":{"r":[1601782516188],"w":[]},"/001":{"_type":"file","_replicaCount":3,"_lock":{"r":[],"w":[]}}}}}
 * @file2chunkData {JSON}   map data of filePath to chunkName, @example {"/usr/data/001":["aabbccdd"]}
 * @chunkData      {JSON}   base info of all chunk on local, @example {"aabbccdd":[1,10,"127.0.0.1:3001,1585471730177","127.0.0.1:3002,1585471730177","127.0.0.1:3003,1585471730177"]}
 * @serverData     {JSON}   data of server, @example {"127.0.0.1:3001":[12,1599033677924],"127.0.0.1:3002":[22,1599033664421],"127.0.0.1:3003":[18,1599033677924]}
 * @waitleaseData  {JSON}   waitting for chunkserver confirm lease, @example {}
 * @filePath       {String} file path of system, @example "/usr/data/001"
 * @fd             {Number} file describe as timestamp when file is opened, @example 1606961159937
 * @index          {Number} index of chunk, @example 0
 * @maxUseRate     {Number} max use rate, @example 80
 * @timestamp      {Number} time stamp, @example 1585471730178
 * @heartbeatTime  {Number} time of heartbeat, @example 60000
 * @chunkDeadTime  {Number} chunk is damage after the time, @example 7200000
 * @lockDuration   {Number} lock duration, @example 300000
 * @recordPath     {String} path of operate record, @example "C:\work\GFS2\AppData\master\operation.log"
 * @return         {Array}  Return value, @example [{"code":0,"msg":"","data":{"version":1,"primary":"127.0.0.1:3001","serverList":["127.0.0.1:3001","127.0.0.1:3002","127.0.0.1:3003"]}}]
 */
exports.getWriteServerList = async function( namespaceData, file2chunkData, chunkData, serverData, waitleaseData, filePath, fd, index, maxUseRate, timestamp, heartbeatTime, chunkDeadTime, lockDuration, recordPath ){
// START
  log.args( Error(), arguments );
  let result = {};
  let version, primary, serverList;

  /* check file is exists or not */
  if( !namespaceTool.hasPath(namespaceData, filePath) ){
    util.error( result, 'NOT_EXISTS', `filePath is not exists, ${filePath}` );
    log.error( Error(), jsons([result]) );
    return [result];
  }

  /* check fd is exists or not */
  if( !fd ){
    util.error( result, 'NO_FD', `must has fd, ${filePath}` );
    log.error( Error(), jsons([result]) );
    return [result];
  }

  /* check file is locked or not */
  let auth = namespaceTool.hasAuth( namespaceData, filePath, fd, timestamp, lockDuration );
  if( !auth ){
    util.error( result, 'NO_AUTH', `has no delete file authority, ${filePath}, ${fd} ` );
    log.error( Error(), jsons([result]) );
    return [result];
  }

  /* check range of index */
  let chunkName;
  let replicaCount = namespaceTool.getReplicaCount( namespaceData, filePath );
  let chunkCount = file2chunkTool.getCount( file2chunkData, filePath );

  /* index beyond range, error */
  if( index > chunkCount ){
    util.error( result, 'INDEX_OVERFLOW', `index is overflow, ${filePath}` );
    log.error( Error(), jsons([result]) );
    return [result];
  }
  /* write in new chunk */
  else if( index == chunkCount ){
    chunkName = chunkdataTool.getNewChunkName( chunkData );
    serverList = serverdataTool.getFree( serverData, maxUseRate, 1.5 * heartbeatTime, timestamp, [], replicaCount ); // 新选几台服务器
    primary = serverList[timestamp % replicaCount];
    version = 1;
    let isNew = 1;
    result = await lauchOrder.grantLease( waitleaseData, chunkName, serverList, primary, version, timestamp, isNew );

    // 结果正常，第一个请求者会被选定为执行者
    if( 0 === result.code && result.isRunner ){
      // B 将新块设置到全局变量中
      lauchOrder.setNewChunk( file2chunkData, chunkData, filePath, chunkName, serverList, primary, version, replicaCount, timestamp );
      result = operationLog.setVersion( timestamp, filePath, chunkName, version, recordPath );
      log.error( Error(), jsons([result]) );
      if(0 != result.code){ return [result]; }
    }
    else{
      log.error( Error(), jsons([result]) );
      return [result];
    }
  }
  /* write in existing chunk */
  else if( index < chunkCount ){
    chunkName = file2chunkTool.getByIndex( file2chunkData, filePath, index );

    // 5 检查chunkName状态是否OK
    let isGood = chunkdataTool.isGood( chunkData, chunkName, timestamp, chunkDeadTime );
    if( !isGood ){
      util.error( result, 'REPLICA_COUNT_LESS', `${filePath}, ${chunkName}` );
      log.error( Error(), jsons([result]) );
      return [result];
    }

    // 6 判断是否存在primary
    serverList = chunkdataTool.getServerList( chunkData, chunkName, heartbeatTime, timestamp );
    primary = chunkdataTool.getPrimary( chunkData, chunkName, heartbeatTime, timestamp );
    version = chunkdataTool.getVersion( chunkData, chunkName );

    if(!primary){
      // 预选primary
      primary = serverList[timestamp % replicaCount];
      version += 1;
      let isNew = 0;
      // 通知新候选pair和新的租约版本号，通知给所有副本
      result = await lauchOrder.grantLease( waitleaseData, chunkName, serverList, primary, version, timestamp, isNew );

      // 结果正常，并且被队列选定为执行者
      if( 0 === result.code && result.isRunner ){
        chunkdataTool.setPrimary( chunkData, chunkName, primary, timestamp );
        chunkdataTool.setVersion( chunkData, chunkName, version ); /* 写入内存 */
        result = operationLog.setVersion( timestamp, filePath, chunkName, version, recordPath ); /* 写入日志 */
        log.error( Error(), jsons([result]) );
        if(0 != result.code){ return [result]; }
      }
      else{
        log.error( Error(), jsons([result]) );
        return [result];
      }
    }
  }

  util.success( result, '', {chunkName, version, primary, serverList} );

  log.end( Error(), jsons([result]) );
  return [result];
// END
};
// PUBLIC_METHOD_END [getWriteServerList]


// PUBLIC_METHOD_START [getAppendServerList]
/**
 * get list of chunkserver to append
 * @namespaceData  {JSON}   tree of namespace, @example {"/usr":{"_type":"dir","_lock":{"r":[],"w":[]},"/data":{"_type":"dir","_lock":{"r":[],"w":[]},"/001":{"_type":"file","_replicaCount":3,"_lock":{"r":[],"w":[]}}}}}
 * @chunkData      {JSON}   base info of all chunk on local, @example {"aabbccdd":[1,10,"127.0.0.1:3001,1602211802871","127.0.0.1:3002,1602211802871","127.0.0.1:3003,1602211802871"]}
 * @chunkfullData  {JSON}   full filled of chunk, @example {}
 * @file2chunkData {JSON}   map data of filePath to chunkName, @example {"/usr/data/001":["aabbccdd"]}
 * @serverData     {JSON}   data of server, @example {"127.0.0.1:3001":[12,1602211802871],"127.0.0.1:3002":[22,1602211802871],"127.0.0.1:3003":[18,1602211802871]}
 * @waitleaseData  {JSON}   waitting for chunkserver confirm lease, @example {}
 * @filePath       {String} file path of system, @example "/usr/data/001"
 * @fd             {Number} file describe as timestamp when file is opened, @example 1606961159937
 * @maxUseRate     {Number} max use rate, @example 80
 * @timestamp      {Number} time stamp, @example 1602211802872
 * @heartbeatTime  {Number} time of heartbeat, @example 60000
 * @chunkDeadTime  {Number} chunk is damage after the time, @example 7200000
 * @lockDuration   {Number} lock duration, @example 300000
 * @recordPath     {String} path of operate record, @example "C:\work\GFS2\AppData\master\operation.log"
 * @return         {Array}  Return value, @example [{"code":0,"msg":"","data":{"version":1,"primary":"127.0.0.1:3001","serverList":["127.0.0.1:3001","127.0.0.1:3002","127.0.0.1:3003"]}}]
 */
exports.getAppendServerList = async function( namespaceData, chunkData, chunkfullData, file2chunkData, serverData, waitleaseData, filePath, fd, maxUseRate, timestamp, heartbeatTime, chunkDeadTime, lockDuration, recordPath ){
// START
  log.args( Error(), arguments );
  let result = {};

  // 1 判断文件是否存在
  if( !namespaceTool.hasPath( namespaceData, filePath ) ){
    util.error( result, 'NOT_EXISTS', `filePath is not exists, ${filePath}`);
    log.error( Error(), jsons([result]) );
    return [result];
  }

  /* check file is locked or not */
  let auth = namespaceTool.hasAuth( namespaceData, filePath, fd, timestamp, lockDuration );
  if( !auth ){
    util.error( result, 'NO_AUTH', `has no delete file authority, ${filePath}, ${fd} ` );
    log.error( Error(), jsons([result]) );
    return [result];
  }

  // 3 获取最后一个快
  let chunkName = file2chunkTool.getLastChunkName( file2chunkData, filePath );
  let replicaCount = chunkdataTool.getReplicaCount( chunkData, chunkName );
  let primary, serverList, version, isNew;

  // 4 判断最后块是否可以继续使用
  /* 块已满，无法继续使用，需要创建新块 */
  if( chunkfullTool.isFull( chunkfullData, chunkName ) ){
    // A 先选择块服务器，并选择primary，然后向块服务器推送块租约(因为是新块，所以块服务器也要创建块)
    chunkName = chunkdataTool.getNewChunkName( chunkData );
    serverList = serverdataTool.getFree( serverData, maxUseRate, 1.5 * heartbeatTime, timestamp, [], replicaCount ); // 新选几台服务器
    primary = serverList[timestamp % replicaCount];
    version = 1;
    isNew = 1;
    result = await lauchOrder.grantLease( waitleaseData, chunkName, serverList, primary, version, timestamp, isNew );

    // 结果正常，并且被队列选定为执行者
    if( 0 === result.code && result.isRunner ){
      // B 将新块设置到全局变量中
      lauchOrder.setNewChunk( file2chunkData, chunkData, filePath, chunkName, serverList, primary, version, replicaCount, timestamp );
      // C 写入操作日志
      result = operationLog.setVersion( timestamp, filePath, chunkName, version, recordPath );
      if (0 != result.code ){
        log.error( Error(), jsons([result]) );
        return [result];
      }
    }
    else{
      log.error( Error(), jsons([result]) );
      return [result];
    }
  }
  /* 块未满，可以继续使用 */
  else{
    // A 检查chunkName状态是否OK
    let isGood = chunkdataTool.isGood( chunkData, chunkName, timestamp, chunkDeadTime );
    if( !isGood ){
      util.error( result, 'REPLICA_COUNT_LESS', `${filePath}, ${chunkName}`);
      log.error( Error(), jsons([result]) );
      return [result];
    }

    serverList = chunkdataTool.getServerList( chunkData, chunkName );
    primary = chunkdataTool.getPrimary( chunkData, chunkName, heartbeatTime, timestamp );
    version = chunkdataTool.getVersion( chunkData, chunkName );

    // 没有primary
    if(!primary){
      // A 给块服务器分配新的租约
      primary = serverList[timestamp % replicaCount];
      version++;
      isNew = 0;
      result = await lauchOrder.grantLease( waitleaseData, chunkName, serverList, primary, version, timestamp, isNew );
      if(0 == result.code && result.isRunner){
        // B 更新Master租约数据
        chunkdataTool.setPrimary( chunkData, chunkName, primary, timestamp );
        chunkdataTool.setVersion( chunkData, chunkName, version );
        result = operationLog.setVersion( timestamp, filePath, chunkName, version, recordPath );
        if(0 != result.code){
          log.error( Error(), jsons([result]) );
          return [result];
        }
      }
      else{
        log.error( Error(), jsons([result]) );
        return [result];
      }
    }
  }

  util.success( result, 'success', {version, primary, serverList} );

  log.end( Error(), jsons([result]) );
  return [result];
// END
};
// PUBLIC_METHOD_END [getAppendServerList]


// PUBLIC_METHOD_START [getReadServerList]
/**
 * get list of chunkserver to read
 * @namespaceData  {JSON}   tree of namespace, @example {"/usr":{"_type":"dir","_lock":{},"/data":{"_type":"dir","_lock":{},"/001":{"_type":"file","_lock":{}}}}}
 * @file2chunkData {JSON}   map data of filePath to chunkName, @example {"/usr/data/001":["aabbccdd", "eeffgghh"]}
 * @chunkData      {JSON}   base info of all chunk on local, @example {"aabbccdd":[1,20,"127.0.0.1:3001,1600247712022","127.0.0.1:3002,1600247712022","127.0.0.1:3003,1600247712022,P"], "eeffgghh":[1,20,"127.0.0.1:3001,1600247712022","127.0.0.1:3002,1600247712022","127.0.0.1:3003,1600247712022,P"]}
 * @filePath       {String} file path of system, @example "/usr/data/001"
 * @fd             {Number} file describe as timestamp when file is opened, @example 1607151913750
 * @index          {Number} index of chunk, @example 1
 * @count          {String} count, @example "3"
 * @timestamp      {Number} time stamp, @example 1602211802872
 * @lockDuration   {Number} lock duration, @example 300000
 * @return         {Array}  Return value, @example [{"code":0,"data":{"3":{"chunkName":"aabbccdd","version":6,"serverList":["127.0.0.1:3001","127.0.0.1:3002","127.0.0.1:3003"]}},"msg":""}]
 */
exports.getReadServerList = async function( namespaceData, file2chunkData, chunkData, filePath, fd, index, count, timestamp, lockDuration ){
// START
  log.args( Error(), arguments );
  let result = {};

  // 1 判断文件是否存在
  if( !namespaceTool.hasPath( namespaceData, filePath ) ){
    util.error( result, 'NOT_EXISTS', `filePath is not exists, ${filePath}`);
    log.error( Error(), jsons([result]) );
    return [result];
  }

  /* check has operate authority or not */
  let auth = namespaceTool.hasAuth( namespaceData, filePath, fd, timestamp, lockDuration );
  if( !auth ){
    util.error( result, 'NO_AUTH', `has no read file authority, ${filePath}, ${fd} ` );
    log.error( Error(), jsons([result]) );
    return [result];
  }

  // 2 获取块名称列表
  log.debug( Error(), jsons({file2chunkData, filePath, index, count}) );
  let chunkNameList = file2chunkTool.getByIndexList( file2chunkData, filePath, index, count );
  if( !chunkNameList.length ){
    util.error( result, 'CHUNKS_EMPTY', `` );
    return [result];
  }

  // 3 根据块名从chunkData中找出块对应的server列表
  let chunks = [];
  for( const chunkName of chunkNameList ){
    if( chunkName ){
      let version = chunkdataTool.getVersion( chunkData, chunkName );
      let serverList = chunkdataTool.getServerList( chunkData, chunkName );
      chunks[chunks.length] = {chunkName, version, serverList};
    }
    else{
      chunks[chunks.length] = '';
    }
  }
  util.success( result, '', {chunks} );

  log.end( Error(), jsons([result]) );
  return [result];
// END
};
// PUBLIC_METHOD_END [getReadServerList]


// PUBLIC_METHOD_START [snapshot]
/**
 * run snapshot
 * @namespaceData {JSON}   tree of namespace, @example {"/usr/data/001":["aabbccdd"]}
 * @filePath      {String} file path of system, @example "/usr/data/1.txt"
 * @recordPath    {String} path of operate record, @example "C:\work\GFS2\AppData\master\namespace.rec"
 * @return        {Array}  返回值, @example [{"code":0}, ""]
 */
exports.snapshot = async function( namespaceData, filePath, recordPath ){
// START
  // let result = {}, res = {};

  // // 判断文件命名空间是否存在
  // if(!namespaceData[filePath]){
  //   [result.code, result.msg] = [-1, `Error: ${filePath} is not exists`];
  //   return [result];
  // }

  // // 判断文件是否加了快照锁
  // res = lockdataTool.isLock(lockData, filePath, 'snapshot');
  // [result.code, result.msg] = [res.code, res.msg];
  // if(0 != result.code) { return [result]; }

  // // 已经被加锁
  // if(res.data.isLock){
  //   [result.code, result.msg] = [-1, `${filePath} SNAPSHOT operation is Lock`];
  //   return [result];
  // }

  // // 对文件加全锁
  // lockdataTool.lockAll(lockData, filePath);

  // // 增加文件chunk块的引用计数
  // let chunkNameList = namespaceData[filePath];

  // // 保留快照操作记录
  // [res.code, res.msg] = operationLog.snapshot(filePath, recordPath);
  // [result.code, result.msg] = [res.code, res.msg];
  // if(0 != result.code){ return [result]; }

  // // 在命名空间中创建快照项
  // let {snapshotName} = res.data;
  // namespaceData[snapshotName] = Array.from(chunkNameList);

  // // 解除所有锁
  // lockdataTool.unlockAll(lockData, filePath);

  // return [result];
// END
};
// PUBLIC_METHOD_END [snapshot]


