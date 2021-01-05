
// store chunk info
// format -> [size, reportTime]

const metadata = {
  // 'ab83e19265655130b208def31e0c483ecb835a24a9a7508eaec0df0e62e65870': [67108864, 1602642455697],
  // '7f92ae0d99f850c4889e2b2c5594fcc616002e61fe175e03a0306849afeb457e': [32204553, 1602642455697]
};


exports.get = function(){
  return metadata;
};


exports.set = function(data){
  metadata = data;
};

