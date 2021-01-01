
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Chunkserver
 * @copyright: liningftp@qq.com
 * @name: chunkdataTool
 * @desc: manage chunk metadata
 * @file: /metadata/tool/chunkdataTool.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START
const {lodash, clog, log, jsons} = require('../../../base');

const MAX_REPORT_COUNT = 1024;
// END
// REQUIRE_END


// PUBLIC_METHOD_START [add]
/**
 * add chunk
 * @chunkData {JSON}   base info of all chunk on local, @example {}
 * @chunkName {String} name of chunk, @example "aabbccdd"
 * @size      {Number} size of content, @example 300
 */
exports.add = function( chunkData, chunkName, size ){
// START
  log.args( Error(), arguments );
  chunkData[chunkName] = [size, 0];

  log.end( Error(), jsons(chunkData) );
  return chunkData;
// END
};
// PUBLIC_METHOD_END [add]


// PUBLIC_METHOD_START [has]
/**
 * has chunk name or not
 * @chunkData {JSON}   base info of all chunk on local, @example {"aabbccdd":[306, 1602691021717]}
 * @chunkName {String} name of chunk, @example "aabbccdd"
 */
exports.has = function( chunkData, chunkName ){
// START
  log.args( Error(), arguments );

  let b = chunkData.hasOwnProperty(chunkName);

  log.end( Error(), jsons(b) );
  return b;
// END
};
// PUBLIC_METHOD_END [has]


// PUBLIC_METHOD_START [getSize]
/**
 * get chunk size
 * @chunkData {JSON}   base info of all chunk on local, @example {"aabbccdd":[306, 1602691021717]}
 * @chunkName {String} name of chunk, @example "aabbccdd"
 * @return    {Number} 返回值, @example 3
 */
exports.getSize = function( chunkData, chunkName ){
// START
  log.args( Error(), arguments );
  let size;

  if( chunkData.hasOwnProperty(chunkName) ){
    size = chunkData[chunkName][0];
  }

  log.end( Error(), jsons(size) );
  return size;
// END
};
// PUBLIC_METHOD_END [getSize]


// PUBLIC_METHOD_START [setSize]
/**
 * set chunk size
 * @chunkData {JSON}   base info of all chunk on local, @example {"aabbccdd":[306, 1602691021717]}
 * @chunkName {String} name of chunk, @example "aabbccdd"
 * @size      {Number} size of content, @example 1024
 */
exports.setSize = function( chunkData, chunkName, size ){
// START
  log.args( Error(), arguments );
  if( chunkData.hasOwnProperty(chunkName) ){
    chunkData[chunkName][0] = size;
  }

  log.end( Error(), jsons(chunkData) );
  return chunkData;
// END
};
// PUBLIC_METHOD_END [setSize]


// PUBLIC_METHOD_START [delete]
/**
 * delete chunk
 * @chunkData {JSON}   base info of all chunk on local, @example {"aabbccdd":[306, 1602691021717]}
 * @chunkName {String} name of chunk, @example "aabbccdd"
 */
exports.delete = function( chunkData, chunkName ){
// START
  log.args( Error(), arguments );
  delete chunkData[chunkName];

  log.end( Error(), jsons(chunkData) );
  return chunkData;
// END
};
// PUBLIC_METHOD_END [delete]


// PUBLIC_METHOD_START [setTime]
/**
 * set report time
 * @chunkData {JSON}   base info of all chunk on local, @example {"aabbccdd":[306, 1602691021717]}
 * @chunkName {String} name of chunk, @example "aabbccdd"
 * @timestamp {Number} current timestamp, @example 1602691122774
 */
exports.setTime = function( chunkData, chunkName, timestamp ){
// START
  log.args( Error(), arguments );
  if( chunkData[chunkName] ){
    chunkData[chunkName][1] = timestamp;
  }
  log.info( Error(), jsons(chunkData) );
// END
};
// PUBLIC_METHOD_END [setTime]


// PUBLIC_METHOD_START [getUseRate]
/**
 * get use rate of storage
 * @chunkData     {JSON}   base info of all chunk on local, @example {}
 * @maxChunkCount {Number} max chunk count of chunkserver, @example 16
 * @return        {Number} 返回值, @example 25
 */
exports.getUseRate = function( chunkData, maxChunkCount ){
// START
  log.args( Error(), arguments );
  let count = Object.keys(chunkData).length;
  let useRate = Math.ceil( count * 100 / maxChunkCount );

  log.end( Error(), jsons(useRate) );
  return useRate;
// END
};
// PUBLIC_METHOD_END [getUseRate]


// PUBLIC_METHOD_START [getReport]
/**
 * get chunk to report
 * @chunkData {JSON} base info of all chunk on local, @example {"aabbccdd":[306, 1602691021717], "eeffgghh":[1024, 1602720522884], "ooxxkkmm":[333, 0]}
 */
exports.getReport = function( chunkData ){
// START
  log.args( Error(), arguments );
  let items = Object.entries(chunkData);

  /* sort by last report time(can 0) asc */
  let list = lodash.sortBy(items, (item) => {
    return item[1][1];
  });
  log.info( Error(), jsons(list) );

  let data = list.slice(0, MAX_REPORT_COUNT).map(item => item[0]);

  log.end( Error(), jsons(data) );
  return data;
// END
};
// PUBLIC_METHOD_END [getReport]


