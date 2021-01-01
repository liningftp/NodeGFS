
const fs = require("fs");
const child_process = require("child_process");

// 后面会重复加载，这里不能使用const声明
let scanProcess = require("C:\\work\\GFS2\\Chunkserver\\daemon\\process\\scanProcess.js");


////////////////////////////////////////////////////////////////////////////////

// 重新载入模块
function reload(){
	delete require.cache[require.resolve("C:\\work\\GFS2\\Chunkserver\\daemon\\process\\scanProcess.js")]
	scanProcess = require("C:\\work\\GFS2\\Chunkserver\\daemon\\process\\scanProcess.js");
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
	// 执行业务逻辑
	var checksumData = {"ab83e19265655130b208def31e0c483ecb835a24a9a7508eaec0df0e62e65870":[0, [2089148645]]}
	var chunkRoot = "C:\\work\\GFS2\\AppData\\chunkserver\\chunk1";
	var blockSize = 65536;
	var result = await scanProcess._start(checksumData, chunkRoot, blockSize);

	return result;
// END
};
