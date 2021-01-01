
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Chunkserver
 * @copyright: liningftp@qq.com
 * @name: chunkversionFreeTool
 * @desc: manage free index in version file
 * @file: /metadata/tool/chunkversionFreeTool.js
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
 * @chunkversionFreeData {Array}  free position of chunkversion file, @example []
 * @freeIndex            {Number} index of free item, @example 1
 */
exports.add = function( chunkversionFreeData, freeIndex ){
// START
  log.args( Error(), arguments );

  if( !chunkversionFreeData.includes(freeIndex) ){
    chunkversionFreeData.push(freeIndex);
  }

  log.end( Error(), `${jsons(chunkversionFreeData)}` );
  return chunkversionFreeData;
// END
};
// PUBLIC_METHOD_END [add]


// PUBLIC_METHOD_START [delete]
/**
 * delete free index
 * @chunkversionFreeData {Array}  free position of chunkversion file, @example [2, 3]
 * @freeIndex            {Number} index of free item, @example 2
 */
exports.delete = function( chunkversionFreeData, freeIndex ){
// START
  log.args( Error(), arguments );

  let index = chunkversionFreeData.findIndex( index => index == freeIndex );

  if( -1 < index ){
    chunkversionFreeData.splice(index, 1);
  }

  log.end( Error(), `${jsons(chunkversionFreeData)}` );
  return chunkversionFreeData;
// END
};
// PUBLIC_METHOD_END [delete]


// PUBLIC_METHOD_START [getFreeIndex]
/**
 * get free index
 * @chunkversionFreeData {Array} free position of chunkversion file, @example [2, 3]
 */
exports.getFreeIndex = function( chunkversionFreeData ){
// START
  log.args( Error(), arguments );

  let index  = chunkversionFreeData[0];

  if( index == undefined ){
    index = -1;
  }

  log.end( Error(), `${jsons(index)}` );
  return index;
// END
};
// PUBLIC_METHOD_END [getFreeIndex]


