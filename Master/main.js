
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

const chunkserverEnter = {};


startupdataTool.init(startupData, START_TIME);

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

log.init( logPath );

operationLog.load( namespaceData, namespaceDeleteData, namespaceSnapshotData, file2chunkData, file2chunkDeleteData, file2chunkSnapshotData, chunkData, deleteRetainTime, recordPath );

daemon.start( namespaceDeleteData, file2chunkDeleteData, chunkData, serverData, deleteRetainTime, heartbeatTime, chunkDeadTime );

async function response(socket, data){
  let result = comm.decodeMessageData(data);

  var head = result.head;
  var body = result.body;

  log.warn( new Error(), '1 -> ' + jsons( head ) );
  log.warn( new Error(), socket.remoteAddress );

  if(handler[head.method]){
    let res = {}, bigData, message;
    let timestamp = Date.now();

    handleEnter( head.method, head.pair, timestamp );
    
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


function handleEnter( method, pair, timestamp ){
  let remainCount = 10;
  let m = method.toLowerCase().includes('boot') ? 'B' : method.toLowerCase().includes('heart') ? 'H' : '';

  let showTime = function( m, now, tm ){
    now = parseInt( now );
    tm = parseInt( tm );
    let t = ( now - tm ) / 1000;
    let past = Math.floor( t );
    let msg = '';
    if( 0 == t ){
      msg = `${m}, Right now`;
    }
    else{
      msg = `${m}, Passed ${past}s`;
    }

    return msg;
  }

  chunkserverEnter[pair] = chunkserverEnter[pair] || [];
  chunkserverEnter[pair].push( `${m},${timestamp}` );

  let tableData = [
    // {
    //   '127.0.0.1:3001': 'B, passed 30s',
    //   '127.0.0.1:3002': 'B, passed 30s',
    //   '127.0.0.1:3003': 'B, passed 30s',
    // },
    // {
    //   '127.0.0.1:3001': 'B, passed 90s',
    //   '127.0.0.1:3002': '',
    //   '127.0.0.1:3003': ''
    // }
  ];

  let pairs = Object.keys( chunkserverEnter );
  let maxCount = Math.max( ...pairs.map( pair => chunkserverEnter[pair].length ) );

  for( let i = 0; i < maxCount; i++ ){
    let line = {};
    for( const [pair, list] of Object.entries( chunkserverEnter ) ){
      if( list[i] ){
        let [m, tm] = list[i].split(',');
        line[pair] = showTime( m, timestamp, tm );
      }
      else{
        line[pair] = '';
      }
    }
    tableData.push( line );
  }

  if( remainCount < tableData.length ){
    tableData.splice( 0, tableData.length - remainCount );
  }

  console.clear();
  console.table( tableData );
}

// handleEnter( 'boot', '127.0.0.1:3001', Date.now() );
// handleEnter( 'boot', '127.0.0.1:3002', Date.now() );
// handleEnter( 'boot', '127.0.0.1:3003', Date.now() );
// handleEnter( 'heart', '127.0.0.1:3001', Date.now() );



// // simulator test
// if( 'develop' === process.env.NODE_ENV ){
//   require('./test');
// }

