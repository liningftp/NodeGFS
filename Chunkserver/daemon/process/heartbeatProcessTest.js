
const fs = require("fs");
const child_process = require("child_process");

// 后面会重复加载，这里不能使用const声明
let heartbeatProcess = require("C:\\work\\GFS2\\Chunkserver\\daemon\\process\\heartbeatProcess.js");


////////////////////////////////////////////////////////////////////////////////

// 重新载入模块
function reload(){
	delete require.cache[require.resolve("C:\\work\\GFS2\\Chunkserver\\daemon\\process\\heartbeatProcess.js")]
	heartbeatProcess = require("C:\\work\\GFS2\\Chunkserver\\daemon\\process\\heartbeatProcess.js");
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

// start
exports._start = async function(){
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
			"recvHeartbeatReport"
		],
		"returnValueList": [
			{
				"result": {
					"code": 0
				},
				"bigData": {
					"restoreList": [],
					"createList": [],
					"removeList": []
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
	var collectList = ["aabbccdd,2", "eeffgghh,1"]
	var errorList = ["eeffgghh"]
	var leaseList = ["aabbccdd"]
	var useRate = 25;
	var startTime = 1602671114309;
	var masterHost = "127.0.0.1";
	var masterPort = 3000;
	var localHost = "127.0.0.1";
	var localPort = 3001;
	var result = await heartbeatProcess._start(collectList, errorList, leaseList, useRate, startTime, masterHost, masterPort, localHost, localPort);

	// 向子进程发送退出指令

	return result;
// END
};
