
const fs = require("fs");
const child_process = require("child_process");

// 后面会重复加载，这里不能使用const声明
let masterAPI = require("C:\\work\\GFS2\\Chunkserver\\callapi\\masterAPI.js");


////////////////////////////////////////////////////////////////////////////////

// 重新载入模块
function reload(){
	delete require.cache[require.resolve("C:\\work\\GFS2\\Chunkserver\\callapi\\masterAPI.js")]
	masterAPI = require("C:\\work\\GFS2\\Chunkserver\\callapi\\masterAPI.js");
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

// 向Master报告启动数据
exports.reportBootData = async function(){
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
			"recvBootData"
		],
		"returnValueList": [
			{
				"result": {
					"code": 0,
					"data": {
						"startTime": 1602907450469
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
	var chunkList = ["ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b,2"]
	var useRate = 25;
	var masterHost = "127.0.0.1";
	var masterPort = 3000;
	var localHost = "127.0.0.1";
	var localPort = 3001;
	var result = await masterAPI.reportBootData(chunkList, useRate, masterHost, masterPort, localHost, localPort);

	// 向子进程发送退出指令

	return result;
// END
};


// get last chunkName of file from Master
exports.getLastChunkName = async function(){
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
			"getLastChunkName"
		],
		"returnValueList": [
			{
				"result": {
					"code": 0,
					"data": {
						"startTime": 1602907450469,
						"chunkName": "eeffgghh"
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
	var masterHost = "127.0.0.1";
	var masterPort = 3000;
	var filePath = "/usr/data/001";
	var startTime = 1606358756826;
	var result = await masterAPI.getLastChunkName(masterHost, masterPort, filePath, startTime);

	// 向子进程发送退出指令

	return result;
// END
};


// 向Master上报错误块
exports.reportErrorChunk = async function(){
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
			"recvErrorChunk"
		],
		"returnValueList": [
			{
				"result": {
					"code": 0,
					"data": {
						"startTime": 1602907450469
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
	var masterHost = "127.0.0.1";
	var masterPort = 3000;
	var chunkName = "ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b";
	var localHost = "127.0.0.1";
	var localPort = 3002;
	var startTime = 1606363070335;
	var result = await masterAPI.reportErrorChunk(masterHost, masterPort, chunkName, localHost, localPort, startTime);

	// 向子进程发送退出指令

	return result;
// END
};


// report chunk filled full to Master
exports.reportFullChunk = async function(){
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
			"recvFullChunk"
		],
		"returnValueList": [
			{
				"result": {
					"code": 0,
					"data": {
						"startTime": 1602907450469
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
	var masterHost = "127.0.0.1";
	var masterPort = 3000;
	var chunkName = "aabbccdd";
	var localHost = "127.0.0.1";
	var localPort = 3002;
	var startTime = 1606376977109;
	var result = await masterAPI.reportFullChunk(masterHost, masterPort, chunkName, localHost, localPort, startTime);

	// 向子进程发送退出指令

	return result;
// END
};


// 向Master上报心跳
exports.reportHeatbeat = async function(){
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
			"recvHeartbeat"
		],
		"returnValueList": [
			{
				"result": {
					"code": 0,
					"data": {
						"startTime": 1602907450469
					}
				},
				"bigData": {
					"deleteList": [],
					"cloneList": []
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
	var collectList = ["ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b,12","be6ed3c858a45021b916388572d1081975c27961763e567db6bcd21db2827b05,6"]
	var leaseList = ["ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b"]
	var errorList = ["be6ed3c858a45021b916388572d1081975c27961763e567db6bcd21db2827b05"]
	var useRate = 26;
	var startTime = 1606470128122;
	var masterHost = "127.0.0.1";
	var masterPort = 3000;
	var localHost = "127.0.0.1";
	var localPort = 3001;
	var result = await masterAPI.reportHeatbeat(collectList, leaseList, errorList, useRate, startTime, masterHost, masterPort, localHost, localPort);

	// 向子进程发送退出指令

	return result;
// END
};
