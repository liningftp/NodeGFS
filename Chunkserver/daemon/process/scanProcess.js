
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

const restTime = 10000; // 3600000; // 两轮快扫描的时间间隔，1个小时
let chunkRoot, logPath;
let blockSize, maxChunkSize;

process.on('message', async (message) => {
  let {flag} = message;

  // 主线程发起的，启动命令
  if('start' == flag){
    chunkRoot = message.chunkRoot;
    logPath = message.logPath;
    blockSize = message.blockSize;

    log.init( logPath );

    // 请求一定范围内容校验和数据
    process.send({
      'flag': 'mainData'
    });
  }
  // 主线程返回的校验和数据
  else if('mainData' == flag){
    let {checksumData} = message;

    // 执行校验
    let errorList = await exports._start(checksumData, chunkRoot, blockSize);

    process.send({
      'flag': 'errorList',
      'errorList': errorList
    });

    // 上轮扫描完成后，等待1小时，再开启下一轮
    setTimeout( () => {
      // 请求一定范围内容校验和数据
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
      // 执行校验和检测
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


