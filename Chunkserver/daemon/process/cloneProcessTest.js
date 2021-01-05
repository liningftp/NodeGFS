
const fs = require("fs");
const child_process = require("child_process");

let cloneProcess = require("C:\\work\\Git_work\\NodeGFS\\Chunkserver\\daemon\\process\\cloneProcess.js");


////////////////////////////////////////////////////////////////////////////////

function reload(){
  delete require.cache[require.resolve("C:\\work\\Git_work\\NodeGFS\\Chunkserver\\daemon\\process\\cloneProcess.js")]
  cloneProcess = require("C:\\work\\Git_work\\NodeGFS\\Chunkserver\\daemon\\process\\cloneProcess.js");
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
exports._start = async function(){
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
      "readChunk"
    ],
    "returnValueList": [
      {
        "result": {
          "code": 0
        },
        "bigData": "hello girl"
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
  var cloneQueue = ["aabbccdd,3,127.0.0.1:3002,127.0.0.1:3003"]
  var chunkRoot = "C:\\work\\GFS2\\AppData\\chunkserver\\chunk1";
  var blockSize = 65536;
  var maxChunkSize = 67108864;
  var result = await cloneProcess._start(cloneQueue, chunkRoot, blockSize, maxChunkSize);

  // send to exit

  return result;
// END
};


// clone chunk to disk
exports._clone = async function(){
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
      "readChunk"
    ],
    "returnValueList": [
      {
        "result": {
          "code": 0
        },
        "bigData": "hello girl"
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
  var cloneList = ["aabbccdd,3,127.0.0.1:3002,127.0.0.1:3003","eeffgghh,10,127.0.0.1:3002,127.0.0.1:3003"]
  var chunkRoot = "C:\\work\\GFS2\\AppData\\chunkserver\\chunk1";
  var blockSize = 65536;
  var maxChunkSize = 67108864;
  var result = await cloneProcess._clone(cloneList, chunkRoot, blockSize, maxChunkSize);

  // send to exit

  return result;
// END
};
