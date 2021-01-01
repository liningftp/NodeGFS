
// 日志管理的通用方案
// 支持内存和磁盘存储


// logItem -> {
// 	'logSN': logSN,
// 	'tm': tm,
// 	'logData': logData
// }
let metadata = {
	// 'abcdefgh': [
	// 	{
	// 		'logSN': logSN,
	// 		'tm': tm,
	// 		'logData': logData
	// 	}, ..
	// ]
};


let snData = {
	// 'abcdefgh': 1000	
};


exports.init = function(logKey, logSN){
	if(!logKey){
		return false;
	}

	if(!snData[logKey] && !logSN){
		return false;
	}

	if(!metadata[logKey]){
		metadata[logKey] = [];
	}
	
	if(!snData[logKey]){
		snData[logKey]= logSN;
	}

	return true;
};


// @type 日志类型 'in', 'return'
exports.push = function(logKey, methodName, type, logData){
	if(snData[logKey]){
		metadata[logKey].push({
			'key': logKey,
			'sn': snData[logKey],
			'tm': Date.now(),
			'methodName': methodName,
			'type': type,
			'data': logData
		});
		snData[logKey]++;
	}
};


exports.get = function(logKey){
	return metadata[logKey];
};

