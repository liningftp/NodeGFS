
const fs = require('fs');
const path = require('path');

const buffer = [];

const s2 = ' '.repeat( 2 );
const s4 = ' '.repeat( 4 );

let logPath;
let timer;


/****************************************************************************/
/*                               public function                            */
/****************************************************************************/

exports.init = function( savePath ){

  logPath = savePath;

  timer = setInterval( () => {
    _save();
  }, 3 * 1000 );

};

/**
 * @level {String} 'WARN', 'DEBUG', 'INFO', 'ERROR', 'FATAL'
 *
 */
exports.out = function( error, message ){
  let level = error.message;
  let stack = _stack( error );

  buffer[buffer.length] = [
    `[${_format(new Date())}] [${level.toUpperCase()}] ${stack.path}, line ${stack.line}`,
    `${s2}${stack.method} ${message}`,
  ].join('\n');
};


exports.args = ( error, args ) => {
  let message = _getArgsMessage( args );

  _out( 'INFO', error, message );
};

exports.info = ( error, message ) => {
  _out( 'INFO', error, ` -> ${message}` );
};

exports.warn = ( error, message ) => {
  _out( 'WARN', error, ` <- ${message}` );
};

exports.debug = ( error, message ) => {
  _out( 'DEBUG', error, ` <- ${message}` );
};


exports.error = ( error, message ) => {
  _out( 'ERROR', error, ` <- ${message}` );
};

exports.fatal = ( error, message ) => {
  _out( 'FATAL', error, ` <- ${message}` );
};

exports.end = ( error, message ) => {
  _out( 'INFO', error, ` <- ${message}` );
};


/****************************************************************************/
/*                              private function                            */
/****************************************************************************/

function _out(level, error, message){
  let stack = _stack( error );

  buffer[buffer.length] = [
    `[${_format(new Date())}] [${level.toUpperCase()}] ( ${stack.method} ) ${stack.path}, line ${stack.line}`,
    `${s2}${message}`,
  ].join('\n');
}


function _save() {
  let list = buffer.splice( 0, buffer.length );
  if( list && list.length ){
    let content = '\n\n' + list.join('\n\n');
    fs.appendFileSync( logPath, content );
  }
};


function _getArgsMessage( args ){
  /* hack */
  // let fn = _getFn( args );
  // let names = _getParamName( fn );

  let values = Array.from( args );

  let list = [`(`];
  for( let i = 0; i < args.length; i++ ){
    // let name = names[i];
    let value = values[i];
    list[list.length] = `${s4}-> ${JSON.stringify(value)}`;
  }
  list[list.length] = `${s2})`;

  return list.join('\n');
}


/**
 * how do fun get?
 * fun is arguments.callee in within itself
 */
function _getParamName( fn ){
  if(typeof fn !== 'object' && typeof fn !== 'function' ) return;

  const COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
  const DEFAULT_PARAMS = /=[^,)]+/mg;
  const FAT_ARROWS = /=>.*$/mg;
  let code = fn.prototype ? fn.prototype.constructor.toString() : fn.toString();
  code = code
      .replace(COMMENTS, '')
      .replace(FAT_ARROWS, '')
      .replace(DEFAULT_PARAMS, '');
  let result = code.slice(code.indexOf('(') + 1, code.indexOf(')')).match(/([^\s,]+)/g);

  return result === null ? [] :result;
}


/**
 * @format {String} "yyyy-MM-ddThh:mm:ss.S"
  */
function _format(date, format) {

  format = format || "yyyy-MM-ddThh:mm:ss.S";

  var o = {
    "M+" : date.getMonth() + 1, // month
    "d+" : date.getDate(), // day
    "h+" : date.getHours(), // hour
    "m+" : date.getMinutes(), // minute
    "s+" : date.getSeconds(), // second
    "q+" : Math.floor((date.getMonth() + 3) / 3), // quarter
    "S+" : date.getMilliseconds()
    // millisecond
  }

  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }

  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      var formatStr="";
      for(var i=1;i<=RegExp.$1.length;i++){
          formatStr+="0";
      }

      var replaceStr="";
      if(RegExp.$1.length == 1){
          replaceStr=o[k];
      }else{
          formatStr=formatStr+o[k];
          var index=("" + o[k]).length;
          formatStr=formatStr.substr(index);
          replaceStr=formatStr;
      }
      format = format.replace(RegExp.$1, replaceStr);
    }
  }

  return format;
}


function _stack( error ) {
  var stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/i;
  var stackReg2 = /at\s+()(.*):(\d*):(\d*)/i;
  var stacklist = error.stack.split('\n').slice(1);
  var s = stacklist[0];
  var sp = stackReg.exec(s) || stackReg2.exec(s);
  var data = {};
  if (sp && sp.length === 5) {
      data.method = sp[1];
      data.path = sp[2];
      data.line = sp[3];
      data.pos = sp[4];
      data.file = path.basename(data.path);
  }
  return data;
};

