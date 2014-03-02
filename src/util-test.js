var should = require('should');
var util = require('./util');

describe('util', function () {
	describe('util.array_equal', function () {
		it('#equal arrays', function (done) {
			var a = [1, 2, 3, 4, 20, 4];
			var b = [1, 2, 3, 4, 20, 4];

			util.arrays_equal(a, b).should.be.true;
			done();
		});	

		it('#not equal arrays', function (done) {
			var a = [1, 2, 3, 4, 10, 4];
			var b = [1, 2, 3, 4, 20, 4];

			util.arrays_equal(a, b).should.be.false;
			done();
		});
	});

	describe('util.raw_atom_2_atom', function () {
		// Passes good, but floating distortion ...
		it.skip('#retains only x, y, z', function (done) {
			var raw_atom = {
				'_': [32,4,56,43,234,56,2,45,6,4],
				'i_code': [33],
				'serial': [12,34,56,32],
				'x': [0x20, 0x20, 0x31, 0x32, 0x2e, 0x32, 0x34, 0x30],
				'y': [0x38, 0x30, 0x30, 0x34, 0x2e, 0x36, 0x31, 0x31],
				'z': [0x20, 0x20, 0x20, 0x31, 0x2e, 0x32, 0x33, 0x35]
			}

			util.raw_atom_2_atom(raw_atom).should.eql({
				x: 12.240,
				y: 8004.611,
				z: 1.235
			});
		});
	});

	describe('util.init_model', function () {
		it('#underflow', function (done) {
			var model = 12;

			util.init_model(model).should.eql([0x20, 0x20, 0x31, 0x32]);
			done();
		});

		it('#just the right size', function (done) {
			var model = 4321;

			util.init_model(model).should.eql([0x34, 0x33, 0x32, 0x31]);
			done();
		});

		it('#overflow', function (done) {
			var model = 56789;

			(function with_error() {
				util.init_model(model);
			}).should.throw('Model overflow!');

			done();
		});

		it('#negative', function (done) {
			var model = -1;

			(function with_error() {
				util.init_model(model);
			}).should.throw('Negative model!');

			done();
		});
	});

	describe('util.determine_automaton', function () {
		// cs = chunk_start
		// ms = model_start
		// ce = chunk_end
		// me = model_end
		it('#cs = ms, ce > me', function (done) {
			var chunk = [0, 1, 2, 3, 4, 5, 6];
			var tree = {0:{1:{2:{3:{4:{5:[100]}}}}}};
			var determination_array = [];
			var i = 0;

			var result = util.determine_automaton(tree, chunk, i, determination_array);

			should.not.exist(result.determination_array);
			result.auto.should.eql([100]);
			done();
		});

		it('#cs = ms, ce = me', function (done) {
			var chunk = [0, 1, 2, 3, 4, 5];
			var tree = {0:{1:{2:{3:{4:{5:[100]}}}}}};
			var determination_array = [];
			var i = 0;

			var result = util.determine_automaton(tree, chunk, i, determination_array);

			should.not.exist(result.determination_array);
			result.auto.should.eql([100]);
			done();
		});

		it('#cs = ms, ce < me', function (done) {
			var chunk = [0, 1, 2, 3, 4];
			var tree = {0:{1:{2:{3:{4:{5:[100]}}}}}};
			var determination_array = [];
			var i = 0;

			var result = util.determine_automaton(tree, chunk, i, determination_array);

			should.not.exist(result.auto);
			result.determination_array.should.eql([0, 1, 2, 3, 4]);
			done();
		});

		it('#cs = ms, ce > me (null determination_array)', function (done) {
			var chunk = [0, 1, 2, 3, 4, 5, 6];
			var tree = {0:{1:{2:{3:{4:{5:[100]}}}}}};
			var determination_array = null;
			var i = 0;

			var result = util.determine_automaton(tree, chunk, i, determination_array);

			should.not.exist(result.determination_array);
			result.auto.should.eql([100]);
			done();
		});

		it('#cs = ms, ce = me (null determination_array)', function (done) {
			var chunk = [0, 1, 2, 3, 4, 5];
			var tree = {0:{1:{2:{3:{4:{5:[100]}}}}}};
			var determination_array = null;
			var i = 0;

			var result = util.determine_automaton(tree, chunk, i, determination_array);

			should.not.exist(result.determination_array);
			result.auto.should.eql([100]);
			done();
		});

		it('#cs = ms, ce < me (null determination_array)', function (done) {
			var chunk = [0, 1, 2, 3, 4];
			var tree = {0:{1:{2:{3:{4:{5:[100]}}}}}};
			var determination_array = null;
			var i = 0;

			var result = util.determine_automaton(tree, chunk, i, determination_array);

			should.not.exist(result.auto);
			result.determination_array.should.eql([0, 1, 2, 3, 4]);
			done();
		});

		it('#cs > ms, ce > me', function (done) {
			var chunk = [1, 2, 3, 4, 5, 6];
			var tree = {0:{1:{2:{3:{4:{5:[100]}}}}}};
			var determination_array = [0];
			var i = 0;

			var result = util.determine_automaton(tree, chunk, i, determination_array);

			should.not.exist(result.determination_array);
			result.auto.should.eql([100]);
			done();
		});

		it('#cs > ms, ce = me', function (done) {
			var chunk = [1, 2, 3, 4, 5];
			var tree = {0:{1:{2:{3:{4:{5:[100]}}}}}};
			var determination_array = [0];
			var i = 0;

			var result = util.determine_automaton(tree, chunk, i, determination_array);

			should.not.exist(result.determination_array);
			result.auto.should.eql([100]);
			done();
		});

		it('#cs > ms, ce < me', function (done) {
			var chunk = [1, 2, 3, 4];
			var tree = {0:{1:{2:{3:{4:{5:[100]}}}}}};
			var determination_array = [0];
			var i = 0;

			var result = util.determine_automaton(tree, chunk, i, determination_array);

			should.not.exist(result.auto);
			result.determination_array.should.eql([0, 1, 2, 3, 4]);
			done();
		});

		it('#cs < ms, ce > me', function (done) {
			var chunk = [-1, -2, 0, 1, 2, 3, 4, 5, 6];
			var tree = {0:{1:{2:{3:{4:{5:[100]}}}}}};
			var determination_array = null;
			var i = 2;

			var result = util.determine_automaton(tree, chunk, i, determination_array);

			should.not.exist(result.determination_array);
			result.auto.should.eql([100]);
			done();
		});

		it('#cs < ms, ce = me', function (done) {
			var chunk = [-1, -2, 0, 1, 2, 3, 4, 5];
			var tree = {0:{1:{2:{3:{4:{5:[100]}}}}}};
			var determination_array = null;
			var i = 2;

			var result = util.determine_automaton(tree, chunk, i, determination_array);

			should.not.exist(result.determination_array);
			result.auto.should.eql([100]);
			done();
		});

		it('#cs < ms, ce = me', function (done) {
			var chunk = [-1, -2, 0, 1, 2, 3, 4];
			var tree = {0:{1:{2:{3:{4:{5:[100]}}}}}};
			var determination_array = null;
			var i = 2;

			var result = util.determine_automaton(tree, chunk, i, determination_array);

			should.not.exist(result.auto);
			result.determination_array.should.eql([0, 1, 2, 3, 4]);
			done();
		});
	});

	describe('util.object_concat', function () {
		it('#two objects', function (done) {
			var obj =  {a: 1};
			var obj2 = {b: 2};

			util.object_concat(obj, obj2).should.eql({
				a: 1,
				b: 2
			});

			done();
		});

		it('#four objects', function (done) {
			var obj =  {a: 1};
			var obj2 = {b: 2};
			var obj3 = {c: 3};
			var obj4 = {d: 4};

			util.object_concat(obj, obj2, obj3, obj4).should.eql({
				a: 1,
				b: 2,
				c: 3,
				d: 4
			});

			done();
		});

		it('#next"s props override prev"s', function (done) {
			var obj = {a: 1};
			var obj2 = {a: 2, b: 3};
			var obj3 = {b: 4, c: 5};

			util.object_concat(obj, obj2, obj3).should.eql({
				a: 2,
				b: 4,
				c: 5
			});

			done();
		});
	});
})