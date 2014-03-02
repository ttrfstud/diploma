var signals = require('./signals');
var should = require('should');	

describe('signals', function () {
	it('#', function (done) {
		signals.WRONG.should.equal(0);
		signals.READ_LINE.should.equal(1);
		signals.INCOMPLETE_LINE.should.equal(2);

		done();
	})
});