
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Master
 * @copyright: liningftp@qq.com
 * @name: serverdataTool
 * @desc: manage chunkserver
 * @file: /metadata/tool/serverdataTool.js
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
 * add chunkserver
 * @serverData {JSON}   data of server, @example {"127.0.0.1:3001":[12,1599033406152],"127.0.0.1:3002":[22,1599033664421],"127.0.0.1:3003":[18,1599033677924]}
 * @pair       {String} chunkserver host and port, @example "127.0.0.1:3003"
 * @useRate    {Number} use rate of disk, @example 2
 * @timestamp  {Number} time stamp, @example 1600334079891
 */
exports.add = function( serverData, pair, useRate, timestamp ){
// START
  log.args( Error(), arguments );

  serverData[pair] = [useRate, timestamp];

  log.end( Error(), jsons(serverData) );
  return serverData;
// END
};
// PUBLIC_METHOD_END [add]


// PUBLIC_METHOD_START [hasServer]
/**
 * has chunkserver or not
 * @serverData {JSON}   data of server, @example {"127.0.0.1:3001":[12,1599033406152],"127.0.0.1:3002":[22,1599033664421],"127.0.0.1:3003":[18,1599033677924]}
 * @pair       {String} chunkserver host and port, @example "127.0.0.1:3003"
 */
exports.hasServer = function( serverData, pair ){
// START
  log.args( Error(), arguments );

  let b = serverData.hasOwnProperty(pair);

  log.end( Error(), jsons(b) );
  return b;
// END
};
// PUBLIC_METHOD_END [hasServer]


// PUBLIC_METHOD_START [update]
/**
 * update use rate or time
 * @serverData {JSON}   data of server, @example {"127.0.0.1:3001":[12,1599033406152],"127.0.0.1:3002":[22,1599033664421],"127.0.0.1:3003":[18,1599033677924]}
 * @pair       {String} chunkserver host and port, @example "127.0.0.1:3003"
 * @useRate    {Number} use rate of disk, @example 25
 * @timestamp  {Number} time stamp, @example 1600334079891
 */
exports.update = function( serverData, pair, useRate, timestamp ){
// START
  log.args( Error(), arguments );

  if( serverData.hasOwnProperty(pair) ){
    serverData[pair][0] = useRate;
    serverData[pair][1] = timestamp;
  }

  log.end( Error(), jsons(serverData) );
  return serverData;
// END
};
// PUBLIC_METHOD_END [update]


// PUBLIC_METHOD_START [getTime]
/**
 * get report time of chunkserver
 * @serverData {JSON}   data of server, @example {"127.0.0.1:3001":[12,1599033406152],"127.0.0.1:3002":[22,1599033664421],"127.0.0.1:3003":[18,1599033677924]}
 * @pair       {String} chunkserver host and port, @example "127.0.0.1:3003"
 */
exports.getTime = function( serverData, pair ){
// START
  log.args( Error(), arguments );

  let tm;

  if( serverData.hasOwnProperty(pair) ){
    tm = serverData[pair][1];
  }

  log.end( Error(), jsons(tm) );
  return tm;
// END
};
// PUBLIC_METHOD_END [getTime]


// PUBLIC_METHOD_START [getServerList]
/**
 * get list of all chunkserver
 * @serverData {JSON} data of server, @example {"127.0.0.1:3001":[12,1599033406152],"127.0.0.1:3002":[22,1599033664421],"127.0.0.1:3003":[18,1599033677924]}
 */
exports.getServerList = function( serverData ){
// START
  log.args( Error(), arguments );

  let serverList = Object.keys(serverData);

  log.end( Error(), jsons(serverList) );
  return serverList;
// END
};
// PUBLIC_METHOD_END [getServerList]


// PUBLIC_METHOD_START [getFree]
/**
 * get chunkservers if its use rate is low
 * @serverData   {JSON}   data of server, @example {"127.0.0.1:3001":[12,1599033406152],"127.0.0.1:3002":[22,1599033664421],"127.0.0.1:3003":[79,1599033677924]}
 * @maxUseRate   {Number} max use rate, @example 80
 * @maxAliveTime {Number} max alive time, @example 120000
 * @nowTime      {Number} current time, @example 1599033677924
 * @excludeList  {Array}  exclude pair list, @example ["127.0.0.1:3001", "127.0.0.1:3002"]
 * @count        {Number} count, @example 1
 * @return       {Array}  返回值, @example []
 */
exports.getFree = function( serverData, maxUseRate, maxAliveTime, nowTime, excludeList, count ){
// START
  log.args( Error(), arguments );

  excludeList = excludeList || [];

  // 筛选
  let arr = [];
  for( const [pair, item] of Object.entries(serverData) ){
    let [useRate, tm] = item;
    // 使用率较低，还在保活时间期内，主机没在黑名单
    if( useRate < maxUseRate && (tm + maxAliveTime > nowTime) && !excludeList.includes(pair) ){
      arr.push([pair, useRate]);
    }
  }

  // 排序，抽取100个进行排序(主要针对集群机器太多的情况进行简化)
  arr.sort( (v1, v2) => (v1[1] - v2[1]) );

  // 取前count个
  let list = arr.slice(0, count).map(v => v[0]);

  log.end( Error(), jsons(list) );
  return list;
// END
};
// PUBLIC_METHOD_END [getFree]


// PUBLIC_METHOD_START [isAlive]
/**
 * check chunkserver is alive or not
 * @serverData   {JSON}   data of server, @example {"127.0.0.1:3001":[12,1599033406152],"127.0.0.1:3002":[22,1599033664421],"127.0.0.1:3003":[79,1599033677924]}
 * @pair         {String} chunkserver host and port, @example "127.0.0.1:3002"
 * @maxAliveTime {Number} max alive time, @example 120000
 * @timestamp    {Number} time stamp, @example 1599033784420
 * @return       {Number} 返回值, @example 1
 */
exports.isAlive = function( serverData, pair, maxAliveTime, timestamp ){
// START
  log.args( Error(), arguments );

  let b;
  if( serverData.hasOwnProperty(pair) ){
    let [useRate, tm] = serverData[pair];
    b = (tm + maxAliveTime) > timestamp;
  }

  log.end( Error(), jsons(b) );
  return b;
// END
};
// PUBLIC_METHOD_END [isAlive]


// PUBLIC_METHOD_START [getExpireList]
/**
 * get list of server which report time is expired
 * @serverData   {JSON}   data of server, @example {"127.0.0.1:3001":[12,1599033406152],"127.0.0.1:3002":[22,1599033406152],"127.0.0.1:3003":[79,1599033677924]}
 * @maxAliveTime {Number} max alive time, @example 120000
 * @timestamp    {Number} time stamp, @example 1599033784420
 * @return       {Array}  返回值, @example ["127.0.0.1:3001"]
 */
exports.getExpireList = function( serverData, maxAliveTime, timestamp ){
// START
  log.args( Error(), arguments );

  let list = [];
  for( const [pair, item] of Object.entries(serverData) ){
    if( !exports.isAlive(serverData, pair, maxAliveTime, timestamp) ){
      list.push(pair);
    }
  }

  log.end( Error(), jsons(list) );
  return list;
// END
};
// PUBLIC_METHOD_END [getExpireList]


