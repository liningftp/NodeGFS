
const fs = require("fs");
const child_process = require("child_process");

let serverdataTool = require("C:\\work\\Git_work\\NodeGFS\\Master\\metadata\\tool\\serverdataTool.js");


////////////////////////////////////////////////////////////////////////////////

function reload(){
  delete require.cache[require.resolve("C:\\work\\Git_work\\NodeGFS\\Master\\metadata\\tool\\serverdataTool.js")]
  serverdataTool = require("C:\\work\\Git_work\\NodeGFS\\Master\\metadata\\tool\\serverdataTool.js");
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

// update use rate or time
exports.update = function(){
// START
  reload();
  // run
  var serverData = {"127.0.0.1:3001":[12,1599033406152],"127.0.0.1:3002":[22,1599033664421],"127.0.0.1:3003":[18,1599033677924]};
  var pair = "127.0.0.1:3003";
  var useRate = 25;
  var timestamp = 1600334079891;
  var result = serverdataTool.update(serverData, pair, useRate, timestamp);

  return result;
// END
};


// add chunkserver
exports.add = function(){
// START
  reload();
  // run
  var serverData = {"127.0.0.1:3001":[12,1599033406152],"127.0.0.1:3002":[22,1599033664421],"127.0.0.1:3003":[18,1599033677924]};
  var pair = "127.0.0.1:3003";
  var useRate = 2;
  var timestamp = 1600334079891;
  var result = serverdataTool.add(serverData, pair, useRate, timestamp);

  return result;
// END
};


// get chunkservers if its use rate is low
exports.getFree = function(){
// START
  reload();
  // run
  var serverData = {"127.0.0.1:3001":[12,1599033406152],"127.0.0.1:3002":[22,1599033664421],"127.0.0.1:3003":[79,1599033677924]};
  var maxUseRate = 80;
  var maxAliveTime = 120000;
  var nowTime = 1599033677924;
  var excludeList = ["127.0.0.1:3001", "127.0.0.1:3002"]
  var count = 1;
  var result = serverdataTool.getFree(serverData, maxUseRate, maxAliveTime, nowTime, excludeList, count);

  return result;
// END
};


// has chunkserver or not
exports.hasServer = function(){
// START
  reload();
  // run
  var serverData = {"127.0.0.1:3001":[12,1599033406152],"127.0.0.1:3002":[22,1599033664421],"127.0.0.1:3003":[18,1599033677924]};
  var pair = "127.0.0.1:3003";
  var result = serverdataTool.hasServer(serverData, pair);

  return result;
// END
};


// get report time of chunkserver
exports.getTime = function(){
// START
  reload();
  // run
  var serverData = {"127.0.0.1:3001":[12,1599033406152],"127.0.0.1:3002":[22,1599033664421],"127.0.0.1:3003":[18,1599033677924]};
  var pair = "127.0.0.1:3003";
  var result = serverdataTool.getTime(serverData, pair);

  return result;
// END
};


// check chunkserver is alive or not
exports.isAlive = function(){
// START
  reload();
  // run
  var serverData = {"127.0.0.1:3001":[12,1599033406152],"127.0.0.1:3002":[22,1599033664421],"127.0.0.1:3003":[79,1599033677924]};
  var pair = "127.0.0.1:3002";
  var maxAliveTime = 120000;
  var timestamp = 1599033784420;
  var result = serverdataTool.isAlive(serverData, pair, maxAliveTime, timestamp);

  return result;
// END
};


// get list of all chunkserver
exports.getServerList = function(){
// START
  reload();
  // run
  var serverData = {"127.0.0.1:3001":[12,1599033406152],"127.0.0.1:3002":[22,1599033664421],"127.0.0.1:3003":[18,1599033677924]};
  var result = serverdataTool.getServerList(serverData);

  return result;
// END
};


// get list of server which report time is expired
exports.getExpireList = function(){
// START
  reload();
  // run
  var serverData = {"127.0.0.1:3001":[12,1599033406152],"127.0.0.1:3002":[22,1599033406152],"127.0.0.1:3003":[79,1599033677924]};
  var maxAliveTime = 120000;
  var timestamp = 1599033784420;
  var result = serverdataTool.getExpireList(serverData, maxAliveTime, timestamp);

  return result;
// END
};
