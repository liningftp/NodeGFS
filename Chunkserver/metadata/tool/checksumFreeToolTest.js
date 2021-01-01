
const fs = require("fs");
const child_process = require("child_process");

// 后面会重复加载，这里不能使用const声明
let checksumFreeTool = require("C:\\work\\GFS2\\Chunkserver\\metadata\\tool\\checksumFreeTool.js");


////////////////////////////////////////////////////////////////////////////////

// 重新载入模块
function reload(){
	delete require.cache[require.resolve("C:\\work\\GFS2\\Chunkserver\\metadata\\tool\\checksumFreeTool.js")]
	checksumFreeTool = require("C:\\work\\GFS2\\Chunkserver\\metadata\\tool\\checksumFreeTool.js");
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

// get free index
exports.getFreeIndex = function(){
// START
	reload();
	// 执行业务逻辑
	var checksumFreeData = [2, 3]
	var result = checksumFreeTool.getFreeIndex(checksumFreeData);

	return result;
// END
};


// delete free index
exports.delete = function(){
// START
	reload();
	// 执行业务逻辑
	var checksumFreeData = [2, 3]
	var freeIndex = 2;
	var result = checksumFreeTool.delete(checksumFreeData, freeIndex);

	return result;
// END
};


// add free index
exports.add = function(){
// START
	reload();
	// 执行业务逻辑
	var checksumFreeData = []
	var freeIndex = 1;
	var result = checksumFreeTool.add(checksumFreeData, freeIndex);

	return result;
// END
};
