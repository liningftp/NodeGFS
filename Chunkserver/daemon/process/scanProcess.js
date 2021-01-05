
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Chunkserver
 * @copyright: liningftp@qq.com
 * @name: scanProcess
 * @desc: scan chunk subprocess
 * @file: /daemon/process/scanProcess.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START
const {schedule, crc32, utilfs, clog, log, jsons} = require('../../../base');
const {checksumTool} = require('../../metadata');
const {chunkdataPersist} = require('../../store');

const restTime = 10000; // 3600000;
let chunkRoot, logPath;
let blockSize, maxChunkSize;

process.on('message', async (message) => {
  let {flag} = message;

  if('start' == flag){
    chunkRoot = message.chunkRoot;
    logPath = message.logPath;
    blockSize = message.blockSize;

    log.init( logPath );

    process.send({
      'flag': 'mainData'
    });
  }
  else if('mainData' == flag){
    let {checksumData} = message;

    let errorList = await exports._start(checksumData, chunkRoot, blockSize);

    process.send({
      'flag': 'errorList',
      'errorList': errorList
    });

    setTimeout( () => {
      process.send({
        'flag': 'mainData'
      });
    }, restTime);
  }

});
// END
// REQUIRE_END


// PUBLIC_METHOD_START [_start]
/**
 * start
 * @checksumData {Array}  checksumdata of all chunk on local, @example {"ab83e19265655130b208def31e0c483ecb835a24a9a7508eaec0df0e62e65870":[0, [2089148645]]}
 * @chunkRoot    {String} root directory where the chunk is stored, @example "C:\work\GFS2\AppData\chunkserver\chunk1"
 * @blockSize    {Number} block size for checksum, @example 65536
 */
exports._start = async function( checksumData, chunkRoot, blockSize ){
// START
  log.args( Error(), arguments );

  let errorList = [];

  for(const chunkName of Object.keys(checksumData) ){
    let result = chunkdataPersist.read(chunkRoot, chunkName);

    if(0 != result.code){
      if( 'NOT_EXISTS' == result.error ){
        errorList.push(chunkName);
      }
    }
    else{
      let contentData = result.data;
      let compareOK = checksumTool.compare(checksumData, chunkName, contentData, blockSize);
      if( !compareOK ){
        errorList.push(chunkName);
      }
    }
  }

  log.end( Error(), jsons( errorList ) );
  return errorList;
// END
};
// PUBLIC_METHOD_END [_start]


