
'use strict';

const {minimist, comm, util, clog, jsonlog, log, jsons} = require('../base');
const config = require('./config.js');
const boot = require('./boot/boot.js');
const handler = require('./handler.js');
const daemon = require('./daemon/daemon.js');

const {
  namespace,
  namespaceDelete,
  namespaceSnapshot,
  file2chunk,
  file2chunkDelete,
  file2chunkSnapshot,
  chunkdata,
  chunklost,
  serverdata,
  startupdata,
  startupdataTool,
} = require('./metadata');

const operationLog = require('./store/operationLog.js');


const START_TIME = Date.now();

const [
  namespaceData,
  namespaceDeleteData,
  namespaceSnapshotData,
  file2chunkData,
  file2chunkDeleteData,
  file2chunkSnapshotData,
  chunkData,
  chunklostData,
  serverData,
  startupData,
] = [
  namespace.get(),
  namespaceDelete.get(),
  namespaceSnapshot.get(),
  file2chunk.get(),
  file2chunkDelete.get(),
  file2chunkSnapshot.get(),
  chunkdata.get(),
  chunklost.get(),
  serverdata.get(),
  startupdata.get(),
];


// 设置初始化时间戳
startupdataTool.init(startupData, START_TIME);

// 初始化配置
// 获取命令行输入参数
// node main.js -h 127.0.0.1 -p 3000 -l C:\work\GFS2\Master\log -n namespace.log
let args = minimist(process.argv.splice(2));
boot.init(config, args);

const [
  masterHost,
  masterPort,
  deleteRetainTime,
  heartbeatTime,
  chunkDeadTime,
  logPath,
  recordPath,
] = [
  config.MASTER_HOST,
  config.MASTER_PORT,
  config.DELETE_RETAIN_TIME,
  config.HEARTBEAT_TIME,
  config.CHUNK_DEAD_TIME,
  config.LOG_PATH,
  config.RECORD_PATH,
];

// 初始执行日志
log.init( logPath );

// 加载日志
operationLog.load( namespaceData, namespaceDeleteData, namespaceSnapshotData, file2chunkData, file2chunkDeleteData, file2chunkSnapshotData, chunkData, deleteRetainTime, recordPath );

// 启动块管理子进程
daemon.start( namespaceDeleteData, file2chunkDeleteData, chunkData, serverData, deleteRetainTime, heartbeatTime, chunkDeadTime );

// 请求处理入口
async function response(socket, data){
  let result = comm.decodeMessageData(data);

  var head = result.head;
  var body = result.body;

  log.warn( new Error(), '1 -> ' + jsons( head ) );
  log.warn( new Error(), socket.remoteAddress );

  // 处理客户端、Master和Primary发来的请求
  if(handler[head.method]){
    let res = {}, bigData, message;
    let timestamp = Date.now();
    
    let state = startupdataTool.getState( startupData, timestamp, heartbeatTime );
    /* Master init */
    if( 'init' == state ){
      if( 'recvBootData' == head.method || 'recvHeartbeat' == head.method ){
        if( head.startTime && !startupdataTool.checkTime( startupData, head.startTime ) ){
          util.result( res, -1, 'MASTER_REBOOT' );
        }
        else{
          [res, bigData] = await handler[head.method](head, body);
        }
      }
      else{
        util.result( res, -1, 'MASTER_INIT', 'Please wait 1 minute' );
      }
    }
    /* Master work */
    else if('work' == state ){
      /* for chunkserver after Master work*/
      if( head.startTime && !startupdataTool.checkTime( startupData, head.startTime ) ){
        util.result( res, -1, 'MASTER_REBOOT' );
      }
      else{
        [res, bigData] = await handler[head.method](head, body);
      }
    }
    res.data = Object.assign( {}, res.data, {"startTime":START_TIME} );
    message = comm.encodeMessageData(res, bigData);

    log.warn( new Error(), '2 -> ' + jsons( head ) );
    log.warn( new Error(), socket.remoteAddress );
    comm.send(socket, message);
    comm.end(socket);
    
    log.warn( new Error(), '3 -> ' + jsons( head ) );
  }
}

// 启动服务程序
comm.createServer( masterHost, masterPort, {
  'onListen': function(host, port){
    console.log(`Master server started`);
    console.log(`  Host: ${host}, Port: ${port}`);
    console.log(`  RECORD_PATH: ${recordPath}`);
  },
  'onData': function(socket, data){
    log.debug( new Error(), socket.remoteAddress );
    let result = comm.decodeMessageData(data);
    log.debug( new Error(), jsons( result.head ) );
    response(socket, data);
  },
  'onError': function(err){
    console.log(err);
  }
});


// // simulator test
// if( 'develop' === process.env.NODE_ENV ){
//   require('./test');
// }

