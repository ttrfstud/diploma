module.exports = function () {
	var result = {};

	for (var i = 0; i < arguments.length; i++) {
		for (var j in arguments[i]) if (arguments[i].hasOwnProperty(j)) {
			result[j] = arguments[i][j];
		}
	}

	return result;
};