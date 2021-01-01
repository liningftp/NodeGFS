
// 存放版本号磁盘文件中，块项被删除后未被使用的位置索引

// 格式 -> [索引, 索引, ..]

// 每个块名对应容量占最大块尺寸的比例，也就是块的使用率
var metadata = [
  // 3,
  // 4,
  // 7,
  // ..
];


exports.get = function(){
  return metadata;
};


exports.set = function(data){
  metadata = data;
};


