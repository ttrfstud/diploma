var skip = require('./skip');
var should = require('should');

describe('skip automaton', function () {
	it('#is zero', function (done) {
		skip.should.equal(-1);

		done();
	});
});