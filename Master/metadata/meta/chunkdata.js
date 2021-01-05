
// store chunk data
// format: referCount, version, replicaCount, primary, secondary, secondary, ..
//   parimary->IP:Port,Version,Primary/Secondary,Timestamp(set lease time)
//   second->IP:Port,Version
const metadata = {
  // 'ab83e19265655130b208def31e0c483ecb835a24a9a7508eaec0df0e62e65870': [
  //   1, 20, '127.0.0.1:3001,1585471730177,P', '127.0.0.1:3002,1600081036080', '127.0.0.1:3003,1600081059277'
  // ],
  // '7f92ae0d99f850c4889e2b2c5594fcc616002e61fe175e03a0306849afeb457e': [ 
  //   1, 20, '127.0.0.1:3001,1585471730177,P', '127.0.0.1:3002,1600081069140', '127.0.0.1:3003,1600081076940'
  // ],
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


