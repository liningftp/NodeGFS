
const fs = require("fs");
const child_process = require("child_process");

// 后面会重复加载，这里不能使用const声明
let waitleaseTool = require("C:\\work\\GFS2\\Master\\metadata\\tool\\waitleaseTool.js");


////////////////////////////////////////////////////////////////////////////////

// 重新载入模块
function reload(){
	delete require.cache[require.resolve("C:\\work\\GFS2\\Master\\metadata\\tool\\waitleaseTool.js")]
	waitleaseTool = require("C:\\work\\GFS2\\Master\\metadata\\tool\\waitleaseTool.js");
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

// has chunk name or not
exports.has = function(){
// START
	reload();
	// 执行业务逻辑
	var waitleaseData = {"aabbccdd":[1603366654864,{"sock":3}]};
	var chunkName = "aabbccdd";
	var result = waitleaseTool.has(waitleaseData, chunkName);

	return result;
// END
};


// add
exports.add = function(){
// START
	reload();
	// 执行业务逻辑
	var waitleaseData = {};
	var chunkName = "aabbccdd";
	var clientObject = {"sock":3};
	var timestamp = 1603366654864;
	var result = waitleaseTool.add(waitleaseData, chunkName, clientObject, timestamp);

	return result;
// END
};


// get list
exports.get = function(){
// START
	reload();
	// 执行业务逻辑
	var waitleaseData = {"aabbccdd":[1603366654864,{"sock":3}]};
	var chunkName = "aabbccdd";
	var result = waitleaseTool.get(waitleaseData, chunkName);

	return result;
// END
};


// delete from queue
exports.delete = function(){
// START
	reload();
	// 执行业务逻辑
	var waitleaseData = {"aabbccdd":[1603366654864,{"sock":3}]};
	var chunkName = "aabbccdd";
	var result = waitleaseTool.delete(waitleaseData, chunkName);

	return result;
// END
};


// clear expire
exports.clear = function(){
// START
	reload();
	// 执行业务逻辑
	var waitleaseData = {"aabbccdd":[1603366654864,{"sock":3}], "eeffgghh":[1603367094445,{"sock":3}]};
	var timestamp = 1603367094445;
	var result = waitleaseTool.clear(waitleaseData, timestamp);

	return result;
// END
};
