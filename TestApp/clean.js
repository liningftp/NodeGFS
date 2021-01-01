
const {rimraf} = require('../base');


let pathList = [
  'C:\\work\\GFS2\\AppData\\master\\*',
  'C:\\work\\GFS2\\AppData\\chunkserver\\*',
  'C:\\work\\GFS2\\AppData\\test\\output\\*',
  'C:\\work\\GFS2\\AppData\\test\\result.txt',
  'C:\\work\\GFS2\\AppData\\test\\error.txt',
];

let logList = [
  'C:\\work\\GFS2\\AppData\\master\\log.log',
  'C:\\work\\GFS2\\AppData\\chunkserver\\log*.log',
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
