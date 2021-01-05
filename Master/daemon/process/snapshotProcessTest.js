
const fs = require("fs");
const child_process = require("child_process");

let snapshotProcess = require("C:\\work\\Git_work\\NodeGFS\\Master\\daemon\\process\\snapshotProcess.js");


////////////////////////////////////////////////////////////////////////////////

function reload(){
  delete require.cache[require.resolve("C:\\work\\Git_work\\NodeGFS\\Master\\daemon\\process\\snapshotProcess.js")]
  snapshotProcess = require("C:\\work\\Git_work\\NodeGFS\\Master\\daemon\\process\\snapshotProcess.js");
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

// start
exports._start = function(){
// START
  reload();
  // run
  var result = snapshotProcess._start();

  return result;
// END
};
