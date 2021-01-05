
const os   = require('os');
const path = require('path');
const {util} = require('../base');


process.env.NODE_ENV = 'develop';
// process.env.NODE_ENV = 'product';

if('develop' === process.env.NODE_ENV){
  exports.MASTER_HOST   = "127.0.0.1";
  exports.LOCAL_HOST    = "127.0.0.1";
}
else if('product' === process.env.NODE_ENV){
  exports.MASTER_HOST   = "192.168.11.125"; // Please set ip of master server
  exports.LOCAL_HOST    = util.getWlanIPList()[0];
}

exports.MASTER_PORT     = 3000;
exports.LOCAL_PORT      = 3001;

exports.MAX_CHUNK_COUNT = 16;
exports.MAX_CHUNK_SIZE  = 67108864;
exports.BLOCK_SIZE      = 65536;

exports.CACHE_ROOT      = path.join(__dirname, '../AppData/chunkserver/cache/'); // "C:\\work\\GFS2\\AppData\\chunkserver\\cache\\";
exports.CHUNK_ROOT      = path.join(__dirname, '../AppData/chunkserver/chunk/'); // "C:\\work\\GFS2\\AppData\\chunkserver\\chunk1\\";
exports.CHECKSUM_PATH   = path.join(__dirname, '../AppData/chunkserver/checksum/data'); // "C:\\work\\GFS2\\AppData\\chunkserver\\checksum\\data";
exports.VERSION_PATH    = path.join(__dirname, '../AppData/chunkserver/version/data'); // "C:\\work\\GFS2\\AppData\\chunkserver\\version\\data";

exports.LOG_PATH        = path.join(__dirname, '../AppData/chunkserver/log.log'); // C:\\work\\GFS2\\AppData\\chunkserver\\log.log

