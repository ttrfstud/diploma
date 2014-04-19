var debuf = require('../debuf');

var should = require('should');

describe('debuf', function () {
	it('random buffer', function (done) {
		// -67.367  37.777 -51.345
		var buf = [51, 54, 53, 48, 54, 32, 32, 79, 32, 32, 32, 71, 76, 89, 32, 69, 32, 54, 55, 57, 32, 32, 32, 32, 32, 45, 54, 55, 46, 51, 54, 55, 32, 32, 51, 55, 46, 55, 55, 55, 32, 45, 53, 49, 46, 51, 52, 53, 32, 32, 49, 46, 48, 48, 32, 53, 55, 46, 50, 48, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 79, 32, 32];

		debuf(buf).should.eql({x: -67.367, y: 37.777, z: -51.345});
		
		done();
	});

	it.skip('random buffer 2', function (done) { // float bias
		// 
		var buf = [51, 54, 53, 48, 55, 32, 32, 78, 32, 32, 32, 80, 72, 69, 32, 69, 32, 54, 56, 48, 32, 32, 32, 32, 32, 45, 54, 57, 46, 49, 56, 54, 32, 32, 51, 55, 46, 49, 48, 49, 32, 45, 53, 48, 46, 50, 48, 54, 32, 32, 49, 46, 48, 48, 32, 53, 54, 46, 56, 50, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 78, 32, 32];
		debuf(buf).should.eql({x: -69.186, y: 37.101, z: -50.206});

		done();
	});
});