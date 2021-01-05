
const fs = require("fs");
const child_process = require("child_process");

let gfs = require("C:\\work\\Git_work\\NodeGFS\\ClientLib\\gfs.js");


////////////////////////////////////////////////////////////////////////////////

function reload(){
  delete require.cache[require.resolve("C:\\work\\Git_work\\NodeGFS\\ClientLib\\gfs.js")]
  gfs = require("C:\\work\\Git_work\\NodeGFS\\ClientLib\\gfs.js");
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

// open file path
exports.open = async function(){
// START
  reload();
  // run
  var filePath = "/usr/data/001";
  var flags = "O_RDWR";
  var mode = "O_APPEND";
  var masterHost = "127.0.0.1";
  var masterPort = 3000;
  var result = await gfs.open(filePath, flags, mode, masterHost, masterPort);

  return result;
// END
};


// close file path
exports.close = async function(){
// START
  reload();
  // run
  var filePath = "/use/data/001";
  var fd = "1606226758420";
  var masterHost = "127.0.0.1";
  var masterPort = 3000;
  var result = await gfs.close(filePath, fd, masterHost, masterPort);

  return result;
// END
};


// delete directory
exports.deleteDir = async function(){
// START
  reload();
  // run
  var filePath = "/usr/data";
  var fd = 1606961159937;
  var masterHost = "127.0.0.1";
  var masterPort = 3000;
  var result = await gfs.deleteDir(filePath, fd, masterHost, masterPort);

  return result;
// END
};


// create directory
exports.createDir = async function(){
// START
  reload();
  // run
  var filePath = "/usr/data/001";
  var masterHost = "127.0.0.1";
  var masterPort = 3000;
  var result = await gfs.createDir(filePath, masterHost, masterPort);

  return result;
// END
};


// delete file path
exports.deleteFile = async function(){
// START
  reload();
  // run
  var filePath = "/usr/data/001";
  var fd = 1606909907287;
  var masterHost = "127.0.0.1";
  var masterPort = 3000;
  var result = await gfs.deleteFile(filePath, fd, masterHost, masterPort);

  return result;
// END
};


// create file path
exports.createFile = async function(){
// START
  reload();
  // run
  var filePath = "/usr/data/001";
  var replicaCount = 3;
  var masterHost = "127.0.0.1";
  var masterPort = 3000;
  var result = await gfs.createFile(filePath, replicaCount, masterHost, masterPort);

  return result;
// END
};


// write file
exports.write = async function(){
// START
  reload();
  // run
  var filePath = "/usr/data/001";
  var fd = 1607151913750;
  var content = "999";
  var position = 2;
  var masterHost = "127.0.0.1";
  var masterPort = 3000;
  var result = await gfs.write(filePath, fd, content, position, masterHost, masterPort);

  return result;
// END
};


// record append
exports.append = async function(){
// START
  reload();
  // run
  var filePath = "/use/data/001";
  var fd = 1606961159937;
  var content = Buffer.from("999");
  var masterHost = "127.0.0.1";
  var masterPort = 3000;
  var result = await gfs.append(filePath, fd, content, masterHost, masterPort);

  return result;
// END
};


// read file
exports.read = async function(){
// START
  reload();
  // run
  var filePath = "/use/data/001";
  var fd = 1607151913750;
  var position = 1;
  var length = 0;
  var maxChunkSize = 67108864;
  var masterHost = "127.0.0.1";
  var masterPort = 3000;
  var result = await gfs.read(filePath, fd, position, length, maxChunkSize, masterHost, masterPort);

  return result;
// END
};


// snapshot ( TODO )
exports.snapshot = async function(){
// START
  reload();
  // run
  var filePath = "/use/data/1.txt";
  var result = await gfs.snapshot(filePath);

  return result;
// END
};
