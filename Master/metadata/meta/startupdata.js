
// 启动数据
/**
{"state":"init","startTime":0,"serverChecklist":["127.0.0.1:3001","127.0.0.1:3002","127.0.0.1:3003"]}
 */
const metadata = {
  // 'startTime': 0, // Master启动时间戳（毫秒）
  // 'serverChecklist': ["127.0.0.1:3001", "127.0.0.1:3002", "127.0.0.1:3003"]
};


exports.get = function(){
  return metadata
};


exports.set = function(data){
  for( const key of Object.keys(metadata) ){
    delete metadata[key];
  }
  Object.assign(metadata, data);
};


