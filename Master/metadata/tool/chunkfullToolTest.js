
const fs = require("fs");
const child_process = require("child_process");

// 后面会重复加载，这里不能使用const声明
let chunkfullTool = require("C:\\work\\GFS2\\Master\\metadata\\tool\\chunkfullTool.js");


////////////////////////////////////////////////////////////////////////////////

// 重新载入模块
function reload(){
	delete require.cache[require.resolve("C:\\work\\GFS2\\Master\\metadata\\tool\\chunkfullTool.js")]
	chunkfullTool = require("C:\\work\\GFS2\\Master\\metadata\\tool\\chunkfullTool.js");
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

// 指定的块是否为满块
exports.isFull = function(){
// START
	reload();
	// 执行业务逻辑
	var chunkfullData = {"aabbccdd":1603201500764};
	var chunkName = "aabbccdd";
	var result = chunkfullTool.isFull(chunkfullData, chunkName);

	return result;
// END
};


// 添加填满块的信息
exports.add = function(){
// START
	reload();
	// 执行业务逻辑
	var chunkfullData = {};
	var chunkName = "aabbccdd";
	var timestamp = 1603201500764;
	var result = chunkfullTool.add(chunkfullData, chunkName, timestamp);

	return result;
// END
};


// 删除指定的块
exports.delete = function(){
// START
	reload();
	// 执行业务逻辑
	var chunkfullData = {"aabbccdd":1603201500764};
	var chunkName = "aabbccdd";
	var result = chunkfullTool.delete(chunkfullData, chunkName);

	return result;
// END
};


// 清除过时块
exports.clear = function(){
// START
	reload();
	// 执行业务逻辑
	var chunkfullData = {"aabbccdd":1603201500764};
	var timestamp = 1603202299410;
	var result = chunkfullTool.clear(chunkfullData, timestamp);

	return result;
// END
};
