
// 启动数据
var metaData = {
	'startTime': 0 // Master启动时间戳（毫秒）
};


exports.get = function(){
	return metaData
};


exports.set = function(data){
	metaData = data;
};

