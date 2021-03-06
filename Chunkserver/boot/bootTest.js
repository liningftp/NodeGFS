
const fs = require("fs");
const child_process = require("child_process");

let boot = require("C:\\work\\Git_work\\NodeGFS\\Chunkserver\\boot\\boot.js");


////////////////////////////////////////////////////////////////////////////////

function reload(){
  delete require.cache[require.resolve("C:\\work\\Git_work\\NodeGFS\\Chunkserver\\boot\\boot.js")]
  boot = require("C:\\work\\Git_work\\NodeGFS\\Chunkserver\\boot\\boot.js");
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

// first report data to master
exports.reportBootData = async function(){
// START
  reload();
  // run
  var chunkData = {"5964d672f56753389f3d89906ab238fbc680359229015a15a4ca66e466b128bc":[1024,0]};
  var chunkversionData = {"5964d672f56753389f3d89906ab238fbc680359229015a15a4ca66e466b128bc":[0,3]};
  var masterData = {"startTime":1602907450469};
  var maxChunkCount = 16;
  var masterHost = "127.0.0.1";
  var masterPort = 3000;
  var localHost = "127.0.0.1";
  var localPort = 3001;
  var result = await boot.reportBootData(chunkData, chunkversionData, masterData, maxChunkCount, masterHost, masterPort, localHost, localPort);

  return result;
// END
};


// init
exports.init = function(){
// START
  reload();
  // run
  var args = {};
  var config = {};
  var cacheData = {};
  var chunkData = {};
  var checksumData = {};
  var checksumFreeData = {};
  var chunkversionData = {};
  var chunkversionFreeData = {};
  var timestamp = 1606702772564;
  var result = boot.init(args, config, cacheData, chunkData, checksumData, checksumFreeData, chunkversionData, chunkversionFreeData, timestamp);

  return result;
// END
};
