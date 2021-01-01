
const net = require('net');
const validator = require('validator');

const log = require('./log.js');

const PACK_SIZE = 65536; //包头长度要远小于这个值


/****************************************************************************/
/*                                create object                             */
/****************************************************************************/

const server = net.createServer();

// @opt - {
//   'onData': onData,
//   'onListen': onListen,
//   'getHead': getHead
// }
exports.createServer = function(host, port, opt){

  opt = opt || {};

  // 绑定各种事件
  server.on('listening', function(){
    opt.onListen && opt.onListen(host, port);
  });

  server.on('connection', function(client){
    // 创建接收器
    let receiver = new Receiver({
      'onData': function(socket, dataBuffer){
        opt.onData && opt.onData( socket, dataBuffer);
      }
    });

    receiver.init(client);

    client.on('data', ( data ) => {
      receiver.recv( data );
      if( receiver.isCompleted() ){
        // ..
      }
    });

    // 监听客户端对象
    client.on('error', function(err){
      console.log(err);
    });

    client.on('close', function(){
      // console.log('close');
    });

    // client.on('timeout', function(){
    //   exports.send(client, '兄弟超时，我要断开连接了');
    //   exports.end(client);
    // });
    // client.setTimeout(5 * 1000); //5秒超时
  });

  server.on('close', function(){
    opt.onClose && opt.onClose();
  });


  server.on('error', function(err){
    opt.onError && opt.onError(err);
  });


  server.listen(port, host, function(){

  });

};


// @opt - {
//   'onConnect': onConnect
//   'onData': onData
// }
exports.createClient = function(srvHost, srvPort, opt){

  opt = opt || {};

  let client = new net.Socket();
  // client.setEncoding('utf8');

  // 创建接收器
  let receiver = new Receiver({
    'onData': function(socket, dataBuffer){
      opt.onData && opt.onData(dataBuffer);
    }
  });
  receiver.init(client);

  /* set client  */
  client.connect(srvPort, srvHost, function(){
    opt.onConnect && opt.onConnect();
  });

  client.on('data', ( data ) => {
    receiver.recv( data );
    if( receiver.isCompleted() ){
      // ..
    }
  });

  client.on('timeout', function(err){
    console.log('timeout');
    log.debug( Error(), `${err}` );
    opt.onTimeout && opt.onTimeout(err);
  });

  client.on('error', function(err){
    console.log(err);
    opt.onError && opt.onError(err);
  });

  client.on('close', function(){
    // console.log('client side close');
  });

  client.setTimeout(10000);

  return client;
};


/****************************************************************************/
/*                                 comm method                              */
/****************************************************************************/

// @data {Buffer}
exports.send = function(socket, data){

  var comm = exports;

  if(!Buffer.isBuffer(data)){
    console.log('data must is Buffer type')
    return false;
  }

  var hasSendSize = 0;

  var dataSize = data.byteLength;
  var head = {
    'dataSize': dataSize
  };
  var message = comm.encodeMessageData(head, data);
  var headSize = comm.getMessageHeadSize(message);
  var totalSize = headSize + dataSize;
  while(hasSendSize < totalSize){
    var pack = message.slice(hasSendSize, hasSendSize + PACK_SIZE);
    socket.write(pack);
    hasSendSize += PACK_SIZE;
  }

};


// 发送后阻塞直到获取返回结果
exports.clientRequest = async function(host, port, message, keepAlive){
  let comm = exports;
  port = parseInt(port);
  
  async function send(host, port, message){
    return new Promise((resolve, reject) => {
      let client = comm.createClient(host, port, {
        'onConnect': function(){
          comm.send(client, message);
        },
        // @data {Buffer}
        'onData': function(data){
          let result = comm.decodeMessageData(data);
          resolve( [client, result] );
        },
        'onError': function(err){
          resolve({
            'head': {
              'code': -1,
              'msg': JSON.stringify(err)
            }
          });
        },
        'onTimeout': function(err){
          resolve({
            'head': {
              'code': -1,
              'msg': JSON.stringify(err)
            }
          });
        }
      });
    });
  }

  let [client, result] = await send( host, port, message );

  if( !keepAlive ){
    client.end();
  }

  return [result.head, result.body, client];
};


exports.end = function(socket){
  socket.end();
};


/****************************************************************************/
/*                                private object                            */
/****************************************************************************/

// 接收句柄
// opt {
//   'onData': // @return Buffer
// }
function Receiver(opt){
  this.opt = opt || {};
  this.socket = null;
  this.headBuffer = Buffer.alloc(PACK_SIZE);
  this.wholeBuffer;
  this.head = null;
  this.headSize = 0;
  this.index = 0;
  this.totalSize = 0;
  this.completed = 0;
}


Receiver.prototype.init = function( sock ){
  this.socket = sock;
  this.headBuffer.fill(0); // 清空
  if(this.wholeBuffer){
    this.wholeBuffer.fill(0); // 清空
  }
  this.head = null;
  this.headSize = 0;
  this.index = 0;
  this.totalSize = 0;
  this.completed = 0;
};


Receiver.prototype.isCompleted = function(){
  return this.completed;
};


Receiver.prototype.recv = function(data){
  if( this.completed ){
    return;
  }

  var _data = Buffer.from(data);
  // 我们强制要求包的头部大小必须远小于PACK_SIZE，这样可以保证headBuffer能够容下包头
  // 一般情况下，首次接收就可以把包头完整收到的，对于边界情况的考虑
  // 1.如果data数据量很小，包头内容不完整，我们等待下次数据到来，继续拼接头部
  if( !this.head ){
    _data.copy( this.headBuffer, this.index );
    this.head = exports.decodeMessageHead( this.headBuffer );
    // 头内容接收完
    if( this.head ){
      this.headSize = exports.getMessageHeadSize( this.headBuffer );
      this.totalSize = this.headSize + this.head.dataSize;
      this.wholeBuffer = Buffer.alloc( this.totalSize );

      // index大于0说明之前有过收包，但包头内容不完整
      if( 0 < this.index ){
        this.headBuffer.slice( 0, this.index ).copy( this.wholeBuffer, 0 );
      }
      _data.copy( this.wholeBuffer, this.index );
      this.index += _data.byteLength;

      // 数据接收完
      if( this.index >= this.totalSize ){
        this.completed = true;
        this.opt.onData && this.opt.onData( this.socket, this.wholeBuffer.slice( this.headSize, this.totalSize ) );
      }
    }
    else{
      this.index += _data.byteLength;
    }
  }
  else{
    _data.copy( this.wholeBuffer, this.index );
    this.index += _data.byteLength;
    // 数据接收完
    if( this.index >= this.totalSize){
      this.completed = true;
      this.opt.onData && this.opt.onData( this.socket, this.wholeBuffer.slice( this.headSize, this.totalSize ) );
    }
  }
};


/****************************************************************************/
/*                                 tool method                              */
/****************************************************************************/

// 编码数据流
// @head {JSON} 消息头部
// @body {Buffer || Other} 数据内容 - 传输数据流时有用，控制流时不使用
// @return {Buffer}
exports.encodeMessageData = function(head, body){
  head = head || {};
  var _head = Buffer.from( JSON.stringify(head) );
  var _headLen = Buffer.from( ('0000' + _head.byteLength).slice(-4) );

  let _body = body;
  if(!Buffer.isBuffer(body)){
    if('string' === typeof body){
      _body = Buffer.from(body);
    }
    else{
      _body = Buffer.from(JSON.stringify(body||""));
    }
  }

  var result = Buffer.concat([_headLen, _head, _body]);

  return result;
};


// 解码数据流
// @messageData - 不考虑什么类型，每个字段统一解码成Buffer
// @return - {
//   head: {JSON},
//   body: Buffer
// }
exports.decodeMessageData = function(messageData){
  var result = Buffer.from(messageData);

  var p = 0;

  var headLen = result.slice(0, (p += 4)) - 0;
  var head = result.slice(p, (p += headLen));

  var body = result.slice(p);

  return {
    'head': JSON.parse(head.toString()),
    'body': body
  };
};


// @dataFragment {Buffer} 数据片段，除了head还有其他不完整的内容
// @return {Buffer}
exports.decodeMessageHead = function(dataFragment){
  var result = Buffer.from(dataFragment);

  var p = 0;

  var headLen = result.slice(0, (p += 4)) - 0;
  var headBuf = result.slice(p, (p += headLen));
  var headStr = headBuf.toString();

  var head;
  if( validator.isJSON(headStr) ){
    head = JSON.parse(headStr);
  }

  return head;
};


// 获取报文头的长度，4个字节用来存放长度值
// @return {Int}
exports.getMessageHeadSize = function(message){
  var result = Buffer.from(message);
  var headLen = result.slice(0, 4) - 0;
  return headLen + 4;
};