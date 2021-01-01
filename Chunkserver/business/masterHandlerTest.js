
const fs = require("fs");
const child_process = require("child_process");

// 后面会重复加载，这里不能使用const声明
let masterHandler = require("C:\\work\\GFS2\\Chunkserver\\business\\masterHandler.js");


////////////////////////////////////////////////////////////////////////////////

// 重新载入模块
function reload(){
	delete require.cache[require.resolve("C:\\work\\GFS2\\Chunkserver\\business\\masterHandler.js")]
	masterHandler = require("C:\\work\\GFS2\\Chunkserver\\business\\masterHandler.js");
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

// receive lease of Master grant to primary
exports.recvLease = async function(){
// START
	reload();
	// 执行业务逻辑
	var chunkData = {};
	var checksumData = {};
	var checksumFreeData = []
	var chunkversionData = {};
	var chunkversionFreeData = []
	var leaseData = {};
	var chunkName = "ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b";
	var version = 1;
	var primary = "127.0.0.1:3001";
	var serverList = ["127.0.0.1:3001", "127.0.0.1:3002", "127.0.0.1:3003"]
	var isNew = 1;
	var timestamp = 1606641250664;
	var blockSize = 65536;
	var chunkRoot = "C:\\work\\GFS2\\AppData\\chunkserver\\chunk1\\";
	var checksumPath = "C:\\work\\GFS2\\AppData\\chunkserver\\checksum1\\data";
	var versionPath = "C:\\work\\GFS2\\AppData\\chunkserver\\version1\\data";
	var result = await masterHandler.recvLease(chunkData, checksumData, checksumFreeData, chunkversionData, chunkversionFreeData, leaseData, chunkName, version, primary, serverList, isNew, timestamp, blockSize, chunkRoot, checksumPath, versionPath);

	return result;
// END
};


// master revoke lease
exports.revokeLease = async function(){
// START
	reload();
	// 执行业务逻辑
	var chunkData = {"aabbccdd":[306, 1602691021717], "eeffgghh":[1, 1602691021717]};
	var leaseData = {"aabbccdd":{"primary":1602576896653, "work":1}};
	var chunkName = "eeffgghh";
	var result = await masterHandler.revokeLease(chunkData, leaseData, chunkName);

	return result;
// END
};
