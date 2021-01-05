
const fs = require("fs");
const child_process = require("child_process");

let chunkversionFreeTool = require("C:\\work\\Git_work\\NodeGFS\\Chunkserver\\metadata\\tool\\chunkversionFreeTool.js");


////////////////////////////////////////////////////////////////////////////////

function reload(){
  delete require.cache[require.resolve("C:\\work\\Git_work\\NodeGFS\\Chunkserver\\metadata\\tool\\chunkversionFreeTool.js")]
  chunkversionFreeTool = require("C:\\work\\Git_work\\NodeGFS\\Chunkserver\\metadata\\tool\\chunkversionFreeTool.js");
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
  var chunkversionFreeData = [2, 3]
  var result = chunkversionFreeTool.getFreeIndex(chunkversionFreeData);

  return result;
// END
};


// delete free index
exports.delete = function(){
// START
  reload();
  // run
  var chunkversionFreeData = [2, 3]
  var freeIndex = 2;
  var result = chunkversionFreeTool.delete(chunkversionFreeData, freeIndex);

  return result;
// END
};


// add free index
exports.add = function(){
// START
  reload();
  // run
  var chunkversionFreeData = []
  var freeIndex = 1;
  var result = chunkversionFreeTool.add(chunkversionFreeData, freeIndex);

  return result;
// END
};
