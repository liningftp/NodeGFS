
const fs = require("fs");
const child_process = require("child_process");

let errordataTool = require("C:\\work\\Git_work\\NodeGFS\\Chunkserver\\metadata\\tool\\errordataTool.js");


////////////////////////////////////////////////////////////////////////////////

function reload(){
  delete require.cache[require.resolve("C:\\work\\Git_work\\NodeGFS\\Chunkserver\\metadata\\tool\\errordataTool.js")]
  errordataTool = require("C:\\work\\Git_work\\NodeGFS\\Chunkserver\\metadata\\tool\\errordataTool.js");
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

// delete chunk which is reported
exports.delete = function(){
// START
  reload();
  // run
  var errorData = {"aabbccdd":1602494497551, "eeffgghh":0};
  var chunkNameList = []
  var result = errordataTool.delete(errorData, chunkNameList);

  return result;
// END
};


// add error chunk
exports.add = function(){
// START
  reload();
  // run
  var errorData = {};
  var chunkName = "aabbccdd";
  var result = errordataTool.add(errorData, chunkName);

  return result;
// END
};


// set report time
exports.setTime = function(){
// START
  reload();
  // run
  var errorData = {"aabbccdd":1602494497551, "eeffgghh":0};
  var chunkName = "aabbccdd";
  var timestamp = 1602494497551;
  var result = errordataTool.setTime(errorData, chunkName, timestamp);

  return result;
// END
};


// clear chunk after report
exports.clear = function(){
// START
  reload();
  // run
  var errorData = {"aabbccdd":1602494497551, "eeffgghh":0};
  var chunkNameList = ["aabbccdd"]
  var result = errordataTool.clear(errorData, chunkNameList);

  return result;
// END
};


// get list of chunk to report
exports.getReport = function(){
// START
  reload();
  // run
  var errorData = {"aabbccdd":1602494497551, "eeffgghh":0};
  var result = errordataTool.getReport(errorData);

  return result;
// END
};
