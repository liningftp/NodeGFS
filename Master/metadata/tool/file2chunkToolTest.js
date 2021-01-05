
const fs = require("fs");
const child_process = require("child_process");

let file2ChunkTool = require("C:\\work\\Git_work\\NodeGFS\\Master\\metadata\\tool\\file2chunkTool.js");


////////////////////////////////////////////////////////////////////////////////

function reload(){
  delete require.cache[require.resolve("C:\\work\\Git_work\\NodeGFS\\Master\\metadata\\tool\\file2chunkTool.js")]
  file2ChunkTool = require("C:\\work\\Git_work\\NodeGFS\\Master\\metadata\\tool\\file2chunkTool.js");
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

// add chunk
exports.add = function(){
// START
  reload();
  // run
  var file2chunkData = {"/usr/data/001":["aabbccdd"]};
  var filePath = "/usr/data/001";
  var chunkName = "eeffgghh";
  var result = file2ChunkTool.add(file2chunkData, filePath, chunkName);

  return result;
// END
};


// delete file path
exports.delete = function(){
// START
  reload();
  // run
  var file2chunkData = {"/usr/data/001":["aabbccdd"], "/usr/data/002":["eeffgghh"]};
  var filePath = "/usr/data/001";
  var result = file2ChunkTool.delete(file2chunkData, filePath);

  return result;
// END
};


// get last chunk name of file path
exports.getLastChunkName = function(){
// START
  reload();
  // run
  var file2chunkData = {"/usr/data/001":["aabbccdd", "eeffgghh"]};
  var filePath = "/usr/data/001";
  var result = file2ChunkTool.getLastChunkName(file2chunkData, filePath);

  return result;
// END
};


// get list of chunk name of file path
exports.getChunkNameList = function(){
// START
  reload();
  // run
  var file2chunkData = {"/usr/data/001":["aabbccdd", "eeffgghh"]};
  var filePath = "/usr/data/001";
  var result = file2ChunkTool.getChunkNameList(file2chunkData, filePath);

  return result;
// END
};


// get list of chunk name by index arange
exports.getByIndexList = function(){
// START
  reload();
  // run
  var file2chunkData = {"/usr/data/001":["aabbccdd", "eeffgghh"]};
  var filePath = "/usr/data/001";
  var index = 0;
  var count = 1;
  var result = file2ChunkTool.getByIndexList(file2chunkData, filePath, index, count);

  return result;
// END
};


// get chunk count of file path
exports.getCount = function(){
// START
  reload();
  // run
  var file2chunkData = {"/usr/data/001":["aabbccdd", "eeffgghh"]};
  var filePath = "/usr/data/001";
  var result = file2ChunkTool.getCount(file2chunkData, filePath);

  return result;
// END
};


// get chunk name by index
exports.getByIndex = function(){
// START
  reload();
  // run
  var file2chunkData = {"/usr/data/001":["aabbccdd", "eeffgghh"]};
  var filePath = "/usr/data/001";
  var index = 1;
  var result = file2ChunkTool.getByIndex(file2chunkData, filePath, index);

  return result;
// END
};


// get last chunk
exports.getLast = function(){
// START
  reload();
  // run
  var file2chunkData = {"/usr/data/001":["aabbccdd", "eeffgghh"]};
  var filePath = "/usr/data/001";
  var result = file2ChunkTool.getLast(file2chunkData, filePath);

  return result;
// END
};
