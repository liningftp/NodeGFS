
// store free index in checksum file

// format -> [index0, index1, ..]

const metadata = [
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


