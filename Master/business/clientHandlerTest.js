
const fs = require("fs");
const child_process = require("child_process");

let clientHandler = require("C:\\work\\Git_work\\NodeGFS\\Master\\business\\clientHandler.js");


////////////////////////////////////////////////////////////////////////////////

function reload(){
  delete require.cache[require.resolve("C:\\work\\Git_work\\NodeGFS\\Master\\business\\clientHandler.js")]
  clientHandler = require("C:\\work\\Git_work\\NodeGFS\\Master\\business\\clientHandler.js");
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

// open file
exports.open = async function(){
// START
  reload();
  // run
  var namespaceData = {"/usr":{"_type":"dir","_lock":{"r":[1606225901838,1600765377526],"w":[],"a":[],"snap":[]},"/data":{"_type":"dir","_lock":{"r":[1606225901838,1600765377526],"w":[],"a":[],"snap":[]},"/001":{"_type":"file","_replicaCount":3,"_lock":{"r":[],"w":[],"a":[],"snap":[1606225901838]}}}}};
  var filePath = "/usr/data/001";
  var flags = "O_RDWR";
  var mode = "O_APPEND";
  var timestamp = 1606225666536;
  var lockDuration = 300000;
  var result = await clientHandler.open(namespaceData, filePath, flags, mode, timestamp, lockDuration);

  return result;
// END
};


// close file
exports.close = async function(){
// START
  reload();
  // run
  var namespaceData = {"/usr":{"_type":"dir","_lock":{"r":[1600765363449,1600765377526],"w":[],"a":[],"snap":[]},"/data":{"_type":"dir","_lock":{"r":[1600765363449,1600765377526],"w":[],"a":[],"snap":[]},"/001":{"_type":"file","_replicaCount":3,"_lock":{"r":[1600765363449],"w":[],"a":[],"snap":[]}}}}};
  var filePath = "/usr/data/001";
  var fd = "1600765377526";
  var result = await clientHandler.close(namespaceData, filePath, fd);

  return result;
// END
};


// create namespace directory
exports.createDir = async function(){
// START
  reload();
  // run
  var namespaceData = {};
  var filePath = "/usr/data/001";
  var timestamp = 1603423714256;
  var recordPath = "C:\\work\\GFS2\\AppData\\master\\operation.log";
  var result = await clientHandler.createDir(namespaceData, filePath, timestamp, recordPath);

  return result;
// END
};


// delete namespace directory
exports.deleteDir = async function(){
// START
  reload();
  // run
  var namespaceData = {"/usr":{"_type":"dir","_lock":{"r":[1601782516188],"w":[]},"/data":{"_type":"dir","_lock":{"r":[1601782516188],"w":[]},"/001":{"_type":"file","_replicaCount":3,"_lock":{"r":[],"w":[]}}}}};
  var namespaceDeleteData = {};
  var filePath = "/usr/data";
  var fd = 1606961159937;
  var timestamp = 1604366129450;
  var lockDuration = 300000;
  var recordPath = "C:\\work\\GFS2\\AppData\\master\\operation.log";
  var result = await clientHandler.deleteDir(namespaceData, namespaceDeleteData, filePath, fd, timestamp, lockDuration, recordPath);

  return result;
// END
};


// create namespace file
exports.createFile = async function(){
// START
  reload();
  // run
  var namespaceData = {"/usr":{"_type":"dir","_lock":{"r":[],"w":[]},"/data":{"_type":"dir","_lock":{"r":[],"w":[]}}}};
  var file2chunkData = {};
  var chunkData = {};
  var serverData = {"127.0.0.1:3001":[12,1599033406152],"127.0.0.1:3002":[22,1599033664421],"127.0.0.1:3003":[18,1599033677924]};
  var waitleaseData = {};
  var filePath = "/usr/data/001";
  var replicaCount = 3;
  var avgUseRate = 50;
  var heartbeatTime = 60000;
  var timestamp = 1599033406152;
  var recordPath = "C:\\work\\GFS2\\AppData\\master\\operation.log";
  var result = await clientHandler.createFile(namespaceData, file2chunkData, chunkData, serverData, waitleaseData, filePath, replicaCount, avgUseRate, heartbeatTime, timestamp, recordPath);

  return result;
// END
};


// delete namespace file
exports.deleteFile = async function(){
// START
  reload();
  // run
  var namespaceData = {"/usr":{"_type":"dir","_lock":{"r":[1601782516188],"w":[]},"/data":{"_type":"dir","_lock":{"r":[1601782516188],"w":[]},"/001":{"_type":"file","_replicaCount":3,"_lock":{"r":[],"w":[]}}}}};
  var namespaceDeleteData = {};
  var file2chunkData = {};
  var file2chunkDeleteData = {};
  var filePath = "/usr/data/001";
  var fd = 1606909907287;
  var timestamp = 1604366129450;
  var lockDuration = 300000;
  var recordPath = "C:\\work\\GFS2\\AppData\\master\\operation.log";
  var result = await clientHandler.deleteFile(namespaceData, namespaceDeleteData, file2chunkData, file2chunkDeleteData, filePath, fd, timestamp, lockDuration, recordPath);

  return result;
// END
};


// get list of chunkserver to write
exports.getWriteServerList = async function(){
// START
  reload();
  // run
  var namespaceData = {"/usr":{"_type":"dir","_lock":{"r":[1601782516188],"w":[]},"/data":{"_type":"dir","_lock":{"r":[1601782516188],"w":[]},"/001":{"_type":"file","_replicaCount":3,"_lock":{"r":[],"w":[]}}}}};
  var file2chunkData = {"/usr/data/001":["aabbccdd"]};
  var chunkData = {"aabbccdd":[1,10,"127.0.0.1:3001,1585471730177","127.0.0.1:3002,1585471730177","127.0.0.1:3003,1585471730177"]};
  var serverData = {"127.0.0.1:3001":[12,1599033677924],"127.0.0.1:3002":[22,1599033664421],"127.0.0.1:3003":[18,1599033677924]};
  var waitleaseData = {};
  var filePath = "/usr/data/001";
  var fd = 1606961159937;
  var index = 0;
  var maxUseRate = 80;
  var timestamp = 1585471730178;
  var heartbeatTime = 60000;
  var chunkDeadTime = 7200000;
  var lockDuration = 300000;
  var recordPath = "C:\\work\\GFS2\\AppData\\master\\operation.log";
  var result = await clientHandler.getWriteServerList(namespaceData, file2chunkData, chunkData, serverData, waitleaseData, filePath, fd, index, maxUseRate, timestamp, heartbeatTime, chunkDeadTime, lockDuration, recordPath);

  return result;
// END
};


// get list of chunkserver to append
exports.getAppendServerList = async function(){
// START
  reload();
  // run
  var namespaceData = {"/usr":{"_type":"dir","_lock":{"r":[],"w":[]},"/data":{"_type":"dir","_lock":{"r":[],"w":[]},"/001":{"_type":"file","_replicaCount":3,"_lock":{"r":[],"w":[]}}}}};
  var chunkData = {"aabbccdd":[1,10,"127.0.0.1:3001,1602211802871","127.0.0.1:3002,1602211802871","127.0.0.1:3003,1602211802871"]};
  var chunkfullData = {};
  var file2chunkData = {"/usr/data/001":["aabbccdd"]};
  var serverData = {"127.0.0.1:3001":[12,1602211802871],"127.0.0.1:3002":[22,1602211802871],"127.0.0.1:3003":[18,1602211802871]};
  var waitleaseData = {};
  var filePath = "/usr/data/001";
  var fd = 1606961159937;
  var maxUseRate = 80;
  var timestamp = 1602211802872;
  var heartbeatTime = 60000;
  var chunkDeadTime = 7200000;
  var lockDuration = 300000;
  var recordPath = "C:\\work\\GFS2\\AppData\\master\\operation.log";
  var result = await clientHandler.getAppendServerList(namespaceData, chunkData, chunkfullData, file2chunkData, serverData, waitleaseData, filePath, fd, maxUseRate, timestamp, heartbeatTime, chunkDeadTime, lockDuration, recordPath);

  return result;
// END
};


// get list of chunkserver to read
exports.getReadServerList = async function(){
// START
  reload();
  // run
  var namespaceData = {"/usr":{"_type":"dir","_lock":{},"/data":{"_type":"dir","_lock":{},"/001":{"_type":"file","_lock":{}}}}};
  var file2chunkData = {"/usr/data/001":["aabbccdd", "eeffgghh"]};
  var chunkData = {"aabbccdd":[1,20,"127.0.0.1:3001,1600247712022","127.0.0.1:3002,1600247712022","127.0.0.1:3003,1600247712022,P"], "eeffgghh":[1,20,"127.0.0.1:3001,1600247712022","127.0.0.1:3002,1600247712022","127.0.0.1:3003,1600247712022,P"]};
  var filePath = "/usr/data/001";
  var fd = 1607151913750;
  var index = 1;
  var count = "3";
  var timestamp = 1602211802872;
  var lockDuration = 300000;
  var result = await clientHandler.getReadServerList(namespaceData, file2chunkData, chunkData, filePath, fd, index, count, timestamp, lockDuration);

  return result;
// END
};


// run snapshot
exports.snapshot = async function(){
// START
  reload();
  // run
  var namespaceData = {"/usr/data/001":["aabbccdd"]};
  var filePath = "/usr/data/1.txt";
  var recordPath = "C:\\work\\GFS2\\AppData\\master\\namespace.rec";
  var result = await clientHandler.snapshot(namespaceData, filePath, recordPath);

  return result;
// END
};
