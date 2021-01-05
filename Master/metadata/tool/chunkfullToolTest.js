
const fs = require("fs");
const child_process = require("child_process");

let chunkfullTool = require("C:\\work\\Git_work\\NodeGFS\\Master\\metadata\\tool\\chunkfullTool.js");


////////////////////////////////////////////////////////////////////////////////

function reload(){
  delete require.cache[require.resolve("C:\\work\\Git_work\\NodeGFS\\Master\\metadata\\tool\\chunkfullTool.js")]
  chunkfullTool = require("C:\\work\\Git_work\\NodeGFS\\Master\\metadata\\tool\\chunkfullTool.js");
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

// chunk is full or not
exports.isFull = function(){
// START
  reload();
  // run
  var chunkfullData = {"aabbccdd":1603201500764};
  var chunkName = "aabbccdd";
  var result = chunkfullTool.isFull(chunkfullData, chunkName);

  return result;
// END
};


// add chunk is fulled
exports.add = function(){
// START
  reload();
  // run
  var chunkfullData = {};
  var chunkName = "aabbccdd";
  var timestamp = 1603201500764;
  var result = chunkfullTool.add(chunkfullData, chunkName, timestamp);

  return result;
// END
};


// delete chunk
exports.delete = function(){
// START
  reload();
  // run
  var chunkfullData = {"aabbccdd":1603201500764};
  var chunkName = "aabbccdd";
  var result = chunkfullTool.delete(chunkfullData, chunkName);

  return result;
// END
};


// clear expire
exports.clear = function(){
// START
  reload();
  // run
  var chunkfullData = {"aabbccdd":1603201500764};
  var timestamp = 1603202299410;
  var result = chunkfullTool.clear(chunkfullData, timestamp);

  return result;
// END
};
