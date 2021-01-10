
const path = require('path');

const {rimraf} = require('../base');


let pathList = [
  path.join( __dirname, '../AppData/master/*' ),
  path.join( __dirname, '../AppData/chunkserver/*' ),
  path.join( __dirname, '../AppData/test/output/*' ),
  path.join( __dirname, '../AppData/test/result.txt' ),
  path.join( __dirname, '../AppData/test/error.txt' ),
];

let logList = [
  path.join( __dirname, '../AppData/master/log.log' ),
  path.join( __dirname, '../AppData/chunkserver/log*.log' ),
];


let args = process.argv.splice(2);
let deleteList;

// only clean log
if( 'log' == args[0] ){
  deleteList = logList;
}
else{
  deleteList = pathList;
}

deleteList.forEach( p => {
  rimraf(p, function(err){
    if(err){
      console.log(err);
    }
  });
});
