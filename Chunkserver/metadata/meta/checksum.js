
// load all chunk chunksum
// format -> [index, chunksumList]

const metadata = {
  // 'ab83e19265655130b208def31e0c483ecb835a24a9a7508eaec0df0e62e65870': [0, [-1234567890,123456789012]],
  // '7f92ae0d99f850c4889e2b2c5594fcc616002e61fe175e03a0306849afeb457e': [1, [-1234567890,123456789012]],
  // '2': 0,
  // ..
};


exports.get = function(){
  return metadata;
};


exports.set = function(data){
  metadata = data;
};


