
/**
 * 命名空间文件和块的对应关系, 块包含引用计数, 默认为1
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

