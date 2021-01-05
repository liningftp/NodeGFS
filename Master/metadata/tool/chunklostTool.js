
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Master
 * @copyright: liningftp@qq.com
 * @name: chunklostTool
 * @desc: chunklost manage tool
 * @file: /metadata/tool/chunklostTool.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START
const {lodash, clog, log, jsons} = require('../../../base');
const chunkdataTool = require('./chunkdataTool.js');
const serverdataTool = require('./serverdataTool.js');

const waitTime = 90000;

// END
// REQUIRE_END


// PUBLIC_METHOD_START [add]
/**
 * add chunk is lost
 * @chunklostData {JSON}   replica of chunk is less, @example {}
 * @chunkNameList {Array}  list of chunkName, @example ["aabbccdd"]
 * @timestamp     {Number} time stamp, @example 1601130794448
 * @return        {JSON}   return value, @example {}
 */
exports.add = function( chunklostData, chunkNameList, timestamp ){
// START
  log.args( Error(), arguments );

  exports._clear( chunklostData, timestamp );

  for(const chunkName of chunkNameList){
    if( !chunklostData.hasOwnProperty( chunkName ) ){
      chunklostData[chunkName] = [timestamp, 0];
    }
  }

  log.end( Error(), jsons( chunklostData ) );
  return chunklostData;
// END
};
// PUBLIC_METHOD_END [add]


// PUBLIC_METHOD_START [getList]
/**
 * get list which will be repaired, early is in top
 * @chunklostData {JSON}   replica of chunk is less, @example {"aabbccdd":[1599701518196,1603841772044],"eeffgghh":[1603842910809,0],"ooxxkkmm":[1599701518196,0]}
 * @timestamp     {Number} time stamp, @example 1606443851845
 */
exports.getList = function( chunklostData, timestamp ){
// START
  log.args( Error(), arguments );

  let list = [];

  exports._clear( chunklostData, timestamp );

  for( const item of Object.entries( chunklostData ) ){
    let [chunkName, [joinTime, repairTime]] = item;
    if( 0 === repairTime ){
      list.push([chunkName, joinTime]);
    }
  }

  /* sort by join time */
  let data = lodash
    .sortBy( list, (item) => {
      return item[1];
    } )
    .map( item => item[0] );

  log.end( Error(), jsons( data ) );
  return data;
// END
};
// PUBLIC_METHOD_END [getList]


// PUBLIC_METHOD_START [setTime]
/**
 * set time stamp
 * @chunklostData {JSON}   replica of chunk is less, @example {"aabbccdd":[1599701518196,0],"eeffgghh":[1603842910809,0],"ooxxkkmm":[1599701518196,0]}
 * @chunkNameList {Array}  list of chunkName, @example ["aabbccdd", "eeffgghh"]
 * @timestamp     {Number} time stamp, @example 1601131150047
 */
exports.setTime = function( chunklostData, chunkNameList, timestamp ){
// START
  log.args( Error(), arguments );

  for( const chunkName of chunkNameList ){
    chunklostData[chunkName][1] = timestamp;
  }

  log.end( Error(), jsons( chunklostData ) );
  return chunklostData;
// END
};
// PUBLIC_METHOD_END [setTime]


// PUBLIC_METHOD_START [_clear]
/**
 * clear chunk whick is repaired or expired
 * @chunklostData {JSON}   replica of chunk is less, @example {"aabbccdd":[1599701518196,1603841772044],"eeffgghh":[1603842910809,0],"ooxxkkmm":[1599701518196,0]}
 * @timestamp     {Number} time stamp, @example 1603843484074
 * @return        {JSON}   return value, @example {}
 */
exports._clear = function( chunklostData, timestamp ){
// START
  log.args( Error(), arguments );

  for( const [chunkName, [joinTime, repairTime]] of Object.entries( chunklostData ) ){
    /* expire */
    if( joinTime + waitTime < timestamp ){
      delete chunklostData[chunkName];
    }
  }

  log.end( Error(), jsons( chunklostData ) );
  return chunklostData;
// END
};
// PUBLIC_METHOD_END [_clear]


