
const fs = require("fs");
const child_process = require("child_process");

let boot = require("C:\\work\\Git_work\\NodeGFS\\Master\\boot\\boot.js");


////////////////////////////////////////////////////////////////////////////////

function reload(){
  delete require.cache[require.resolve("C:\\work\\Git_work\\NodeGFS\\Master\\boot\\boot.js")]
  boot = require("C:\\work\\Git_work\\NodeGFS\\Master\\boot\\boot.js");
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

// initialize
exports.init = function(){
// START
  reload();
  // run
  var config = {};
  var args = {};
  var result = boot.init(config, args);

  return result;
// END
};
