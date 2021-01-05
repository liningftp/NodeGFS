
// store master startup data

var metaData = {
	'startTime': 0 // master start time
};


exports.get = function(){
	return metaData
};


exports.set = function(data){
	metaData = data;
};

