

// 将字符按照单元长度分割成子字符串数组
exports.split = function(str, unitLen){

	let list = [];
	let index = 0;
	while(true){
		let start = unitLen * index;
		let end = unitLen * (index + 1);
		let substr = str.slice(start, end);
		if(!substr || !substr.length){
			break;
		}
		list.push(substr);
		index++;
	}
	return list;
};


// 将路径转成命名空间树的节点名称数组
// '/usr/data/001' -> ['/usr', '/data', '/001']
// '/usr/data/001//////' -> ['/usr', '/data', '/001']
// 'usr/data/001' -> ['/data', '/001']
// 'usr/data/001///' -> ['/data', '/001']
exports.splitPath = function(filePath){
	let arr = filePath.match(/\/\w+/g);
	return arr;
};

