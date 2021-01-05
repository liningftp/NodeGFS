
/**
 * file to chunk map
 *
 */

const metadata = {
  // '/usr/data/photo/123': ['aabbcdd', 'eeffgghh', ..]
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








