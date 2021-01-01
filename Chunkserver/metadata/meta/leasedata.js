
// 给心跳层准别的数据

// 租约元数据

// 使用场景：
// Primary身份的控制，Master会选择某个chunkserver作为Primary，租约期为60秒，
// 到期后如果当前Primary不申请延期，那么Master会更换其他chunkserver为Primary
// 这里的守约机制是：
// Primary接到请求时，
// 如果primary值为1，则对租约枷锁lock值为1，待处理完成后释放锁lock值为0；
// 如果primary不为1，则返回错误给客户端，让其从Master获取新的Primary服务器
// 心跳执行机制：
// 每分钟执行一次，对primary值为1的块，lock值为0，不再续期租约（修改primary为0），值为1则续期（保持primary为1）
// locktime超过60秒，心跳强制释放锁，并修改primary值为0，不再续期租约


// 只有处于Primary状态的chunk块，才会载入进来，
// 一旦不是primary，就从数据中移除
var metadata = {
  // 'ab83e19265655130b208def31e0c483ecb835a24a9a7508eaec0df0e62e65870': {
  //  'primary': 1602576896653,
  //  'work': 1
  // }
};


exports.get = function(){
  return metadata;
};


exports.set = function(data){
  metadata = data;
};


