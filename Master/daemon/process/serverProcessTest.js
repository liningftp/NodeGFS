
const fs = require("fs");
const child_process = require("child_process");

// 后面会重复加载，这里不能使用const声明
let serverProcess = require("C:\\work\\GFS2\\Master\\daemon\\process\\serverProcess.js");


////////////////////////////////////////////////////////////////////////////////

// 重新载入模块
function reload(){
	delete require.cache[require.resolve("C:\\work\\GFS2\\Master\\daemon\\process\\serverProcess.js")]
	serverProcess = require("C:\\work\\GFS2\\Master\\daemon\\process\\serverProcess.js");
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

// find timeout chunkserver
exports._start = function(){
// START
	reload();
	// 执行业务逻辑
	var serverData = {"127.0.0.1:3001":[12,1599033406152],"127.0.0.1:3002":[22,1599033406152],"127.0.0.1:3003":[79,1599033677924]}
	var heartbeatTime = 60000;
	var timestamp = 1599033406152;
	var result = serverProcess._start(serverData, heartbeatTime, timestamp);

	return result;
// END
};
