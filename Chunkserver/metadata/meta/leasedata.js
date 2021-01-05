
// store lease datat

// format -> { chunkName: {'primary': setTime, 'work': 1} }

const metadata = {
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


