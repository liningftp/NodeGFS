
const fs = require("fs");
const child_process = require("child_process");

let heartbeatHandler = require("C:\\work\\Git_work\\NodeGFS\\Master\\business\\heartbeatHandler.js");


////////////////////////////////////////////////////////////////////////////////

function reload(){
  delete require.cache[require.resolve("C:\\work\\Git_work\\NodeGFS\\Master\\business\\heartbeatHandler.js")]
  heartbeatHandler = require("C:\\work\\Git_work\\NodeGFS\\Master\\business\\heartbeatHandler.js");
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

// receive heartbeat package
exports.recvHeartbeat = async function(){
// START
  reload();
  // run
  var chunkData = {"aabbccdd":["127.0.0.1:3001,30,1,1585579929367", "127.0.0.1:3002,30,1", "127.0.0.1:3003,30,1"],"eeffgghh":["127.0.0.1:3001,33,1,1585580705452", "127.0.0.1:3002,32,0", "127.0.0.1:3003,33,1"],"ooxxpppp":["127.0.0.1:3001,6,1,1585579929367", "127.0.0.1:3002,6,1", "127.0.0.1:3003,6,1"]};
  var serverData = {"127.0.0.1:3001":[12,1599033406152],"127.0.0.1:3002":[22,1599033664421],"127.0.0.1:3003":[18,1599033677924]};
  var chunkrepairData = {};
  var startupData = {"startTime": 1602228234877};
  var pair = "127.0.0.1:3002";
  var useRate = 28;
  var collectList = ["aabbccdd,3", "eeffgghh,10"]
  var errorList = ["eeffgghh"]
  var leaseList = ["aabbccdd"]
  var startTime = 1593947506381;
  var timestamp = 1602295184323;
  var heartbeatTime = 60000;
  var chunkDeadTime = 86400000;
  var result = await heartbeatHandler.recvHeartbeat(chunkData, serverData, chunkrepairData, startupData, pair, useRate, collectList, errorList, leaseList, startTime, timestamp, heartbeatTime, chunkDeadTime);

  return result;
// END
};


// get clone list of chunk
exports._getCloneList = function(){
// START
  reload();
  // run
  var chunkData = {"aabbccdd":["127.0.0.1:3001,30,1,1585579929367", "127.0.0.1:3002,30,1", "127.0.0.1:3003,30,1"],"eeffgghh":["127.0.0.1:3001,33,1,1585580705452", "127.0.0.1:3002,32,0", "127.0.0.1:3003,33,1"],"ooxxpppp":["127.0.0.1:3001,6,1,1585579929367", "127.0.0.1:3002,6,1", "127.0.0.1:3003,6,1"]};
  var chunkrepairData = {};
  var repairCount = 1;
  var pair = "127.0.0.1:3001";
  var useRate = 25;
  var timestamp = 1602295184323;
  var chunkDeadTime = 7200000;
  var result = heartbeatHandler._getCloneList(chunkData, chunkrepairData, repairCount, pair, useRate, timestamp, chunkDeadTime);

  return result;
// END
};


// handle chunk of chunkserver collect
exports._handleCollect = function(){
// START
  reload();
  // run
  var chunkData = {"aabbccdd":[1,10,"127.0.0.1:3001,1585471730177","127.0.0.1:3002,1585471730177","127.0.0.1:3003,1585471730177"]};
  var chunkrepairData = {};
  var startupData = {};
  var collectList = ["aabbccdd,10", "eeffgghh,10"]
  var pair = "127.0.0.1:3002";
  var timestamp = 1602340386329;
  var heartbeatTime = 60000;
  var chunkDeadTime = 7200000;
  var result = heartbeatHandler._handleCollect(chunkData, chunkrepairData, startupData, collectList, pair, timestamp, heartbeatTime, chunkDeadTime);

  return result;
// END
};


// handle error chunk
exports._handleError = function(){
// START
  reload();
  // run
  var chunkData = {"aabbccdd":[1,10,3,"127.0.0.1:3001,1585471730177","127.0.0.1:3002,1585471730177","127.0.0.1:3003,1585471730177"]};
  var chunkrepairData = {};
  var errorList = ["aabbccdd"]
  var pair = "127.0.0.1:3002";
  var timestamp = 1585471730177;
  var chunkDeadTime = 7200000;
  var result = heartbeatHandler._handleError(chunkData, chunkrepairData, errorList, pair, timestamp, chunkDeadTime);

  return result;
// END
};


// handle renew lease
exports._handleLease = function(){
// START
  reload();
  // run
  var chunkData = {"aabbccdd":[1,10,3,"127.0.0.1:3001,1585471730177","127.0.0.1:3002,1585471730177","127.0.0.1:3003,1585471730177"]};
  var chunkNameList = ["aabbccdd"]
  var pair = "127.0.0.1:3001";
  var timestamp = 1602342236570;
  var result = heartbeatHandler._handleLease(chunkData, chunkNameList, pair, timestamp);

  return result;
// END
};
