
const {crc32} = require('../../base/wrapper.js');
const utilFS = require('../../base/utilFS.js');

const chunkPath = 'C:\\work\\GFS2\\AppData\\chunkserver\\chunk1\\d55d8d548c8a5b2f98e68f8ab797fb9026ad49e8c940548ebf2c34f6da60896f';

const targetPath = './checksumData.txt';


let [code, msg, contentData] = utilFS.readSync(chunkPath);



function c(contentData, totalSize, blockLen){

	contentData = Buffer.isBuffer(contentData) ? contentData : Buffer.from(contentData);

	let list = [];

	let index = 0;

	while(index * blockLen < totalSize){

		let start = index * blockLen;
		let end = (start + blockLen <= totalSize) ? (start + blockLen) : totalSize;

		let b = contentData.slice(start, end);

		let sum = crc32.buf(b);

		list.push(sum);

		index++;
	}

	return list;
}


let list = c(contentData, 62530020, 64 * 1024);

utilFS.writeSync(targetPath, list.join(','));
