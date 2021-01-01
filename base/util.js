
const os = require('os');
const fs = require('fs');
const uuidv5 = require('uuid/v5');
const validator = require('validator');
const md5 = require('js-md5');
const crypto = require('crypto');
const jsscompress = require("js-string-compression");

const clog = console.log.bind(console);

var exports = exports || {};

// 获取32位随机字符串
exports.getKey = function(){

	var tm1 = Date.now();
	var rd = Math.random() + Math.random() + Math.random() + Math.random() + Math.random();
	var tm2 = Date.now();

	return md5( [tm1, rd, tm2].join('-') );

};


// 获取64位随机值
exports.getUUID = function(){
	// 返回32位值
	function cr(n){
		var base = uuidv5('http://example.com/' + n, uuidv5.URL);
		var tm1 = Date.now();
		var rd = Math.random() + Math.random() + Math.random() + Math.random() + Math.random();
		var tm2 = Date.now();
		var str = [tm1, rd, tm2].join('-');
		return uuidv5(str, base).replace(/-/g, '');
	}
	// 返回64位值
	return cr(Math.random()) + cr(Math.random());
};


// 批量获取64位随机值
exports.getPatchUUID = function(count){
	var list = [];
	for(var i = 0; i < count; i++){
		list.push( exports.getUUID() );
	}
	return list;
};


// 获取内容的校验和
exports.getChecksum = function(content){
	return crypto
		.createHash('md5')
		.update(content, 'utf8')
		.digest('hex');
};


// 将整体Buffer分割成小Buffer组成的数组
// @data {Buffer} 完整的Buffer对象
// @return Array[Buffer] 分割后的小Buffer
exports.splitToList = function(data, splitSize){
	var bufList = [];

	var totalSize = data.byteLength;
	var p = 0;
	while(p < totalSize){
		var buf;
		if( (p + splitSize) < totalSize){
			buf = Buffer.alloc(splitSize);
			data.slice(p, p + splitSize).copy(buf);
		}
		else{
			buf = Buffer.alloc(totalSize - p);
			data.slice(p).copy(buf);
		}
		bufList.push(buf);
		p += splitSize;
	}

	return bufList;
};

exports.mergeChunkToData = function(chunkList){

	return Buffer.concat(chunkList);
};


// 读取块内容的指定区域
// @data {Buffer} 数据内容
// @startPos {Int} 起始索引
// @length {Int} 内容长度
// @return {Buffer} 读取的内容
exports.getChunkRange = function(data, startPos, length){
	if( !Buffer.isBuffer(data) ){
		data = Buffer.from(data);
	}

	if(0 == data.byteLength){
		console.log('Error: util.getChunkRange data is Empty!');
		return;
	}

	return data.slice(startPos, startPos + length);
};


// 压缩字符串
// @raw {String} 原始字符串
exports.compress = function(raw){
	var hm = new jsscompress.Hauffman();
	return hm.compress(raw);
};

exports.decompress = function(data){
	var hm = new jsscompress.Hauffman();
	return hm.decompress(data);
};


// 解析chunkserver上报的块信息
// @data {Buffer} 批量64位文件名拼接而成的Buffer对象
// @return [
// 	'ed04473f4b4f54f091328b8801242dde5498b2e387775bcc9a381e1f48982275',
// 	'e7d4d860cec8544890ac1aca968e7af889e73ea4407b555cac4a9f4162c064ac'
// ]
exports.decodeChunkNameData = function(data){
	var list = [];

	var p = 0;
	while(true){
		buf = data.slice(p, (p += 64));
		if(64 === buf.byteLength){
			list.push(buf.toString());
		}
		else{
			break;
		}
	}

	return list;

};


// @arr - [Object]
// @sortField - {String} 排序字段名称
// @opt - {
//   'fieldType': 'number', // 'string'
//   'sortType': 'asc' // 'desc'
// }
exports.objectSort = function(arr, sortField, opt){

  opt = opt || {};

  var fieldType = opt.fieldType || 'string';
  var sortType = opt.sortType || 'desc';

  var list = [];

  // first sort by desc
  arr.forEach(function(item){

    var index = 0;

    // if('cn' === item.iso2){
    //   debugger;
    // }

    for(var i = 0; i < list.length; i++){
      if('number' === fieldType){
        if(list[i][sortField] - 0 < item[sortField] - 0){
          index = i;
          break;
        }
        else{
          index = i + 1;
        }
      }
      else{
        if(list[i][sortField] < item[sortField]){
          index = i;
          break;
        }
        else{
          index = i + 1;
        }
      }
    }

    list.splice(index, 0, item);

  });

  if('asc' === sortType){
    list.reverse();
  }

  return list;

};


exports.getChunkCurrentSize = function(chunkPath){
	var code, msg, stat;
	try{
		if(fs.existsSync(chunkPath)){
			stat = fs.statSync(chunkPath);
			code = 0;
			msg = '';
		}
		else{
			code = -1;
			msg = `util.getChunkCurrentSize, ${chunkPath} not exists`;
			return [code, msg];
		}
	}
	catch(e){
		code = -1;
		msg = `util.getChunkCurrentSize, ${chunkPath}, ${e.message}`;
		return [code, msg];
	}
	return [code, msg, stat.size];
};


// 计算块的尺寸
exports.getChunkFreeSize = function(chunkPath, maxSize){
	var stat = fs.statSync(chunkPath);
	return maxSize - stat.size;
};


// 给块填充指定数量的0
exports.fillEmpty = function(filePath, fillSize){
	// 如果还有很小剩余空间，则用0填满
	if(fillSize){
		var b = Buffer.alloc(fillSize);
		b.fill(0);
		fs.appendFileSync(filePath, b);
	}
};


// 根据数值转换成合理的容量单位
exports.sizeUnit = function(count){
	const minK = 1024;
	const minM = minK * 1024;
	const minG = minM * 1024;
	const minT = minG * 1024;
	const minP = minT * 1024;

	var res;
	if(0 <= count && count < minK){
		res = count + 'B';
	}
	else if(minK <= count && count < minM){
		res = Math.round(count / minK * 100) / 100 + 'KB';
	}
	else if(minM < count && count < minG){
		res = Math.round(count / minM * 100) / 100 + 'MB';
	}
	else if(minG <= count && count < minT){
		res = Math.round(count / minG * 100) / 100 + 'GB';
	}
	else if(minT <= count && count < minP){
		res = Math.round(count / minT * 100) / 100 + 'TB';
	}
	else if(minP <= count){
		res = Math.round(count / minP * 100) / 100 + 'PB';
	}
	return res;
};


// 获取最大的数字
exports.getMax = function(arr){
	let max = arr[0];
	arr.forEach(n => max = (n > max) ? n : max);
	return max;
};



// 模拟Sleep
// @t {Int} 秒数
exports.sleep = async function(t){
	return new Promise( (resolve, reject) => {
		setTimeout( () => {
			resolve();
		}, t * 1000);
	});
};


// 获取主机在局域网中的IP地址
exports.getWlanIPList = function(){
	const IPList = [];
	const ifaces = os.networkInterfaces();
	for(let dev in ifaces){
		let items = ifaces[dev];
		items.forEach( (item) => {
			if(!item.internal && 'IPV4' === item.family.toUpperCase()){
				IPList.push(item.address);
			}
		} );
	}
	return IPList;
};


// 设置结果对象
exports.result = function(result, code, error, message, data){
  for( const key of Object.keys(result) ){
    delete result[key];
  }

  if(undefined != code){
    result['code'] = code;
  }

  if(undefined != error){
    result['error'] = error;
  }

  if(undefined != message){
    result['message'] = message;
  }

  if(data){
    result['data'] = data;
  }

  return result;
};


exports.success = function(result, message, data){
  for( const key of Object.keys(result) ){
    delete result[key];
  }

  result = Object.assign( result, {
    "code": 0,
    "message": message || "SUCCESS"
  } );

  if(data){
    result['data'] = data;
  }

  return result;
};


exports.error = function(result, error, message, data){
  for( const key of Object.keys(result) ){
    delete result[key];
  }

  result = Object.assign( result, {
    "code": -1,
    "error": error || "",
    "message": message || "FAIL"
  } );

  if(data){
    result['data'] = data;
  }

  return result;
};

