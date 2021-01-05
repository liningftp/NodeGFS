
const fs = require("fs");
const child_process = require("child_process");

let operationLog = require("C:\\work\\Git_work\\NodeGFS\\Master\\store\\operationLog.js");


////////////////////////////////////////////////////////////////////////////////

function reload(){
  delete require.cache[require.resolve("C:\\work\\Git_work\\NodeGFS\\Master\\store\\operationLog.js")]
  operationLog = require("C:\\work\\Git_work\\NodeGFS\\Master\\store\\operationLog.js");
}


async function forkServer(forkFile, startParam){
  var child = child_process.fork(forkFile);

  return  new Promise( (resolve, reject) => {
    child.on("message", (result) => {
      if("onload" == result.state){
        child.send(startParam);
      }
      else if("started" == result.state){
        resolve(child);
      }
      else{
      }
    });
  });

}


////////////////////////////////////////////////////////////////////////////////

// load log and serialize
exports.load = function(){
// START
  reload();
  // run
  var namespaceData = {};
  var namespaceDeleteData = {};
  var namespaceSnapshotData = {};
  var file2chunkData = {};
  var file2chunkDeleteData = {};
  var file2chunkSnapshotData = {};
  var chunkData = {};
  var retainTime = 259200000;
  var recordPath = "C:\\work\\GFS2\\AppData\\master\\operation.log";
  var result = operationLog.load(namespaceData, namespaceDeleteData, namespaceSnapshotData, file2chunkData, file2chunkDeleteData, file2chunkSnapshotData, chunkData, retainTime, recordPath);

  return result;
// END
};


// create directory operation
exports.createDir = function(){
// START
  reload();
  // run
  var timestamp = 1601254063759;
  var filePath = "/usr/data/001";
  var recordPath = "C:\\work\\GFS2\\AppData\\master\\operation.log";
  var result = operationLog.createDir(timestamp, filePath, recordPath);

  return result;
// END
};


// create file operation
exports.createFile = function(){
// START
  reload();
  // run
  var timestamp = 1601254063759;
  var filePath = "/usr/data/001";
  var replicaCount = 3;
  var recordPath = "C:\\work\\GFS2\\AppData\\master\\operation.log";
  var result = operationLog.createFile(timestamp, filePath, replicaCount, recordPath);

  return result;
// END
};


// delete file or directory operation
exports.delete = function(){
// START
  reload();
  // run
  var timestamp = 1601255782731;
  var filePath = "/usr/data/001";
  var opType = "dd";
  var recordPath = "C:\\work\\GFS2\\AppData\\master\\operation.log";
  var result = operationLog.delete(timestamp, filePath, opType, recordPath);

  return result;
// END
};


// set primary version operation
exports.setVersion = function(){
// START
  reload();
  // run
  var timestamp = 1601256507746;
  var filePath = "/usr/data/001";
  var chunkName = "aabbccdd";
  var version = 20;
  var recordPath = "C:\\work\\GFS2\\AppData\\master\\operation.log";
  var result = operationLog.setVersion(timestamp, filePath, chunkName, version, recordPath);

  return result;
// END
};


// snapshot operation
exports.snapshot = function(){
// START
  reload();
  // run
  var timestamp = 1601256866163;
  var filePath = "/usr/data/001";
  var recordPath = "C:\\work\\GFS2\\AppData\\master\\operation.log";
  var result = operationLog.snapshot(timestamp, filePath, recordPath);

  return result;
// END
};


// save log to disk
exports._save = function(){
// START
  reload();
  // run
  var timestamp = 1601254063759;
  var opType = "cd";
  var filePath = "/usr/data";
  var more = "3";
  var recordPath = "C:\\work\\GFS2\\AppData\\master\\operation.log";
  var result = operationLog._save(timestamp, opType, filePath, more, recordPath);

  return result;
// END
};
