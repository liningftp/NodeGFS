
/**
 * node api/delete.js file /usr/data/001
 * node api/create.js file /usr/data/001
 * node api/append.js /usr/data/001 xxx
 */

const {utilfs, clog, jsonlog} = require('../../base');

const gfs = require('../../ClientLib/gfs.js');
const config = require('../config.js');

const masterHost = config.MASTER_HOST;
const masterPort = config.MASTER_PORT;


( async () => {

  let args = process.argv.splice(2);

  let [filePath, content] = args;
  let flags = 'O_WRONLY';
  let mode = '';

  /* open */
  let result = await gfs.open( filePath, flags, mode, masterHost, masterPort );
  jsonlog( result );

  if( 0 == result.code ){
    let {fd} = result.data;

    /* run operation */
    try{
      jsonlog( {filePath, content, masterHost, masterPort} );
      result = await gfs.append( filePath, fd, content, masterHost, masterPort );
      jsonlog( result );
    }
    catch( e ){
      clog( e.stack );
    }

    /* close */
    if( fd ){
      result = await gfs.close( filePath, fd, masterHost, masterPort );
      jsonlog( result );
    }
  }

} )();

