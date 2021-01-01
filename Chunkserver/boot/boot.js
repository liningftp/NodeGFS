
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Chunkserver
 * @copyright: liningftp@qq.com
 * @name: boot
 * @desc: boot
 * @file: /boot/boot.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START
const fs = require('fs');
const path = require('path');
const {utilfs, comm, clog, jsonlog, log, jsons} = require('../../base');

const {
  chunkdataTool,
  versionTool,
  masterdataTool
} = require('../metadata');

const {
  cachedataPersist,
  chunkdataPersist,
  checksumPersist,
  chunkversionPersist
} = require('../store');

const {
  masterAPI
} = require('../callapi');
// END
// REQUIRE_END


// PUBLIC_METHOD_START [init]
/**
 * init
 * @args                 {JSON}   startup command arguments, @example {}
 * @config               {JSON}   config data, @example {}
 * @cacheData            {JSON}   cache data, @example {}
 * @chunkData            {JSON}   base info of all chunk on local, @example {}
 * @checksumData         {JSON}   checksumdata of all chunk on local, @example {}
 * @checksumFreeData     {JSON}   free position of checksum file, @example {}
 * @chunkversionData     {JSON}   chunkversion of all chunk on local, @example {}
 * @chunkversionFreeData {JSON}   free position of chunkversion file, @example {}
 * @timestamp            {Number} current timestamp, @example 1606702772564
 */
exports.init = function( args, config, cacheData, chunkData, checksumData, checksumFreeData, chunkversionData, chunkversionFreeData, timestamp ){
// START
  log.args( Error(), arguments );
  /* init config from args */
  config.STORAGE_SIZE   = (args.s || 1) * 1024 * 1024 * 1024 || config.STORAGE_SIZE;
  config.MASTER_HOST    = args.m || config.MASTER_HOST;
  config.LOCAL_HOST     = args.h || config.LOCAL_HOST;
  config.LOCAL_PORT     = args.p || config.LOCAL_PORT;
  config.CACHE_ROOT     = args.c || config.CACHE_ROOT;
  config.CHUNK_ROOT     = args.d || config.CHUNK_ROOT;
  config.CHECKSUM_PATH  = args.k || config.CHECKSUM_PATH;
  config.VERSION_PATH   = args.v || config.VERSION_PATH;
  config.LOG_PATH       = args.l || config.LOG_PATH;

  if( args.p ){
    config.CACHE_ROOT = path.join( config.CACHE_ROOT, args.p + '//' );
    config.CHUNK_ROOT = path.join( config.CHUNK_ROOT, args.p + '//' );
    config.CHECKSUM_PATH += args.p;
    config.VERSION_PATH += args.p;
    config.LOG_PATH += args.p;
  }

  /* init cacheData */
  if( !fs.existsSync( config.CACHE_ROOT ) ){
    utilfs.makePath( config.CACHE_ROOT );
  }
  cachedataPersist.load( cacheData, config.CACHE_ROOT, timestamp );

  /* init chunkData */
  if( !fs.existsSync( config.CHUNK_ROOT ) ){
    utilfs.makePath( config.CHUNK_ROOT );
  }
  chunkdataPersist.load(chunkData, config.CHUNK_ROOT);

  /* init path */
  if( !fs.existsSync( config.CHECKSUM_PATH ) ){
    utilfs.makePath( config.CHECKSUM_PATH );
    utilfs.makeFile( config.CHECKSUM_PATH );
  }
  /* init checksumData, checksumFreeData */
  checksumPersist.load(checksumData, checksumFreeData, config.CHECKSUM_PATH);

  /* init path */
  if( !fs.existsSync( config.VERSION_PATH ) ){
    utilfs.makePath( config.VERSION_PATH );
    utilfs.makeFile( config.VERSION_PATH );
  }
  /* init chunkversionData, chunkversionFreeData */
  chunkversionPersist.load(chunkversionData, chunkversionFreeData, config.VERSION_PATH);

  if( !fs.existsSync( config.LOG_PATH ) ){
    utilfs.makePath( config.LOG_PATH );
    utilfs.makeFile( config.LOG_PATH );
  }

// END
};
// PUBLIC_METHOD_END [init]


// PUBLIC_METHOD_START [reportBootData]
/**
 * first report data to master
 * @chunkData        {JSON}   base info of all chunk on local, @example {"5964d672f56753389f3d89906ab238fbc680359229015a15a4ca66e466b128bc":[1024,0]}
 * @chunkversionData {JSON}   chunkversion of all chunk on local, @example {"5964d672f56753389f3d89906ab238fbc680359229015a15a4ca66e466b128bc":[0,3]}
 * @masterData       {JSON}   data of Master server, @example {"startTime":1602907450469}
 * @maxChunkCount    {Number} max chunk count of chunkserver, @example 16
 * @masterHost       {String} host of Master server, @example "127.0.0.1"
 * @masterPort       {Number} port of Master server, @example 3000
 * @localHost        {String} local host ip, @example "127.0.0.1"
 * @localPort        {Number} local port, @example 3001
 */
exports.reportBootData = async function( chunkData, chunkversionData, masterData, maxChunkCount, masterHost, masterPort, localHost, localPort ){
// START
  log.args( Error(), arguments );
  let chunkList = [];

  for( const chunkName of Object.keys( chunkData ) ){
    let version = chunkversionData[chunkName][1];
    chunkList.push( `${chunkName},${version}` );
  }

  let useRate = chunkdataTool.getUseRate( chunkData, maxChunkCount );

  let [result, bigData] = await masterAPI.reportBootData( chunkList, useRate, masterHost, masterPort, localHost, localPort );

  if( 0 != result.code ){
    log.error( Error(), `${jsons([result])}` );
    return result;
  }

  log.info( Error(), `${jsons([result])}` );

  let {startTime} = result.data;
  masterdataTool.setTime( masterData, startTime );

  log.end( Error(), 'void' );
  return result;
// END
};
// PUBLIC_METHOD_END [reportBootData]


