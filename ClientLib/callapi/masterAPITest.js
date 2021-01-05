
const fs = require("fs");
const child_process = require("child_process");

let masterAPI = require("C:\\work\\Git_work\\NodeGFS\\ClientLib\\callapi\\masterAPI.js");


////////////////////////////////////////////////////////////////////////////////

function reload(){
  delete require.cache[require.resolve("C:\\work\\Git_work\\NodeGFS\\ClientLib\\callapi\\masterAPI.js")]
  masterAPI = require("C:\\work\\Git_work\\NodeGFS\\ClientLib\\callapi\\masterAPI.js");
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

// open system file
exports.open = async function(){
// START
  reload();
  // run
  var filePath = "/use/data/001";
  var flags = "O_RDONLY";
  var mode = "O_APPEND";
  var masterHost = "127.0.0.1";
  var masterPort = 3000;
  var result = await masterAPI.open(filePath, flags, mode, masterHost, masterPort);

  return result;
// END
};


// close system file
exports.close = async function(){
// START
  reload();
  // run
  var filePath = "/usr/data/001";
  var fd = 1606102127166;
  var masterHost = "127.0.0.1";
  var masterPort = 3000;
  var result = await masterAPI.close(filePath, fd, masterHost, masterPort);

  return result;
// END
};


// Delete directory
exports.deleteDir = async function(){
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
      "deleteDir"
    ],
    "returnValueList": [
      {
        "result": {
          "code": 0
        }
      }
    ]
  }
];
  var childList = [];
  for(var i = 0, startParam; startParam = startParamList[i]; i++){
    var child = await forkServer(forkFile, startParam);
    childList.push(child);
  }

  // run
  var filePath = "/use/data";
  var fd = 1606961159937;
  var masterHost = "127.0.0.1";
  var masterPort = 3000;
  var result = await masterAPI.deleteDir(filePath, fd, masterHost, masterPort);

  // send to exit

  return result;
// END
};


// Create directory
exports.createDir = async function(){
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
      "createDir"
    ],
    "returnValueList": [
      {
        "result": {
          "code": 0
        }
      }
    ]
  }
];
  var childList = [];
  for(var i = 0, startParam; startParam = startParamList[i]; i++){
    var child = await forkServer(forkFile, startParam);
    childList.push(child);
  }

  // run
  var filePath = "/use/data";
  var masterHost = "127.0.0.1";
  var masterPort = 3000;
  var result = await masterAPI.createDir(filePath, masterHost, masterPort);

  // send to exit

  return result;
// END
};


// delete file
exports.deleteFile = async function(){
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
      "deleteFile"
    ],
    "returnValueList": [
      {
        "result": {
          "code": 0
        }
      }
    ]
  }
];
  var childList = [];
  for(var i = 0, startParam; startParam = startParamList[i]; i++){
    var child = await forkServer(forkFile, startParam);
    childList.push(child);
  }

  // run
  var filePath = "/use/data/001";
  var fd = 1606909907287;
  var masterHost = "127.0.0.1";
  var masterPort = 3000;
  var result = await masterAPI.deleteFile(filePath, fd, masterHost, masterPort);

  // send to exit

  return result;
// END
};


// create file
exports.createFile = async function(){
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
      "createFile"
    ],
    "returnValueList": [
      {
        "result": {
          "code": 0
        }
      }
    ]
  }
];
  var childList = [];
  for(var i = 0, startParam; startParam = startParamList[i]; i++){
    var child = await forkServer(forkFile, startParam);
    childList.push(child);
  }

  // run
  var filePath = "/use/data/001";
  var replicaCount = 0;
  var masterHost = "127.0.0.1";
  var masterPort = 3000;
  var result = await masterAPI.createFile(filePath, replicaCount, masterHost, masterPort);

  // send to exit

  return result;
// END
};


// get serverList where write on
exports.getWriteServerList = async function(){
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
      "getWriteServerList"
    ],
    "returnValueList": [
      {
        "result": {
          "code": 0,
          "msg": "",
          "data": {
            "version": 1,
            "primary": "127.0.0.1:3001",
            "serverList": [
              "127.0.0.1:3001",
              "127.0.0.1:3002",
              "127.0.0.1:3003"
            ]
          }
        }
      }
    ]
  }
];
  var childList = [];
  for(var i = 0, startParam; startParam = startParamList[i]; i++){
    var child = await forkServer(forkFile, startParam);
    childList.push(child);
  }

  // run
  var filePath = "/usr/data/001";
  var fd = 1606102127166;
  var index = 2;
  var masterHost = "127.0.0.1";
  var masterPort = 3000;
  var result = await masterAPI.getWriteServerList(filePath, fd, index, masterHost, masterPort);

  // send to exit

  return result;
// END
};


// get serverList where read from
exports.getReadServerList = async function(){
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
      "getReadServerList"
    ],
    "returnValueList": [
      {
        "result": {
          "code": 0,
          "data": {
            "3": {
              "chunkName": "aabbccdd",
              "version": 6,
              "serverList": [
                "127.0.0.1:3001",
                "127.0.0.1:3002",
                "127.0.0.1:3003"
              ]
            }
          },
          "msg": ""
        }
      }
    ]
  }
];
  var childList = [];
  for(var i = 0, startParam; startParam = startParamList[i]; i++){
    var child = await forkServer(forkFile, startParam);
    childList.push(child);
  }

  // run
  var filePath = "/usr/data/001";
  var fd = 1607151913750;
  var index = 1;
  var count = 3;
  var masterHost = "127.0.0.1";
  var masterPort = 3000;
  var result = await masterAPI.getReadServerList(filePath, fd, index, count, masterHost, masterPort);

  // send to exit

  return result;
// END
};


// get serverList where to append
exports.getAppendServerList = async function(){
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
      "getAppendServerList"
    ],
    "returnValueList": [
      {
        "result": {
          "code": 0,
          "msg": "",
          "data": {
            "version": 1,
            "primary": "127.0.0.1:3001",
            "serverList": [
              "127.0.0.1:3001",
              "127.0.0.1:3002",
              "127.0.0.1:3003"
            ]
          }
        }
      }
    ]
  }
];
  var childList = [];
  for(var i = 0, startParam; startParam = startParamList[i]; i++){
    var child = await forkServer(forkFile, startParam);
    childList.push(child);
  }

  // run
  var filePath = "/usr/data/001";
  var fd = 1606961159937;
  var masterHost = "127.0.0.1";
  var masterPort = 3000;
  var result = await masterAPI.getAppendServerList(filePath, fd, masterHost, masterPort);

  // send to exit

  return result;
// END
};
