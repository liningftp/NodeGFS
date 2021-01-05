
const fs = require("fs");
const child_process = require("child_process");

let namespaceDeleteTool = require("C:\\work\\Git_work\\NodeGFS\\Master\\metadata\\tool\\namespaceDeleteTool.js");


////////////////////////////////////////////////////////////////////////////////

function reload(){
  delete require.cache[require.resolve("C:\\work\\Git_work\\NodeGFS\\Master\\metadata\\tool\\namespaceDeleteTool.js")]
  namespaceDeleteTool = require("C:\\work\\Git_work\\NodeGFS\\Master\\metadata\\tool\\namespaceDeleteTool.js");
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

// add file path
exports.add = function(){
// START
  reload();
  // run
  var namespaceDeleteData = {};
  var filePath = "/usr/data/001";
  var timestamp = 1599188987628;
  var tree = {"/usr":{"_type":"dir","_lock":{"r":[],"w":[]},"/data":{"_type":"dir","_lock":{"r":[],"w":[]},"/001":{"_type":"file","_lock":{"r":[],"w":[]}},"/002":{"_type":"file","_lock":{"r":[],"w":[]}}},"/photo":{"_type":"dir","_lock":{"r":[],"w":[]},"/2020":{"_type":"file","_lock":{"r":[],"w":[]}}}}};
  var result = namespaceDeleteTool.add(namespaceDeleteData, filePath, timestamp, tree);

  return result;
// END
};


// get namespace
exports.get = function(){
// START
  reload();
  // run
  var namespaceDeleteData = {"/usr/data":{"1597879274447":{"/usr":{"_type":"dir","_lock":{"r":[],"w":[]},"/data":{"_type":"dir","_lock":{"r":[],"w":[]},"/001":{"_type":"file","_lock":{"r":[],"w":[]}},"/002":{"_type":"file","_lock":{"r":[],"w":[]}}},"/photo":{"_type":"dir","_lock":{"r":[],"w":[]},"/2020":{"_type":"file","_lock":{"r":[],"w":[]}}}}}}};
  var filePath = "/usr/data";
  var timestamp = 1597879274447;
  var result = namespaceDeleteTool.get(namespaceDeleteData, filePath, timestamp);

  return result;
// END
};


// delete file path
exports.delete = function(){
// START
  reload();
  // run
  var namespaceDeleteData = {"/usr/data":{"1597879274447":{"/usr":{"_type":"dir","_lock":{"r":[],"w":[]},"/data":{"_type":"dir","_lock":{"r":[],"w":[]},"/001":{"_type":"file","_lock":{"r":[],"w":[]}},"/002":{"_type":"file","_lock":{"r":[],"w":[]}}},"/photo":{"_type":"dir","_lock":{"r":[],"w":[]},"/2020":{"_type":"file","_lock":{"r":[],"w":[]}}}}}}};
  var filePath = "/usr/data";
  var timestamp = 1597879274447;
  var result = namespaceDeleteTool.delete(namespaceDeleteData, filePath, timestamp);

  return result;
// END
};


// get expire list
exports.getExpireList = function(){
// START
  reload();
  // run
  var namespaceDeleteData = {"/usr/data":{"1597879274447":{"/usr":{"_type":"dir","_lock":{"r":[],"w":[]},"/data":{"_type":"dir","_lock":{"r":[],"w":[]},"/001":{"_type":"file","_lock":{"r":[],"w":[]}},"/002":{"_type":"file","_lock":{"r":[],"w":[]}}},"/photo":{"_type":"dir","_lock":{"r":[],"w":[]},"/2020":{"_type":"file","_lock":{"r":[],"w":[]}}}}}}};
  var retainTime = 259200000;
  var timestamp = 1601278486787;
  var result = namespaceDeleteTool.getExpireList(namespaceDeleteData, retainTime, timestamp);

  return result;
// END
};
