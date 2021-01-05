
const fs = require("fs");
const child_process = require("child_process");

let chunkversionTool = require("C:\\work\\Git_work\\NodeGFS\\Chunkserver\\metadata\\tool\\chunkversionTool.js");


////////////////////////////////////////////////////////////////////////////////

function reload(){
  delete require.cache[require.resolve("C:\\work\\Git_work\\NodeGFS\\Chunkserver\\metadata\\tool\\chunkversionTool.js")]
  chunkversionTool = require("C:\\work\\Git_work\\NodeGFS\\Chunkserver\\metadata\\tool\\chunkversionTool.js");
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

// delete chunk
exports.deleteChunk = function(){
// START
  reload();
  // run
  var chunkversionData = {"aabbccdd":[1,12], "eeffgghh":[0, 20]};
  var chunkName = "aabbccdd";
  var result = chunkversionTool.deleteChunk(chunkversionData, chunkName);

  return result;
// END
};


// add new chunk
exports.addChunk = function(){
// START
  reload();
  // run
  var chunkversionData = {};
  var chunkName = "ab83e19265655130b208def31e0c483ecb835a24a9a7508eaec0df0e62e65870";
  var version = 3;
  var itemIndex = 1;
  var result = chunkversionTool.addChunk(chunkversionData, chunkName, version, itemIndex);

  return result;
// END
};


// get chunk version
exports.getVersion = function(){
// START
  reload();
  // run
  var chunkversionData = {"aabbccdd":[1,12], "eeffgghh":[2, 20]};
  var chunkName = "aabbccdd";
  var result = chunkversionTool.getVersion(chunkversionData, chunkName);

  return result;
// END
};


// set chunk version
exports.setVersion = function(){
// START
  reload();
  // run
  var chunkversionData = {"aabbccdd":[1,12], "eeffgghh":[0, 20]};
  var chunkName = "aabbccdd";
  var version = 60;
  var result = chunkversionTool.setVersion(chunkversionData, chunkName, version);

  return result;
// END
};


// get chunk index
exports.getChunkIndex = function(){
// START
  reload();
  // run
  var chunkversionData = {"aabbccdd":[1,12], "eeffgghh":[0, 20]};
  var chunkName = "aabbccdd";
  var result = chunkversionTool.getChunkIndex(chunkversionData, chunkName);

  return result;
// END
};


// get chunk version count
exports.getCount = function(){
// START
  reload();
  // run
  var chunkversionData = {"aabbccdd":[1,12], "eeffgghh":[0, 20]};
  var result = chunkversionTool.getCount(chunkversionData);

  return result;
// END
};
