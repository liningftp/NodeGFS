

const {clog} = require('../../base');
const {
  namespace,
  chunkdata,
  chunkfull,
  chunklost,
  file2chunk,
  serverdata,
} = require('../metadata');


exports.getLastChunkName = function(){
  let metadata = {
    "/usr": {
      "_type": "dir",
      "_lock": {
        "r": [
          1606358546627,
          1600765377526
        ],
        "w": [],
        "a": [],
        "snap": []
      },
      "/data": {
        "_type": "dir",
        "_lock": {
          "r": [
            1606358546627,
            1600765377526
          ],
          "w": [],
          "a": [],
          "snap": [1606358546627]
        },
        "/001": {
          "_type": "file",
          "_replicaCount": 3,
          "_lock": {
            "r": [],
            "w": [],
            "a": [],
            "snap": [
              
            ]
          }
        }
      }
    }
  };


  file2chunk.set( {
    // '/usr/data/001': ['ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b', 'be6ed3c858a45021b916388572d1081975c27961763e567db6bcd21db2827b05']
    '/usr/data/001': ['ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b']
  } );

  namespace.set( metadata );
};


exports.recvErrorChunk = function(){
  chunkdata.set( {
    'ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b': [
      1,
      10,
      3,
      "127.0.0.1:3001,1606289531449",
      "127.0.0.1:3002,1606289531449",
      "127.0.0.1:3003,1606289531449"
    ]
  } );


  chunklost.set( {

  } );

};


exports.recvFullChunk = function(){
  chunkfull.set( {

  } );
};



exports.recvBootData = function(){
  chunkdata.set( {
    'ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b': [
      1,
      10,
      3
      // 3,
      // "127.0.0.1:3001,1606289531449",
      // "127.0.0.1:3002,1606289531449",
      // "127.0.0.1:3003,1606289531449"
    ]
  } );

  serverdata.set( {

  } );

};



exports.recvHeartbeat = function(){

  chunkdata.set( {
    'ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b': [
      1,
      10,
      3,
      "127.0.0.1:3001,1606289531449",
      "127.0.0.1:3002,1606442252070",
      "127.0.0.1:3003,1606442252070"
    ],
    'aabbccdd': [
      1,
      10,
      3,
      "127.0.0.1:3002,1606442252070",
      "127.0.0.1:3003,1606442252070"
    ]
  } );

  serverdata.set( {

  } );

  chunklost.set( {
    'aabbccdd': [1606445116915, 0]
  } );

};

