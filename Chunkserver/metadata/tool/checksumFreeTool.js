
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Chunkserver
 * @copyright: liningftp@qq.com
 * @name: checksumFreeTool
 * @desc: manage free position of checksum in disk
 * @file: /metadata/tool/checksumFreeTool.js
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
 * add free index
 * @checksumFreeData {Array}  free position of checksum file, @example []
 * @freeIndex        {Number} index of free item, @example 1
 */
exports.add = function( checksumFreeData, freeIndex ){
// START
  log.args( Error(), arguments );

  if( !checksumFreeData.includes(freeIndex) ){
    checksumFreeData.push(freeIndex);
  }

  log.end( Error(), `${jsons(checksumFreeData)}` );
  return checksumFreeData;
// END
};
// PUBLIC_METHOD_END [add]


// PUBLIC_METHOD_START [delete]
/**
 * delete free index
 * @checksumFreeData {Array}  free position of checksum file, @example [2, 3]
 * @freeIndex        {Number} index of free item, @example 2
 */
exports.delete = function( checksumFreeData, freeIndex ){
// START
  log.args( Error(), arguments );

  let index = checksumFreeData.findIndex( index => index == freeIndex );

  if( -1 < index ){
    checksumFreeData.splice(index, 1);
  }

  log.end( Error(), `${jsons(checksumFreeData)}` );
  return checksumFreeData;
// END
};
// PUBLIC_METHOD_END [delete]


// PUBLIC_METHOD_START [getFreeIndex]
/**
 * get free index
 * @checksumFreeData {Array} free position of checksum file, @example [2, 3]
 */
exports.getFreeIndex = function( checksumFreeData ){
// START
  log.args( Error(), arguments );

  let index  = checksumFreeData[0];

  if( index == undefined ){
    index = -1;
  }

  log.end( Error(), `${jsons(index)}` );
  return index;
// END
};
// PUBLIC_METHOD_END [getFreeIndex]


