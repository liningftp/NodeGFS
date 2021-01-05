
const fs = require("fs");
const child_process = require("child_process");

let startupdataTool = require("C:\\work\\Git_work\\NodeGFS\\Master\\metadata\\tool\\startupdataTool.js");


////////////////////////////////////////////////////////////////////////////////

function reload(){
  delete require.cache[require.resolve("C:\\work\\Git_work\\NodeGFS\\Master\\metadata\\tool\\startupdataTool.js")]
  startupdataTool = require("C:\\work\\Git_work\\NodeGFS\\Master\\metadata\\tool\\startupdataTool.js");
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

// init
exports.init = function(){
// START
  reload();
  // run
  var startupData = {"startTime":1};
  var startTime = 1593783888581;
  var serverChecklist = ["127.0.0.1:3001", "127.0.0.1:3002", "127.0.0.1:3003"]
  var result = startupdataTool.init(startupData, startTime, serverChecklist);

  return result;
// END
};


// get state, init or work
exports.getState = function(){
// START
  reload();
  // run
  var startupData = {"startTime":1603864865087, "state":"init"};
  var timestamp = 1603864865087;
  var heartbeatTime = 60000;
  var result = startupdataTool.getState(startupData, timestamp, heartbeatTime);

  return result;
// END
};


// get startup time
exports.getTime = function(){
// START
  reload();
  // run
  var startupData = {"startTime":1593783888581};
  var result = startupdataTool.getTime(startupData);

  return result;
// END
};


// check start time of master and chunkserver is consistent
exports.checkTime = function(){
// START
  reload();
  // run
  var startupData = {"startTime":1593783888581};
  var startTime = 1593783888581;
  var result = startupdataTool.checkTime(startupData, startTime);

  return result;
// END
};
