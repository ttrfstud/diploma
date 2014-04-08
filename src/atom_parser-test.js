var should = require('should');
var parse = require('./atom_parser');

describe('atom parser', function () {

	// All these tests are sort of integration tests...
	// They stress this parser with the real data

	it('#2hrt', function (done) {
		parse('2hrt', null, function (atoms, hets) {
			console.log(atoms);
			console.log(hets);
		}, {file: 1});

	});
	
});