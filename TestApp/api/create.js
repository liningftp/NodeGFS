
/**
 * node api/create.js dir /usr/data
 * node api/create.js file /usr/data/001
 */

const {utilfs, clog, jsonlog} = require('../../base');

const gfs = require('../../ClientLib/gfs.js');
const config = require('../config.js');

const masterHost = config.MASTER_HOST;
const masterPort = config.MASTER_PORT;


( async () => {

  let args = process.argv.splice(2);

  let [type, filePath] = args;
  let flags = 'O_WRONLY';
  let mode = '';

  let result = await gfs.open( filePath, flags, mode, masterHost, masterPort );
  jsonlog( result );

  if( 0 == result.code ){
    let {fd} = result.data;

    if( 'dir' === type ){
      result = await gfs.createDir( filePath, masterHost, masterPort );
    }
    else if( 'file' === type ){
      let replicaCount = 3;
      result = await gfs.createFile( filePath, replicaCount, masterHost, masterPort );
    }
    jsonlog( result );

    if( fd ){
      result = await gfs.close( filePath, fd, masterHost, masterPort );
      jsonlog( result );
    }
  }

} )();
