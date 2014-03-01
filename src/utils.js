exports.arrays_equal = function (a1, a2) {
	if (a1.length !== a2.length) {
		return false;
	}

	for (var i = 0; i < a1.length; i++) {
		if (a1[i] !== a2[i]) {
			return false;
		}
	}

	return true;
}

exports.raw_atom_2_atom = function (raw_atom) {
	var x, y, z;

	throw new Error('not implemented');
}