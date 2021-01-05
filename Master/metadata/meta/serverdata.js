
// store server data
// format -> {pair: [useRate, reportTime]}

const metadata = {
//   '192.168.0.1:3001': [12,1597879274447],
//   '192.168.0.1:3002': [22,1597879295305],
//   '192.168.0.1:3003': [18,1597880709715]
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


