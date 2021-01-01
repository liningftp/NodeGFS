
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Master
 * @copyright: liningftp@qq.com
 * @name: chunkpairTool
 * @desc: repair loss and error chunk
 * @file: /metadata/tool/chunkrepairTool.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START
const {lodash, clog, log, jsons} = require('../../../base');

// waiting for targetRepair complete repair task, 90 seconds
const waitTime = 90000;
// END
// REQUIRE_END


// PUBLIC_METHOD_START [add]
/**
 * add loss or error chunk
 * @chunkrepairData {JSON}   global data of error and loss chunk, @example {}
 * @repairType      {String} loss or error chunk to repair, @example "loss"
 * @srcPair         {String} whick chukserver loss or error chunk from, @example "127.0.0.1:3001"
 * @chunkNameList   {Array}  list of chunkName, @example ["aabbccdd"]
 * @timestamp       {Number} time stamp, @example 1601130794448
 */
exports.add = function( chunkrepairData, repairType, srcPair, chunkNameList, timestamp ){
// START
  log.args( Error(), arguments );

  exports._clear( chunkrepairData, timestamp );

  for( const chunkName of chunkNameList ){
    if( !chunkrepairData.hasOwnProperty(chunkName) ){
      chunkrepairData[chunkName] = [ repairType, [srcPair, timestamp] ];
    }
  }

  log.end( Error(), jsons( chunkrepairData ) );
  return chunkrepairData;
// END
};
// PUBLIC_METHOD_END [add]


// PUBLIC_METHOD_START [delete]
/**
 * delete repairer
 * @chunkrepairData {JSON}   global data of error and loss chunk, @example {"aabbccdd":["loss",["127.0.0.1:3001",1601130794448], ["127.0.0.1:3002", 1601130794448]]}
 * @chunkName       {String} name of chunk, @example "aabbccdd"
 */
exports.delete = function( chunkrepairData, chunkName ){
// START
  log.args( Error(), arguments );

  delete chunkrepairData[chunkName];

  log.end( Error(), jsons( chunkrepairData ) );
  return chunkrepairData;
// END
};
// PUBLIC_METHOD_END [delete]


// PUBLIC_METHOD_START [getList]
/**
 * get list to repair
 * @chunkrepairData {JSON}   global data of error and loss chunk, @example {"aabbccdd":["error",["127.0.0.1:3001",1599701518196]]}
 * @targetPair      {String} which chunkserver to repair loss or error chunk, @example "127.0.0.1:3001"
 * @repairCount     {Number} how many loss or error chunk to repair, @example 1
 * @timestamp       {Number} time stamp, @example 1606443851845
 */
exports.getList = function( chunkrepairData, targetPair, repairCount, timestamp ){
// START
  log.args( Error(), arguments );

  let list = [];

  /* clear expire */
  exports._clear( chunkrepairData, timestamp );

  /* get chunkName from chunkpairData which is not repaired and its pair is not targetPair */
  for( const [chunkName, item] of Object.entries( chunkrepairData ) ){
    let [ repairType, [pair, joinTime], repairer ] = item;
    if( !repairer && pair != targetPair ){
      list.push( chunkName );
      if( repairCount == list.length ){
        break;
      }
    }
  }

  log.end( Error(), jsons( list ) );

  return list;
// END
};
// PUBLIC_METHOD_END [getList]


// PUBLIC_METHOD_START [setRepairer]
/**
 * set repairer
 * @chunkrepairData {JSON}   global data of error and loss chunk, @example {"aabbccdd":["loss",["127.0.0.1:3001",1601130794448]]}
 * @chunkNameList   {Array}  list of chunkName, @example ["aabbccdd", "eeffgghh"]
 * @targetPair      {String} which chunkserver to repair loss or error chunk, @example "127.0.0.1:3003"
 * @timestamp       {Number} time stamp, @example 1601131150047
 */
exports.setRepairer = function( chunkrepairData, chunkNameList, targetPair, timestamp ){
// START
  log.args( Error(), arguments );

  for( const chunkName of chunkNameList ){
    if( chunkrepairData.hasOwnProperty( chunkName ) ){
      let repairer = [targetPair, timestamp];
      chunkrepairData[chunkName][2] = repairer;
    }
  }

  log.end( Error(), jsons( chunkrepairData ) );
  return chunkrepairData;
// END
};
// PUBLIC_METHOD_END [setRepairer]


// PUBLIC_METHOD_START [isRepairer]
/**
 * is the repairer or not
 * @chunkrepairData {JSON}   global data of error and loss chunk, @example {"aabbccdd":["loss",["127.0.0.1:3001",1601130794448], ["127.0.0.1:3002", 1601130794448]]}
 * @chunkName       {String} name of chunk, @example "aabbccdd"
 * @targetPair      {String} which chunkserver to repair loss or error chunk, @example "127.0.0.1:3002"
 */
exports.isRepairer = function( chunkrepairData, chunkName, targetPair ){
// START
  log.args( Error(), arguments );

  let b;

  if( chunkrepairData.hasOwnProperty( chunkName ) ){
    let item = chunkrepairData[chunkName];
    let [ repairType, [pair, joinTime], repairer ] = item;

    if( repairer && repairer[0] == targetPair ){
      b = true;
    }
  }

  log.end( Error(), jsons( b ) );
  return b;
// END
};
// PUBLIC_METHOD_END [isRepairer]


// PUBLIC_METHOD_START [_clear]
/**
 * clear expire
 * @chunkrepairData {JSON}   global data of error and loss chunk, @example {"aabbccdd":["error",["127.0.0.1:3001",1599701518196] ]}
 * @timestamp       {Number} time stamp, @example 1603841772044
 */
exports._clear = function( chunkrepairData, timestamp ){
// START
  log.args( Error(), arguments );

  for( const [chunkName, items] of Object.entries( chunkrepairData ) ){
    // let [ repairType, [pair, joinTime], [targetPair, repairTime] ] = items;
    let repairItem = items[2];

    /* expire */
    if( repairItem ){
      let [targetPair, repairTime] = repairItem;
      if( repairTime + waitTime < timestamp ){
        delete chunkrepairData[chunkName];
      }
    }
  }

  log.end( Error(), jsons( chunkrepairData ) );
  return chunkrepairData;
// END
};
// PUBLIC_METHOD_END [_clear]


