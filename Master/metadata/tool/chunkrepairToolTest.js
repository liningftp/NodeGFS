
const fs = require("fs");
const child_process = require("child_process");

let chunkpairTool = require("C:\\work\\Git_work\\NodeGFS\\Master\\metadata\\tool\\chunkrepairTool.js");


////////////////////////////////////////////////////////////////////////////////

function reload(){
  delete require.cache[require.resolve("C:\\work\\Git_work\\NodeGFS\\Master\\metadata\\tool\\chunkrepairTool.js")]
  chunkpairTool = require("C:\\work\\Git_work\\NodeGFS\\Master\\metadata\\tool\\chunkrepairTool.js");
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

// add loss or error chunk
exports.add = function(){
// START
  reload();
  // run
  var chunkrepairData = {};
  var repairType = "loss";
  var srcPair = "127.0.0.1:3001";
  var chunkNameList = ["aabbccdd"]
  var timestamp = 1601130794448;
  var result = chunkpairTool.add(chunkrepairData, repairType, srcPair, chunkNameList, timestamp);

  return result;
// END
};


// get list to repair
exports.getList = function(){
// START
  reload();
  // run
  var chunkrepairData = {"aabbccdd":["error",["127.0.0.1:3001",1599701518196]]};
  var targetPair = "127.0.0.1:3001";
  var repairCount = 1;
  var timestamp = 1606443851845;
  var result = chunkpairTool.getList(chunkrepairData, targetPair, repairCount, timestamp);

  return result;
// END
};


// delete repairer
exports.delete = function(){
// START
  reload();
  // run
  var chunkrepairData = {"aabbccdd":["loss",["127.0.0.1:3001",1601130794448], ["127.0.0.1:3002", 1601130794448]]};
  var chunkName = "aabbccdd";
  var result = chunkpairTool.delete(chunkrepairData, chunkName);

  return result;
// END
};


// set repairer
exports.setRepairer = function(){
// START
  reload();
  // run
  var chunkrepairData = {"aabbccdd":["loss",["127.0.0.1:3001",1601130794448]]};
  var chunkNameList = ["aabbccdd", "eeffgghh"]
  var targetPair = "127.0.0.1:3003";
  var timestamp = 1601131150047;
  var result = chunkpairTool.setRepairer(chunkrepairData, chunkNameList, targetPair, timestamp);

  return result;
// END
};


// is the repairer or not
exports.isRepairer = function(){
// START
  reload();
  // run
  var chunkrepairData = {"aabbccdd":["loss",["127.0.0.1:3001",1601130794448], ["127.0.0.1:3002", 1601130794448]]};
  var chunkName = "aabbccdd";
  var targetPair = "127.0.0.1:3002";
  var result = chunkpairTool.isRepairer(chunkrepairData, chunkName, targetPair);

  return result;
// END
};


// clear expire
exports._clear = function(){
// START
  reload();
  // run
  var chunkrepairData = {"aabbccdd":["error",["127.0.0.1:3001",1599701518196] ]};
  var timestamp = 1603841772044;
  var result = chunkpairTool._clear(chunkrepairData, timestamp);

  return result;
// END
};
