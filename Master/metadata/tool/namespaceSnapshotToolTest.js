
const fs = require("fs");
const child_process = require("child_process");

let namespaceSnapshotTool = require("C:\\work\\Git_work\\NodeGFS\\Master\\metadata\\tool\\namespaceSnapshotTool.js");


////////////////////////////////////////////////////////////////////////////////

function reload(){
  delete require.cache[require.resolve("C:\\work\\Git_work\\NodeGFS\\Master\\metadata\\tool\\namespaceSnapshotTool.js")]
  namespaceSnapshotTool = require("C:\\work\\Git_work\\NodeGFS\\Master\\metadata\\tool\\namespaceSnapshotTool.js");
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

// get namespace
exports.get = function(){
// START
  reload();
  // run
  var namespaceSnapshotData = {"/usr/data/001":{"1600959455031":{"/usr":{"_type":"dir","_lock":{"r":[],"w":[]},"/data":{"_type":"dir","_lock":{"r":[],"w":[]},"/001":{"_type":"file","_lock":{"r":[],"w":[]}}}}}}};
  var filePath = "/usr/data/001";
  var timestamp = "1600959455031";
  var result = namespaceSnapshotTool.get(namespaceSnapshotData, filePath, timestamp);

  return result;
// END
};


// get timestamp list
exports.getList = function(){
// START
  reload();
  // run
  var namespaceSnapshotData = {"/usr/data/001":{"1600959455031":{"/usr":{"_type":"dir","_lock":{"r":[],"w":[]},"/data":{"_type":"dir","_lock":{"r":[],"w":[]},"/001":{"_type":"file","_lock":{"r":[],"w":[]}}}}}}}
  var filePath = "/usr/data/001";
  var result = namespaceSnapshotTool.getList(namespaceSnapshotData, filePath);

  return result;
// END
};


// add file path
exports.add = function(){
// START
  reload();
  // run
  var namespaceSnapshotData = {}
  var filePath = "/usr/data/001";
  var timestamp = 1600959455031;
  var tree = {"/usr":{"_type":"dir","_lock":{"r":[],"w":[]},"/data":{"_type":"dir","_lock":{"r":[],"w":[]},"/001":{"_type":"file","_lock":{"r":[],"w":[]}}}}};
  var result = namespaceSnapshotTool.add(namespaceSnapshotData, filePath, timestamp, tree);

  return result;
// END
};
