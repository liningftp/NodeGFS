
const fs = require("fs");
const child_process = require("child_process");

// 后面会重复加载，这里不能使用const声明
let cachedataTool = require("C:\\work\\GFS2\\Chunkserver\\metadata\\tool\\cachedataTool.js");


////////////////////////////////////////////////////////////////////////////////

// 重新载入模块
function reload(){
	delete require.cache[require.resolve("C:\\work\\GFS2\\Chunkserver\\metadata\\tool\\cachedataTool.js")]
	cachedataTool = require("C:\\work\\GFS2\\Chunkserver\\metadata\\tool\\cachedataTool.js");
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

// generate cache key
exports.createKey = function(){
// START
	reload();
	// 执行业务逻辑
	var cacheData = {"7f92ae0d99f850c4889e2b2c5594fcc6":[1024,1602985006457, 0],"16002e61fe175e03a0306849afeb457e":[30,1602985099686,1602985108213]};
	var result = cachedataTool.createKey(cacheData);

	return result;
// END
};


// add cache info
exports.add = function(){
// START
	reload();
	// 执行业务逻辑
	var cacheData = {};
	var cacheKey = "key123456";
	var size = 1024;
	var timestamp = 1602985444175;
	var result = cachedataTool.add(cacheData, cacheKey, size, timestamp);

	return result;
// END
};


// get cache size of content
exports.getSize = function(){
// START
	reload();
	// 执行业务逻辑
	var cacheData = {"key123456":[1024,1602985006457, 0]};
	var cacheKey = "key123456";
	var result = cachedataTool.getSize(cacheData, cacheKey);

	return result;
// END
};


// set cache used time
exports.setUsedTime = function(){
// START
	reload();
	// 执行业务逻辑
	var cacheData = {"7f92ae0d99f850c4889e2b2c5594fcc6":[1024,1602985006457, 0],"16002e61fe175e03a0306849afeb457e":[30,1602985099686,1602985108213]};
	var cacheKey = "7f92ae0d99f850c4889e2b2c5594fcc6";
	var timestamp = 1602985444175;
	var result = cachedataTool.setUsedTime(cacheData, cacheKey, timestamp);

	return result;
// END
};


// clear cache according to LRU
exports.clear = function(){
// START
	reload();
	// 执行业务逻辑
	var cacheData = {"7f92ae0d99f850c4889e2b2c5594fcc6":[1024,1602985006457, 0],"16002e61fe175e03a0306849afeb457e":[30,1602985099686,1602985108213]};
	var timestamp = 1602986926188;
	var result = cachedataTool.clear(cacheData, timestamp);

	return result;
// END
};
