
const fs = require("fs");
const child_process = require("child_process");

// 后面会重复加载，这里不能使用const声明
let masterAPI = require("C:\\work\\GFS2\\ClientLib\\callapi\\masterAPI.js");


////////////////////////////////////////////////////////////////////////////////

// 重新载入模块
function reload(){
	delete require.cache[require.resolve("C:\\work\\GFS2\\ClientLib\\callapi\\masterAPI.js")]
	masterAPI = require("C:\\work\\GFS2\\ClientLib\\callapi\\masterAPI.js");
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

// open system file
exports.open = async function(){
// START
	reload();
	// 执行业务逻辑
	var filePath = "/use/data/001";
	var flags = "O_RDONLY";
	var mode = "O_APPEND";
	var masterHost = "127.0.0.1";
	var masterPort = 3000;
	var result = await masterAPI.open(filePath, flags, mode, masterHost, masterPort);

	return result;
// END
};


// close system file
exports.close = async function(){
// START
	reload();
	// 执行业务逻辑
	var filePath = "/usr/data/001";
	var fd = 1606102127166;
	var masterHost = "127.0.0.1";
	var masterPort = 3000;
	var result = await masterAPI.close(filePath, fd, masterHost, masterPort);

	return result;
// END
};


// Delete directory
exports.deleteDir = async function(){
// START
	reload();

	// 启动测试服务端子进程
	var forkFile = "C:\\work\\CodeDesign\\server\\resource\\netServer.js";
	var startParamList = [
	{
		"method": "startServer",
		"host": "127.0.0.1",
		"port": 3000,
		"targetNameList": [
			"deleteDir"
		],
		"returnValueList": [
			{
				"result": {
					"code": 0
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
	var filePath = "/use/data";
	var fd = 1606961159937;
	var masterHost = "127.0.0.1";
	var masterPort = 3000;
	var result = await masterAPI.deleteDir(filePath, fd, masterHost, masterPort);

	// 向子进程发送退出指令

	return result;
// END
};


// Create directory
exports.createDir = async function(){
// START
	reload();

	// 启动测试服务端子进程
	var forkFile = "C:\\work\\CodeDesign\\server\\resource\\netServer.js";
	var startParamList = [
	{
		"method": "startServer",
		"host": "127.0.0.1",
		"port": 3000,
		"targetNameList": [
			"createDir"
		],
		"returnValueList": [
			{
				"result": {
					"code": 0
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
	var filePath = "/use/data";
	var masterHost = "127.0.0.1";
	var masterPort = 3000;
	var result = await masterAPI.createDir(filePath, masterHost, masterPort);

	// 向子进程发送退出指令

	return result;
// END
};


// delete file
exports.deleteFile = async function(){
// START
	reload();

	// 启动测试服务端子进程
	var forkFile = "C:\\work\\CodeDesign\\server\\resource\\netServer.js";
	var startParamList = [
	{
		"method": "startServer",
		"host": "127.0.0.1",
		"port": 3000,
		"targetNameList": [
			"deleteFile"
		],
		"returnValueList": [
			{
				"result": {
					"code": 0
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
	var filePath = "/use/data/001";
	var fd = 1606909907287;
	var masterHost = "127.0.0.1";
	var masterPort = 3000;
	var result = await masterAPI.deleteFile(filePath, fd, masterHost, masterPort);

	// 向子进程发送退出指令

	return result;
// END
};


// create file
exports.createFile = async function(){
// START
	reload();

	// 启动测试服务端子进程
	var forkFile = "C:\\work\\CodeDesign\\server\\resource\\netServer.js";
	var startParamList = [
	{
		"method": "startServer",
		"host": "127.0.0.1",
		"port": 3000,
		"targetNameList": [
			"createFile"
		],
		"returnValueList": [
			{
				"result": {
					"code": 0
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
	var filePath = "/use/data/001";
	var replicaCount = 0;
	var masterHost = "127.0.0.1";
	var masterPort = 3000;
	var result = await masterAPI.createFile(filePath, replicaCount, masterHost, masterPort);

	// 向子进程发送退出指令

	return result;
// END
};


// get serverList where write on
exports.getWriteServerList = async function(){
// START
	reload();

	// 启动测试服务端子进程
	var forkFile = "C:\\work\\CodeDesign\\server\\resource\\netServer.js";
	var startParamList = [
	{
		"method": "startServer",
		"host": "127.0.0.1",
		"port": 3000,
		"targetNameList": [
			"getWriteServerList"
		],
		"returnValueList": [
			{
				"result": {
					"code": 0,
					"msg": "",
					"data": {
						"version": 1,
						"primary": "127.0.0.1:3001",
						"serverList": [
							"127.0.0.1:3001",
							"127.0.0.1:3002",
							"127.0.0.1:3003"
						]
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
	var filePath = "/usr/data/001";
	var fd = 1606102127166;
	var index = 2;
	var masterHost = "127.0.0.1";
	var masterPort = 3000;
	var result = await masterAPI.getWriteServerList(filePath, fd, index, masterHost, masterPort);

	// 向子进程发送退出指令

	return result;
// END
};


// get serverList where read from
exports.getReadServerList = async function(){
// START
	reload();

	// 启动测试服务端子进程
	var forkFile = "C:\\work\\CodeDesign\\server\\resource\\netServer.js";
	var startParamList = [
	{
		"method": "startServer",
		"host": "127.0.0.1",
		"port": 3000,
		"targetNameList": [
			"getReadServerList"
		],
		"returnValueList": [
			{
				"result": {
					"code": 0,
					"data": {
						"3": {
							"chunkName": "aabbccdd",
							"version": 6,
							"serverList": [
								"127.0.0.1:3001",
								"127.0.0.1:3002",
								"127.0.0.1:3003"
							]
						}
					},
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
	var filePath = "/usr/data/001";
	var fd = 1607151913750;
	var index = 1;
	var count = 3;
	var masterHost = "127.0.0.1";
	var masterPort = 3000;
	var result = await masterAPI.getReadServerList(filePath, fd, index, count, masterHost, masterPort);

	// 向子进程发送退出指令

	return result;
// END
};


// get serverList where to append
exports.getAppendServerList = async function(){
// START
	reload();

	// 启动测试服务端子进程
	var forkFile = "C:\\work\\CodeDesign\\server\\resource\\netServer.js";
	var startParamList = [
	{
		"method": "startServer",
		"host": "127.0.0.1",
		"port": 3000,
		"targetNameList": [
			"getAppendServerList"
		],
		"returnValueList": [
			{
				"result": {
					"code": 0,
					"msg": "",
					"data": {
						"version": 1,
						"primary": "127.0.0.1:3001",
						"serverList": [
							"127.0.0.1:3001",
							"127.0.0.1:3002",
							"127.0.0.1:3003"
						]
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
	var filePath = "/usr/data/001";
	var fd = 1606961159937;
	var masterHost = "127.0.0.1";
	var masterPort = 3000;
	var result = await masterAPI.getAppendServerList(filePath, fd, masterHost, masterPort);

	// 向子进程发送退出指令

	return result;
// END
};
