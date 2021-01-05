
const fs = require("fs");
const child_process = require("child_process");

let daemon = require("C:\\work\\Git_work\\NodeGFS\\Chunkserver\\daemon\\daemon.js");


////////////////////////////////////////////////////////////////////////////////

function reload(){
  delete require.cache[require.resolve("C:\\work\\Git_work\\NodeGFS\\Chunkserver\\daemon\\daemon.js")]
  daemon = require("C:\\work\\Git_work\\NodeGFS\\Chunkserver\\daemon\\daemon.js");
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

// start
exports.start = async function(){
// START
  reload();

  // start subProcess
  var forkFile = "C:\\work\\CodeDesign\\server\\resource\\netServer.js";
  var startParamList = [
  {
    "method": "startServer",
    "host": "127.0.0.1",
    "port": 3000,
    "targetNameList": [
      "recvHeartbeatReport"
    ],
    "returnValueList": [
      {
        "result": {
          "code": 0
        },
        "bigData": {
          "restoreList": [
            "aabbccdd,127.0.0.1:3002"
          ],
          "createList": [],
          "removeList": []
        }
      }
    ]
  },
  {
    "method": "startServer",
    "host": "127.0.0.1",
    "port": 3002,
    "targetNameList": [
      "readChunk"
    ],
    "returnValueList": [
      {
        "result": {
          "code": 0,
          "data": {
            "version": 3,
            "checksumList": [
              -1234567890
            ]
          },
          "msg": ""
        },
        "bigData": "ooxx"
      }
    ]
  }
];
  var childList = [];
  for(var i = 0, startParam; startParam = startParamList[i]; i++){
    var child = await forkServer(forkFile, startParam);
    childList.push(child);
  }


  // ready file dependent on to test
  var fileList = [
    {
        "filePath": "C:\\work\\GFS2\\AppData\\chunkserver\\checksum1\\data",
        "fileContent": ""
    },
    {
        "filePath": "C:\\work\\GFS2\\AppData\\chunkserver\\version1\\data",
        "fileContent": ""
    }
];
  fileList.forEach(item => {
    fs.writeFileSync(item.filePath, item.fileContent);
  });

  // run
  var checksumData = {};
  var checksumFreeData = {};
  var chunkData = {};
  var chunkversionData = {};
  var chunkversionFreeData = {};
  var errorData = {};
  var leaseData = {};
  var masterData = {"startTime":1602907450469};
  var checksumPath = "C:\\work\\GFS2\\AppData\\chunkserver\\checksum1\\data";
  var chunkRoot = "C:\\work\\GFS2\\AppData\\chunkserver\\chunk1\\";
  var versionPath = "C:\\work\\GFS2\\AppData\\chunkserver\\version1\\data";
  var blockSize = 65536;
  var maxChunkSize = 67108864;
  var maxChunkCount = 25;
  var masterHost = "127.0.0.1";
  var masterPort = 3000;
  var localHost = "127.0.0.1";
  var localPort = 3001;
  var logPath = "C:\\work\\GFS2\\AppData\\chunkserver\\log.log";
  var result = await daemon.start(checksumData, checksumFreeData, chunkData, chunkversionData, chunkversionFreeData, errorData, leaseData, masterData, checksumPath, chunkRoot, versionPath, blockSize, maxChunkSize, maxChunkCount, masterHost, masterPort, localHost, localPort, logPath);

  // send to exit

  return result;
// END
};


// handle clone data after chunk has be cloned to disk
exports._handleClone = function(){
// START
  reload();
  // run
  var checksumData = {"5964d672f56753389f3d89906ab238fbc680359229015a15a4ca66e466b128bc":[0,[12345679]]};
  var checksumFreeData = []
  var chunkData = {"5964d672f56753389f3d89906ab238fbc680359229015a15a4ca66e466b128bc":[1024,0]};
  var chunkversionData = {"5964d672f56753389f3d89906ab238fbc680359229015a15a4ca66e466b128bc":[0,3]};
  var chunkversionFreeData = []
  var cloneData = {"5964d672f56753389f3d89906ab238fbc680359229015a15a4ca66e466b128bc": {"version":3003, "checksumList":[123456799], "size":2024}};
  var checksumPath = "C:\\work\\GFS2\\AppData\\chunkserver\\checksum1\\data";
  var versionPath = "C:\\work\\GFS2\\AppData\\chunkserver\\version1\\data";
  var result = daemon._handleClone(checksumData, checksumFreeData, chunkData, chunkversionData, chunkversionFreeData, cloneData, checksumPath, versionPath);

  return result;
// END
};


// handle delete chunk from master
exports._handleDelete = function(){
// START
  reload();
  // run
  var checksumData = {"5964d672f56753389f3d89906ab238fbc680359229015a15a4ca66e466b128bc":[0,[12345679]]};
  var checksumFreeData = []
  var chunkData = {"5964d672f56753389f3d89906ab238fbc680359229015a15a4ca66e466b128bc":[1024,0]};
  var chunkversionData = {"5964d672f56753389f3d89906ab238fbc680359229015a15a4ca66e466b128bc":[0,3]};
  var chunkversionFreeData = []
  var deleteList = ["5964d672f56753389f3d89906ab238fbc680359229015a15a4ca66e466b128bc"]
  var chunkRoot = "C:\\work\\GFS2\\AppData\\chunkserver\\chunk1\\";
  var checksumPath = "C:\\work\\GFS2\\AppData\\chunkserver\\checksum1\\data";
  var versionPath = "C:\\work\\GFS2\\AppData\\chunkserver\\version1\\data";
  var result = daemon._handleDelete(checksumData, checksumFreeData, chunkData, chunkversionData, chunkversionFreeData, deleteList, chunkRoot, checksumPath, versionPath);

  return result;
// END
};
