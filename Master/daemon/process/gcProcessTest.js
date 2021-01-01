
const fs = require("fs");
const child_process = require("child_process");

// 后面会重复加载，这里不能使用const声明
let gcProcess = require("C:\\work\\GFS2\\Master\\daemon\\process\\gcProcess.js");


////////////////////////////////////////////////////////////////////////////////

// 重新载入模块
function reload(){
	delete require.cache[require.resolve("C:\\work\\GFS2\\Master\\daemon\\process\\gcProcess.js")]
	gcProcess = require("C:\\work\\GFS2\\Master\\daemon\\process\\gcProcess.js");
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

// run check
exports._start = function(){
// START
	reload();
	// 执行业务逻辑
	var namespaceDeleteData = {"/usr/data":{"1597879274447":{"/usr":{"_type":"dir","_lock":{"r":[],"w":[]},"/data":{"_type":"dir","_lock":{"r":[],"w":[]},"/001":{"_type":"file","_replicaCount":3,"_lock":{"r":[],"w":[]}},"/002":{"_type":"file","_replicaCount":3,"_lock":{"r":[],"w":[]}}},"/photo":{"_type":"dir","_lock":{"r":[],"w":[]},"/2020":{"_type":"file","_replicaCount":3,"_lock":{"r":[],"w":[]}}}}}}};
	var retainTime = 259200000;
	var timestamp = 1601278486787;
	var result = gcProcess._start(namespaceDeleteData, retainTime, timestamp);

	return result;
// END
};
