var isspace = function (ch) {
	return ch === 32;
};

var isnum = function (ch) {
	return ch >= 48 && ch <= 57;
}

module.exports = function (buf) {
	var i;

	i = 24;

	function atof() {
		var sign;
		var val;
		var fbase;

		sign = 1;
		val = 0;

		while(isspace(buf[i])) {
			i++;
		}

		if (buf[i] === 45) {
			sign = -1;
			i++;
		}

		while(isnum(buf[i])) {
			val = val * 10 + (buf[i] - 48);
			i++;
		}

		i++; // skip dot

		fbase = 1;

		while(isnum(buf[i])) {
			fbase *= 10;
			val = val + (buf[i] - 48) / fbase;
			i++;
		}

		return parseFloat(val * sign);
	}

	x = atof();
	y = atof();
	z = atof();

	return {x : x, y: y, z: z};
};