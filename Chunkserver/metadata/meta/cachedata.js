
// based on LRU
// cacheKey -> [size, joinTime, usedTime]

const metadata = {
  // '7f92ae0d99f850c4889e2b2c5594fcc6': [1024, 1602985006457, 0],
  // '16002e61fe175e03a0306849afeb457e': [4096, 1602985099686, 1602985108213]
};


exports.get = function(){
  return metadata;
};


exports.set = function(data){
  metadata = data;
};


