var should = require('should');
var parse = require('./atom_parser');

describe('atom parser', function () {

	// All these tests are sort of integration tests...
	// They stress this parser with the real data

	it('#2hrt', function (done) {
		parse('2hrt', null, function (atoms, hets) {
			hets[0].x.should.equal(33.445);
			hets[0].y.should.equal(-21.436);
			hets[0].z.should.equal(-11.942);
			done();
		}, {file: 1});

	});
	
});