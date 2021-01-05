
const fs = require("fs");
const child_process = require("child_process");

let serverProcess = require("C:\\work\\Git_work\\NodeGFS\\Master\\daemon\\process\\serverProcess.js");


////////////////////////////////////////////////////////////////////////////////

function reload(){
  delete require.cache[require.resolve("C:\\work\\Git_work\\NodeGFS\\Master\\daemon\\process\\serverProcess.js")]
  serverProcess = require("C:\\work\\Git_work\\NodeGFS\\Master\\daemon\\process\\serverProcess.js");
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

// find timeout chunkserver
exports._start = function(){
// START
  reload();
  // run
  var serverData = {"127.0.0.1:3001":[12,1599033406152],"127.0.0.1:3002":[22,1599033406152],"127.0.0.1:3003":[79,1599033677924]}
  var heartbeatTime = 60000;
  var timestamp = 1599033406152;
  var result = serverProcess._start(serverData, heartbeatTime, timestamp);

  return result;
// END
};
