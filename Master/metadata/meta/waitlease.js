
const metadata = {
  // "aabbccdd": [1599701518196, socket1, socket2, ..],
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
