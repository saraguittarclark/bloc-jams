
var forEach = function(array, callback) {
	for (var i = 0; i < array.length; i++) {
		// point = array[i];
		// callback = revealPoints
		
		// revealPoints(point)
		callback(array[i]);
	}
};

//GENERIC callback function to be used anywhere


