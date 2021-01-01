
const fs = require("fs");
const child_process = require("child_process");

// 后面会重复加载，这里不能使用const声明
let cachedataPersist = require("C:\\work\\GFS2\\Chunkserver\\store\\cachedataPersist.js");


////////////////////////////////////////////////////////////////////////////////

// 重新载入模块
function reload(){
	delete require.cache[require.resolve("C:\\work\\GFS2\\Chunkserver\\store\\cachedataPersist.js")]
	cachedataPersist = require("C:\\work\\GFS2\\Chunkserver\\store\\cachedataPersist.js");
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

// load cache from disk
exports.load = function(){
// START
	reload();
	// 执行业务逻辑
	var cacheData = {};
	var cacheRoot = "C:\\work\\GFS2\\AppData\\chunkserver\\cache1";
	var timestamp = 1602989732263;
	var result = cachedataPersist.load(cacheData, cacheRoot, timestamp);

	return result;
// END
};


// write cache data to disk
exports.write = function(){
// START
	reload();
	// 执行业务逻辑
	var cacheContent = Buffer.from("hello world");
	var cacheRoot = "C:\\work\\GFS2\\AppData\\chunkserver\\cache1";
	var cacheKey = "key1234567";
	var result = cachedataPersist.write(cacheContent, cacheRoot, cacheKey);

	return result;
// END
};


// read content of cache key
exports.read = function(){
// START
	reload();
	// 执行业务逻辑
	var cacheRoot = "C:\\work\\GFS2\\AppData\\chunkserver\\cache1";
	var cacheKey = "key1234567";
	var result = cachedataPersist.read(cacheRoot, cacheKey);

	return result;
// END
};


// delete content of cache key
exports.delete = function(){
// START
	reload();
	// 执行业务逻辑
	var cacheRoot = "C:\\work\\GFS2\\AppData\\chunkserver\\cache1\\";
	var cacheKey = "key1234567";
	var result = cachedataPersist.delete(cacheRoot, cacheKey);

	return result;
// END
};
