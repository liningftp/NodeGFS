
// 基于LRU算法的缓存数据
// cacheKey -> [尺寸, 加入时间, 被使用时间]

// {"7f92ae0d99f850c4889e2b2c5594fcc6":[0,1602985006457],"16002e61fe175e03a0306849afeb457e":[1602985099686,1602985108213]}

// 每个块名对应容量占最大块尺寸的比例，也就是块的使用率
var metadata = {
  // '7f92ae0d99f850c4889e2b2c5594fcc6': [1024, 1602985006457, 0],
  // '16002e61fe175e03a0306849afeb457e': [4096, 1602985099686, 1602985108213]
};


exports.get = function(){
  return metadata;
};


exports.set = function(data){
  metadata = data;
};


