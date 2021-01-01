

const {clog} = require('../../base');
const {
  namespace,
  chunkfull,
  file2chunk,
  chunkdata,
  serverdata,
} = require('../metadata');


exports.open = function(){

  namespace.set( {
    "/usr": {
      "_type": "dir",
      "_lock": {
        "r": [
          1606226758420,
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
            1606226758420,
            1600765377526
          ],
          "w": [],
          "a": [],
          "snap": []
        },
        "/001": {
          "_type": "file",
          "_replicaCount": 3,
          "_lock": {
            "r": [],
            "w": [],
            "a": [],
            "snap": [
              1606226758420
            ]
          }
        }
      }
    }
  } );

};


exports.createDir = function(){
  namespace.set( {} );
};


exports.deleteDir = function(){
  namespace.set( {
    "/usr": {
      "_type": "dir",
      "_lock": {
        "r": [
          1606226758420,
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
            1606226758420,
            1600765377526
          ],
          "w": [],
          "a": [],
          "snap": []
        },
        "/001": {
          "_type": "file",
          "_replicaCount": 3,
          "_lock": {
            "r": [],
            "w": [],
            "a": [],
            "snap": [
              1606226758420
            ]
          }
        }
      }
    }
  } );
};


exports.createFile = function(){

  namespace.set( {
    "/usr": {
      "_type": "dir",
      "_lock": {
        "r": [
          1606226758420,
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
            1606226758420,
            1600765377526
          ],
          "w": [],
          "a": [],
          "snap": []
        },
        "/001": {
          "_type": "file",
          "_replicaCount": 3,
          "_lock": {
            "r": [],
            "w": [],
            "a": [],
            "snap": [
              1606226758420
            ]
          }
        }
      }
    }
  } );

};


exports.deleteFile = function(){
  let metadata = {
    "/usr": {
      "_type": "dir",
      "_lock": {
        "r": [
          1606269656302,
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
            1606269656302,
            1600765377526
          ],
          "w": [],
          "a": [],
          "snap": []
        },
        "/001": {
          "_type": "file",
          "_replicaCount": 3,
          "_lock": {
            "r": [],
            "w": [],
            "a": [],
            "snap": [
              1606269656302
            ]
          }
        }
      }
    }
  };

  namespace.set( metadata );
  // clog( JSON.stringify( namespace.get(), '', 2) );
};


exports.getWriteServerList = function(){

  namespace.set( {
    "/usr": {
      "_type": "dir",
      "_lock": {
        "r": [
          1606269656302,
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
            1606269656302,
            1600765377526
          ],
          "w": [],
          "a": [],
          "snap": []
        },
        "/001": {
          "_type": "file",
          "_replicaCount": 3,
          "_lock": {
            "r": [],
            "w": [],
            "a": [],
            "snap": [
              1606269656302
            ]
          }
        }
      }
    }
  } );


  file2chunk.set( {
    '/usr/data/001': ['ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b']
  } );


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


  serverdata.set( {
    "127.0.0.1:3001":[12,1606289531449],
    "127.0.0.1:3002":[22,1606289531449],
    "127.0.0.1:3003":[18,1606289531449]
  } );

  // clog( JSON.stringify( namespace.get(), '', 2) );
};


exports.getAppendServerList = function(){

  namespace.set( {
    "/usr": {
      "_type": "dir",
      "_lock": {
        "r": [
          1606269656302,
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
            1606269656302,
            1600765377526
          ],
          "w": [],
          "a": [],
          "snap": []
        },
        "/001": {
          "_type": "file",
          "_replicaCount": 3,
          "_lock": {
            "r": [],
            "w": [],
            "a": [],
            "snap": [
              1606269656302
            ]
          }
        }
      }
    }
  } );


  chunkfull.set( {
    'ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b': 1606311968818
  } );


  chunkdata.set( {
    'ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b': [
      1,
      10,
      3,
      "127.0.0.1:3001,1606311968818",
      "127.0.0.1:3002,1606311968818",
      "127.0.0.1:3003,1606311968818"
    ]
  } );


  file2chunk.set( {
    '/usr/data/001': ['ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b']
  } );


  serverdata.set( {
    "127.0.0.1:3001":[12,1606311968818],
    "127.0.0.1:3002":[22,1606311968818],
    "127.0.0.1:3003":[18,1606311968818]
  } );

  // clog( JSON.stringify( namespace.get(), '', 2) );
};


exports.getReadServerList = function(){

  namespace.set( {
    "/usr": {
      "_type": "dir",
      "_lock": {
        "r": [
          1606269656302,
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
            1606269656302,
            1600765377526
          ],
          "w": [],
          "a": [],
          "snap": []
        },
        "/001": {
          "_type": "file",
          "_replicaCount": 3,
          "_lock": {
            "r": [],
            "w": [],
            "a": [],
            "snap": [
              1606269656302
            ]
          }
        }
      }
    }
  } );


  file2chunk.set( {
    '/usr/data/001': ['ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b', 'be6ed3c858a45021b916388572d1081975c27961763e567db6bcd21db2827b05']
  } );

  chunkfull.set( {
    'ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b': 1606311968818
  } );

  chunkdata.set( {
    'ad4e67f0b01f550d9e9c33e548ce971b2e2112ae3c695af3b01ba3639268375b': [
      1,
      2,
      3,
      "127.0.0.1:3001,1606311968818",
      "127.0.0.1:3002,1606311968818",
      "127.0.0.1:3003,1606311968818"
    ],
    'be6ed3c858a45021b916388572d1081975c27961763e567db6bcd21db2827b05': [
      1,
      6,
      3,
      "127.0.0.1:3004,1606311968818",
      "127.0.0.1:3005,1606311968818",
      "127.0.0.1:3006,1606311968818"
    ]
  } );

  serverdata.set( {
    "127.0.0.1:3001":[12,1606311968818],
    "127.0.0.1:3002":[22,1606311968818],
    "127.0.0.1:3003":[18,1606311968818],
    "127.0.0.1:3004":[22,1606311968818],
    "127.0.0.1:3005":[18,1606311968818],
    "127.0.0.1:3006":[22,1606311968818],
  } );

  // clog( JSON.stringify( namespace.get(), '', 2) );
};


