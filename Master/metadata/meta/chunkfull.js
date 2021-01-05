 
// format -> primary report time
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


