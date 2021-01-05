
const fs = require("fs");
const child_process = require("child_process");

let waitleaseTool = require("C:\\work\\Git_work\\NodeGFS\\Master\\metadata\\tool\\waitleaseTool.js");


////////////////////////////////////////////////////////////////////////////////

function reload(){
  delete require.cache[require.resolve("C:\\work\\Git_work\\NodeGFS\\Master\\metadata\\tool\\waitleaseTool.js")]
  waitleaseTool = require("C:\\work\\Git_work\\NodeGFS\\Master\\metadata\\tool\\waitleaseTool.js");
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

// has chunk name or not
exports.has = function(){
// START
  reload();
  // run
  var waitleaseData = {"aabbccdd":[1603366654864,{"sock":3}]};
  var chunkName = "aabbccdd";
  var result = waitleaseTool.has(waitleaseData, chunkName);

  return result;
// END
};


// add
exports.add = function(){
// START
  reload();
  // run
  var waitleaseData = {};
  var chunkName = "aabbccdd";
  var clientObject = {"sock":3};
  var timestamp = 1603366654864;
  var result = waitleaseTool.add(waitleaseData, chunkName, clientObject, timestamp);

  return result;
// END
};


// get list
exports.get = function(){
// START
  reload();
  // run
  var waitleaseData = {"aabbccdd":[1603366654864,{"sock":3}]};
  var chunkName = "aabbccdd";
  var result = waitleaseTool.get(waitleaseData, chunkName);

  return result;
// END
};


// delete from queue
exports.delete = function(){
// START
  reload();
  // run
  var waitleaseData = {"aabbccdd":[1603366654864,{"sock":3}]};
  var chunkName = "aabbccdd";
  var result = waitleaseTool.delete(waitleaseData, chunkName);

  return result;
// END
};


// clear expire
exports.clear = function(){
// START
  reload();
  // run
  var waitleaseData = {"aabbccdd":[1603366654864,{"sock":3}], "eeffgghh":[1603367094445,{"sock":3}]};
  var timestamp = 1603367094445;
  var result = waitleaseTool.clear(waitleaseData, timestamp);

  return result;
// END
};
