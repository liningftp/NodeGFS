
const fs = require("fs");
const child_process = require("child_process");

let handler = require("C:\\work\\Git_work\\NodeGFS\\Master\\handler.js");


////////////////////////////////////////////////////////////////////////////////

function reload(){
  delete require.cache[require.resolve("C:\\work\\Git_work\\NodeGFS\\Master\\handler.js")]
  handler = require("C:\\work\\Git_work\\NodeGFS\\Master\\handler.js");
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

// delete namespace file
exports.deleteFile = async function(){
// START
  reload();
  // run
  var head = {"method":"deleteFile","filePath":"/usr/data/001","fd":1606909907287};
  var body = Buffer.from("");
  var result = await handler.deleteFile(head, body);

  return result;
// END
};


// delete namespace directory
exports.deleteDir = async function(){
// START
  reload();
  // run
  var head = {"method":"deleteDir","filePath":"/usr/data","fd":1606961159937};
  var body = Buffer.from("");
  var result = await handler.deleteDir(head, body);

  return result;
// END
};


// get list of chunkserver to read
exports.getReadServerList = async function(){
// START
  reload();
  // run
  var head = {"method":"getReadServerList","filePath":"/usr/data/001","fd":1607151913750,"index":1,"count":"3"};
  var body = Buffer.from("");
  var result = await handler.getReadServerList(head, body);

  return result;
// END
};


// create namespace file
exports.createFile = async function(){
// START
  reload();
  // run
  var head = {"method":"createFile","filePath":"/usr/data/001","replicaCount":3};
  var body = Buffer.from("");
  var result = await handler.createFile(head, body);

  return result;
// END
};


// create namespace directory
exports.createDir = async function(){
// START
  reload();
  // run
  var head = {"method":"createDir","filePath":"/usr/data/001"};
  var body = Buffer.from("");
  var result = await handler.createDir(head, body);

  return result;
// END
};


// get list of chunkserver to append
exports.getAppendServerList = async function(){
// START
  reload();
  // run
  var head = {"method":"getAppendServerList","filePath":"/usr/data/001","fd":1606961159937};
  var body = Buffer.from("");
  var result = await handler.getAppendServerList(head, body);

  return result;
// END
};


// get list of chunkserver to write
exports.getWriteServerList = async function(){
// START
  reload();
  // run
  var head = {"method":"getWriteServerList","filePath":"/usr/data/001","index":0,"fd":1606961159937};
  var body = Buffer.from("");
  var result = await handler.getWriteServerList(head, body);

  return result;
// END
};


// close file
exports.close = async function(){
// START
  reload();
  // run
  var head = {"method":"close","filePath":"/usr/data/001","fd":"1600765377526"};
  var body = Buffer.from("");
  var result = await handler.close(head, body);

  return result;
// END
};


// open file
exports.open = async function(){
// START
  reload();
  // run
  var head = {"method":"open","filePath":"/usr/data/001","flags":"O_RDWR","mode":"O_APPEND"};
  var body = Buffer.from("");
  var result = await handler.open(head, body);

  return result;
// END
};


// run snapshot
exports.snapshot = async function(){
// START
  reload();
  // run
  var head = {"method":"snapshot","filePath":"/usr/data/1.txt"};
  var body = Buffer.from("");
  var result = await handler.snapshot(head, body);

  return result;
// END
};


// receive boot data from chunkserver
exports.recvBootData = async function(){
// START
  reload();
  // run
  var head = {"method":"recvBootData","chunkList":["aabbccdd,2","eeffgghh,3"],"pair":"127.0.0.1:3001","useRate":25};
  var body = Buffer.from("");
  var result = await handler.recvBootData(head, body);

  return result;
// END
};


// receive fullchunk from primary
exports.recvFullChunk = async function(){
// START
  reload();
  // run
  var head = {"method":"recvFullChunk","chunkName":"ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b","startTime":1602228234877,"pair":"127.0.0.1:3001"};
  var body = Buffer.from("");
  var result = await handler.recvFullChunk(head, body);

  return result;
// END
};


// receive error chunk from primary
exports.recvErrorChunk = async function(){
// START
  reload();
  // run
  var head = {"method":"recvErrorChunk","chunkName":"ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b","startTime":1602228234877,"pair":"127.0.0.1:3001"};
  var body = Buffer.from("");
  var result = await handler.recvErrorChunk(head, body);

  return result;
// END
};


// chunkserver request the last chunkName of file
exports.getLastChunkName = async function(){
// START
  reload();
  // run
  var head = {"method":"getLastChunkName","filePath":"/usr/data/001","startTime":1602228234877};
  var body = Buffer.from("");
  var result = await handler.getLastChunkName(head, body);

  return result;
// END
};


// receive heartbeat package
exports.recvHeartbeat = async function(){
// START
  reload();
  // run
  var head = {"method":"recvHeartbeat","pair":"127.0.0.1:3002","useRate":28,"collectList":["aabbccdd,3","eeffgghh,10"],"errorList":["eeffgghh"],"leaseList":["aabbccdd"],"startTime":1593947506381};
  var body = Buffer.from("");
  var result = await handler.recvHeartbeat(head, body);

  return result;
// END
};
