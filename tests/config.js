
process.env.NODE_ENV = 'develop';
// process.env.NODE_ENV = 'product';

if('develop' === process.env.NODE_ENV){
  exports.MASTER_HOST = '127.0.0.1';
}
else if('product' === process.env.NODE_ENV){
  exports.MASTER_HOST = '192.168.11.125'; // Please set ip of master server
}

exports.MASTER_PORT = 3000;

