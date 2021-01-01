
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Chunkserver
 * @copyright: liningftp@qq.com
 * @name: masterHandler
 * @desc: handle request from master
 * @file: /business/masterHandler.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START
const {clog, jsonlog} = require('../../base');

const {
  chunkdataTool,
  checksumTool,
  checksumFreeTool,
  chunkversionTool,
  chunkversionFreeTool,
  leasedataTool,
} = require('../metadata');

const {
  chunkdataPersist,
  checksumPersist,
  chunkversionPersist,
} = require('../store');

const {
  masterAPI,
  secondaryAPI
} = require('../callapi');
// END
// REQUIRE_END


// PUBLIC_METHOD_START [recvLease]
/**
 * receive lease of Master grant to primary
 * @chunkData            {JSON}   base info of all chunk on local, @example {}
 * @checksumData         {JSON}   checksumdata of all chunk on local, @example {}
 * @checksumFreeData     {Array}  free position of checksum file, @example []
 * @chunkversionData     {JSON}   chunkversion of all chunk on local, @example {}
 * @chunkversionFreeData {Array}  free position of chunkversion file, @example []
 * @leaseData            {JSON}   lease of primary chunk, @example {}
 * @chunkName            {String} name of chunk, @example "ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b"
 * @version              {Number} version number, @example 1
 * @primary              {String} primary of chunkserver, @example "127.0.0.1:3001"
 * @serverList           {Array}  all server of chunk, @example ["127.0.0.1:3001", "127.0.0.1:3002", "127.0.0.1:3003"]
 * @isNew                {Number} chunk is new to create or not, @example 1
 * @timestamp            {Number} current timestamp, @example 1606641250664
 * @blockSize            {Number} block size for checksum, @example 65536
 * @chunkRoot            {String} root directory where the chunk is stored, @example "C:\work\GFS2\AppData\chunkserver\chunk1\"
 * @checksumPath         {String} path of file to save checksum of chunk, @example "C:\work\GFS2\AppData\chunkserver\checksum1\data"
 * @versionPath          {String} path of file to save version of chunk, @example "C:\work\GFS2\AppData\chunkserver\version1\data"
 * @return               {Array}  Return value, @example [{"code":0}]
 */
exports.recvLease = async function( chunkData, checksumData, checksumFreeData, chunkversionData, chunkversionFreeData, leaseData, chunkName, version, primary, serverList, isNew, timestamp, blockSize, chunkRoot, checksumPath, versionPath ){
// START
  let result = {};

  if( !chunkdataTool.has(chunkData, chunkName) ){
    if( !isNew ){
      util.result( result, -1, 'NO_CHUINK', `${chunkName}` );
      return [result];
    }

    /* handle chunk */
    result = chunkdataPersist.create(chunkRoot, chunkName);
    if(0 != result.code){
      return [result];
    }
    chunkdataTool.add(chunkData, chunkName, 0);

    /* handle checksum */
    let contentData = Buffer.from('');
    let checksumList = checksumTool.createChecksum(contentData, blockSize);

    let freeIndex = checksumFreeTool.getFreeIndex(checksumFreeData);
    if(-1 === freeIndex){
      freeIndex = checksumTool.getCount(checksumData);
    }
    checksumTool.addChunk(checksumData, chunkName, checksumList, freeIndex);
    result = checksumPersist.addChunk(chunkName, checksumList, checksumPath, freeIndex);
    if(0 != result.code){
      return [result];
    }

    /* handle version */
    freeIndex = chunkversionFreeTool.getFreeIndex(chunkversionFreeData);
    if(-1 === freeIndex){
      freeIndex = chunkversionTool.getCount(chunkversionData);
    }
    chunkversionTool.addChunk(chunkversionData, chunkName, version, freeIndex);
    result = chunkversionPersist.addChunk(chunkName, version, versionPath, freeIndex);
    if(0 != result.code){
      return [result];
    }

    /* pass to next chunkserver */
    let secondServerList = serverList.filter(item => item != primary);
    if(secondServerList.length){
      result = await secondaryAPI.secondCreateChunk(secondServerList, chunkName, version);
    }
  }
  else{
    if( isNew ){
      util.result( result, -1, 'HAS_CHUINK', `${chunkName}` );
      return [result];
    }

    /* set primary version */
    chunkversionTool.setVersion(chunkversionData, chunkName, version);
    let itemIndex = chunkversionTool.getChunkIndex(chunkversionData, chunkName);
    result = chunkversionPersist.setVersion(chunkName, version, versionPath, itemIndex);
    if(0 != result.code){
      return [result];
    };

    /* pass to next chunkserver */
    let secondServerList = serverList.filter(item => item != primary);
    if(secondServerList.length){
      result = await secondaryAPI.secondSetVersion(secondServerList, chunkName, version);
    }
  }

  /* update leaseData */
  leasedataTool.setLease(leaseData, chunkName, timestamp);

  return [result];
// END
};
// PUBLIC_METHOD_END [recvLease]


// PUBLIC_METHOD_START [revokeLease]
/**
 * master revoke lease
 * @chunkData {JSON}   base info of all chunk on local, @example {"aabbccdd":[306, 1602691021717], "eeffgghh":[1, 1602691021717]}
 * @leaseData {JSON}   lease of primary chunk, @example {"aabbccdd":{"primary":1602576896653, "work":1}}
 * @chunkName {String} name of chunk, @example "eeffgghh"
 * @return    {Array}  返回值, @example [{"code":0, "data":"aabbccdd"}]
 */
exports.revokeLease = async function( chunkData, leaseData, chunkName ){
// START
  if( !chunkdataTool.has(chunkData, chunkName) ){
    return;
  }

  // 设置租约数据
  leasedataTool.revokeLease(leaseData, chunkName);

  return leaseData;
// END
};
// PUBLIC_METHOD_END [revokeLease]


