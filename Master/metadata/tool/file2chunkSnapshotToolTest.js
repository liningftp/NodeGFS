
const fs = require("fs");
const child_process = require("child_process");

let file2chunkSnapshotTool = require("C:\\work\\Git_work\\NodeGFS\\Master\\metadata\\tool\\file2chunkSnapshotTool.js");


////////////////////////////////////////////////////////////////////////////////

function reload(){
  delete require.cache[require.resolve("C:\\work\\Git_work\\NodeGFS\\Master\\metadata\\tool\\file2chunkSnapshotTool.js")]
  file2chunkSnapshotTool = require("C:\\work\\Git_work\\NodeGFS\\Master\\metadata\\tool\\file2chunkSnapshotTool.js");
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

// manage file2chunk snapshot
exports.add = function(){
// START
  reload();
  // run
  var file2chunkSnapshotData = {};
  var filePath = "/usr/data/001";
  var timestamp = 1597879274447;
  var chunkNameList = ['aabbcdd', 'eeffgghh']
  var result = file2chunkSnapshotTool.add(file2chunkSnapshotData, filePath, timestamp, chunkNameList);

  return result;
// END
};


// get chunk list of file path
exports.get = function(){
// START
  reload();
  // run
  var file2chunkSnapshotData = {"/usr/data/001":{"1597879274447":["aabbcdd","eeffgghh"]}};
  var filePath = "/usr/data/001";
  var timestamp = 1597879274447;
  var result = file2chunkSnapshotTool.get(file2chunkSnapshotData, filePath, timestamp);

  return result;
// END
};


// delete file path
exports.delete = function(){
// START
  reload();
  // run
  var file2chunkSnapshotData = {"/usr/data/001":{"1597879274447":["aabbcdd","eeffgghh"]}};
  var filePath = "/usr/data/001";
  var timestamp = 1597879274447;
  var result = file2chunkSnapshotTool.delete(file2chunkSnapshotData, filePath, timestamp);

  return result;
// END
};
