
'use strict';

const {minimist, comm, util, clog, jsonlog, log, jsons} = require('../base');
const config = require('./config.js');
const boot = require('./boot/boot.js');
const handler = require('./handler.js');
const daemon = require('./daemon/daemon.js');

const {
  cachedata,
  chunkdata,
  checksum,
  checksumFree,
  chunkversion,
  chunkversionFree,
  errordata,
  leasedata,
  masterdata
} = require('./metadata');


const cacheData = cachedata.get();
const chunkData = chunkdata.get();
const checksumData = checksum.get();
const checksumFreeData = checksumFree.get();
const chunkversionData = chunkversion.get();
const chunkversionFreeData = chunkversionFree.get();
const errorData = errordata.get();
const leaseData = leasedata.get();
const masterData = masterdata.get();

// 请求处理入口
async function response(socket, data){
  let result = comm.decodeMessageData(data);

  var head = result.head;
  var body = result.body;

  // 处理客户端、Master和Primary发来的请求
  if(handler[head.method]){
    // 获取结果
    let [res, bigData] = await handler[head.method](head, body);
    // 返回结果
    let message = comm.encodeMessageData(res, bigData);
    comm.send(socket, message);
    comm.end(socket);
  }
}

const timestamp = Date.now();


( async () => {
  
  // 初始化配置
  // 获取命令行输入参数
  // node main.js -h 127.0.0.1 -p 3001 -c /cache1 -d /data1 -s 2
  // args -> { _: [], h: '127.0.0.1', p: 3000, c: '/cache1', d: '/data1' }
  let args = minimist(process.argv.splice(2));
  boot.init( args, config, cacheData, chunkData, checksumData, checksumFreeData, chunkversionData, chunkversionFreeData, timestamp );

  let checksumPath  = config.CHECKSUM_PATH;
  let chunkRoot     = config.CHUNK_ROOT;
  let versionPath   = config.VERSION_PATH;
  let maxChunkSize  = config.MAX_CHUNK_SIZE;
  let maxChunkCount = config.MAX_CHUNK_COUNT;
  let blockSize     = config.BLOCK_SIZE;
  let masterHost    = config.MASTER_HOST;
  let masterPort    = config.MASTER_PORT;
  let localHost     = config.LOCAL_HOST;
  let localPort     = config.LOCAL_PORT;
  let logPath       = config.LOG_PATH;

  // 初始执行日志
  log.init( logPath );

  await boot.reportBootData( chunkData, chunkversionData, masterData, maxChunkCount, masterHost, masterPort, localHost, localPort );

  // 守护子线程启动
  daemon.start( checksumData, checksumFreeData, chunkData, chunkversionData, chunkversionFreeData, errorData, leaseData, masterData, checksumPath, chunkRoot, versionPath, blockSize, maxChunkSize, maxChunkCount, masterHost, masterPort, localHost, localPort, logPath );

  // 启动服务程序
  comm.createServer( localHost, localPort, {
    'onListen': function(host, port){
      console.log(`Chunkserver server started`);
      console.log(`  MASTER_HOST: ${masterHost}, MASTER_PORT: ${masterPort}`);
      console.log(`  Host: ${host}, Port: ${port}`);
      console.log(`  MAX_CHUNK_SIZE: ${util.sizeUnit(config.MAX_CHUNK_SIZE)}`);
      console.log(`  STORAGE_SIZE: ${util.sizeUnit(config.STORAGE_SIZE)}`);
      console.log(`  CACHE_ROOT: ${config.CACHE_ROOT}`);
      console.log(`  CHUNK_ROOT: ${config.CHUNK_ROOT}`);
      console.log(`  CHECKSUM_PATH: ${checksumPath}`);
      console.log(`  VERSION_PATH: ${versionPath}`);
      console.log(`  LOG_PATH: ${config.LOG_PATH}`);
    },
    'onData': function(socket, data){
      response( socket, data );
    },
    'onError': function(err){
      console.log( err );
    }
  });

} )();

