
const fs = require('fs');
const path = require('path');

// 文件系统工具


// 根据指定的路径，创建对应的文件系统，中间不存在的部分，则进行创建
// @filePath {String} 格式要求，如果最后一项是目录，必须以\(windows)或者/(linux)结尾
exports.makePath = function(filePath){
  var code, msg;

  // 如果已经存在，则判断是目录还是文件
  if(fs.existsSync(filePath)){
    return [-1, '创建失败，该路径已经存在'];
  }

  var items;
  if(/^win/.test(process.platform)){
    items = filePath.split('\\');
  }
  else{
    items = filePath.split('/');
  }

  var dir;
  try{
    // 最后一项不要
    for(var i = 1; i < items.length - 1; i++){
      dir = items.slice(0, i + 1).join('/');
      if(fs.existsSync(dir)){
        if( !fs.statSync(dir).isDirectory() ){
          [code, msg] = [-1, `创建失败，路径中的${dir}部分是文件不是目录，无法继续`];
          break;
        }
        else{
          //..
        }
      }
      else{
        fs.mkdirSync(dir);
      }
    }
    code = 0;
  }
  catch(e){
    [code, msg] = [-1, e.message];
  }

  return [code, msg];
};


// 判断是否存在指定的文件路径（包括文件、目录两种情况）
exports.hasFilePath = function(filePath){
  return fs.existsSync(filePath);
};


exports.makeFile = function(filePath){
  let code, msg;

  if(fs.existsSync(filePath)){
    [code, msg] = [0, ""];
  }
  else{
    try{
      fs.writeFileSync(filePath, "");
      [code, msg] = [0, ''];
    }
    catch(e){
      [code, msg] = [-1, `utilfs.makeFile, ${filePath}, ${e.message}`];
    }
  }

  return [code, msg];
};


// 规范文件或者目录路径格式，必须以/开头，不能以/结尾
exports.formatFilePath = function(filePath){
  let f = '';

  if( /^\//.test(filePath) ){
    f = filePath.replace(/\/$/, '');
  }

  return f;
};


// 读取指定目录下的所有文件，忽略目录
// 只统计一级目录下的文件尺寸大小，子目录中的不统计
exports.getAllFiles = function(dirPath){

  let code, msg, data = [], totalSize = 0;

  let files = fs.readdirSync(dirPath);

  try{
    for(var i = 0; i < files.length; i++){
      let fileName = files[i];
      let filePath = path.join(dirPath, fileName);
      let stat = fs.statSync(filePath);

      if(stat.isFile()){
        data.push({
          'fileName': fileName,
          'filePath': filePath,
          'size': stat.size
        });
        totalSize += stat.size;
      }
    }
    [code, msg] = [0, ''];
  }
  catch(e){
    [code, msg] = [-1, e.message];
  }

  return [code, msg, data, totalSize];
};


exports.writeFileSync = function( filePath, contentData ){
  let code, msg;

  try{
    fs.writeFileSync(filePath, contentData);
    [code, msg] = [0, ''];
  }
  catch(e){
    code = -1;
    msg = `utilfs.writeSync, ${e.message}, ${filePath}`;
    console.log( e.stack );
  }

  return [code, msg];
};


// 用0将指定文件填充到最大尺寸
exports.fillToByZero = function(filePath, targetSize){
  var code, msg;
  try{
    var stat = fs.statSync(filePath);
    var fillSize = targetSize - stat.size;
    if(0 < fillSize){
      let b = Buffer.alloc(fillSize);
      b.fill('0');
      fs.appendFileSync(filePath, b);
      [code, msg] = [0, ''];
    }
    else if(0 == fillSize){
      [code, msg] = [0, ''];
    }
    else if(0 > fillSize){
      [code, msg] = [-1, `utilfs.fillToByZero, targetSize < currentSize`];
    }
  }
  catch(e){
    [code, msg] = [0, `utilfs.fillToByZero, ${filePath}, ${e.message}`];
  }
  return [code, msg];
};


exports.getChunkCurrentSize = function(chunkPath){
  var code, msg, stat;
  try{
    if(fs.existsSync(chunkPath)){
      stat = fs.statSync(chunkPath);
      code = 0;
      msg = '';
    }
    else{
      code = -1;
      msg = `utilfs.getChunkCurrentSize, ${chunkPath} not exists`;
      return [code, msg];
    }
  }
  catch(e){
    code = -1;
    msg = `utilfs.getChunkCurrentSize, ${chunkPath}, ${e.message}`;
    return [code, msg];
  }
  return [code, msg, stat.size];
};


// 获取文件状态
exports.statSync = function(filePath){
  let result = {};

  try{
    if( fs.existsSync(filePath) ){
      let stat = fs.statSync(filePath);
      [result.code, result.msg, result.stat] = [0, '', stat];
    }
    else{
      [result.code, result.msg] = [-1, `Error: ${filePath} is not exists`];
    }
  }
  catch(e){
    [result.code, result.msg] = [-1, `Error: ${filePath}, ${e.message}`];
  }

  return result;
};


// 必须保证该文件存在，如果已存在不做处理，如果不存在则创建空文件
exports.mustHasFile = function(filePath){
  let code, msg;
  try{
    if(!fs.existsSync(filePath)){
      fs.writeFileSync(filePath, Buffer.from(''));
    }
    [code, msg] = [0, ''];
  }
  catch(e){
    [code, msg] = [-1, `utilfs.mustHasFile, ${filePath}`];
  }
  return [code, msg];
};


exports.deleteSync = function(filePath){
  let code, msg;
  try{
    if(fs.existsSync(filePath)){
      fs.unlinkSync(filePath);
    }
    [code, msg] = [0, ''];
  }
  catch(e){
    [code, msg] = [-1, `utilfs.deleteSync, ${filePath}, ${e.message}`];
  }
  return [code, msg];
};


exports.appendSync = function(filePath, contentData){

  let code, msg, startPos, length;

  try{
    let stat;
    if(fs.existsSync(filePath)){
      stat = fs.statSync(filePath);
      startPos = stat.size;
    }
    else{
      startPos = 0;
    }
    length = contentData.byteLength;
    fs.appendFileSync(filePath, contentData);
    [code, msg] = [0, ''];
  }
  catch(e){
    [code, msg] = [-1, `utilfs.appendSync, ${filePath}, ${e.message}`];
  }

  return [code, msg, startPos, length];
};


exports.readSync = function(filePath){
  let code, msg, contentData;

  try{
    contentData = fs.readFileSync(filePath);
    [code, msg] = [0, ''];
  }
  catch(e){
    [code, msg] = [-1, `utilfs.readSync, ${filePath}, ${e.message}`];
  }

  return [code, msg, contentData];
};



exports.override = function(filePath, content, startPos){
  let fd, code, msg;
  
  try{
    fd = fs.openSync(filePath, 'rs+');
    fs.writeSync(fd, content, startPos);
    [code, msg] = [0, ''];
  }
  catch(e){
    [code, msg] = [-1, e.message];
  }
  finally{
    fs.closeSync(fd);
  }

  return [code, msg];
};


exports.overrideBuffer = function(filePath, content, startPos){
  let fd, code, msg;
  
  let contentData = Buffer.from(content);

  try{
    fd = fs.openSync(filePath, 'rs+');
    fs.writeSync(fd, contentData, 0, contentData.byteLength, startPos);
    [code, msg] = [0, ''];
  }
  catch(e){
    [code, msg] = [-1, e.message];
  }
  finally{
    fs.closeSync(fd);
  }

  return [code, msg];
};



exports.renameSync = function(oldPath, newPath){
  let code, msg;

  if(!fs.existsSync(oldPath)){
    return [-1, `utilfs.renameSync Error: ${oldPath} is not Exists`];
  }

  try{
    fs.renameSync(oldPath, newPath);
    [code, msg] = [0, ''];
  }
  catch(e){
    [code, msg] = [-1, `utilfs.renameSync Error:${e.message}, oldPath->${oldPath}, newPath->${newPath}`];
  }
  return [code, msg];
};



exports.existsSync = function(filePath){
  return fs.existsSync(filePath);
};


// exports.rename = function(oldPath, newPath){
//   let code, msg;

//   fs.rename(oldPath, newPath, function(err){
//     [code, msg] = [-1, `utilfs.rename Error:${e.message}, oldPath->${oldPath}, newPath->${newPath}`];
//   });
// };


// getIndexStartPos(64, 66, 10) -> [ [ 1 ], [ [ 2, 12 ] ] ]
// getIndexStartPos(64, 64, 128) -> [ [ 1, 2 ], [ [ 0, 64 ], [ 0, 64 ] ] ]
exports.getIndexStartPos = function(fixedSize, offset, length){
  let indexList = [];
  let posList = [];

  let len = length;

  // 计算首块
  let startPos = offset % fixedSize;
  if(0 == startPos){
    index = offset / fixedSize;
  }
  else{
    index = Math.ceil(offset / fixedSize) - 1;
  }
  indexList.push(index);

  let endPos = (fixedSize < len + startPos) ? fixedSize : (startPos + len);
  posList.push([startPos, endPos]);

  len -= fixedSize - startPos;

  if(0 < len){
    while(true){
      if(fixedSize < len){
        indexList.push(index + 1);
        posList.push([0, fixedSize]);

        index++;
        len -= fixedSize;
      }
      else{
        indexList.push(index + 1);
        posList.push([0, len]);
        break;
      }
    }
  }

  return [indexList, posList];
};
