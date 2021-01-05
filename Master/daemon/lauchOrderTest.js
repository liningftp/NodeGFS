
const fs = require("fs");
const child_process = require("child_process");

let lauchOrder = require("C:\\work\\Git_work\\NodeGFS\\Master\\daemon\\lauchOrder.js");


////////////////////////////////////////////////////////////////////////////////

function reload(){
  delete require.cache[require.resolve("C:\\work\\Git_work\\NodeGFS\\Master\\daemon\\lauchOrder.js")]
  lauchOrder = require("C:\\work\\Git_work\\NodeGFS\\Master\\daemon\\lauchOrder.js");
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

// set new chunk to metadata and persist data
exports.setNewChunk = function(){
// START
  reload();
  // run
  var file2chunkData = {"/usr/data/001":["aabbccdd"], "/usr/data/002":["eeffgghh"]};
  var chunkData = {};
  var filePath = "/usr/data/001";
  var chunkName = "aabbccdd";
  var serverList = ["127.0.0.1:3001", "127.0.0.1:3002", "127.0.0.1:3003"]
  var primary = "127.0.0.1:3001";
  var version = 1;
  var replicaCount = 3;
  var timestamp = 1602252811319;
  var result = lauchOrder.setNewChunk(file2chunkData, chunkData, filePath, chunkName, serverList, primary, version, replicaCount, timestamp);

  return result;
// END
};


// revoke lease of primary to run snapshot
exports.revokeLease = async function(){
// START
  reload();
  // run
  var chunkData = {"aabbccdd":[1,20,3,"127.0.0.1:3001,1600247712022","127.0.0.1:3002,1600247712022","127.0.0.1:3003,1600247712022,P"]};
  var chunkName = "aabbccdd";
  var result = await lauchOrder.revokeLease(chunkData, chunkName);

  return result;
// END
};


// grant lease to primary
exports.grantLease = async function(){
// START
  reload();
  // run
  var waitleaseData = {};
  var chunkName = "ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b";
  var serverList = ["127.0.0.1:3001", "127.0.0.1:3002", "127.0.0.1:3003"]
  var primary = "127.0.0.1:3001";
  var version = 1;
  var timestamp = 1606639653647;
  var isNew = 0;
  var result = await lauchOrder.grantLease(waitleaseData, chunkName, serverList, primary, version, timestamp, isNew);

  return result;
// END
};
