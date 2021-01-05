
const fs = require("fs");
const child_process = require("child_process");

let checksumFreeTool = require("C:\\work\\Git_work\\NodeGFS\\Chunkserver\\metadata\\tool\\checksumFreeTool.js");


////////////////////////////////////////////////////////////////////////////////

function reload(){
  delete require.cache[require.resolve("C:\\work\\Git_work\\NodeGFS\\Chunkserver\\metadata\\tool\\checksumFreeTool.js")]
  checksumFreeTool = require("C:\\work\\Git_work\\NodeGFS\\Chunkserver\\metadata\\tool\\checksumFreeTool.js");
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

// get free index
exports.getFreeIndex = function(){
// START
  reload();
  // run
  var checksumFreeData = [2, 3]
  var result = checksumFreeTool.getFreeIndex(checksumFreeData);

  return result;
// END
};


// delete free index
exports.delete = function(){
// START
  reload();
  // run
  var checksumFreeData = [2, 3]
  var freeIndex = 2;
  var result = checksumFreeTool.delete(checksumFreeData, freeIndex);

  return result;
// END
};


// add free index
exports.add = function(){
// START
  reload();
  // run
  var checksumFreeData = []
  var freeIndex = 1;
  var result = checksumFreeTool.add(checksumFreeData, freeIndex);

  return result;
// END
};
