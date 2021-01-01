
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Chunkserver
 * @copyright: liningftp@qq.com
 * @name: chunkversionTool
 * @desc: manage chunk version metadata
 * @file: /metadata/tool/chunkversionTool.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START
const {clog, log, jsons} = require('../../../base');
// END
// REQUIRE_END


// PUBLIC_METHOD_START [addChunk]
/**
 * add new chunk
 * @chunkversionData {JSON}   chunkversion of all chunk on local, @example {}
 * @chunkName        {String} name of chunk, @example "ab83e19265655130b208def31e0c483ecb835a24a9a7508eaec0df0e62e65870"
 * @version          {Number} version number, @example 3
 * @itemIndex        {Number} index of item, @example 1
 */
exports.addChunk = function( chunkversionData, chunkName, version, itemIndex ){
// START
  log.args( Error(), arguments );

  chunkversionData[chunkName] = [itemIndex, version];

  log.end( Error(), `${jsons(chunkversionData)}` );
  return chunkversionData;
// END
};
// PUBLIC_METHOD_END [addChunk]


// PUBLIC_METHOD_START [deleteChunk]
/**
 * delete chunk
 * @chunkversionData {JSON}   chunkversion of all chunk on local, @example {"aabbccdd":[1,12], "eeffgghh":[0, 20]}
 * @chunkName        {String} name of chunk, @example "aabbccdd"
 */
exports.deleteChunk = function( chunkversionData, chunkName ){
// START
  log.args( Error(), arguments );

  delete chunkversionData[chunkName];

  log.end( Error(), `${jsons(chunkversionData)}` );
  return chunkversionData;
// END
};
// PUBLIC_METHOD_END [deleteChunk]


// PUBLIC_METHOD_START [getVersion]
/**
 * get chunk version
 * @chunkversionData {JSON}   chunkversion of all chunk on local, @example {"aabbccdd":[1,12], "eeffgghh":[2, 20]}
 * @chunkName        {String} name of chunk, @example "aabbccdd"
 * @return           {Number} 返回值, @example 2
 */
exports.getVersion = function( chunkversionData, chunkName ){
// START
  log.args( Error(), arguments );

  let version;

  if( chunkversionData.hasOwnProperty(chunkName) ){
    version = chunkversionData[chunkName][1];
  }

  log.end( Error(), `${jsons(version)}` );
  return version;
// END
};
// PUBLIC_METHOD_END [getVersion]


// PUBLIC_METHOD_START [setVersion]
/**
 * set chunk version
 * @chunkversionData {JSON}   chunkversion of all chunk on local, @example {"aabbccdd":[1,12], "eeffgghh":[0, 20]}
 * @chunkName        {String} name of chunk, @example "aabbccdd"
 * @version          {Number} version number, @example 60
 */
exports.setVersion = function( chunkversionData, chunkName, version ){
// START
  log.args( Error(), arguments );

  let index = -1;

  if( chunkversionData.hasOwnProperty(chunkName) ){
    chunkversionData[chunkName][1] = version;
    index = chunkversionData[chunkName][0];
  }

  log.end( Error(), `${jsons(index)}` );
  return index;
// END
};
// PUBLIC_METHOD_END [setVersion]


// PUBLIC_METHOD_START [getCount]
/**
 * get chunk version count
 * @chunkversionData {JSON} chunkversion of all chunk on local, @example {"aabbccdd":[1,12], "eeffgghh":[0, 20]}
 */
exports.getCount = function( chunkversionData ){
// START
  log.args( Error(), arguments );

  let count = Object.keys(chunkversionData).length;

  log.end( Error(), `${jsons(count)}` );
  return count;
// END
};
// PUBLIC_METHOD_END [getCount]


// PUBLIC_METHOD_START [getChunkIndex]
/**
 * get chunk index
 * @chunkversionData {JSON}   chunkversion of all chunk on local, @example {"aabbccdd":[1,12], "eeffgghh":[0, 20]}
 * @chunkName        {String} name of chunk, @example "aabbccdd"
 */
exports.getChunkIndex = function( chunkversionData, chunkName ){
// START
  log.args( Error(), arguments );

  let chunkIndex  = -1;

  if( chunkversionData.hasOwnProperty(chunkName) ){
    chunkIndex = chunkversionData[chunkName][0];
  }

  log.end( Error(), `${jsons(chunkIndex)}` );
  return chunkIndex;
// END
};
// PUBLIC_METHOD_END [getChunkIndex]


