
/**

{"/usr/data":{"1597879274447":{"/usr":{"_type":"dir","_lock":{"r":[],"w":[]},"/data":{"_type":"dir","_lock":{"r":[],"w":[]},"/001":{"_type":"file","_lock":{"r":[],"w":[]}},"/002":{"_type":"file","_lock":{"r":[],"w":[]}}},"/photo":{"_type":"dir","_lock":{"r":[],"w":[]},"/2020":{"_type":"file","_lock":{"r":[],"w":[]}}}}}}}

 */

///////////////////////////////////////////////////////////getDeletedData
// 删除的文件或目录，不允许删除非空目录
const metadata = {
  // "/usr/data": {
  //   "1597879274447": {
  //     "/usr": {
  //       "_type": "dir",
  //       "_lock": {"r": [], "w": []},
  //       "/data": {
  //         "_type": "dir",
  //         "_lock": {"r": [], "w": []},
  //         "/001": {
  //           "_type": "file",
  //           "_lock": {"r": [], "w": []},
  //         },
  //         "/002": {
  //           "_type": "file",
  //           "_lock": {"r": [], "w": []},
  //         }
  //       },
  //       "/photo": {
  //         "_type": "dir",
  //         "_lock": {"r": [], "w": []},
  //         "/2020": {
  //           "_type": "file",
  //           "_lock": {"r": [], "w": []},
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

