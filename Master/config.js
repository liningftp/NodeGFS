
const os    = require('os');
const path  = require('path');


process.env.NODE_ENV = 'develop';
// process.env.NODE_ENV = 'product';


if('develop' === process.env.NODE_ENV){
  exports.MASTER_HOST = '127.0.0.1';
}
else if('product' === process.env.NODE_ENV){
  exports.MASTER_HOST = '192.168.11.125'; // Please set ip of master server
}

exports.MASTER_PORT = 3000;

exports.RECORD_PATH = path.join(__dirname, '../AppData/master/operation.log'); //C:\\work\\GFS2\\AppData\\master\\operation.log

exports.CHECKPOINT_ROOT  = path.join(__dirname, '../AppData/master/checkpoint/'); //C:\\work\\GFS2\\AppData\\master\\checkpoint\\

exports.LOG_PATH = path.join(__dirname, '../AppData/master/log.log'); //C:\\work\\GFS2\\AppData\\master\\log.log

exports.DELETE_RETAIN_TIME = 259200000; // 3 * 24 * 3600 * 1000;

exports.HEARTBEAT_TIME = 60 * 1000;

exports.CHUNK_DEAD_TIME = 7200000; // 2 * 60 * 60 * 1000;

exports.SERVER_ALIVE_TIME = 2 * exports.HEARTBEAT_TIME;

exports.STORE_MAX_USE_RATE = 80;

exports.STORE_AVG_USE_RATE = 50;

exports.LOCK_DURATION = 60000; 


