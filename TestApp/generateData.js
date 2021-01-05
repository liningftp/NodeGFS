
const fs = require('fs');
const path = require('path');

const util = require('../base/util.js');

const dataRoot = path.join(__dirname, "data/input/");


const total = 100;


for(var i = 0; i < total; i++){
	var fileName = 1000 + i + '.txt';
	var filePath = path.join(dataRoot, fileName);
	var len = getLen();
	if(!len){
		console.log(len);
	}
	var content = util.getKey().slice(0, len);
	fs.writeFileSync(filePath, content);
}


function getLen(){
	var len;
	while(!len){
		len = parseInt(16 * Math.random(), 10);
	}
	return len;
}
