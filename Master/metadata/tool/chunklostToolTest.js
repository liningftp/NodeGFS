
const fs = require("fs");
const child_process = require("child_process");

let chunklostTool = require("C:\\work\\Git_work\\NodeGFS\\Master\\metadata\\tool\\chunklostTool.js");


////////////////////////////////////////////////////////////////////////////////

function reload(){
  delete require.cache[require.resolve("C:\\work\\Git_work\\NodeGFS\\Master\\metadata\\tool\\chunklostTool.js")]
  chunklostTool = require("C:\\work\\Git_work\\NodeGFS\\Master\\metadata\\tool\\chunklostTool.js");
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

// get list which will be repaired, early is in top
exports.getList = function(){
// START
  reload();
  // run
  var chunklostData = {"aabbccdd":[1599701518196,1603841772044],"eeffgghh":[1603842910809,0],"ooxxkkmm":[1599701518196,0]};
  var timestamp = 1606443851845;
  var result = chunklostTool.getList(chunklostData, timestamp);

  return result;
// END
};


// set time stamp
exports.setTime = function(){
// START
  reload();
  // run
  var chunklostData = {"aabbccdd":[1599701518196,0],"eeffgghh":[1603842910809,0],"ooxxkkmm":[1599701518196,0]};
  var chunkNameList = ["aabbccdd", "eeffgghh"]
  var timestamp = 1601131150047;
  var result = chunklostTool.setTime(chunklostData, chunkNameList, timestamp);

  return result;
// END
};


// add chunk is lost
exports.add = function(){
// START
  reload();
  // run
  var chunklostData = {};
  var chunkNameList = ["aabbccdd"]
  var timestamp = 1601130794448;
  var result = chunklostTool.add(chunklostData, chunkNameList, timestamp);

  return result;
// END
};


// clear chunk whick is repaired or expired
exports._clear = function(){
// START
  reload();
  // run
  var chunklostData = {"aabbccdd":[1599701518196,1603841772044],"eeffgghh":[1603842910809,0],"ooxxkkmm":[1599701518196,0]};
  var timestamp = 1603843484074;
  var result = chunklostTool._clear(chunklostData, timestamp);

  return result;
// END
};
