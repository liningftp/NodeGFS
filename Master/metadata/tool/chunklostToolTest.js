
const fs = require("fs");
const child_process = require("child_process");

// 后面会重复加载，这里不能使用const声明
let chunklostTool = require("C:\\work\\GFS2\\Master\\metadata\\tool\\chunklostTool.js");


////////////////////////////////////////////////////////////////////////////////

// 重新载入模块
function reload(){
	delete require.cache[require.resolve("C:\\work\\GFS2\\Master\\metadata\\tool\\chunklostTool.js")]
	chunklostTool = require("C:\\work\\GFS2\\Master\\metadata\\tool\\chunklostTool.js");
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

// 获取需要修复的块列表，先加入的排在前面
exports.getList = function(){
// START
	reload();
	// 执行业务逻辑
	var chunklostData = {"aabbccdd":[1599701518196,1603841772044],"eeffgghh":[1603842910809,0],"ooxxkkmm":[1599701518196,0]};
	var timestamp = 1606443851845;
	var result = chunklostTool.getList(chunklostData, timestamp);

	return result;
// END
};


// 设置时间戳
exports.setTime = function(){
// START
	reload();
	// 执行业务逻辑
	var chunklostData = {"aabbccdd":[1599701518196,0],"eeffgghh":[1603842910809,0],"ooxxkkmm":[1599701518196,0]};
	var chunkNameList = ["aabbccdd", "eeffgghh"]
	var timestamp = 1601131150047;
	var result = chunklostTool.setTime(chunklostData, chunkNameList, timestamp);

	return result;
// END
};


// 添加丢失块信息，生成修复信息
exports.add = function(){
// START
	reload();
	// 执行业务逻辑
	var chunklostData = {};
	var chunkNameList = ["aabbccdd"]
	var timestamp = 1601130794448;
	var result = chunklostTool.add(chunklostData, chunkNameList, timestamp);

	return result;
// END
};


// 清除丢失块修复信息中的OK和过时数据
exports._clear = function(){
// START
	reload();
	// 执行业务逻辑
	var chunklostData = {"aabbccdd":[1599701518196,1603841772044],"eeffgghh":[1603842910809,0],"ooxxkkmm":[1599701518196,0]};
	var timestamp = 1603843484074;
	var result = chunklostTool._clear(chunklostData, timestamp);

	return result;
// END
};
