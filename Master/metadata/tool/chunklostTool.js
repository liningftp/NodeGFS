
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

// 执行修复后，等待90秒，如果还没有完成修复，则认为本次修复失效
const waitTime = 90000;

// END
// REQUIRE_END


// PUBLIC_METHOD_START [add]
/**
 * 添加丢失块信息，生成修复信息
 * @chunklostData {JSON}   replica of chunk is less, @example {}
 * @chunkNameList {Array}  list of chunkName, @example ["aabbccdd"]
 * @timestamp     {Number} time stamp, @example 1601130794448
 * @return        {JSON}   返回值, @example {}
 */
exports.add = function( chunklostData, chunkNameList, timestamp ){
// START
  log.args( Error(), arguments );

  // 清空OK数据或者超时的任务数据
  exports._clear( chunklostData, timestamp );

  // 处理lowList
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
 * 获取需要修复的块列表，先加入的排在前面
 * @chunklostData {JSON}   replica of chunk is less, @example {"aabbccdd":[1599701518196,1603841772044],"eeffgghh":[1603842910809,0],"ooxxkkmm":[1599701518196,0]}
 * @timestamp     {Number} time stamp, @example 1606443851845
 */
exports.getList = function( chunklostData, timestamp ){
// START
  log.args( Error(), arguments );

  let list = [];

  // 清空OK数据或者超时的任务数据
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
 * 设置时间戳
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
 * 清除丢失块修复信息中的OK和过时数据
 * @chunklostData {JSON}   replica of chunk is less, @example {"aabbccdd":[1599701518196,1603841772044],"eeffgghh":[1603842910809,0],"ooxxkkmm":[1599701518196,0]}
 * @timestamp     {Number} time stamp, @example 1603843484074
 * @return        {JSON}   返回值, @example {}
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


