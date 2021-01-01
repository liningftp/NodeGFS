
// 存放填满的块名称
// 场景: 
//  1 当client写入或追加时，chunkserver发现块满，则将该块上报给Master，
//  2 然后chunkserver告知client，请再次向Master请求最新的primary
//  3 当client再次请求Master时，Master检查发现文件最后的块已满，则重新创建块，并分配新的租约
// 格式: 
//   块名称 -> primary上报块已满的时间戳
// {"ab83e19265655130b208def31e0c483ecb835a24a9a7508eaec0df0e62e65870":1600081036080,"7f92ae0d99f850c4889e2b2c5594fcc616002e61fe175e03a0306849afeb457e":1585471730177}
const metadata = {
  // 'ab83e19265655130b208def31e0c483ecb835a24a9a7508eaec0df0e62e65870': 1600081036080,
  // '7f92ae0d99f850c4889e2b2c5594fcc616002e61fe175e03a0306849afeb457e': 1585471730177
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


