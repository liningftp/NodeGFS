
const fs = require("fs");
const child_process = require("child_process");

let secondaryAPI = require("C:\\work\\Git_work\\NodeGFS\\Chunkserver\\callapi\\secondaryAPI.js");


////////////////////////////////////////////////////////////////////////////////

function reload(){
  delete require.cache[require.resolve("C:\\work\\Git_work\\NodeGFS\\Chunkserver\\callapi\\secondaryAPI.js")]
  secondaryAPI = require("C:\\work\\Git_work\\NodeGFS\\Chunkserver\\callapi\\secondaryAPI.js");
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

// push data to secondary
exports.secondPushData = async function(){
// START
  reload();

  // start subProcess
  var forkFile = "C:\\work\\CodeDesign\\server\\resource\\netServer.js";
  var startParamList = [
  {
    "method": "startServer",
    "host": "127.0.0.1",
    "port": 3002,
    "targetNameList": [
      "secondPushData"
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
  var secondServerList = ['127.0.0.1:3002', '127.0.0.1:3003']
  var cacheKey = "key123456";
  var contentData = Buffer.from("hello");
  var result = await secondaryAPI.secondPushData(secondServerList, cacheKey, contentData);

  // send to exit

  return result;
// END
};


// secondary create chunk
exports.secondCreateChunk = async function(){
// START
  reload();

  // start subProcess
  var forkFile = "C:\\work\\CodeDesign\\server\\resource\\netServer.js";
  var startParamList = [
  {
    "method": "startServer",
    "host": "127.0.0.1",
    "port": 3002,
    "targetNameList": [
      "secondCreateChunk"
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
  var secondServerList = ["127.0.0.1:3002", "127.0.0.1:3003"]
  var chunkName = "ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b";
  var version = 66;
  var result = await secondaryAPI.secondCreateChunk(secondServerList, chunkName, version);

  // send to exit

  return result;
// END
};


// chunk size guarantee
exports.secondGuarantee = async function(){
// START
  reload();

  // start subProcess
  var forkFile = "C:\\work\\CodeDesign\\server\\resource\\netServer.js";
  var startParamList = [
  {
    "method": "startServer",
    "host": "127.0.0.1",
    "port": 3003,
    "targetNameList": [
      "secondGuarantee"
    ],
    "returnValueList": [
      {
        "result": {
          "code": 0,
          "data": {
            "maxSize": 10
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
  var secondServerList = ['127.0.0.1:3003']
  var chunkName = "aabbccdd";
  var cacheKey = "key123456";
  var privSize = 5;
  var version = 2;
  var result = await secondaryAPI.secondGuarantee(secondServerList, chunkName, cacheKey, privSize, version);

  // send to exit

  return result;
// END
};


// secondary write
exports.secondWrite = async function(){
// START
  reload();

  // start subProcess
  var forkFile = "C:\\work\\CodeDesign\\server\\resource\\netServer.js";
  var startParamList = [
  {
    "method": "startServer",
    "host": "127.0.0.1",
    "port": 3003,
    "targetNameList": [
      "secondWrite"
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
  var secondServerList = ["127.0.0.1:3003"]
  var cacheKey = "key123456";
  var chunkName = "aabbccdd";
  var startPos = 1;
  var version = 1;
  var result = await secondaryAPI.secondWrite(secondServerList, cacheKey, chunkName, startPos, version);

  // send to exit

  return result;
// END
};


// secondary padding char 0 to chunk
exports.secondPadding = async function(){
// START
  reload();

  // start subProcess
  var forkFile = "C:\\work\\CodeDesign\\server\\resource\\netServer.js";
  var startParamList = [
  {
    "method": "startServer",
    "host": "127.0.0.1",
    "port": 3002,
    "targetNameList": [
      "secondPadding"
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
  var secondServerList = ["127.0.0.1:3002", "127.0.0.1:3003"]
  var chunkName = "aabbccdd";
  var targetSize = 65536;
  var result = await secondaryAPI.secondPadding(secondServerList, chunkName, targetSize);

  // send to exit

  return result;
// END
};


// set secondary version
exports.secondSetVersion = async function(){
// START
  reload();

  // start subProcess
  var forkFile = "C:\\work\\CodeDesign\\server\\resource\\netServer.js";
  var startParamList = [
  {
    "method": "startServer",
    "host": "127.0.0.1",
    "port": 3002,
    "targetNameList": [
      "secondSetVersion"
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
  var secondServerList = ["127.0.0.1:3002", "127.0.0.1:3003"]
  var chunkName = "aabbccdd";
  var version = "21";
  var result = await secondaryAPI.secondSetVersion(secondServerList, chunkName, version);

  // send to exit

  return result;
// END
};


// secondary record append
exports.secondAppend = async function(){
// START
  reload();

  // start subProcess
  var forkFile = "C:\\work\\CodeDesign\\server\\resource\\netServer.js";
  var startParamList = [
  {
    "method": "startServer",
    "host": "127.0.0.1",
    "port": 3002,
    "targetNameList": [
      "secondAppend"
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
  var secondServerList = ["127.0.0.1:3002", "127.0.0.1:3003"]
  var cacheKey = "key123456";
  var chunkName = "aabbccdd";
  var result = await secondaryAPI.secondAppend(secondServerList, cacheKey, chunkName);

  // send to exit

  return result;
// END
};
