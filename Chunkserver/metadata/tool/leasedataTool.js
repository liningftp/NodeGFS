
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Chunkserver
 * @copyright: liningftp@qq.com
 * @name: leasedataTool
 * @desc: manage primary lease
 * @file: /metadata/tool/leasedataTool.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START

// END
// REQUIRE_END


// PUBLIC_METHOD_START [setLease]
/**
 * set lease
 * @leaseData {JSON}   lease of primary chunk, @example {"aabbccdd":{"primary":1602576896653, "work":1}, "eeffgghh":{"primary":1602576896653, "work":0}}
 * @chunkName {String} name of chunk, @example "eeffgghh"
 * @timestamp {Number} current timestamp, @example 1602576896653
 */
exports.setLease = function( leaseData, chunkName, timestamp ){
// START
  leaseData[chunkName] = leaseData[chunkName] || {'primary':0, 'work':0};
  leaseData[chunkName]['primary'] = timestamp;

  return leaseData;
// END
};
// PUBLIC_METHOD_END [setLease]


// PUBLIC_METHOD_START [revokeLease]
/**
 * revoke lease
 * @leaseData {JSON}   lease of primary chunk, @example {"aabbccdd":{"primary":1602576896653, "work":1}, "eeffgghh":{"primary":1602576896653, "work":0}}
 * @chunkName {String} name of chunk, @example "aabbccdd"
 */
exports.revokeLease = function( leaseData, chunkName ){
// START
  if( leaseData.hasOwnProperty(chunkName) ){
    delete leaseData[chunkName];
  }

  return leaseData;
// END
};
// PUBLIC_METHOD_END [revokeLease]


// PUBLIC_METHOD_START [setWork]
/**
 * set work state
 * @leaseData {JSON}   lease of primary chunk, @example {"aabbccdd":{"primary":1602576896653, "work":1}, "eeffgghh":{"primary":1602576896653, "work":0}}
 * @chunkName {String} name of chunk, @example "eeffgghh"
 */
exports.setWork = function( leaseData, chunkName ){
// START
  if( leaseData.hasOwnProperty(chunkName) ){
    leaseData[chunkName]['work'] = 1;
  }

  return leaseData;
// END
};
// PUBLIC_METHOD_END [setWork]


// PUBLIC_METHOD_START [setFree]
/**
 * set free state
 * @leaseData {JSON}   lease of primary chunk, @example {"aabbccdd":{"primary":1602576896653, "work":1}, "eeffgghh":{"primary":1602576896653, "work":0}}
 * @chunkName {String} name of chunk, @example "aabbccdd"
 */
exports.setFree = function( leaseData, chunkName ){
// START
  if( leaseData.hasOwnProperty(chunkName) ){
    leaseData[chunkName]['work'] = 0;
  }

  return leaseData;
// END
};
// PUBLIC_METHOD_END [setFree]


// PUBLIC_METHOD_START [getRenewList]
/**
 * get list of  chunk will to renew lease
 * @leaseData {JSON}   lease of primary chunk, @example {"aabbccdd":{"primary":1602576896653, "work":1}, "eeffgghh":{"primary":1602576896653, "work":0}}
 * @duration  {Number} duration, @example 60000
 * @timestamp {Number} current timestamp, @example 1602576896653
 */
exports.getRenewList = function( leaseData, duration, timestamp ){
// START
  let list = [];

  for( const [chunkName, item] of Object.entries(leaseData) ){
    if(item.primary + duration < timestamp){
      delete leaseData[chunkName];
    }
    else if(item.work){
      list.push(chunkName);
    }
  }

  return list;
// END
};
// PUBLIC_METHOD_END [getRenewList]


