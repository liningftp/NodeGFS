
/**
 * 存放发现错误的块，会被上报给Master
 * 格式: 块名 -> 上报的时间
 */

// {"ab83e19265655130b208def31e0c483ecb835a24a9a7508eaec0df0e62e65870":1602492707877,"7f92ae0d99f850c4889e2b2c5594fcc616002e61fe175e03a0306849afeb457e":0}
var metadata = {
  // 'ab83e19265655130b208def31e0c483ecb835a24a9a7508eaec0df0e62e65870': 1602492707877,
  // '7f92ae0d99f850c4889e2b2c5594fcc616002e61fe175e03a0306849afeb457e': 0
};


exports.get = function(){
  return metadata;
};


exports.set = function(data){
  metadata = data;
};
