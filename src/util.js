exports.arrays_equal = function arrays_equal(a1, a2) {
	if (a1.length !== a2.length) {
		return false;
	}

	for (var i = 0; i < a1.length; i++) {
		if (a1[i] !== a2[i]) {
			return false;
		}
	}

	return true;
};

function zeroify(potential_number) {
	var zeroed = potential_number - 0x30;

	if (zeroed > 9 || zeroed < 0) {
		return 0;
	}

	return zeroed;
}

exports.raw_atom_2_atom = function raw_atom_2_atom(raw_atom) {
	var x = y = z = 0;

	for (var i = 0; i < 8; i++) {
		if (i < 4) {
			x += zeroify(raw_atom.x[i]) * Math.pow(10, 3 - i);
			y += zeroify(raw_atom.y[i]) * Math.pow(10, 3 - i);
			z += zeroify(raw_atom.z[i]) * Math.pow(10, 3 - i);
		} else if (i > 4) {
			x += zeroify(raw_atom.x[i]) * Math.pow(10, 4 - i);
			y += zeroify(raw_atom.y[i]) * Math.pow(10, 4 - i);
			z += zeroify(raw_atom.z[i]) * Math.pow(10, 4 - i);
		}
	}

	for (var i = 0; i < 4; i++) {
		if (raw_atom.x[i] === 0x2d) {
			x = 0 - x;
		}

		if (raw_atom.y[i] === 0x2d) {
			y = 0 - y;
		}

		if (raw_atom.z[i] === 0x2d) {
			z = 0 - z;
		}
	}

	return {x: x, y: y, z: z};
};

exports.init_model = function init_model(model) {
	if (model >= 10000) {
		throw new Error('Model overflow!');
	}

	if (model < 0) {
		throw new Error('Negative model!');
	}

	var _model = [];

	while(model) {
		var digit = model % 10;
		_model.unshift(digit + 0x30);
		model = (model - digit) / 10;
	}

	while(_model.length !== 4) {
		_model.unshift(0x20);
	}

	return _model;
};