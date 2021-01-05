
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Master
 * @copyright: liningftp@qq.com
 * @name: chunkdataTool
 * @desc: chunkdata tool
 * @file: /metadata/tool/chunkdataTool.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START
const {util, clog, log, jsons} = require('../../../base');
// END
// REQUIRE_END


// PUBLIC_METHOD_START [add]
/**
 * add chunk in init
 * @chunkData    {JSON}   base info of all chunk on local, @example {}
 * @chunkName    {String} name of chunk, @example "aabbccdd"
 * @version      {Number} version number, @example 1
 * @replicaCount {Number} count of relipcas, @example 3
 * @serverList   {Array}  all server of chunk, @example ["127.0.0.1:3001", "127.0.0.1:3002", "127.0.0.1:3003"]
 * @timestamp    {Number} time stamp, @example 1602253824890
 */
exports.add = function( chunkData, chunkName, version, replicaCount, serverList, timestamp ){
// START
  log.args( Error(), arguments );
  if( !chunkData.hasOwnProperty(chunkName) ){
    chunkData[chunkName] = [1, version, replicaCount];
    if( serverList && serverList.length && timestamp ){
      let list = serverList.map(item => `${item},${timestamp}`);
      chunkData[chunkName].push(...list);
    }
  }
  log.end( Error(), jsons(chunkData) );
  return chunkData;
// END
};
// PUBLIC_METHOD_END [add]


// PUBLIC_METHOD_START [get]
/**
 * get chunk data
 * @chunkData {JSON}   base info of all chunk on local, @example {"aabbccdd":[1,10,"127.0.0.1:3001,1585471730177","127.0.0.1:3002,1585471730177","127.0.0.1:3003,1585471730177"]}
 * @chunkName {String} name of chunk, @example "aabbccdd"
 * @return    {Array}  return value, @example []
 */
exports.get = function( chunkData, chunkName ){
// START
  log.args( Error(), arguments );
  let item = chunkData[chunkName];
  log.end( Error(), jsons(item) );
  return item;
// END
};
// PUBLIC_METHOD_END [get]


// PUBLIC_METHOD_START [has]
/**
 * has chunkName or not
 * @chunkData {JSON}   base info of all chunk on local, @example {"aabbccdd":[1,10,"127.0.0.1:3001,1585471730177","127.0.0.1:3002,1585471730177","127.0.0.1:3003,1585471730177"]}
 * @chunkName {String} name of chunk, @example "aabbccdd"
 * @return    {Number} return value, @example 1
 */
exports.has = function( chunkData, chunkName ){
// START
  log.args( Error(), arguments );
  let b = chunkData.hasOwnProperty( chunkName );
  log.end( Error(), jsons(b) );
  return b;
// END
};
// PUBLIC_METHOD_END [has]


// PUBLIC_METHOD_START [delete]
/**
 * delete chunk
 * @chunkData     {JSON}  base info of all chunk on local, @example {"aabbccdd":[1,1,3,"127.0.0.1:3001,1602253824890","127.0.0.1:3002,1602253824890","127.0.0.1:3003,1602253824890"]}
 * @chunkNameList {Array} list of chunkName, @example ['aabbccdd']
 */
exports.delete = function( chunkData, chunkNameList ){
// START
  log.args( Error(), arguments );
  for(const chunkName of chunkNameList){
    delete chunkData[chunkName];
  }
  log.info( Error(), jsons(chunkData) );
// END
};
// PUBLIC_METHOD_END [delete]


// PUBLIC_METHOD_START [addPair]
/**
 * add pair to chunkdata
 * @chunkData {JSON}   base info of all chunk on local, @example {"aabbccdd":[1,1,3]}
 * @chunkName {String} name of chunk, @example "aabbccdd"
 * @pair      {String} chunkserver host and port, @example "127.0.0.1:3001"
 * @timestamp {Number} time stamp, @example 1600241484546
 */
exports.addPair = function( chunkData, chunkName, pair, timestamp ){
// START
  log.args( Error(), arguments );
  if( chunkData[chunkName] ){
    let index = exports.findPairIndex(chunkData, chunkName, pair);
    if( -1 < index){
      exports.updateTime(chunkData, chunkName, pair, timestamp);
    }
    else{
      chunkData[chunkName].push(`${pair},${timestamp}`);
    }
  }
  log.end( Error(), jsons(chunkData) );
  return chunkData;
// END
};
// PUBLIC_METHOD_END [addPair]


// PUBLIC_METHOD_START [hasPair]
/**
 * has pair or not
 * @chunkData {JSON}   base info of all chunk on local, @example {"aabbccdd":[1,1,3,"127.0.0.1:3001,1602253824890","127.0.0.1:3002,1602253824890","127.0.0.1:3003,1602253824890"]}
 * @chunkName {String} name of chunk, @example "aabbccdd"
 * @pair      {String} chunkserver host and port, @example "127.0.0.1:3002"
 * @return    {Number} return value, @example 1
 */
exports.hasPair = function( chunkData, chunkName, pair ){
// START
  log.args( Error(), arguments );
  let b = -1 < exports.findPairIndex(chunkData, chunkName, pair);

  log.end( Error(), jsons(b) );
  return b;
// END
};
// PUBLIC_METHOD_END [hasPair]


// PUBLIC_METHOD_START [removePair]
/**
 * remove pair from chunkdata
 * @chunkData {JSON}   base info of all chunk on local, @example {"aabbccdd":[1,10,3,"127.0.0.1:3001,1585471730177","127.0.0.1:3002,1585471730177","127.0.0.1:3003,1585471730177"]}
 * @chunkName {String} name of chunk, @example "aabbccdd"
 * @pair      {String} chunkserver host and port, @example "127.0.0.1:3002"
 */
exports.removePair = function( chunkData, chunkName, pair ){
// START
  log.args( Error(), arguments );
  let index = exports.findPairIndex(chunkData, chunkName, pair);
  if(-1 < index){
    chunkData[chunkName].splice(index, 1);
  }
  log.end( Error(), jsons(chunkData) );
  return chunkData;
// END
};
// PUBLIC_METHOD_END [removePair]


// PUBLIC_METHOD_START [clearExpire]
/**
 * clear expire chunk
 * @chunkData     {JSON}   base info of all chunk on local, @example {"ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b":[1,10,3,"127.0.0.1:3001,1606441373142","127.0.0.1:3002,1606289531449","127.0.0.1:3003,1606289531449"]}
 * @chunkName     {String} name of chunk, @example "ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b"
 * @timestamp     {Number} time stamp, @example 1606441373142
 * @chunkDeadTime {Number} chunk is damage after the time, @example 7200000
 */
exports.clearExpire = function( chunkData, chunkName, timestamp, chunkDeadTime ){
// START
  log.args( Error(), arguments );

  for( const [chunkName, list] of Object.entries(chunkData) ){
    for(let i = list.length - 1; 3 <= i; i--){
      let [pair, tm] = list[i].split(',');
      tm = parseInt(tm);
      if( tm + chunkDeadTime <= timestamp ){
        list.splice(i, 1);
      }
    }
  }

  log.end( Error(), jsons(chunkData) );
  return chunkData;
// END
};
// PUBLIC_METHOD_END [clearExpire]


// PUBLIC_METHOD_START [findPairIndex]
/**
 * find pair
 * @chunkData {JSON}   base info of all chunk on local, @example {"aabbccdd":[1,10,3,"127.0.0.1:3001,1585471730177","127.0.0.1:3002,1585471730177","127.0.0.1:3003,1585471730177"]}
 * @chunkName {String} name of chunk, @example "aabbccdd"
 * @pair      {String} chunkserver host and port, @example "127.0.0.1:3002"
 * @return    {Number} return value, @example 1
 */
exports.findPairIndex = function( chunkData, chunkName, pair ){
// START
  log.args( Error(), arguments );
  let index = -1;

  if(chunkData[chunkName]){
    index = chunkData[chunkName].findIndex(item => String(item).trim().startsWith(pair.trim()));
  }

  log.end( Error(), jsons(index) );
  return index;
// END
};
// PUBLIC_METHOD_END [findPairIndex]


// PUBLIC_METHOD_START [getVersion]
/**
 * get chunk version
 * @chunkData {JSON}   base info of all chunk on local, @example {"aabbccdd":[1,2,3,"127.0.0.1:3001,1585471730177","127.0.0.1:3002,1585471730177","127.0.0.1:3003,1585471730177"]}
 * @chunkName {String} name of chunk, @example "aabbccdd"
 * @return    {Number} return value, @example 2
 */
exports.getVersion = function( chunkData, chunkName ){
// START
  log.args( Error(), arguments );
  let version;
  if( chunkData.hasOwnProperty(chunkName) ){
    version = chunkData[chunkName][1];
  }
  log.end( Error(), jsons(version) );
  return version;
// END
};
// PUBLIC_METHOD_END [getVersion]


// PUBLIC_METHOD_START [setVersion]
/**
 * set chunk version
 * @chunkData {JSON}   base info of all chunk on local, @example {"aabbccdd":[1,2,3,"127.0.0.1:3001,1585471730177","127.0.0.1:3002,1585471730177","127.0.0.1:3003,1585471730177"]}
 * @chunkName {String} name of chunk, @example "aabbccdd"
 * @version   {Number} version number, @example 11
 */
exports.setVersion = function( chunkData, chunkName, version ){
// START
  log.args( Error(), arguments );
  if( chunkData.hasOwnProperty(chunkName) ){
    let [referCount, maxVer] = chunkData[chunkName];
    if(maxVer < version){
      chunkData[chunkName][1] = version;
    }
  }
  log.end( Error(), jsons(chunkData) );
// END
};
// PUBLIC_METHOD_END [setVersion]


// PUBLIC_METHOD_START [checkVersion]
/**
 * check version
 * @chunkData {JSON}   base info of all chunk on local, @example {"aabbccdd":[1,10,3,"127.0.0.1:3001,1585471730177","127.0.0.1:3002,1585471730177","127.0.0.1:3003,1585471730177"]}
 * @chunkName {String} name of chunk, @example "aabbccdd"
 * @version   {Number} version number, @example 10
 */
exports.checkVersion = function( chunkData, chunkName, version ){
// START
  log.args( Error(), arguments );
  let b;
  if( chunkData.hasOwnProperty(chunkName) ){
    let ver = chunkData[chunkName][1];
    b = (ver == version);
  }
  log.end( Error(), jsons(b) );
  return b;
// END
};
// PUBLIC_METHOD_END [checkVersion]


// PUBLIC_METHOD_START [getNewChunkName]
/**
 * create unique chunk name
 * @chunkData {JSON}   base info of all chunk on local, @example {"aabbccdd":[1,2,3,"127.0.0.1:3001,1585471730177","127.0.0.1:3002,1585471730177","127.0.0.1:3003,1585471730177"]}
 * @return    {String} return value, @example aabbccdd
 */
exports.getNewChunkName = function( chunkData ){
// START
  log.args( Error(), arguments );
  let chunkName;

  while(!chunkName){
    let name = util.getUUID();
    if(!chunkData.hasOwnProperty(name)){
      chunkName = name;
    }
  }

  log.end( Error(), jsons(chunkName) );
  return chunkName;
// END
};
// PUBLIC_METHOD_END [getNewChunkName]


// PUBLIC_METHOD_START [addReferCount]
/**
 * add chunk refer count
 * @chunkData {JSON}   base info of all chunk on local, @example {"aabbccdd":[1,20,3,"127.0.0.1:3001,20,P,1585471730177","127.0.0.1:3002,20","127.0.0.1:3003,20"]}
 * @chunkName {String} name of chunk, @example "aabbccdd"
 */
exports.addReferCount = function( chunkData, chunkName ){
// START
  log.args( Error(), arguments );
  if(chunkData.hasOwnProperty(chunkName)){
    chunkData[chunkName][0]++;
  }
  log.end( Error(), jsons(chunkData) );
  return chunkData;
// END
};
// PUBLIC_METHOD_END [addReferCount]


// PUBLIC_METHOD_START [subReferCount]
/**
 * reduce chunk refer count
 * @chunkData {JSON}   base info of all chunk on local, @example {"aabbccdd":[1,20,3,"127.0.0.1:3001,20,P,1585471730177","127.0.0.1:3002,20","127.0.0.1:3003,20"]}
 * @chunkName {String} name of chunk, @example "aabbccdd"
 */
exports.subReferCount = function( chunkData, chunkName ){
// START
  log.args( Error(), arguments );
  if(chunkData.hasOwnProperty(chunkName)){
    chunkData[chunkName][0]--;
  }
  log.end( Error(), jsons(chunkData) );
  return chunkData;
// END
};
// PUBLIC_METHOD_END [subReferCount]


// PUBLIC_METHOD_START [getPrimary]
/**
 * get primary chunk
 * @chunkData {JSON}   base info of all chunk on local, @example {"aabbccdd":[1,20,3,"127.0.0.1:3001,1600247712022,P","127.0.0.1:3002,1600247712022","127.0.0.1:3003,1600247712022"]}
 * @chunkName {String} name of chunk, @example "aabbccdd"
 * @leaseTime {Number} time of lease, @example 60000
 * @timestamp {Number} time stamp, @example 1600247712022
 * @return    {String} return value, @example 127.0.0.1:3001
 */
exports.getPrimary = function( chunkData, chunkName, leaseTime, timestamp ){
// START
  log.args( Error(), arguments );
  [leaseTime, timestamp] = [parseInt(leaseTime), parseInt(timestamp)];

  let primary;
  let maxVer = chunkData[chunkName][1];
  let [...list] = chunkData[chunkName].slice(3);

  let index = list.findIndex(item => /,P$/i.test(item));

  if(-1 < index){
    let [pair, tm] = list[index].split(',');
    tm = parseInt(tm);
    if(tm + leaseTime > timestamp){
      primary = pair;
    }
  }
  log.end( Error(), jsons(primary) );
  return primary;
// END
};
// PUBLIC_METHOD_END [getPrimary]


// PUBLIC_METHOD_START [setPrimary]
/**
 * set primary chunk
 * @chunkData {JSON}   base info of all chunk on local, @example {"aabbccdd":[1,20,3,"127.0.0.1:3001,1598516343990","127.0.0.1:3002,1600247712022","127.0.0.1:3003,1598516343990,P"]}
 * @chunkName {String} name of chunk, @example "aabbccdd"
 * @pair      {String} chunkserver host and port, @example "127.0.0.1:3002"
 * @timestamp {Number} time stamp, @example 1601341184732
 */
exports.setPrimary = function( chunkData, chunkName, pair, timestamp ){
// START
  log.args( Error(), arguments );
  if( chunkData.hasOwnProperty(chunkName) ){

    chunkData[chunkName] = chunkData[chunkName] || [];

    let list = chunkData[chunkName].slice(3);

    for(let i = 0; i < list.length; i++){
      let item = list[i];
      let arr = item.split(',');
      let [p, tm] = arr;
      arr.length = 2;
      if( p.trim() === pair ){
        arr[1] = timestamp;
        arr[2] = 'P';
      }
      list[i] = arr.join(',');
    }

    chunkData[chunkName].length = 3;
    chunkData[chunkName].splice(3, 0, ...list);

    log.end( Error(), jsons(chunkData) );
    return chunkData;
  }
  end.end( Error(), jsons('void') );
// END
};
// PUBLIC_METHOD_END [setPrimary]


// PUBLIC_METHOD_START [updateTime]
/**
 * update report time of pair
 * @chunkData {JSON}   base info of all chunk on local, @example {"aabbccdd":[1,10,3]}
 * @chunkName {String} name of chunk, @example "aabbccdd"
 * @pair      {String} chunkserver host and port, @example "127.0.0.1:3003"
 * @timestamp {Number} time stamp, @example 1602323111556
 */
exports.updateTime = function( chunkData, chunkName, pair, timestamp ){
// START
  log.args( Error(), arguments );
  let index = exports.findPairIndex(chunkData, chunkName, pair);
  if( -1 < index ){
    let [_pair, tm, ...more] = chunkData[chunkName][index].split(',');
    chunkData[chunkName][index] = [_pair, timestamp, ...more].join(',');
  }
  log.end( Error(), jsons(chunkData) );
  return chunkData;
// END
};
// PUBLIC_METHOD_END [updateTime]


// PUBLIC_METHOD_START [getReplicaCount]
/**
 * get replica count
 * @chunkData {JSON}   base info of all chunk on local, @example {"aabbccdd":[1,20,3,"127.0.0.1:3001,1598516343990","127.0.0.1:3002,1600247712022","127.0.0.1:3003,1598516343990,P"]}
 * @chunkName {String} name of chunk, @example "aabbccdd"
 * @return    {Number} return value, @example 3
 */
exports.getReplicaCount = function( chunkData, chunkName ){
// START
  log.args( Error(), arguments );
  let replicaCount;

  if( chunkData.hasOwnProperty(chunkName) ){
    replicaCount = chunkData[chunkName][2];
  }

  log.end( Error(), jsons(replicaCount) );
  return replicaCount;
// END
};
// PUBLIC_METHOD_END [getReplicaCount]


// PUBLIC_METHOD_START [getServerList]
/**
 * get servers of chunk
 * @chunkData {JSON}   base info of all chunk on local, @example {"aabbccdd":[1,10,3,"127.0.0.1:3001,1585471730177","127.0.0.1:3002,1585471730177","127.0.0.1:3003,1585471730177"]}
 * @chunkName {String} name of chunk, @example "aabbccdd"
 * @return    {Array}  return value, @example []
 */
exports.getServerList = function( chunkData, chunkName ){
// START
  log.args( Error(), arguments );
  let list = chunkData[chunkName].slice(3);

  let _list = Object.assign( [], list.map(item => item.split(',')[0]) );

  log.end( Error(), jsons(_list) );
  return _list;
// END
};
// PUBLIC_METHOD_END [getServerList]


// PUBLIC_METHOD_START [isGood]
/**
 * check chunk is good or not
 * @chunkData     {JSON}   base info of all chunk on local, @example {"aabbccdd":[1,2,3,"127.0.0.1:3001,1600241484545","127.0.0.1:3002,1600241484545","127.0.0.1:3003,1600241484545"]}
 * @chunkName     {String} name of chunk, @example "aabbccdd"
 * @timestamp     {Number} time stamp, @example 1600241484545
 * @chunkDeadTime {Number} chunk is damage after the time, @example 7200000
 */
exports.isGood = function( chunkData, chunkName, timestamp, chunkDeadTime ){
// START
  log.args( Error(), arguments );
  let good = [];

  let replicaCount = chunkData[chunkName][2];

  if( chunkData.hasOwnProperty(chunkName) ){

    let list = chunkData[chunkName].slice(3);

    for(const item of list){
      let [pair, tm] = item.split(',');
      tm = parseInt(tm);
      if( tm + chunkDeadTime > timestamp ){
        good.push(pair);
      }
    }
  }

  let b =  good.length >= replicaCount;

  log.end( Error(), jsons(b) );
  return b;
// END
};
// PUBLIC_METHOD_END [isGood]


