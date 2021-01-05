
const fs = require("fs");
const child_process = require("child_process");

let heartbeatProcess = require("C:\\work\\Git_work\\NodeGFS\\Chunkserver\\daemon\\process\\heartbeatProcess.js");


////////////////////////////////////////////////////////////////////////////////

function reload(){
  delete require.cache[require.resolve("C:\\work\\Git_work\\NodeGFS\\Chunkserver\\daemon\\process\\heartbeatProcess.js")]
  heartbeatProcess = require("C:\\work\\Git_work\\NodeGFS\\Chunkserver\\daemon\\process\\heartbeatProcess.js");
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
          "restoreList": [],
          "createList": [],
          "removeList": []
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
  var collectList = ["aabbccdd,2", "eeffgghh,1"]
  var errorList = ["eeffgghh"]
  var leaseList = ["aabbccdd"]
  var useRate = 25;
  var startTime = 1602671114309;
  var masterHost = "127.0.0.1";
  var masterPort = 3000;
  var localHost = "127.0.0.1";
  var localPort = 3001;
  var result = await heartbeatProcess._start(collectList, errorList, leaseList, useRate, startTime, masterHost, masterPort, localHost, localPort);

  // send to exit

  return result;
// END
};
