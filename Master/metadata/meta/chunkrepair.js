
// format -> ["errorFrom,joinTime", "repairer,repairTime"]

/**
{"aabbccdd":["error",["127.0.0.1:3001",1599701518196],["127.0.0.1:3002",1603841772044]],"eeffgghh":["loss",["",1599701518196],["127.0.0.1:3002",1603841772044]]}
 */
const metadata = {
  // "aabbccdd":[ "error", ["127.0.0.1:3001",1599701518196], ["127.0.0.1:3002",1603841772044] ],
  // "eeffgghh":[ "loss", ["",1599701518196"], ["127.0.0.1:3002",1603841772044] ],
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

