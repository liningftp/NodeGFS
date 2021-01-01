
const fs = require("fs");
const child_process = require("child_process");

// 后面会重复加载，这里不能使用const声明
let namespaceTool = require("C:\\work\\GFS2\\Master\\metadata\\tool\\namespaceTool.js");


////////////////////////////////////////////////////////////////////////////////

// 重新载入模块
function reload(){
	delete require.cache[require.resolve("C:\\work\\GFS2\\Master\\metadata\\tool\\namespaceTool.js")]
	namespaceTool = require("C:\\work\\GFS2\\Master\\metadata\\tool\\namespaceTool.js");
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

// add file path
exports.add = function(){
// START
	reload();
	// 执行业务逻辑
	var namespaceData = {};
	var filePath = "/usr/data/001";
	var fileType = "file";
	var result = namespaceTool.add(namespaceData, filePath, fileType);

	return result;
// END
};


// delete file path
exports.delete = function(){
// START
	reload();
	// 执行业务逻辑
	var namespaceData = {"/usr":{"_type":"dir","_lock":{},"/data":{"_type":"dir","_lock":{},"/001":{"_type":"file","_replicaCount":3,"_lock":{}}}}};
	var filePath = "/usr/data/001/xx/yy";
	var result = namespaceTool.delete(namespaceData, filePath);

	return result;
// END
};


// has path or not
exports.hasPath = function(){
// START
	reload();
	// 执行业务逻辑
	var namespaceData = {"/usr":{"_type":"dir","_lock":{},"/data":{"_type":"dir","_lock":{},"/001":{"_type":"file","_replicaCount":3,"_lock":{}}}}};
	var filePath = "/usr/data/001";
	var result = namespaceTool.hasPath(namespaceData, filePath);

	return result;
// END
};


// get chunk replica count
exports.getReplicaCount = function(){
// START
	reload();
	// 执行业务逻辑
	var namespaceData = {"/usr":{"_type":"dir","_lock":{"r":[],"w":[]},"/data":{"_type":"dir","_lock":{"r":[],"w":[]},"/001":{"_type":"file","_replicaCount":3,"_lock":{"r":[],"w":[]}}}}};
	var filePath = "/usr/data/001";
	var result = namespaceTool.getReplicaCount(namespaceData, filePath);

	return result;
// END
};


// clone the part namespace of file path
exports.clone = function(){
// START
	reload();
	// 执行业务逻辑
	var namespaceData = {"/usr":{"_type":"dir","_lock":{"r":[],"w":[]},"/data":{"_type":"dir","_lock":{"r":[],"w":[]},"/001":{"_type":"file","_replicaCount":3,"_lock":{"r":[],"w":[]}}}}};
	var filePath = "/usr/data/001";
	var result = namespaceTool.clone(namespaceData, filePath);

	return result;
// END
};


// get list of file path from namespace
exports.getFilePathList = function(){
// START
	reload();
	// 执行业务逻辑
	var namespaceData = {"/usr":{"_type":"dir","_lock":{},"/data":{"_type":"dir","_lock":{},"/001":{"_type":"file","_replicaCount":3,"_lock":{}},"/002":{"_type":"file","_replicaCount":3,"_lock":{}}},"/etc":{"_type":"dir","_lock":{},"/nginx":{"_type":"file","_replicaCount":3,"_lock":{}}}}};
	var result = namespaceTool.getFilePathList(namespaceData);

	return result;
// END
};


// add lock
exports.lock = function(){
// START
	reload();
	// 执行业务逻辑
	var namespaceData = {"/usr":{"_type":"dir","_lock":{"r":[1600676278653],"w":[],"snap":[]},"/000":{"_type":"file","_replicaCount":3,"_lock":{"r":[1600676278653],"w":[],"a":[],"snap":[]}}}};
	var filePath = "/usr/000";
	var lockType = "w";
	var timestamp = 1600676278653;
	var lockDuration = 300000;
	var result = namespaceTool.lock(namespaceData, filePath, lockType, timestamp, lockDuration);

	return result;
// END
};


// release lock
exports.unlock = function(){
// START
	reload();
	// 执行业务逻辑
	var namespaceData = {"/usr":{"_type":"dir","_lock":{"r":[1600676278653,1606184682394],"w":[],"snap":[]},"/000":{"_type":"file","_replicaCount":3,"_lock":{"r":[1600676278653],"w":[],"a":[],"snap":[]}}}};
	var filePath = "/usr/000";
	var fd = 1600676278653;
	var result = namespaceTool.unlock(namespaceData, filePath, fd);

	return result;
// END
};


// check lock is exists or not
exports.isLock = function(){
// START
	reload();
	// 执行业务逻辑
	var namespaceData = {"/usr":{"_type":"dir","_lock":{"r":[1601781089737],"w":[],"snap":[1601781089737]},"/000":{"_type":"file","_replicaCount":3,"_lock":{"r":[1601781089737],"w":[],"a":[],"snap":[1601781089737]}}}};
	var filePath = "/usr/000";
	var lockType = "a";
	var timestamp = 1601781089737;
	var lockDuration = 300000;
	var result = namespaceTool.isLock(namespaceData, filePath, lockType, timestamp, lockDuration);

	return result;
// END
};


// has authority to run
exports.hasAuth = function(){
// START
	reload();
	// 执行业务逻辑
	var namespaceData = {"/usr":{"_type":"dir","_lock":{"r":[1601781089737],"w":[],"snap":[1601781089737]},"/000":{"_type":"file","_replicaCount":3,"_lock":{"r":[1601781089737],"w":[],"a":[],"snap":[1601781089737]}}}};
	var filePath = "/usr/000";
	var fd = 1601781089737;
	var timestamp = 1601781089737;
	var lockDuration = 300000;
	var result = namespaceTool.hasAuth(namespaceData, filePath, fd, timestamp, lockDuration);

	return result;
// END
};


// find max fd of tree data
exports._findMaxFD = function(){
// START
	reload();
	// 执行业务逻辑
	var treeData = {"/usr":{"_type":"dir","_lock":{"r":[1600676278653],"w":[1606179635164],"snap":[]},"/000":{"_type":"file","_replicaCount":3,"_lock":{"r":[1600676278653],"w":[],"a":[],"snap":[]}}}};
	var filePath = "/usr/000";
	var result = namespaceTool._findMaxFD(treeData, filePath);

	return result;
// END
};


// copy tree data
exports._copy = function(){
// START
	reload();
	// 执行业务逻辑
	var src = {"/usr":{"_type":"dir","_lock":{"r":[1600765363449,1600765377526],"w":[]},"/data":{"_type":"dir","_lock":{"r":[1600765363449,1600765377526],"w":[]},"/001":{"_type":"file","_replicaCount":3,"_lock":{"r":[],"w":[1600765363449]}}}}};
	var result = namespaceTool._copy(src);

	return result;
// END
};


// clear expire lock
exports._clearLock = function(){
// START
	reload();
	// 执行业务逻辑
	var treeData = {"/usr":{"_type":"dir","_lock":{"r":[1600676278653],"w":[1600675878500],"snap":[]},"/000":{"_type":"file","_replicaCount":3,"_lock":{"r":[1600676278653],"w":[],"a":[1606181904980],"snap":[]}}}};
	var filePath = "/usr/000";
	var timestamp = 1606181904980;
	var lockDuration = 300000;
	var result = namespaceTool._clearLock(treeData, filePath, timestamp, lockDuration);

	return result;
// END
};
