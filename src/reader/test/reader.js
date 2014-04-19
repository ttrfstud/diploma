var Reader = require('../reader');
var should = require('should');

// if some object has length 0, or fully read or similar, it should be null'd

describe('reader', function () {
  it('#on', function (done) {
    var reader = new Reader();
    var handler = function () { console.log('test'); };

    reader.on('testevent', handler);

    reader.subs['testevent'].toString().should.eql(handler.toString());

    done();
  });

  describe('#getch', function () {
    it('test', function (done) {
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

    it('and auto name', function (done) {
      var reader = new Reader();

      var auto = [1, 2, 3];
      auto.name = 'test';

      var chnk = [1, 2, 3];

      reader.auto = auto;
      reader.chnk = chnk;

      reader.getch();

      reader.auto.name.should.equal('test');

      done();
    });
  });

  describe('#ungetch', function () {
    it('and auto name', function (done) {
      var reader = new Reader();

      var auto = [1, 2, 3];
      auto.name = 'test';

      var ac = 4;

      reader.ac = ac;
      reader.auto = auto;
      reader.ungetch();

      reader.auto.name.should.equal('test');

      done();
    });
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
      auto.name = 'test';

      var rauto = [40];
      rauto.name = 'test';

      var reader = new Reader();

      reader.chnk = chnk;
      reader.auto = auto;

      reader.buf = [];

      reader.run();

      should.exist(reader.buf);
      
      reader.chnk.length.should.equal(0);
      reader.auto.should.eql(rauto);
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
      should.not.exist(reader.auto);
      should.not.exist(reader.arr);
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
      should.not.exist(reader.auto);
      should.not.exist(reader.arr);
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

      reader.chnk.should.eql([]);
      reader.arr.should.equal(1);
      should.not.exist(reader.auto);

      done();
    });

    it('!_chnk.length branch 2', function (done) {
      var tree = {10: {20: {30: [1]}}}
      var chnk = [10, 20, 30];

      var reader = new Reader();
      reader.arr = tree;
      reader.chnk = chnk;

      reader.det();

      reader.chnk.length.should.equal(0);
      reader.auto.should.eql([1]);
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
      var tree = {10: {20: [1]}};
      var chnk = [10, 20, 40];

      var reader = new Reader();
      reader.arr = tree;
      reader.chnk = chnk;

      reader.det();

      reader.auto.should.eql([1]);
      reader.chnk.should.eql([40]);
      should.not.exist(reader.arr);

      done();
    });
  });

  describe('_transform', function () {
    it('!_.arr && !_.auto -> _.arr', function (done) {
      var reader = new Reader({ test: 1 });

      var chunk = new Buffer([1, 2, 3]);
      var tree = {1: {2: {3: {4: {5: []}}}}};

      reader.tree = tree;

      reader._transform(chunk);
      should.not.exist(reader.chnk);
      reader.tree.should.eql(tree);
      reader.arr.should.eql({4: {5: []}});

      done();
    });
    
    it('!_.arr && !_.auto -> _.arr, then _.arr again (1)', function (done) {
      var reader = new Reader({ test: 1 });

      var chunk = new Buffer([1, 2, 3]);
      var tree = {1: {2: {3: {4: {5: []}}}}};

      reader.tree = tree;

      reader._transform(chunk);

      chunk = new Buffer([4]);

      reader._transform(chunk);

      should.not.exist(reader.chnk);
      reader.tree.should.eql(tree);
      reader.arr.should.eql({5: []});

      done();
    });
    
    it('!_.arr && !_.auto -> _.arr, then _.arr again (2)', function (done) {
      var reader = new Reader({ test: 1 });

      var chunk = new Buffer([1, 2]);
      var tree = {1: {2: {3: {4: {5: {6:[]}}}}}};

      reader.tree = tree;

      reader._transform(chunk);

      chunk = new Buffer([3, 4]);

      reader._transform(chunk);

      chunk = new Buffer([5]);

      reader._transform(chunk);

      should.not.exist(reader.chnk);
      reader.tree.should.eql(tree);
      reader.arr.should.eql({6:[]});

      done();
    });

    it('!_.arr && !_.auto -> _.auto', function (done) {
      var reader = new Reader({ test: 1 });

      var chunk = new Buffer([1, 2, 3, 4, 5]);
      var tree = {1: {2: {3: {4: {5: [1]}}}}};

      reader.tree = tree;

      reader._transform(chunk);

      // should.not.exist(reader.chnk);
      // should.not.exist(reader.arr);

      // reader.tree.should.eql(tree);
      // reader.auto.should.eql([1]);

      done();
    });

    it('!_.arr && !_.auto -> _.arr, then _.auto (1)', function (done) {
      var reader = new Reader({ test: 1 });

      var auto = [1, 2];
      auto.name = 'test';

      var chunk = new Buffer([1, 2, 3, 4]);
      var tree = {1: {2: {3: {4: {5: auto}}}}};

      reader.tree = tree;

      reader._transform(chunk);

      should.not.exist(reader.chnk);
      reader.tree.should.eql(tree);
      should.not.exist(reader.auto);
      reader.arr.should.eql({5: auto});

      chunk = new Buffer([5]);

      reader._transform(chunk);

      should.not.exist(reader.chnk);
      reader.tree.should.eql(tree);
      should.not.exist(reader.arr);
      reader.auto.should.eql(auto);

      done();
    });

    it('!_.arr && !_.auto -> _.arr, then _.auto (2)', function (done) {
      var reader = new Reader({ test: 1 });

      var auto = [1, 2];
      auto.name = 'test';

      var chunk = new Buffer([1, 2, 3]);
      var tree = {1: {2: {3: {4: {5: auto}}}}};

      reader.tree = tree;

      reader._transform(chunk);

      should.not.exist(reader.chnk);
      reader.tree.should.eql(tree);
      should.not.exist(reader.auto);
      reader.arr.should.eql({4: {5: auto}});

      chunk = new Buffer([4]);

      reader._transform(chunk);

      should.not.exist(reader.chnk);
      reader.tree.should.eql(tree);
      should.not.exist(reader.auto);
      reader.arr.should.eql({5: auto});

      chunk = new Buffer([5]);

      reader._transform(chunk);

      should.not.exist(reader.chnk);
      reader.tree.should.eql(tree);
      should.not.exist(reader.arr);
      reader.auto.should.eql(auto);

      done();
    });

    it('_.auto, chunk is shorter, no errors', function (done) {
      var reader = new Reader({ test: 1 });

      var chunk = new Buffer([1, 1, 1]);
      var auto = [[1, 1], [1, 1], [1, 1], [1, 1]];
      auto.name = 'test';

      var rauto = [[1, 1]];
      rauto.name = 'test';

      var called = false;
      reader.push = function () { called = true; };

      reader.auto = auto;

      reader._transform(chunk);

      should.not.exist(reader.chnk);
      should.not.exist(reader.arr);
      reader.auto.should.eql(rauto);
      called.should.equal(false);

      done();
    });

    it('_.auto, chunk is shorter, no errors, two reads', function (done) {
      var reader = new Reader({ test: 1 });

      var chunk = new Buffer([1, 1, 1]);
      var auto = [[1, 1], [1, 1], [1, 1], [1, 1], [1, 1]];
      auto.name = 'test';

      var rauto1 = [[1, 1], [1, 1]];
      rauto1.name = 'test';

      var rauto2 = [[1, 1]];
      rauto2.name = 'test';

      var called = false;
      reader.push = function () { called = true; };

      reader.auto = auto;

      reader._transform(chunk);

      should.not.exist(reader.chnk);
      should.not.exist(reader.arr);
      reader.auto.should.eql(rauto1);
      called.should.equal(false);

      chunk = new Buffer([1]);

      reader._transform(chunk);

      should.not.exist(reader.arr);
      reader.auto.should.eql(rauto2);
      called.should.equal(false);

      done();
    });

    it('_.auto, chunk is same len', function (done) {
      var reader = new Reader({ test: 1 });

      var chunk = new Buffer([1, 1, 1, 1, 1]);
      var auto = [[1, 1], [1, 1], [1, 1], [1, 1], [1, 1]];
      auto.name = 'test';

      var called = false;
      var carg;
      reader.push = function (arg) { called = true; carg = arg; };

      reader.auto = auto;

      reader._transform(chunk);

      should.not.exist(reader.chnk);
      should.not.exist(reader.arr);
      should.not.exist(reader.auto);
      called.should.equal(true);
      carg.should.eql({name:'test',buf:[1, 1, 1, 1, 1]});

      done();
    });

    it('_.auto, chunk is same len + nl', function (done) {
      var reader = new Reader({ test: 1 });

      var chunk = new Buffer([1, 1, 1, 1, 1, 10, 10, 13, 13]);
      var auto = [[1, 1], [1, 1], [1, 1], [1, 1], [1, 1]];
      auto.name = 'test';

      var called = false;
      var carg;
      reader.push = function (arg) { called = true; carg = arg; };

      reader.auto = auto;

      reader._transform(chunk);

      should.not.exist(reader.chnk);
      should.not.exist(reader.arr);
      should.not.exist(reader.auto);
      called.should.equal(true);
      carg.should.eql({name:'test',buf:[1, 1, 1, 1, 1]});

      done();
    });

    it('_.auto, chunk is longer, incomplete det on second read', function (done) {
      var reader = new Reader({ test: 1 });

      var chunk = new Buffer([1, 1, 1, 1, 1, 10, 10, 13, 13, 100]);
      var auto = [[1, 1], [1, 1], [1, 1], [1, 1], [1, 1]];
      var tree = {100: {200: [10]}};

      auto.name = 'test';

      var called = false;
      var carg;
      reader.push = function (arg) { called = true; carg = arg; };

      reader.auto = auto;
      reader.tree = tree;

      reader._transform(chunk);

      should.not.exist(reader.chnk);
      should.not.exist(reader.auto);
      reader.arr.should.eql({200: [10]});
      called.should.equal(true);
      carg.should.eql({name:'test',buf:[1, 1, 1, 1, 1]});

      done();
    });

    it('_.auto, chunk is longer, complete det on second read', function (done) {
      var reader = new Reader({ test: 1 });

      var rauto = [10];
      rauto.name = 'test';

      var chunk = new Buffer([1, 1, 1, 1, 1, 10, 10, 13, 13, 100]);
      var auto = [[1, 1], [1, 1], [1, 1], [1, 1], [1, 1]];
      var tree = {100: rauto};

      auto.name = 'test';

      var called = false;
      var carg;
      reader.push = function (arg) { called = true; carg = arg; };

      reader.auto = auto;
      reader.tree = tree;

      reader._transform(chunk);

      should.not.exist(reader.chnk);
      should.not.exist(reader.arr);
      reader.auto.should.eql(rauto);
      called.should.equal(true);
      carg.should.eql({name:'test',buf:[1, 1, 1, 1, 1]});

      done();
    });

    it('error on det', function (done) {
      var reader = new Reader({ test: 1 });

      var tree = {10: {20: {30: [10]}}};
      var chnk = new Buffer([10, 20, 31]);

      reader.tree = tree;

      (function () { reader._transform(chnk) }).should.throw(1);

      done();
    });

    it('error on run', function (done) {
      var reader = new Reader({ test: 1 });
      
      var chnk = new Buffer([1, 1, 1]);
      var auto = [[1, 1], [], [1, 1]];

      reader.auto = auto;

      (function () { reader._transform(chnk) }).should.throw(1);

      done();
    });

    it('error on run (no error for comparison)', function (done) {
      var reader = new Reader();
      
      var chnk = new Buffer([1, 1, 1]);
      var auto = [[1, 1], [1, 1], [1, 1]];

      reader.auto = auto;

      (function () { reader._transform(chnk) }).should.not.throw(1);

      done();
    });

    it('error on det in second det', function (done) {
      var reader = new Reader({ test: 1 });
      
      var chnk = new Buffer([1, 1, 1, 100]);
      var auto = [[1, 1], [1, 1], [1, 1]];
      var tree = {99: [1]};

      reader.auto = auto;
      reader.tree = tree;

      (function () { reader._transform(chnk) }).should.throw(1);

      done();
    });

    it('complete read, but incomplete newlines', function (done) {
      var reader = new Reader({ test: 1 });

      var rauto = [101];
      rauto.name = 'test';
      
      var chnk = new Buffer([1, 1, 1, 10, 10, 10, 10, 10, 13]);
      var auto = [[1, 1], [1, 1], [1, 1]];
      var tree = {100: rauto};

      reader.auto = auto;
      
      reader._transform(chnk);

      should.not.exist(reader.auto);
      should.not.exist(reader.arr);

      chnk = new Buffer([10, 13, 100]);

      reader.tree = tree;

      reader._transform(chnk);

      reader.auto.should.eql(rauto);
      should.not.exist(reader.arr);

      done();
    });
  });
});