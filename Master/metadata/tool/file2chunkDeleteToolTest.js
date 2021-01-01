
const fs = require("fs");
const child_process = require("child_process");

// 后面会重复加载，这里不能使用const声明
let file2chunkDeleteTool = require("C:\\work\\GFS2\\Master\\metadata\\tool\\file2chunkDeleteTool.js");


////////////////////////////////////////////////////////////////////////////////

// 重新载入模块
function reload(){
	delete require.cache[require.resolve("C:\\work\\GFS2\\Master\\metadata\\tool\\file2chunkDeleteTool.js")]
	file2chunkDeleteTool = require("C:\\work\\GFS2\\Master\\metadata\\tool\\file2chunkDeleteTool.js");
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

// add
exports.add = function(){
// START
	reload();
	// 执行业务逻辑
	var file2chunkDeleteData = {};
	var filePath = "/usr/data/001";
	var chunkNameList = ["aabbccdd", "eeffgghh"]
	var timestamp = 1599221725369;
	var result = file2chunkDeleteTool.add(file2chunkDeleteData, filePath, chunkNameList, timestamp);

	return result;
// END
};


// get list of chunk name with file path
exports.get = function(){
// START
	reload();
	// 执行业务逻辑
	var file2chunkDeleteData = {"/usr/data/001":{"1597879274447":["aabbcdd","eeffgghh"]}};
	var filePath = "/usr/data/001";
	var timestamp = 1597879274447;
	var result = file2chunkDeleteTool.get(file2chunkDeleteData, filePath, timestamp);

	return result;
// END
};


// delete
exports.delete = function(){
// START
	reload();
	// 执行业务逻辑
	var file2chunkDeleteData = {"/usr/data/001":{"1597879274447":["aabbcdd","eeffgghh"]}};
	var filePath = "/usr/data/001";
	var timestamp = 1597879274447;
	var result = file2chunkDeleteTool.delete(file2chunkDeleteData, filePath, timestamp);

	return result;
// END
};
