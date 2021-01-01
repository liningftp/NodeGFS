
exports.lodash = require('lodash');
exports.minimist = require('minimist');
exports.schedule = require('node-schedule');
exports.crc32 = require('crc-32');
exports.rimraf = require('rimraf');
exports.util = require('./util.js');
exports.utilarray = require('./utilarray.js');
exports.utilfs = require('./utilfs.js');
exports.utilstr = require('./utilstr.js');

exports.comm = require('./communication.js');
exports.log = require('./log.js');



exports.clog = console.log.bind(console);

exports.jsonlog = function(data){
  exports.clog( JSON.stringify(data) );
};

exports.jsons = function( data ){
  if( '[object String]' === Object.prototype.toString.call( data ) ){
    return data;
  }
  return JSON.stringify( data );
};
