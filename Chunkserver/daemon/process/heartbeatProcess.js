
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Chunkserver
 * @copyright: liningftp@qq.com
 * @name: heartbeatProcess
 * @desc: heartbeat subprocess
 * @file: /daemon/process/heartbeatProcess.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START
const {schedule, comm, clog, log, jsonlog, jsons} = require('../../../base');
const {masterAPI} = require('../../callapi');

let scheduleRule = new schedule.RecurrenceRule();
// scheduleRule.second = [1,6,11,16,21,26,31,36,41,46,51,56];
// scheduleRule.second = [1,16,31,46];
const rt = Math.floor( Math.random() * 60 );
scheduleRule.second = [ rt ];
clog( rt );
// scheduleRule.minute = [1,6,11,16,21,26,31,36,41,46,51,56];
// scheduleRule.hour = [1,5,9,13,17,21];

let logPath;
let state = 'START'; // 'PAUSE', 'RESTART'

// 绑定主线程通讯接口
process.on('message', (message) => {
  let {flag} = message;

  // 主线程触发启动
  if('init' == flag){

    logPath = message.logPath;

    log.init( logPath );

    // 启动crontab
    schedule.scheduleJob(scheduleRule, () => {
      // 当侦测到Master重启过，则停止心跳上报，主进程将块信息重新上报后，再发来继续心跳上报命令
      if('START' == state){
        // 向主进程请求上报数据
        process.send({
          'flag': 'mainData',
        });
      }
    });
  }
  else if('RESTART' == flag){
    state = 'START';
  }
  // 主线程返回需要上报到Master的数据
  else if('mainData' == flag){
    let {
      collectList,
      leaseList,
      errorList,
      useRate,
      startTime,
      masterHost,
      masterPort,
      localHost,
      localPort
    } = message;

    // 执行上报逻辑，关键：向主线程和子线程请求的数据，没有返回也没关系，待下次上报时肯定又返回，这些都是非紧急数据，延迟一个上报周期也无妨
    exports._start(collectList, errorList, leaseList, useRate, startTime, masterHost, masterPort, localHost, localPort);
  }
});

// END
// REQUIRE_END


// PUBLIC_METHOD_START [_start]
/**
 * start
 * @collectList {Array}  list of chunk heartbeat, @example ["aabbccdd,2", "eeffgghh,1"]
 * @errorList   {Array}  list of error chunk, @example ["eeffgghh"]
 * @leaseList   {Array}  list of primary to continue lease, @example ["aabbccdd"]
 * @useRate     {Number} use rate of disk, @example 25
 * @startTime   {Number} start time of Master server, @example 1602671114309
 * @masterHost  {String} host of Master server, @example "127.0.0.1"
 * @masterPort  {Number} port of Master server, @example 3000
 * @localHost   {String} local host ip, @example "127.0.0.1"
 * @localPort   {Number} local port, @example 3001
 */
exports._start = async function( collectList, errorList, leaseList, useRate, startTime, masterHost, masterPort, localHost, localPort ){
// START
  log.args( Error(), arguments );

  let result = {}, bigData;

  // Chunkserver刚启动时，startTime没有来及传递过来，所以不进行心跳上报
  if( !startTime ){
    log.end( Error(), jsons('have no startTime, waiting  for master response') );
    return;
  }

  clog( '------------------------------>' );
  clog( {localHost, localPort, collectList, errorList} );
  clog( Date.now() );
  clog( '---' );

  log.warn( Error(), jsons( ` ${localHost}:${localPort} >> start`  ) );

  [result, bigData] = await masterAPI.reportHeatbeat( collectList, leaseList, errorList, useRate, startTime, masterHost, masterPort, localHost, localPort );

  log.warn( Error(), jsons( ` ${localHost}:${localPort} << end`  ) );

  log.info( Error(), `${jsons([result, bigData])}` );

  clog( Date.now() );
  clog( {result} );
  if( bigData ){
    clog( JSON.parse(bigData.toString()) );
  }
  clog( '------------------------------<' );

  // 检验Master服务器是否重启过
  if( 0 != result.code ){
    if('MASTER_REBOOT' == result.error){
      // 暂停心跳包上报
      state = 'PAUSE';
      // 报告给主进程
      process.send({
        'flag': 'reboot'
      });
    }
  }
  else{
    let {deleteList, cloneList} = JSON.parse( bigData.toString() );
    // 推送到主线程去执行
    process.send({
      'flag': 'taskData',
      'deleteList': deleteList,
      'cloneList': cloneList
    });
  }

// END
};
// PUBLIC_METHOD_END [_start]


