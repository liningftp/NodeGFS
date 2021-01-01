
// 存储所有块的版本信息

// 载入本机磁盘所有块的信息

// 内存数据结构，块名称对应数组，
// 第1个元素为块在磁盘文件中的顺序（基于0索引），
// 第2个元素为版本号
var metadata = {
  // 'ab83e19265655130b208def31e0c483ecb835a24a9a7508eaec0df0e62e65870': [1, 12],
  // '7f92ae0d99f850c4889e2b2c5594fcc616002e61fe175e03a0306849afeb457e': [2, 20],
  // ..
};


exports.get = function(){
  return metadata;
};


exports.set = function(data){
  metadata = data;
};


