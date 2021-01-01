
// 等待块服务器确认租约
const metadata = {
  // "aabbccdd": [1599701518196, socket1, socket2, ..], // 开始发出分配租约的时间戳
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
