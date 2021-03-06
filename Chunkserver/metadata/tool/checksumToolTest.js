
const fs = require("fs");
const child_process = require("child_process");

let checksumTool = require("C:\\work\\Git_work\\NodeGFS\\Chunkserver\\metadata\\tool\\checksumTool.js");


////////////////////////////////////////////////////////////////////////////////

function reload(){
  delete require.cache[require.resolve("C:\\work\\Git_work\\NodeGFS\\Chunkserver\\metadata\\tool\\checksumTool.js")]
  checksumTool = require("C:\\work\\Git_work\\NodeGFS\\Chunkserver\\metadata\\tool\\checksumTool.js");
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

// add new chunk
exports.addChunk = function(){
// START
  reload();
  // run
  var checksumData = {};
  var chunkName = "ab83e19265655130b208def31e0c483ecb835a24a9a7508eaec0df0e62e65870";
  var checksumList = [-810311648]
  var itemIndex = 2;
  var result = checksumTool.addChunk(checksumData, chunkName, checksumList, itemIndex);

  return result;
// END
};


// delete chunk
exports.deleteChunk = function(){
// START
  reload();
  // run
  var checksumData = {"aabbccdd":[0, [-1234567890, 123456789012]], "eegghhii":[1, [-1234567890, 123456789012]]};
  var chunkName = "eegghhii";
  var result = checksumTool.deleteChunk(checksumData, chunkName);

  return result;
// END
};


// get checksum
exports.getChecksum = function(){
// START
  reload();
  // run
  var checksumData = {"aabbccdd":[0, [-1234567890, 123456789012]], "eegghhii":[1, [-1234567890, 123456789012]]};
  var chunkName = "eegghhii";
  var result = checksumTool.getChecksum(checksumData, chunkName);

  return result;
// END
};


// set checksum
exports.setChecksum = function(){
// START
  reload();
  // run
  var checksumData = {"aabbccdd":[0, [-1234567890, 123456789012]], "eegghhii":[1, [-1234567890, 123456789012]]};
  var chunkName = "aabbccdd";
  var checksumList = [-810311648]
  var result = checksumTool.setChecksum(checksumData, chunkName, checksumList);

  return result;
// END
};


// calculate checksum
exports.createChecksum = function(){
// START
  reload();
  // run
  var contentData = Buffer.from("");
  var blockSize = 65536;
  var result = checksumTool.createChecksum(contentData, blockSize);

  return result;
// END
};


// compare checksum
exports.compare = function(){
// START
  reload();
  // run
  var checksumData = {"aabbccdd":[0, [-1234567890, 123456789012]], "eegghhii":[1, [-1234567890, 123456789012]]};
  var chunkName = "aabbccdd";
  var contentData = Buffer.from("hello wolrd");
  var blockSize = 65536;
  var result = checksumTool.compare(checksumData, chunkName, contentData, blockSize);

  return result;
// END
};


// get chunk index
exports.getChunkIndex = function(){
// START
  reload();
  // run
  var checksumData = {"aabbccdd":[0, [-1234567890, 123456789012]], "eegghhii":[1, [-1234567890, 123456789012]]};
  var chunkName = "aabbccdd";
  var result = checksumTool.getChunkIndex(checksumData, chunkName);

  return result;
// END
};


// get checksum count
exports.getCount = function(){
// START
  reload();
  // run
  var checksumData = {"aabbccdd":[1, 65530, [-1234567890, 123456789012]], "eegghhii":[1, 1234, [-1234567890, 123456789012]]};
  var result = checksumTool.getCount(checksumData);

  return result;
// END
};
