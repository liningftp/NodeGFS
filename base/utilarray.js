
// 高级数组工具

exports.getCoverArray = function(position, length, unit){
  let list = [];
  let i = Math.floor( position / unit );
  let endPos = position + length;
  
  while( i * unit < endPos ){
    let isFirst = (i * unit < position);
    let start = isFirst ? (position - i * unit) : 0;
    let count = isFirst?
      (i + 1) * unit < endPos ? unit - start : unit
      :
      (i + 1) * unit < endPos ? unit : (endPos - i * unit);
    list.push({
      index: i,
      start,
      count
    });
    
    i++;
  }
  
  return list;
};

