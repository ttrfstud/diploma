var skip = require('./skip');
var should = require('should');

describe('skip automaton', function () {
	it('#is empty array', function (done) {
		skip.should.be.instanceof(Array);
		skip.length.should.equal(0);

		done();
	});

	it('#name is skip', function (done) {
		skip.name.should.equal('skip');

		done();
	});
});