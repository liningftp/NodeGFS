
// 存放服务器数量不足的块列表
// 格式 -> [添加时间, 执行修复时间]

/**
{"aabbccdd":[1599701518196,1603841772044],"eeffgghh":[1599701518196,0],"ooxxkkmm":[1603842910809,0]}
 */
const metadata = {
  // "aabbccdd": [1599701518196, 1603841772044],
  // "eeffgghh": [1603842899517, 0],
  // "ooxxkkmm": [1603842910809, 0],
  // ..
};

exports.get = function(){
  return metadata;
};


exports.set = function(data){
  for( const key of Object.keys(metadata) ){
    delete metadata[key];
  }
  Object.assign(metadata, data);
};


