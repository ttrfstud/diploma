var line = 0;


module.exports.addline = function () {
	line++;
};

module.exports.dump = function () {
	console.log('Current line', line);
};

module.exports.getline = function () {
	return line;
}