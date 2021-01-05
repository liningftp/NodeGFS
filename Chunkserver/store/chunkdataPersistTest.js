
const fs = require("fs");
const child_process = require("child_process");

let chunkdataPersist = require("C:\\work\\Git_work\\NodeGFS\\Chunkserver\\store\\chunkdataPersist.js");


////////////////////////////////////////////////////////////////////////////////

function reload(){
  delete require.cache[require.resolve("C:\\work\\Git_work\\NodeGFS\\Chunkserver\\store\\chunkdataPersist.js")]
  chunkdataPersist = require("C:\\work\\Git_work\\NodeGFS\\Chunkserver\\store\\chunkdataPersist.js");
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

// load chunk from disk
exports.load = function(){
// START
  reload();
  // run
  var chunkData = {};
  var chunkRoot = "C:\\work\\GFS2\\AppData\\chunkserver\\chunk1";
  var result = chunkdataPersist.load(chunkData, chunkRoot);

  return result;
// END
};


// create new chunk
exports.create = function(){
// START
  reload();
  // run
  var chunkRoot = "C:\\work\\GFS2\\AppData\\chunkserver\\chunk1";
  var chunkName = "aabbccdd";
  var result = chunkdataPersist.create(chunkRoot, chunkName);

  return result;
// END
};


// write content to chunk in disk
exports.write = function(){
// START
  reload();
  // run
  var chunkRoot = "C:\\work\\GFS2\\AppData\\chunkserver\\chunk1";
  var chunkName = "aabbccdd";
  var contentData = Buffer.from("hello");
  var position = 0;
  var result = chunkdataPersist.write(chunkRoot, chunkName, contentData, position);

  return result;
// END
};


// append content to chunk in disk
exports.append = function(){
// START
  reload();
  // run
  var chunkRoot = "C:\\work\\GFS2\\AppData\\chunkserver\\chunk1";
  var chunkName = "aabbccdd";
  var contentData = hello;
  var result = chunkdataPersist.append(chunkRoot, chunkName, contentData);

  return result;
// END
};


// read chunk
exports.read = function(){
// START
  reload();
  // run
  var chunkRoot = "C:\\work\\GFS2\\AppData\\chunkserver\\chunk1";
  var chunkName = "aabbccdd";
  var startPos = 0;
  var length = 12;
  var result = chunkdataPersist.read(chunkRoot, chunkName, startPos, length);

  return result;
// END
};


// padding char 0 to chunk
exports.padding = function(){
// START
  reload();
  // run
  var chunkRoot = "C:\\work\\GFS2\\AppData\\chunkserver\\chunk1";
  var chunkName = "aabbccdd";
  var targetSize = 20;
  var result = chunkdataPersist.padding(chunkRoot, chunkName, targetSize);

  return result;
// END
};


// get chunk size
exports.getSize = function(){
// START
  reload();
  // run
  var chunkRoot = "C:\\work\\GFS2\\AppData\\chunkserver\\chunk1";
  var chunkName = "aabbccdd";
  var result = chunkdataPersist.getSize(chunkRoot, chunkName);

  return result;
// END
};


// delete chunk
exports.delete = function(){
// START
  reload();
  // run
  var chunkRoot = "C:\\work\\GFS2\\AppData\\chunkserver\\chunk1";
  var chunkName = "aabbccdd";
  var result = chunkdataPersist.delete(chunkRoot, chunkName);

  return result;
// END
};
