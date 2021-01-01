
const fs = require("fs");
const child_process = require("child_process");

// 后面会重复加载，这里不能使用const声明
let chunkserverAPI = require("C:\\work\\GFS2\\ClientLib\\callapi\\chunkserverAPI.js");


////////////////////////////////////////////////////////////////////////////////

// 重新载入模块
function reload(){
	delete require.cache[require.resolve("C:\\work\\GFS2\\ClientLib\\callapi\\chunkserverAPI.js")]
	chunkserverAPI = require("C:\\work\\GFS2\\ClientLib\\callapi\\chunkserverAPI.js");
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

// Primary run control order to write
exports.primaryWrite = async function(){
// START
	reload();

	// 启动测试服务端子进程
	var forkFile = "C:\\work\\CodeDesign\\server\\resource\\netServer.js";
	var startParamList = [
	{
		"method": "startServer",
		"host": "127.0.0.1",
		"port": 3001,
		"targetNameList": [
			"primaryWrite"
		],
		"returnValueList": [
			{
				"result": {
					"code": 0,
					"msg": ""
				}
			}
		]
	}
];
	var childList = [];
	for(var i = 0, startParam; startParam = startParamList[i]; i++){
		var child = await forkServer(forkFile, startParam);
		childList.push(child);
	}

	// 执行业务逻辑
	var chunkserverList = ["127.0.0.1:3001", "127.0.0.1:3002", "127.0.0.1:3003"]
	var cacheKey = "de960194c26946bd2873a3378020f32e";
	var chunkName = "ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b";
	var startPos = 6;
	var version = 1;
	var result = await chunkserverAPI.primaryWrite(chunkserverList, cacheKey, chunkName, startPos, version);

	// 向子进程发送退出指令

	return result;
// END
};


// Client push data to chunkserver
exports.primaryPushData = async function(){
// START
	reload();

	// 启动测试服务端子进程
	var forkFile = "C:\\work\\CodeDesign\\server\\resource\\netServer.js";
	var startParamList = [
	{
		"method": "startServer",
		"host": "127.0.0.1",
		"port": 3001,
		"targetNameList": [
			"primaryPushData"
		],
		"returnValueList": [
			{
				"result": {
					"code": 0,
					"data": {
						"cacheKey": "key123456"
					}
				}
			}
		]
	}
];
	var childList = [];
	for(var i = 0, startParam; startParam = startParamList[i]; i++){
		var child = await forkServer(forkFile, startParam);
		childList.push(child);
	}

	// 执行业务逻辑
	var chunkserverList = ["127.0.0.1:3001", "127.0.0.1:3002", "127.0.0.1:3003"]
	var contentData = Buffer.from("hello girl");
	var result = await chunkserverAPI.primaryPushData(chunkserverList, contentData);

	// 向子进程发送退出指令

	return result;
// END
};


// Record append
exports.primaryAppend = async function(){
// START
	reload();

	// 启动测试服务端子进程
	var forkFile = "C:\\work\\CodeDesign\\server\\resource\\netServer.js";
	var startParamList = [
	{
		"method": "startServer",
		"host": "127.0.0.1",
		"port": 3001,
		"targetNameList": [
			"primaryAppend"
		],
		"returnValueList": [
			{
				"result": {
					"code": 0,
					"data": {
						"startPos": 0
					}
				}
			}
		]
	}
];
	var childList = [];
	for(var i = 0, startParam; startParam = startParamList[i]; i++){
		var child = await forkServer(forkFile, startParam);
		childList.push(child);
	}

	// 执行业务逻辑
	var chunkserverList = ["127.0.0.1:3001", "127.0.0.1:3002", "127.0.0.1:3003"]
	var filePath = "/usr/data/001";
	var primary = "127.0.0.1:3000";
	var cacheKey = "de960194c26946bd2873a3378020f32e";
	var version = 1;
	var result = await chunkserverAPI.primaryAppend(chunkserverList, filePath, primary, cacheKey, version);

	// 向子进程发送退出指令

	return result;
// END
};


// Read chunk from chunkserver
exports.readChunk = async function(){
// START
	reload();

	// 启动测试服务端子进程
	var forkFile = "C:\\work\\CodeDesign\\server\\resource\\netServer.js";
	var startParamList = [
	{
		"method": "startServer",
		"host": "127.0.0.1",
		"port": 3001,
		"targetNameList": [
			"readChunk"
		],
		"returnValueList": [
			{
				"result": {
					"code": 0,
					"data": {
						"startPos": 0
					}
				},
				"bigData": []
			}
		]
	}
];
	var childList = [];
	for(var i = 0, startParam; startParam = startParamList[i]; i++){
		var child = await forkServer(forkFile, startParam);
		childList.push(child);
	}

	// 执行业务逻辑
	var chunkserverList = ["127.0.0.1:3001", "127.0.0.1:3002", "127.0.0.1:3003"]
	var chunkName = "ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b";
	var version = 1;
	var startPos = 100;
	var length = 1;
	var result = await chunkserverAPI.readChunk(chunkserverList, chunkName, version, startPos, length);

	// 向子进程发送退出指令

	return result;
// END
};
