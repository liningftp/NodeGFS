
const fs = require("fs");
const child_process = require("child_process");

// 后面会重复加载，这里不能使用const声明
let snapshotProcess = require("C:\\work\\GFS2\\Master\\daemon\\process\\snapshotProcess.js");


////////////////////////////////////////////////////////////////////////////////

// 重新载入模块
function reload(){
	delete require.cache[require.resolve("C:\\work\\GFS2\\Master\\daemon\\process\\snapshotProcess.js")]
	snapshotProcess = require("C:\\work\\GFS2\\Master\\daemon\\process\\snapshotProcess.js");
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
exports._start = function(){
// START
	reload();
	// 执行业务逻辑
	var result = snapshotProcess._start();

	return result;
// END
};
