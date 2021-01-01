
const fs = require("fs");
const child_process = require("child_process");

// 后面会重复加载，这里不能使用const声明
let masterdataTool = require("C:\\work\\GFS2\\Chunkserver\\metadata\\tool\\masterdataTool.js");


////////////////////////////////////////////////////////////////////////////////

// 重新载入模块
function reload(){
	delete require.cache[require.resolve("C:\\work\\GFS2\\Chunkserver\\metadata\\tool\\masterdataTool.js")]
	masterdataTool = require("C:\\work\\GFS2\\Chunkserver\\metadata\\tool\\masterdataTool.js");
}


// 创建子进程服务器端
async function forkServer(forkFile, startParam){
	var child = child_process.fork(forkFile);

	return	new Promise( (resolve, reject) => {
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

// set time of master
exports.setTime = function(){
// START
	reload();
	// 执行业务逻辑
	var masterData = {};
	var startTime = 1593783888581;
	var result = masterdataTool.setTime(masterData, startTime);

	return result;
// END
};


// get start time of master
exports.getTime = function(){
// START
	reload();
	// 执行业务逻辑
	var masterData = {"startTime":1593783888581};
	var result = masterdataTool.getTime(masterData);

	return result;
// END
};


// check is master reboot
exports.checkTime = function(){
// START
	reload();
	// 执行业务逻辑
	var masterData = {"startTime":1593783888581};
	var startTime = 1593783888581;
	var result = masterdataTool.checkTime(masterData, startTime);

	return result;
// END
};
