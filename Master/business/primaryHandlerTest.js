
const fs = require("fs");
const child_process = require("child_process");

// 后面会重复加载，这里不能使用const声明
let primaryHandler = require("C:\\work\\GFS2\\Master\\business\\primaryHandler.js");


////////////////////////////////////////////////////////////////////////////////

// 重新载入模块
function reload(){
	delete require.cache[require.resolve("C:\\work\\GFS2\\Master\\business\\primaryHandler.js")]
	primaryHandler = require("C:\\work\\GFS2\\Master\\business\\primaryHandler.js");
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

// receive boot data from chunkserver
exports.recvBootData = async function(){
// START
	reload();
	// 执行业务逻辑
	var chunkData = {"aabbccdd":[1,10,3,"127.0.0.1:3001,1585471730177","127.0.0.1:3002,1585471730177","127.0.0.1:3003,1585471730177"]};
	var serverData = {};
	var chunkList = ["aabbccdd,2", "eeffgghh,3"]
	var pair = "127.0.0.1:3001";
	var useRate = 25;
	var timestamp = 1602228234877;
	var chunkDeadTime = 7200000;
	var result = await primaryHandler.recvBootData(chunkData, serverData, chunkList, pair, useRate, timestamp, chunkDeadTime);

	return result;
// END
};


// receive fullchunk from primary
exports.recvFullChunk = async function(){
// START
	reload();
	// 执行业务逻辑
	var chunkfullData = {"ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b":1603201500764};
	var chunkName = "ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b";
	var pair = "127.0.0.1:3001";
	var startTime = 1602228234877;
	var timestamp = 1602228234877;
	var result = await primaryHandler.recvFullChunk(chunkfullData, chunkName, pair, startTime, timestamp);

	return result;
// END
};


// receive error chunk from primary
exports.recvErrorChunk = async function(){
// START
	reload();
	// 执行业务逻辑
	var chunkData = {"ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b":[1,10,"127.0.0.1:3001,1585471730177","127.0.0.1:3002,1585471730177","127.0.0.1:3003,1585471730177"]};
	var chunklostData = {};
	var chunkName = "ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b";
	var pair = "127.0.0.1:3001";
	var startTime = 1602228234877;
	var timestamp = 1602228234877;
	var result = await primaryHandler.recvErrorChunk(chunkData, chunklostData, chunkName, pair, startTime, timestamp);

	return result;
// END
};


// chunkserver request the last chunkName of file
exports.getLastChunkName = async function(){
// START
	reload();
	// 执行业务逻辑
	var namespaceData = {"/usr":{"_type":"dir","_lock":{"r":[1606226758420,1600765377526],"w":[],"a":[],"snap":[]},"/data":{"_type":"dir","_lock":{"r":[1606226758420,1600765377526],"w":[],"a":[],"snap":[]},"/001":{"_type":"file","_replicaCount":3,"_lock":{"r":[],"w":[],"a":[],"snap":[1606226758420]}}}}};
	var file2chunkData = {"/usr/data/001":["aabbccdd"], "/usr/data/002":["eeffgghh"]};
	var filePath = "/usr/data/001";
	var startTime = 1602228234877;
	var lockDuration = 300000;
	var timestamp = 1602228234877;
	var result = await primaryHandler.getLastChunkName(namespaceData, file2chunkData, filePath, startTime, lockDuration, timestamp);

	return result;
// END
};
