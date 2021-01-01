
/**
 * cls && node api/delete.js file /usr/data/001
 * cls && node api/create.js file /usr/data/001
 * cls && node api/write.js /usr/data/001 hello
 * cls && node api/write.js /usr/data/001 hello 0
 */

const {utilfs, clog, jsonlog} = require('../../base');

const gfs = require('../../ClientLib/gfs.js');
const config = require('../config.js');

const masterHost = config.MASTER_HOST;
const masterPort = config.MASTER_PORT;


( async () => {

  let args = process.argv.splice(2);

  let [filePath, content, position] = args;
  if( !content ){
    console.log( 'content is empty' );
    return;
  }
  position = position || 0;
  let flags = 'O_WRONLY';
  let mode = '';

  /* open */
  let result = await gfs.open( filePath, flags, mode, masterHost, masterPort );
  jsonlog( result );

  if( 0 == result.code ){
    let {fd} = result.data;

    /* run operation */
    try{
      position = parseInt( position );

      jsonlog( {filePath, fd, content, position, masterHost, masterPort} );

      result = await gfs.write( filePath, fd, content, position, masterHost, masterPort );
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
