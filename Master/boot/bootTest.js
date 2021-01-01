
const fs = require("fs");
const child_process = require("child_process");

// 后面会重复加载，这里不能使用const声明
let boot = require("C:\\work\\GFS2\\Master\\boot\\boot.js");


////////////////////////////////////////////////////////////////////////////////

// 重新载入模块
function reload(){
	delete require.cache[require.resolve("C:\\work\\GFS2\\Master\\boot\\boot.js")]
	boot = require("C:\\work\\GFS2\\Master\\boot\\boot.js");
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

// initialize
exports.init = function(){
// START
	reload();
	// 执行业务逻辑
	var config = {};
	var args = {};
	var result = boot.init(config, args);

	return result;
// END
};
