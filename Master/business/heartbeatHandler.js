
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Master
 * @copyright: liningftp@qq.com
 * @name: heartbeatHandler
 * @desc: handle heartbeat from chunkserver
 * @file: /business/heartbeatHandler.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START
const {util, clog, jsonlog, log, jsons} = require('../../base');

const {
  chunkdataTool,
  chunkrepairTool,
  file2chunkTool,
  namespaceTool,
  startupdataTool,
  serverdataTool
} = require('../metadata');

const repairCount = 1;
// END
// REQUIRE_END


// PUBLIC_METHOD_START [recvHeartbeat]
/**
 * receive heartbeat package
 * @chunkData       {JSON}   base info of all chunk on local, @example {"aabbccdd":["127.0.0.1:3001,30,1,1585579929367", "127.0.0.1:3002,30,1", "127.0.0.1:3003,30,1"],"eeffgghh":["127.0.0.1:3001,33,1,1585580705452", "127.0.0.1:3002,32,0", "127.0.0.1:3003,33,1"],"ooxxpppp":["127.0.0.1:3001,6,1,1585579929367", "127.0.0.1:3002,6,1", "127.0.0.1:3003,6,1"]}
 * @serverData      {JSON}   data of server, @example {"127.0.0.1:3001":[12,1599033406152],"127.0.0.1:3002":[22,1599033664421],"127.0.0.1:3003":[18,1599033677924]}
 * @chunkrepairData {JSON}   global data of error and loss chunk, @example {}
 * @startupData     {JSON}   data of Master startup, @example {"startTime": 1602228234877}
 * @pair            {String} chunkserver host and port, @example "127.0.0.1:3002"
 * @useRate         {Number} use rate of disk, @example 28
 * @collectList     {Array}  list of chunk heartbeat, @example ["aabbccdd,3", "eeffgghh,10"]
 * @errorList       {Array}  list of error chunk, @example ["eeffgghh"]
 * @leaseList       {Array}  list of primary to continue lease, @example ["aabbccdd"]
 * @startTime       {Number} start time of Master server, @example 1593947506381
 * @timestamp       {Number} time stamp, @example 1602295184323
 * @heartbeatTime   {Number} time of heartbeat, @example 60000
 * @chunkDeadTime   {Number} chunk is damage after the time, @example 86400000
 * @return          {Array}  返回值, @example [ {"code":0}, {"deleteList":[], "cloneList":[]} ]
 */
exports.recvHeartbeat = async function( chunkData, serverData, chunkrepairData, startupData, pair, useRate, collectList, errorList, leaseList, startTime, timestamp, heartbeatTime, chunkDeadTime ){
// START
  log.args( Error(), arguments );
  log.debug( Error(), jsons(`${pair} >> start`) );
  let result = {}, bigData;
  let deleteList = [];
  let cloneList = [];

  /* update or add chunkserver pair to serverData */
  if( serverdataTool.hasServer( serverData, pair ) ){
    serverdataTool.update( serverData, pair, useRate, timestamp );
  }
  else{
    serverdataTool.add( serverData, pair, useRate, timestamp );
  }

  /* handle collect */
  deleteList = exports._handleCollect( chunkData, chunkrepairData, startupData, collectList, pair, timestamp, heartbeatTime, chunkDeadTime );
  if( !deleteList.length ){
    /* get cloneList of other chunkserver */
    cloneList = exports._getCloneList( chunkData, chunkrepairData, repairCount, pair, useRate, timestamp, chunkDeadTime );

    /* set use time */
    if( cloneList.length ){
      let chunkNameList = cloneList.map( item => item.split(',')[0] );
      let targetPair = pair;
      chunkrepairTool.setRepairer( chunkrepairData, chunkNameList, targetPair, timestamp );
    }
  }

  /* handle error chunk */
  exports._handleError( chunkData, chunkrepairData, errorList, pair, timestamp, chunkDeadTime );

  /* renew lease */
  exports._handleLease( chunkData, leaseList, pair, timestamp );

  util.result( result, 0 );
  bigData = { cloneList, deleteList };

  log.info( Error(), jsons(`reponse -> ${pair}`) );
  log.end( Error(), jsons([result, bigData]) );
  log.debug( Error(), jsons(`${pair} << end`) );
  return [result, bigData];
// END
};
// PUBLIC_METHOD_END [recvHeartbeat]


// PUBLIC_METHOD_START [_getCloneList]
/**
 * get clone list of chunk
 * @chunkData       {JSON}   base info of all chunk on local, @example {"aabbccdd":["127.0.0.1:3001,30,1,1585579929367", "127.0.0.1:3002,30,1", "127.0.0.1:3003,30,1"],"eeffgghh":["127.0.0.1:3001,33,1,1585580705452", "127.0.0.1:3002,32,0", "127.0.0.1:3003,33,1"],"ooxxpppp":["127.0.0.1:3001,6,1,1585579929367", "127.0.0.1:3002,6,1", "127.0.0.1:3003,6,1"]}
 * @chunkrepairData {JSON}   global data of error and loss chunk, @example {}
 * @repairCount     {Number} how many loss or error chunk to repair, @example 1
 * @pair            {String} chunkserver host and port, @example "127.0.0.1:3001"
 * @useRate         {Number} use rate of disk, @example 25
 * @timestamp       {Number} time stamp, @example 1602295184323
 * @chunkDeadTime   {Number} chunk is damage after the time, @example 7200000
 */
exports._getCloneList = function( chunkData, chunkrepairData, repairCount, pair, useRate, timestamp, chunkDeadTime ){
// START
  log.args( Error(), arguments );
  let cloneList = [];

  // 为了减轻服务器克隆的负担，每台服务器每次只克隆1个块
  let taskCount = 1;
  let avgRate = 50;

  // 1 获取所有缺少服务器的块名称列表
  let targetPair = pair;
  let list = chunkrepairTool.getList( chunkrepairData, targetPair, repairCount, timestamp );

  // 只有磁盘使用率低于平均使用率，才可以获取克隆任务
  if( useRate < avgRate ){
    for( const chunkName of list ){
      // 要在不同的机器上执行克隆
      if( !chunkdataTool.hasPair( chunkData, chunkName, pair ) ){
        chunkdataTool.clearExpire( chunkData, chunkName, timestamp, chunkDeadTime );
        // 执行克隆前，再次确认块状态是否OK，如果是OK，则无需再克隆
        let isGood = chunkdataTool.isGood( chunkData, chunkName, timestamp, chunkDeadTime );
        if( !isGood ){
          let version = chunkdataTool.getVersion( chunkData, chunkName );
          let serverList = chunkdataTool.getServerList( chunkData, chunkName );
          cloneList.push(`${chunkName},${version},${serverList.join(',')}`);
        }
        // 只取指定数量的任务数
        if(taskCount === cloneList.length){
          break;
        }
      }
    }
  }

  log.end( Error(), jsons(cloneList) );
  return cloneList;
// END
};
// PUBLIC_METHOD_END [_getCloneList]


// PUBLIC_METHOD_START [_handleCollect]
/**
 * handle chunk of chunkserver collect
 * @chunkData       {JSON}   base info of all chunk on local, @example {"aabbccdd":[1,10,"127.0.0.1:3001,1585471730177","127.0.0.1:3002,1585471730177","127.0.0.1:3003,1585471730177"]}
 * @chunkrepairData {JSON}   global data of error and loss chunk, @example {}
 * @startupData     {JSON}   data of Master startup, @example {}
 * @collectList     {Array}  list of chunk heartbeat, @example ["aabbccdd,10", "eeffgghh,10"]
 * @pair            {String} chunkserver host and port, @example "127.0.0.1:3002"
 * @timestamp       {Number} time stamp, @example 1602340386329
 * @heartbeatTime   {Number} time of heartbeat, @example 60000
 * @chunkDeadTime   {Number} chunk is damage after the time, @example 7200000
 */
exports._handleCollect = function( chunkData, chunkrepairData, startupData, collectList, pair, timestamp, heartbeatTime, chunkDeadTime ){
// START
  log.args( Error(), arguments );
  let deleteList = [];

  for(const item of collectList){
    let [chunkName, version] = item.split(',');

    /* remove item repaired */
    if( chunkrepairTool.isRepairer( chunkrepairData, chunkName, pair) ){
      chunkrepairTool.delete( chunkrepairData, chunkName );
    }

    // Master启动后, chunkData中已包含整个系统所有的块名称, 所以只有存在于chunkData中才是合法的
    // chunkData中不存在的块，直接返回删除
    if( !chunkdataTool.has( chunkData, chunkName) ){
      deleteList.push( chunkName );
    }
    else{
      let mainVersion = chunkdataTool.getVersion( chunkData, chunkName );
      let isGood;
      let hasPair = chunkdataTool.hasPair( chunkData, chunkName, pair );
      let repairType;
      let srcPair;

      // 清理超时pair
      chunkdataTool.clearExpire( chunkData, chunkName, timestamp, chunkDeadTime );

      // 已有的pair
      if( hasPair ){
        if( version >= mainVersion ){
          chunkdataTool.updateTime( chunkData, chunkName, pair, timestamp ); /* 更新pair的时间戳 */
        }
        else{
          deleteList.push( chunkName );
          chunkdataTool.removePair( chunkData, chunkName, pair );
          repairType = 'error';
        }
      }
      // 陌生pair
      else{
        if( version >= mainVersion ){
          isGood = chunkdataTool.isGood( chunkData, chunkName, timestamp, chunkDeadTime );
          if( isGood ){
            deleteList.push( chunkName );
          }
          else{
            chunkdataTool.addPair( chunkData, chunkName, pair, timestamp );
          }
        }
        else{
          deleteList.push( chunkName );
        }
      }

      // 再次检查块状态
      isGood = chunkdataTool.isGood( chunkData, chunkName, timestamp, chunkDeadTime );
      if( !isGood ){
        let state = startupdataTool.getState( startupData, timestamp, heartbeatTime );
        if( 'work' === state ){
          repairType = repairType || 'loss';
          srcPair = ( 'error' == repairType ) ? pair : '';
          chunkrepairTool.add( chunkrepairData, repairType, srcPair, [chunkName], timestamp );
        }
      }
    }
  }

  log.end( Error(), jsons( deleteList ) );
  return deleteList;
// END
};
// PUBLIC_METHOD_END [_handleCollect]


// PUBLIC_METHOD_START [_handleError]
/**
 * handle error chunk
 * @chunkData       {JSON}   base info of all chunk on local, @example {"aabbccdd":[1,10,3,"127.0.0.1:3001,1585471730177","127.0.0.1:3002,1585471730177","127.0.0.1:3003,1585471730177"]}
 * @chunkrepairData {JSON}   global data of error and loss chunk, @example {}
 * @errorList       {Array}  list of error chunk, @example ["aabbccdd"]
 * @pair            {String} chunkserver host and port, @example "127.0.0.1:3002"
 * @timestamp       {Number} time stamp, @example 1585471730177
 * @chunkDeadTime   {Number} chunk is damage after the time, @example 7200000
 */
exports._handleError = function( chunkData, chunkrepairData, errorList, pair, timestamp, chunkDeadTime ){
// START
  log.args( Error(), arguments );
  for(const chunkName of errorList){
    if( chunkdataTool.has(chunkData, chunkName) ){
      chunkdataTool.removePair(chunkData, chunkName, pair);

      // 正常情况下，执行过removePair后，isGood必为false，这里为了逻辑严谨性，再进行一次检测
      let isGood = chunkdataTool.isGood(chunkData, chunkName, timestamp, chunkDeadTime);
      if( !isGood ){
        let repairType = 'error';
        chunkrepairTool.add( chunkrepairData, repairType, pair, [chunkName], timestamp );
      }
    }
  }

  log.end( Error(), jsons(chunkData) );
  return chunkData;
// END
};
// PUBLIC_METHOD_END [_handleError]


// PUBLIC_METHOD_START [_handleLease]
/**
 * handle renew lease
 * @chunkData     {JSON}   base info of all chunk on local, @example {"aabbccdd":[1,10,3,"127.0.0.1:3001,1585471730177","127.0.0.1:3002,1585471730177","127.0.0.1:3003,1585471730177"]}
 * @chunkNameList {Array}  list of chunkName, @example ["aabbccdd"]
 * @pair          {String} chunkserver host and port, @example "127.0.0.1:3001"
 * @timestamp     {Number} time stamp, @example 1602342236570
 */
exports._handleLease = function( chunkData, chunkNameList, pair, timestamp ){
// START
  log.args( Error(), arguments );
  for(const chunkName of chunkNameList){
    chunkdataTool.setPrimary(chunkData, chunkName, pair, timestamp);
  }

  log.end( Error(), jsons(chunkData) );
  return chunkData;
// END
};
// PUBLIC_METHOD_END [_handleLease]


