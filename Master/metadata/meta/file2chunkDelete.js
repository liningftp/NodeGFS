
/**
 * 
 * {"/usr/data/001":{"1597879274447":["aabbcdd","eeffgghh"]}}
 * 
 */

const metadata = {
  // "/usr/data/001": {
  //   "1597879274447": ["aabbcdd", "eeffgghh"]
  // }
};


//////////////////////////////////////////////////////////////////////////////////////////public

exports.get = function(){
  return metadata;
};


exports.set = function(data){
  for( const key of Object.keys(metadata) ){
    delete metadata[key];
  }
  Object.assign(metadata, data);
};

