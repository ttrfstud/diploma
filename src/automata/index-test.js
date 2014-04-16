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

  describe('run', function () {
    it('!_.cc branch', function (done) {
      var chnk = new Buffer([2, 1, 1]);
      var auto = [[1,1,1], [1,1], [1,1], 40];

      var reader = new Reader();

      reader.chnk = chnk;
      reader.auto = auto;

      reader.buf = [];

      reader.run();

      should.exist(reader.buf);
      
      reader.chnk.length.should.equal(0);
      reader.auto.should.eql([40]);
      reader.buf.should.eql([2, 1, 1]);

      done();
    });

    it('!_.ac branch, no nl', function (done) {
      var chnk = new Buffer([2, 1, 100]);
      var auto = [[1,1,1], [1,1]];

      var reader = new Reader();

      reader.chnk = chnk;
      reader.auto = auto;

      reader.buf = [];

      reader.run();

      should.exist(reader.buf);
      
      reader.chnk.length.should.equal(1);
      reader.chnk[0].should.equal(100);
      reader.auto.should.eql([]);
      reader.buf.should.eql([2, 1]);

      done();
    });

    it('!_.ac branch, nl', function (done) {
      var chnk = new Buffer([2, 1, 10, 10, 13, 10, 10, 13, 13, 13, 13, 100]);
      var auto = [[1,1,1], [1,1]];

      var reader = new Reader();

      reader.chnk = chnk;
      reader.auto = auto;

      reader.buf = [];

      reader.run();

      should.exist(reader.buf);
      
      reader.chnk.length.should.equal(1);
      reader.chnk[0].should.equal(100);
      reader.auto.should.eql([]);
      reader.buf.should.eql([2, 1]);

      done();
    });

    it('error branch', function (done) {
      var chnk = new Buffer([2, 1, 10, 10, 13, 10, 10, 13, 13, 13, 13, 100]);
      var auto = [[1,1,1], [1]];

      var reader = new Reader();

      reader.chnk = chnk;
      reader.auto = auto;

      reader.buf = [];

      (function () { reader.run(); }).should.throw(1);

      done();
    });
  });

  describe('#det', function () {
    it('!_chnk.length branch 1', function (done) {
      var tree = {10: {20: {30: 1}}}
      var chnk = [10, 20, 30];

      var reader = new Reader();
      reader.arr = tree;
      reader.chnk = chnk;

      reader.det();

      reader.chnk.length.should.eql(0);
      reader.arr.should.equal(1);
      should.not.exist(reader.auto);

      done();
    });

    it('!_chnk.length branch 2', function (done) {
      var tree = {10: {20: {30: []}}}
      var chnk = [10, 20, 30];

      var reader = new Reader();
      reader.arr = tree;
      reader.chnk = chnk;

      reader.det();

      reader.chnk.length.should.eql(0);
      reader.auto.should.eql([]);
      should.not.exist(reader.arr);

      done();
    });

    it('!_chnk.length branch 2', function (done) {
      var tree = {10: {20: {30: []}}};
      var chnk = [10, 20, 30];

      var reader = new Reader();
      reader.arr = tree;
      reader.chnk = chnk;

      reader.det();

      reader.chnk.length.should.eql(0);
      reader.auto.should.eql([]);
      should.not.exist(reader.arr);

      done();
    });

    it('!_chnk.length branch 3', function (done) {
      var tree = {10: {20: {30: []}}};
      var chnk = [10, 20, 40];

      var reader = new Reader();
      reader.arr = tree;
      reader.chnk = chnk;

      (function () { reader.det(); }).should.throw(1);

      done();
    });

    it('!isarr(_.arr) branch', function (done) {
      var tree = {10: {20: []}};
      var chnk = [10, 20, 40];

      var reader = new Reader();
      reader.arr = tree;
      reader.chnk = chnk;

      reader.det();

      reader.auto.should.eql([]);
      reader.chnk.should.eql([40]);
      should.not.exist(reader.arr);

      done();
    });
  });

  describe('read', function () {
    it('!_.arr && !_.auto -> _.arr', function (done) {
      var reader = new Reader();

      var chunk = new Buffer([1, 2, 3]);
      var tree = {1: {2: {3: {4: {5: []}}}}};

      reader.tree = tree;

      reader.read(chunk);
      reader.chnk.length.should.equal(0);
      reader.tree.should.eql(tree);
      reader.arr.should.eql({4: {5: []}});

      done();
    });
    
    it('!_.arr && !_.auto -> _.arr', function (done) {
      var reader = new Reader();

      var chunk = new Buffer([1, 2, 3]);
      var tree = {1: {2: {3: {4: {5: []}}}}};

      reader.tree = tree;

      reader.read(chunk);
      reader.chnk.length.should.equal(0);
      reader.tree.should.eql(tree);
      reader.arr.should.eql({4: {5: []}});

      done();
    });
  });
});