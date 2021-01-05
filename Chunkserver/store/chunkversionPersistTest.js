
const fs = require("fs");
const child_process = require("child_process");

let chunkversionPersist = require("C:\\work\\Git_work\\NodeGFS\\Chunkserver\\store\\chunkversionPersist.js");


////////////////////////////////////////////////////////////////////////////////

function reload(){
  delete require.cache[require.resolve("C:\\work\\Git_work\\NodeGFS\\Chunkserver\\store\\chunkversionPersist.js")]
  chunkversionPersist = require("C:\\work\\Git_work\\NodeGFS\\Chunkserver\\store\\chunkversionPersist.js");
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

// load version file to memory
exports.load = function(){
// START
  reload();
  // run
  var chunkversionData = {};
  var chunkversionFreeData = []
  var versionPath = "C:\\work\\GFS2\\AppData\\chunkserver\\version1\\data";
  var result = chunkversionPersist.load(chunkversionData, chunkversionFreeData, versionPath);

  return result;
// END
};


// delete chunk
exports.deleteChunk = function(){
// START
  reload();
  // run
  var itemIndex = 0;
  var versionPath = "C:\\work\\GFS2\\AppData\\chunkserver\\version1\\data";
  var result = chunkversionPersist.deleteChunk(itemIndex, versionPath);

  return result;
// END
};


// add chunk
exports.addChunk = function(){
// START
  reload();
  // run
  var chunkName = "ab83e19265655130b208def31e0c483ecb835a24a9a7508eaec0df0e62e65870";
  var version = 1;
  var versionPath = "C:\\work\\GFS2\\AppData\\chunkserver\\version1\\data";
  var itemIndex = 0;
  var result = chunkversionPersist.addChunk(chunkName, version, versionPath, itemIndex);

  return result;
// END
};


// set version
exports.setVersion = function(){
// START
  reload();
  // run
  var chunkName = "ab83e19265655130b208def31e0c483ecb835a24a9a7508eaec0df0e62e65870";
  var version = 80;
  var versionPath = "C:\\work\\GFS2\\AppData\\chunkserver\\version1\\data";
  var itemIndex = 0;
  var result = chunkversionPersist.setVersion(chunkName, version, versionPath, itemIndex);

  return result;
// END
};


// encode
exports.encode = function(){
// START
  reload();
  // run
  var chunkName = "ab83e19265655130b208def31e0c483ecb835a24a9a7508eaec0df0e62e65870";
  var version = 3;
  var result = chunkversionPersist.encode(chunkName, version);

  return result;
// END
};


// decode
exports.decode = function(){
// START
  reload();
  // run
  var encodedContent = Buffer.from("ab83e19265655130b208def31e0c483ecb835a24a9a7508eaec0df0e62e65870,00000008;");
  var result = chunkversionPersist.decode(encodedContent);

  return result;
// END
};
