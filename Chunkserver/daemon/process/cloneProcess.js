
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Chunkserver
 * @copyright: liningftp@qq.com
 * @name: cloneProcess
 * @desc: chunk clone subprocess
 * @file: /daemon/process/cloneProcess.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START
const {schedule, crc32, utilfs, comm, clog, log, jsons} = require('../../../base');
const {checksumTool} = require('../../metadata');
const {chunkdataPersist} = require('../../store');

const cloneQueue = [];

let chunkRoot, logPath;
let blockSize, maxChunkSize;
let working = 0;

process.on('message', message => {
  let {flag} = message;

  if('init' == flag){
    chunkRoot = message.chunkRoot;
    logPath = message.logPath;
    blockSize = message.blockSize;
    maxChunkSize = message.maxChunkSize;

    log.init( logPath );
  }
  else if('start' == flag){
    let {cloneList} = message;
    cloneQueue.push( ...cloneList );

    if( !working ){
      working = 1;
      exports._start( cloneQueue, chunkRoot, blockSize, maxChunkSize );
      working = 0;
    }
  }
});
// END
// REQUIRE_END


// PUBLIC_METHOD_START [_start]
/**
 * start
 * @cloneQueue   {Array}  list of chunk to clone, @example ["aabbccdd,3,127.0.0.1:3002,127.0.0.1:3003"]
 * @chunkRoot    {String} root directory where the chunk is stored, @example "C:\work\GFS2\AppData\chunkserver\chunk1"
 * @blockSize    {Number} block size for checksum, @example 65536
 * @maxChunkSize {Number} max size of chunk, @example 67108864
 */
exports._start = async function( cloneQueue, chunkRoot, blockSize, maxChunkSize ){
// START
  log.args( Error(), arguments );

  if( !cloneQueue || !cloneQueue.length ){
    log.end( Error(), jsons('void') );
    return;
  }

  working = 1;
  let cloneList = cloneQueue.splice( 0, cloneQueue.length );

  let cloneData = await exports._clone( cloneList, chunkRoot, blockSize, maxChunkSize );

  process.send({
    'flag': 'cloneData',
    'cloneData': cloneData
  });

  exports._start(cloneQueue, chunkRoot);
  log.end( Error(), jsons( 'void' ) );
// END
};
// PUBLIC_METHOD_END [_start]


// PUBLIC_METHOD_START [_clone]
/**
 * clone chunk to disk
 * @cloneList    {Array}  list of chunk to clone, @example ["aabbccdd,3,127.0.0.1:3002,127.0.0.1:3003","eeffgghh,10,127.0.0.1:3002,127.0.0.1:3003"]
 * @chunkRoot    {String} root directory where the chunk is stored, @example "C:\work\GFS2\AppData\chunkserver\chunk1"
 * @blockSize    {Number} block size for checksum, @example 65536
 * @maxChunkSize {Number} max size of chunk, @example 67108864
 */
exports._clone = async function( cloneList, chunkRoot, blockSize, maxChunkSize ){
// START
  log.args( Error(), arguments );
  let cloneData = {};

  log.info( Error(), jsons( {cloneList, chunkRoot, blockSize, maxChunkSize} ) );

  for(const item of cloneList){
    let [chunkName, version, ...pairList] = item.split(',');
    version = parseInt( version );
    let [host, port] = pairList[0].split(':');
    let [result, bigData] = await readData( host, port, chunkName, version, 0, maxChunkSize );
    if(0 == result.code){
      result = chunkdataPersist.write( chunkRoot, chunkName, bigData );
      if(0 == result.code){
        let checksumList = checksumTool.createChecksum(bigData, blockSize);
        cloneData[chunkName] = {
          "code": 0,
          "version": version,
          "checksumList": checksumList,
          "size": bigData.byteLength
        };
      }
      else{
        cloneData[chunkName] = result;
      }
    }
    else{
      cloneData[chunkName] = {"code":-1};
    }
  }

  async function readData(host, port, chunkName, version, startPos, length){
    log.args( Error(), arguments );

    let result = {}, bigData;
    // SOCKET_API OPEN [GFS2_Chunkserver.handler.readChunk] {tabCount=2}
    /* client read chunk content */
    /* @return {Array} Return value [{"code":0, "msg":""}, []] */
    [result, bigData] = await comm.clientRequest(host, port, 
      comm.encodeMessageData({
        "method": "readChunk",
        "chunkName": chunkName,
        "startPos": startPos,
        "length": length,
        "version": version,
      })
    );
    // SOCKET_API CLOSE

    log.end( Error(), jsons( [result, bigData] ) );
    return [result, bigData];
  }

  log.end( Error(), jsons( cloneData ) );
  return cloneData;
// END
};
// PUBLIC_METHOD_END [_clone]


