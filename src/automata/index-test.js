var Reader = require('./');
var should = require('should');

describe('reader', function () {
	it('#on', function (done) {
		var reader = new Reader();
		var handler = function () { console.log('test'); };

		reader.on('testevent', handler);

		reader.subs['testevent'].toString().should.eql(handler.toString());

		done();
	});

	it('#getch', function (done) {
		var reader = new Reader();

		reader.auto = new Buffer(3);
		reader.auto[0] = 1;
		reader.auto[1] = 2;
		reader.auto[2] = 3;

		reader.chnk = new Buffer(4);
		reader.chnk[0] = 11;
		reader.chnk[1] = 12;
		reader.chnk[2] = 13;
		reader.chnk[3] = 14;

		reader.auto.length.should.eql(3);
		reader.chnk.length.should.eql(4);

		should.not.exist(reader.cc);
		should.not.exist(reader.ac);

		reader.getch();

		reader.ac.should.eql(1);
		reader.cc.should.eql(11);

		reader.auto[0].should.eql(2);
		reader.auto[1].should.eql(3);

		reader.chnk[0].should.eql(12);
		reader.chnk[1].should.eql(13);
		reader.chnk[2].should.eql(14);

		reader.auto.length.should.eql(2);
		reader.chnk.length.should.eql(3);

		reader.getch();

		reader.ac.should.eql(2);
		reader.cc.should.eql(12);

		reader.auto[0].should.eql(3);

		reader.chnk[0].should.eql(13);
		reader.chnk[1].should.eql(14);

		reader.auto.length.should.eql(1);
		reader.chnk.length.should.eql(2);

		done();
	});

	it('#ungetch', function (done) {
		var reader = new Reader();

		reader.cc = 3;

		reader.chnk = new Buffer(3);
		reader.chnk[0] = 10;
		reader.chnk[1] = 20;
		reader.chnk[2] = 30;

		reader.ungetch();

		should.not.exist(reader.cc);

		reader.chnk.length.should.equal(4);
		reader.chnk[0].should.equal(3);
		reader.chnk[1].should.equal(10);
		reader.chnk[2].should.equal(20);
		reader.chnk[3].should.equal(30);

		done();	
	});

	it('#skipnl', function (done) {
		var reader = new Reader();

		reader.chnk = new Buffer(10);
		reader.chnk[0] = 10;
		reader.chnk[1] = 10;
		reader.chnk[2] = 13;
		reader.chnk[3] = 10;
		reader.chnk[4] = 13;
		reader.chnk[5] = 13;
		reader.chnk[6] = 10;
		reader.chnk[7] = 20;
		reader.chnk[8] = 30;
		reader.chnk[9] = 40;

		reader.skipnl();

		reader.chnk.length.should.eql(3);
		reader.chnk[0].should.eql(20);
		reader.chnk[1].should.eql(30);
		reader.chnk[2].should.eql(40);

		done();


	});


});