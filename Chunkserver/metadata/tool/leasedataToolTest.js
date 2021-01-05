
const fs = require("fs");
const child_process = require("child_process");

let leasedataTool = require("C:\\work\\Git_work\\NodeGFS\\Chunkserver\\metadata\\tool\\leasedataTool.js");


////////////////////////////////////////////////////////////////////////////////

function reload(){
  delete require.cache[require.resolve("C:\\work\\Git_work\\NodeGFS\\Chunkserver\\metadata\\tool\\leasedataTool.js")]
  leasedataTool = require("C:\\work\\Git_work\\NodeGFS\\Chunkserver\\metadata\\tool\\leasedataTool.js");
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

// set lease
exports.setLease = function(){
// START
  reload();
  // run
  var leaseData = {"aabbccdd":{"primary":1602576896653, "work":1}, "eeffgghh":{"primary":1602576896653, "work":0}};
  var chunkName = "eeffgghh";
  var timestamp = 1602576896653;
  var result = leasedataTool.setLease(leaseData, chunkName, timestamp);

  return result;
// END
};


// revoke lease
exports.revokeLease = function(){
// START
  reload();
  // run
  var leaseData = {"aabbccdd":{"primary":1602576896653, "work":1}, "eeffgghh":{"primary":1602576896653, "work":0}};
  var chunkName = "aabbccdd";
  var result = leasedataTool.revokeLease(leaseData, chunkName);

  return result;
// END
};


// set work state
exports.setWork = function(){
// START
  reload();
  // run
  var leaseData = {"aabbccdd":{"primary":1602576896653, "work":1}, "eeffgghh":{"primary":1602576896653, "work":0}};
  var chunkName = "eeffgghh";
  var result = leasedataTool.setWork(leaseData, chunkName);

  return result;
// END
};


// set free state
exports.setFree = function(){
// START
  reload();
  // run
  var leaseData = {"aabbccdd":{"primary":1602576896653, "work":1}, "eeffgghh":{"primary":1602576896653, "work":0}};
  var chunkName = "aabbccdd";
  var result = leasedataTool.setFree(leaseData, chunkName);

  return result;
// END
};


// get list of  chunk will to renew lease
exports.getRenewList = function(){
// START
  reload();
  // run
  var leaseData = {"aabbccdd":{"primary":1602576896653, "work":1}, "eeffgghh":{"primary":1602576896653, "work":0}};
  var duration = 60000;
  var timestamp = 1602576896653;
  var result = leasedataTool.getRenewList(leaseData, duration, timestamp);

  return result;
// END
};
