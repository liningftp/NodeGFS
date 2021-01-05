
const fs = require("fs");
const child_process = require("child_process");

let chunkdataTool = require("C:\\work\\Git_work\\NodeGFS\\Master\\metadata\\tool\\chunkdataTool.js");


////////////////////////////////////////////////////////////////////////////////

function reload(){
  delete require.cache[require.resolve("C:\\work\\Git_work\\NodeGFS\\Master\\metadata\\tool\\chunkdataTool.js")]
  chunkdataTool = require("C:\\work\\Git_work\\NodeGFS\\Master\\metadata\\tool\\chunkdataTool.js");
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

// add chunk in init
exports.add = function(){
// START
  reload();
  // run
  var chunkData = {};
  var chunkName = "aabbccdd";
  var version = 1;
  var replicaCount = 3;
  var serverList = ["127.0.0.1:3001", "127.0.0.1:3002", "127.0.0.1:3003"]
  var timestamp = 1602253824890;
  var result = chunkdataTool.add(chunkData, chunkName, version, replicaCount, serverList, timestamp);

  return result;
// END
};


// get chunk data
exports.get = function(){
// START
  reload();
  // run
  var chunkData = {"aabbccdd":[1,10,"127.0.0.1:3001,1585471730177","127.0.0.1:3002,1585471730177","127.0.0.1:3003,1585471730177"]};
  var chunkName = "aabbccdd";
  var result = chunkdataTool.get(chunkData, chunkName);

  return result;
// END
};


// has chunkName or not
exports.has = function(){
// START
  reload();
  // run
  var chunkData = {"aabbccdd":[1,10,"127.0.0.1:3001,1585471730177","127.0.0.1:3002,1585471730177","127.0.0.1:3003,1585471730177"]};
  var chunkName = "aabbccdd";
  var result = chunkdataTool.has(chunkData, chunkName);

  return result;
// END
};


// delete chunk
exports.delete = function(){
// START
  reload();
  // run
  var chunkData = {"aabbccdd":[1,1,3,"127.0.0.1:3001,1602253824890","127.0.0.1:3002,1602253824890","127.0.0.1:3003,1602253824890"]};
  var chunkNameList = ['aabbccdd']
  var result = chunkdataTool.delete(chunkData, chunkNameList);

  return result;
// END
};


// add pair to chunkdata
exports.addPair = function(){
// START
  reload();
  // run
  var chunkData = {"aabbccdd":[1,1,3]};
  var chunkName = "aabbccdd";
  var pair = "127.0.0.1:3001";
  var timestamp = 1600241484546;
  var result = chunkdataTool.addPair(chunkData, chunkName, pair, timestamp);

  return result;
// END
};


// has pair or not
exports.hasPair = function(){
// START
  reload();
  // run
  var chunkData = {"aabbccdd":[1,1,3,"127.0.0.1:3001,1602253824890","127.0.0.1:3002,1602253824890","127.0.0.1:3003,1602253824890"]};
  var chunkName = "aabbccdd";
  var pair = "127.0.0.1:3002";
  var result = chunkdataTool.hasPair(chunkData, chunkName, pair);

  return result;
// END
};


// remove pair from chunkdata
exports.removePair = function(){
// START
  reload();
  // run
  var chunkData = {"aabbccdd":[1,10,3,"127.0.0.1:3001,1585471730177","127.0.0.1:3002,1585471730177","127.0.0.1:3003,1585471730177"]};
  var chunkName = "aabbccdd";
  var pair = "127.0.0.1:3002";
  var result = chunkdataTool.removePair(chunkData, chunkName, pair);

  return result;
// END
};


// clear expire chunk
exports.clearExpire = function(){
// START
  reload();
  // run
  var chunkData = {"ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b":[1,10,3,"127.0.0.1:3001,1606441373142","127.0.0.1:3002,1606289531449","127.0.0.1:3003,1606289531449"]};
  var chunkName = "ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b";
  var timestamp = 1606441373142;
  var chunkDeadTime = 7200000;
  var result = chunkdataTool.clearExpire(chunkData, chunkName, timestamp, chunkDeadTime);

  return result;
// END
};


// find pair
exports.findPairIndex = function(){
// START
  reload();
  // run
  var chunkData = {"aabbccdd":[1,10,3,"127.0.0.1:3001,1585471730177","127.0.0.1:3002,1585471730177","127.0.0.1:3003,1585471730177"]};
  var chunkName = "aabbccdd";
  var pair = "127.0.0.1:3002";
  var result = chunkdataTool.findPairIndex(chunkData, chunkName, pair);

  return result;
// END
};


// get chunk version
exports.getVersion = function(){
// START
  reload();
  // run
  var chunkData = {"aabbccdd":[1,2,3,"127.0.0.1:3001,1585471730177","127.0.0.1:3002,1585471730177","127.0.0.1:3003,1585471730177"]};
  var chunkName = "aabbccdd";
  var result = chunkdataTool.getVersion(chunkData, chunkName);

  return result;
// END
};


// set chunk version
exports.setVersion = function(){
// START
  reload();
  // run
  var chunkData = {"aabbccdd":[1,2,3,"127.0.0.1:3001,1585471730177","127.0.0.1:3002,1585471730177","127.0.0.1:3003,1585471730177"]};
  var chunkName = "aabbccdd";
  var version = 11;
  var result = chunkdataTool.setVersion(chunkData, chunkName, version);

  return result;
// END
};


// create unique chunk name
exports.getNewChunkName = function(){
// START
  reload();
  // run
  var chunkData = {"aabbccdd":[1,2,3,"127.0.0.1:3001,1585471730177","127.0.0.1:3002,1585471730177","127.0.0.1:3003,1585471730177"]};
  var result = chunkdataTool.getNewChunkName(chunkData);

  return result;
// END
};


// check version
exports.checkVersion = function(){
// START
  reload();
  // run
  var chunkData = {"aabbccdd":[1,10,3,"127.0.0.1:3001,1585471730177","127.0.0.1:3002,1585471730177","127.0.0.1:3003,1585471730177"]};
  var chunkName = "aabbccdd";
  var version = 10;
  var result = chunkdataTool.checkVersion(chunkData, chunkName, version);

  return result;
// END
};


// reduce chunk refer count
exports.subReferCount = function(){
// START
  reload();
  // run
  var chunkData = {"aabbccdd":[1,20,3,"127.0.0.1:3001,20,P,1585471730177","127.0.0.1:3002,20","127.0.0.1:3003,20"]};
  var chunkName = "aabbccdd";
  var result = chunkdataTool.subReferCount(chunkData, chunkName);

  return result;
// END
};


// add chunk refer count
exports.addReferCount = function(){
// START
  reload();
  // run
  var chunkData = {"aabbccdd":[1,20,3,"127.0.0.1:3001,20,P,1585471730177","127.0.0.1:3002,20","127.0.0.1:3003,20"]};
  var chunkName = "aabbccdd";
  var result = chunkdataTool.addReferCount(chunkData, chunkName);

  return result;
// END
};


// get primary chunk
exports.getPrimary = function(){
// START
  reload();
  // run
  var chunkData = {"aabbccdd":[1,20,3,"127.0.0.1:3001,1600247712022,P","127.0.0.1:3002,1600247712022","127.0.0.1:3003,1600247712022"]};
  var chunkName = "aabbccdd";
  var leaseTime = 60000;
  var timestamp = 1600247712022;
  var result = chunkdataTool.getPrimary(chunkData, chunkName, leaseTime, timestamp);

  return result;
// END
};


// set primary chunk
exports.setPrimary = function(){
// START
  reload();
  // run
  var chunkData = {"aabbccdd":[1,20,3,"127.0.0.1:3001,1598516343990","127.0.0.1:3002,1600247712022","127.0.0.1:3003,1598516343990,P"]};
  var chunkName = "aabbccdd";
  var pair = "127.0.0.1:3002";
  var timestamp = 1601341184732;
  var result = chunkdataTool.setPrimary(chunkData, chunkName, pair, timestamp);

  return result;
// END
};


// update report time of pair
exports.updateTime = function(){
// START
  reload();
  // run
  var chunkData = {"aabbccdd":[1,10,3]};
  var chunkName = "aabbccdd";
  var pair = "127.0.0.1:3003";
  var timestamp = 1602323111556;
  var result = chunkdataTool.updateTime(chunkData, chunkName, pair, timestamp);

  return result;
// END
};


// get replica count
exports.getReplicaCount = function(){
// START
  reload();
  // run
  var chunkData = {"aabbccdd":[1,20,3,"127.0.0.1:3001,1598516343990","127.0.0.1:3002,1600247712022","127.0.0.1:3003,1598516343990,P"]};
  var chunkName = "aabbccdd";
  var result = chunkdataTool.getReplicaCount(chunkData, chunkName);

  return result;
// END
};


// get servers of chunk
exports.getServerList = function(){
// START
  reload();
  // run
  var chunkData = {"aabbccdd":[1,10,3,"127.0.0.1:3001,1585471730177","127.0.0.1:3002,1585471730177","127.0.0.1:3003,1585471730177"]};
  var chunkName = "aabbccdd";
  var result = chunkdataTool.getServerList(chunkData, chunkName);

  return result;
// END
};


// check chunk is good or not
exports.isGood = function(){
// START
  reload();
  // run
  var chunkData = {"aabbccdd":[1,2,3,"127.0.0.1:3001,1600241484545","127.0.0.1:3002,1600241484545","127.0.0.1:3003,1600241484545"]};
  var chunkName = "aabbccdd";
  var timestamp = 1600241484545;
  var chunkDeadTime = 7200000;
  var result = chunkdataTool.isGood(chunkData, chunkName, timestamp, chunkDeadTime);

  return result;
// END
};
