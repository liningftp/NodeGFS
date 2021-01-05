
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Master
 * @copyright: liningftp@qq.com
 * @name: operationLog
 * @desc: manage operate log
 * @file: /store/operationLog.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START
const fs = require('fs');
const {utilfs, clog} = require('../../base/index');

const daemon = require('../daemon/daemon.js');

const {
  chunkdataTool,
  file2chunkTool, file2chunkDeleteTool, file2chunkSnapshotTool,
  namespaceTool, namespaceDeleteTool, namespaceSnapshotTool
} = require('../metadata/index.js');

// 1597917547220|cd|/usr/data
// 1597927547220|cf|/usr/data/001
// 1597996169635|v|/usr/data/001|aabbccdd|1
// 1597996169635|v|/usr/data/001|eeffgghh|1
// 1597996169635|v|/usr/data/001|ooxxmmkk|1
// 1597996169635|v|/usr/data/001|ooxxmmkk|2
// 1597928073812|snapshot|/usr/data/001
// 1597927658957|d|/usr/data/001

// END
// REQUIRE_END


// PUBLIC_METHOD_START [load]
/**
 * load log and serialize
 * @namespaceData          {JSON}   tree of namespace, @example {}
 * @namespaceDeleteData    {JSON}   delete tree of namespace, @example {}
 * @namespaceSnapshotData  {JSON}   snapshot tree of namespace, @example {}
 * @file2chunkData         {JSON}   map data of filePath to chunkName, @example {}
 * @file2chunkDeleteData   {JSON}   file2chunkData to be deleted, @example {}
 * @file2chunkSnapshotData {JSON}   file2chunkData to snapshot, @example {}
 * @chunkData              {JSON}   base info of all chunk on local, @example {}
 * @retainTime             {Number} retain time after deleted, @example 259200000
 * @recordPath             {String} path of operate record, @example "C:\work\GFS2\AppData\master\operation.log"
 * @return                 {Array}  return value, @example [0, '', {"/usr/data/photo/123":{"tm":1563783096855,"chunks":["aabbcdd","eeffgghh"]}}]
 */
exports.load = function( namespaceData, namespaceDeleteData, namespaceSnapshotData, file2chunkData, file2chunkDeleteData, file2chunkSnapshotData, chunkData, retainTime, recordPath ){
// START
  // 1 read record
  let code, msg, content;
  [code, msg, content] = utilfs.readSync(recordPath);
  if(0 != code){ return [code, msg, content]; }

  content = (content || Buffer.from('')).toString();

  // 2 parse
  let lines = content.split(/\r|\n/);
  for(let line of lines){

    line = (line || '').trim();
    if(!line){
      continue;
    }
    // 1596597430901|a|/usr/data/001..
    let [tm, opType, filePath, ...more] = line.split('|');

    filePath = utilfs.formatFilePath(filePath);

    if('cd' === opType){
      namespaceTool.add(namespaceData, filePath, 'dir');
    }
    else if('cf' === opType){
      namespaceTool.add(namespaceData, filePath, 'file');
    }
    else if('v' === opType){
      let [chunkName, version] = more[0].split(',');
      version = parseInt(version);
      file2chunkTool.add(file2chunkData, filePath, chunkName);
      // first version is 1
      if( !chunkdataTool.has(chunkData, chunkName) && 1 == version ){
        chunkdataTool.add(chunkData, chunkName, version, 3);
      }
      else if( chunkdataTool.has(chunkData, chunkName) && 1 < version ){
        chunkdataTool.setVersion(chunkData, chunkName, version);
      }
    }
    else if('snapshot' === opType){
      let tree = namespaceTool.clone(namespaceData, filePath);
      namespaceSnapshotTool.add(namespaceSnapshotData, filePath, tm, tree);

      let filePathList = namespaceTool.getFilePathList(tree);

      for(const filePath of filePathList){
        let chunkNameList = file2chunkTool.get(file2chunkData, filePath);
        file2chunkSnapshotTool.add(file2chunkSnapshotData, filePath, tm, chunkNameList);

        for(const chunkName of chunkNameList){
          chunkdataTool.addReferCount(chunkData, chunkName);
        }
      }
    }
    else if('dd' === opType || 'df' == opType){
      let expireList = namespaceDeleteTool.getExpireList(namespaceDeleteData, retainTime, tm);
      namespaceDeleteTool.delete(namespaceDeleteData, expireList);

      // clog(namespaceData);
      let tree = namespaceTool.clone(namespaceData, filePath);
      namespaceTool.delete(namespaceData, filePath);
      // clog(namespaceData);

      // clog(namespaceDeleteData);
      namespaceDeleteTool.add(namespaceDeleteData, filePath, tm, tree);
      // clog(namespaceDeleteData);

      // clog(file2chunkData);
      let chunkNameList = file2chunkTool.delete(file2chunkData, filePath);
      // clog(file2chunkData);

      // clog(file2chunkDeleteData);
      file2chunkDeleteTool.add(file2chunkDeleteData, filePath, chunkNameList, tm);
      // clog(file2chunkDeleteData);

      if( chunkNameList && chunkNameList.length ){
        for(const chunkName of chunkNameList){
          chunkdataTool.subReferCount(chunkData, chunkName);
        }
      }
    }

  }

// END
};
// PUBLIC_METHOD_END [load]


// PUBLIC_METHOD_START [createDir]
/**
 * create directory operation
 * @timestamp  {Number} time stamp, @example 1601254063759
 * @filePath   {String} file path of system, @example "/usr/data/001"
 * @recordPath {String} path of operate record, @example "C:\work\GFS2\AppData\master\operation.log"
 */
exports.createDir = function( timestamp, filePath, recordPath ){
// START
  let result = {};

  let opType = 'cd';

  filePath = utilfs.formatFilePath(filePath);
  let more = [];

  return exports._save(timestamp, opType, filePath, more, recordPath);
// END
};
// PUBLIC_METHOD_END [createDir]


// PUBLIC_METHOD_START [createFile]
/**
 * create file operation
 * @timestamp    {Number} time stamp, @example 1601254063759
 * @filePath     {String} file path of system, @example "/usr/data/001"
 * @replicaCount {Number} count of relipcas, @example 3
 * @recordPath   {String} path of operate record, @example "C:\work\GFS2\AppData\master\operation.log"
 */
exports.createFile = function( timestamp, filePath, replicaCount, recordPath ){
// START
  let result = {};

  let opType = 'cf';

  filePath = utilfs.formatFilePath(filePath);
  let more = [replicaCount];

  return exports._save(timestamp, opType, filePath, more, recordPath);
// END
};
// PUBLIC_METHOD_END [createFile]


// PUBLIC_METHOD_START [delete]
/**
 * delete file or directory operation
 * @timestamp  {Number} time stamp, @example 1601255782731
 * @filePath   {String} file path of system, @example "/usr/data/001"
 * @opType     {String} operate type, 'cd', 'cf', 'dd', 'df', 'w', 'a', 'd', 'snapshot', @example "dd"
 * @recordPath {String} path of operate record, @example "C:\work\GFS2\AppData\master\operation.log"
 * @return     {JSON}   return value, @example {"code":0,"msg":""}
 */
exports.delete = function( timestamp, filePath, opType, recordPath ){
// START
  let result = {};

  filePath = utilfs.formatFilePath(filePath);

  let more = [];

  return exports._save(timestamp, opType, filePath, more, recordPath);
// END
};
// PUBLIC_METHOD_END [delete]


// PUBLIC_METHOD_START [setVersion]
/**
 * set primary version operation
 * @timestamp  {Number} time stamp, @example 1601256507746
 * @filePath   {String} file path of system, @example "/usr/data/001"
 * @chunkName  {String} name of chunk, @example "aabbccdd"
 * @version    {Number} version number, @example 20
 * @recordPath {String} path of operate record, @example "C:\work\GFS2\AppData\master\operation.log"
 */
exports.setVersion = function( timestamp, filePath, chunkName, version, recordPath ){
// START
  let result = {};

  let opType = 'v';
  filePath = utilfs.formatFilePath(filePath);

  let more = [chunkName, version];

  return exports._save(timestamp, opType, filePath, more, recordPath);
// END
};
// PUBLIC_METHOD_END [setVersion]


// PUBLIC_METHOD_START [snapshot]
/**
 * snapshot operation
 * @timestamp  {Number} time stamp, @example 1601256866163
 * @filePath   {String} file path of system, @example "/usr/data/001"
 * @recordPath {String} path of operate record, @example "C:\work\GFS2\AppData\master\operation.log"
 */
exports.snapshot = function( timestamp, filePath, recordPath ){
// START
  let result = {};

  let opType = 'snapshot';
  filePath = utilfs.formatFilePath(filePath);

  let more = [];

  return exports._save(timestamp, opType, filePath, more, recordPath);
// END
};
// PUBLIC_METHOD_END [snapshot]


// PUBLIC_METHOD_START [_save]
/**
 * save log to disk
 * @timestamp  {Number} time stamp, @example 1601254063759
 * @opType     {String} operate type, 'cd', 'cf', 'dd', 'df', 'w', 'a', 'd', 'snapshot', @example "cd"
 * @filePath   {String} file path of system, @example "/usr/data"
 * @more       {String} more data, @example "3"
 * @recordPath {String} path of operate record, @example "C:\work\GFS2\AppData\master\operation.log"
 */
exports._save = function( timestamp, opType, filePath, more, recordPath ){
// START
  let result = {};

  if(!fs.existsSync(recordPath)){
    [result.code, result.message] = [-1, `ERROR: Operate record file ${recordPath} is not exists!`];
    return result;
  }

  let data = [timestamp, opType, filePath];

  if(more && more.length){
    data.push(more);
  }

  let content = '\n' + data.join('|');
  [result.code, result.message] = utilfs.appendSync(recordPath, content);

  return result;
// END
};
// PUBLIC_METHOD_END [_save]


