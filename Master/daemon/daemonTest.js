
const fs = require("fs");
const child_process = require("child_process");

let daemon = require("C:\\work\\Git_work\\NodeGFS\\Master\\daemon\\daemon.js");


////////////////////////////////////////////////////////////////////////////////

function reload(){
  delete require.cache[require.resolve("C:\\work\\Git_work\\NodeGFS\\Master\\daemon\\daemon.js")]
  daemon = require("C:\\work\\Git_work\\NodeGFS\\Master\\daemon\\daemon.js");
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

// start daemon
exports.start = async function(){
// START
  reload();
  // run
  var namespaceDeleteData = {"/usr/data/001":{"1597879274447":{"/usr":{"_type":"dir","_lock":{"r":[],"w":[]},"/data":{"_type":"dir","_lock":{"r":[],"w":[]},"/001":{"_type":"file","_replicaCount":3,"_lock":{"r":[],"w":[]}}}}}}};
  var file2chunkDeleteData = {"/usr/data/001":{"1597879274447":["aabbccdd","eeffgghh"]}};
  var chunkData = {"aabbccdd":[1,20,"127.0.0.1:3001,1600348059891","127.0.0.1:3002,1600347939891","127.0.0.1:3003,1600261659800,P"]};
  var serverData = {"127.0.0.1:3001":[12,1600348059891],"127.0.0.1:3002":[22,1599033664421],"127.0.0.1:3003":[18,1599033677924]}
  var retainTime = 259200000;
  var heartbeatTime = 60000;
  var chunkDeadTime = 86400000;
  var result = await daemon.start(namespaceDeleteData, file2chunkDeleteData, chunkData, serverData, retainTime, heartbeatTime, chunkDeadTime);

  return result;
// END
};


// reclaim gc
exports._reclaim = function(){
// START
  reload();
  // run
  var namespaceDeleteData = {"/usr/data/001":{"1597879274447":{"/usr":{"_type":"dir","_lock":{"r":[],"w":[]},"/data":{"_type":"dir","_lock":{"r":[],"w":[]},"/001":{"_type":"file","_replicaCount":3,"_lock":{"r":[],"w":[]}}}}}}};
  var file2chunkDeleteData = {"/usr/data/001":{"1597879274447":["aabbccdd","eeffgghh"]}};
  var chunkData = {"aabbccdd":[], "eeffgghh":[], "ooxxkkmm":[], "jjyyuuvv":[]};
  var expireList = [["/usr/data/001",[1597879274447]]]
  var result = daemon._reclaim(namespaceDeleteData, file2chunkDeleteData, chunkData, expireList);

  return result;
// END
};
