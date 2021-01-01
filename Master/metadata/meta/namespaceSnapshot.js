
/**


 */

///////////////////////////////////////////////////////////snapshot
const metadata = {
  // "/usr/data": {
  //   "1597879274447": {
  //     "/usr": {
  //       "_type": "dir",
  //       "_lock": {
  //         "r": [],
  //         "w": []
  //       },
  //       "/data": {
  //         "_type": "dir",
  //         "_lock": {
  //           "r": [],
  //           "w": []
  //         },
  //         "/001": {
  //           "_type": "file",
  //           "_lock": {
  //             "r": [],
  //             "w": []
  //           }
  //         }
  //       }
  //     },
  //   },
  // }
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



