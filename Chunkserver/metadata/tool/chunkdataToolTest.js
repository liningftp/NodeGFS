
const fs = require("fs");
const child_process = require("child_process");

// 后面会重复加载，这里不能使用const声明
let chunkdataTool = require("C:\\work\\GFS2\\Chunkserver\\metadata\\tool\\chunkdataTool.js");


////////////////////////////////////////////////////////////////////////////////

// 重新载入模块
function reload(){
	delete require.cache[require.resolve("C:\\work\\GFS2\\Chunkserver\\metadata\\tool\\chunkdataTool.js")]
	chunkdataTool = require("C:\\work\\GFS2\\Chunkserver\\metadata\\tool\\chunkdataTool.js");
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

// add chunk
exports.add = function(){
// START
	reload();
	// 执行业务逻辑
	var chunkData = {};
	var chunkName = "aabbccdd";
	var size = 300;
	var result = chunkdataTool.add(chunkData, chunkName, size);

	return result;
// END
};


// has chunk name or not
exports.has = function(){
// START
	reload();
	// 执行业务逻辑
	var chunkData = {"aabbccdd":[306, 1602691021717]};
	var chunkName = "aabbccdd";
	var result = chunkdataTool.has(chunkData, chunkName);

	return result;
// END
};


// delete chunk
exports.delete = function(){
// START
	reload();
	// 执行业务逻辑
	var chunkData = {"aabbccdd":[306, 1602691021717]};
	var chunkName = "aabbccdd";
	var result = chunkdataTool.delete(chunkData, chunkName);

	return result;
// END
};


// set chunk size
exports.setSize = function(){
// START
	reload();
	// 执行业务逻辑
	var chunkData = {"aabbccdd":[306, 1602691021717]};
	var chunkName = "aabbccdd";
	var size = 1024;
	var result = chunkdataTool.setSize(chunkData, chunkName, size);

	return result;
// END
};


// get chunk size
exports.getSize = function(){
// START
	reload();
	// 执行业务逻辑
	var chunkData = {"aabbccdd":[306, 1602691021717]};
	var chunkName = "aabbccdd";
	var result = chunkdataTool.getSize(chunkData, chunkName);

	return result;
// END
};


// set report time
exports.setTime = function(){
// START
	reload();
	// 执行业务逻辑
	var chunkData = {"aabbccdd":[306, 1602691021717]};
	var chunkName = "aabbccdd";
	var timestamp = 1602691122774;
	var result = chunkdataTool.setTime(chunkData, chunkName, timestamp);

	return result;
// END
};


// get use rate of storage
exports.getUseRate = function(){
// START
	reload();
	// 执行业务逻辑
	var chunkData = {};
	var maxChunkCount = 16;
	var result = chunkdataTool.getUseRate(chunkData, maxChunkCount);

	return result;
// END
};


// get chunk to report
exports.getReport = function(){
// START
	reload();
	// 执行业务逻辑
	var chunkData = {"aabbccdd":[306, 1602691021717], "eeffgghh":[1024, 1602720522884], "ooxxkkmm":[333, 0]};
	var result = chunkdataTool.getReport(chunkData);

	return result;
// END
};
