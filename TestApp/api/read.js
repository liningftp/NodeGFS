
/**
 * cls && node api/delete.js file /usr/data/001
 * cls && node api/create.js file /usr/data/001
 * cls && node api/append.js /usr/data/001 222
 * 
 * cls && node api/read.js /usr/data/001 1 1
 */

const {utilfs, clog, jsonlog} = require('../../base');

const gfs = require('../../ClientLib/gfs.js');
const config = require('../config.js');

const masterHost = config.MASTER_HOST;
const masterPort = config.MASTER_PORT;

const maxChunkSize = 67108864; // 64MByte


( async () => {

  let args = process.argv.splice(2);

  let [filePath, position, length] = args;

  // setInterval( () => {
    _read( filePath, position, length );
  // }, 100 );

} )();


async function _read( filePath, position, length ) {
  position = parseInt( position );
  length = parseInt( length );
  let flags = 'O_RDONLY';
  let mode = '';

  let result = {}, bigData;
  /* open */
  result = await gfs.open( filePath, flags, mode, masterHost, masterPort );
  jsonlog( result );

  if( 0 == result.code ){
    let {fd} = result.data;

    /* run operation */
    try{
      jsonlog( {filePath, fd, position, length, maxChunkSize, masterHost, masterPort} );
      [result, bigData] = await gfs.read( filePath, fd, position, length, maxChunkSize, masterHost, masterPort );
      jsonlog( result );
      jsonlog( bigData.toString() );
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
}
