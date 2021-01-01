

const {
  open, 
  createDir, 
  deleteDir, 
  createFile,
  deleteFile,
  getWriteServerList,
  getAppendServerList,
  getReadServerList,
} = require('./client.js');


const {
  getLastChunkName,
  recvErrorChunk,
  recvFullChunk,
  recvBootData,
  recvHeartbeat,
} = require('./chunkserver.js');


const funList = [
  // open,
  // createDir,
  // deleteDir,
  // createFile,
  // deleteFile,
  // getWriteServerList,
  // getAppendServerList,
  // getReadServerList,

  // getLastChunkName,
  // recvErrorChunk,
  // recvFullChunk,
  // recvBootData,
  // recvHeartbeat,
];


for( const fun of funList ){
  fun();
}

