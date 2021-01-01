
///////////////////////////////////////////////////////////metadata
/**

{"/usr":{"_type":"dir","_lock":{"r":[],"w":[]},"/data":{"_type":"dir","_lock":{"r":[],"w":[]},"/001":{"_type":"file","_replicaCount":3,"_lock":{"r":[],"w":[]}}}}}

{"/usr":{"_type":"dir","_lock":{"r":[1600765363449,1600765377526],"w":[]},"/data":{"_type":"dir","_lock":{"r":[1600765363449,1600765377526],"w":[]},"/001":{"_type":"file","_replicaCount":3,"_lock":{"r":[],"w":[1600765363449]}}}}}

*/
const metadata = {
  // "/usr": {
  //   "_type": "dir",
  //   "_lock": {
  //     "r": [],
  //     "w": []
  //   },
  //   "/data": {
  //     "_type": "dir",
  //     "_lock": {
  //       "r": [],
  //       "w": []
  //     },
  //     "/001": {
  //       "_type": "file",
  //       "_replicaCount": 3,
  //       "_lock": {
  //         "r": [],
  //         "w": []
  //       }
  //     }
  //   }
  // }

  // "/usr": {
  //   "_type": "dir",
  //   "_lock": {
  //     "r": [1600765363449, 1600765377526],
  //     "w": []
  //   },
  //   "/data": {
  //     "_type": "dir",
  //     "_lock": {
  //       "r": [1600765363449, 1600765377526],
  //       "w": []
  //     },
  //     "/001": {
  //       "_type": "file",
  //       "_replicaCount": 3,
  //       "_lock": {
  //         "r": [],
  //         "w": [1600765363449]
  //       }
  //     }
  //   }
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


