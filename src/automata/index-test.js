var reader = require('./index');
var should = require('should');
var skip   = require('./skip');

console.log(reader);

describe('reader', function () {
	var tc = function (string) {
		var arr = [];

		for (var i = 0; i < string.length; i++) {
			arr.push(string.charCodeAt(i));
		}

		return arr;
	};

	it('#fresh reader, first chunk (incomplete)', function (done) {
		var reader0 = new reader();

		var chunk = tc('TITLE');
		reader0.read_more(chunk);

		// Checking state
		should.not.exist(reader0.current_auto);
		reader0.line_offset.should.equal(5); // last read byte
		reader0.determination_array.should.eql(tc('TITLE'));
		reader0.current_object.should.eql({});

		done();
	});

	it('#fresh reader, first chunk (incomplete 2, but automaton)', function (done) {
		var reader0 = new reader();

		var chunk = tc('TITLE ');
		reader0.read_more(chunk);

		// Checking state
		should.not.exist(reader0.determination_array);
		reader0.line_offset.should.equal(6); // last read byte
		reader0.current_auto.should.eql(skip);
		reader0.current_object.should.eql({});

		done();
	});


	it('#fresh reader, first chunk (incomplete 3, but automaton and a piece of line)', function (done) {
		var reader0 = new reader();

		var chunk = tc('TITLE blahblah');
		reader0.read_more(chunk);

		// Checking state
		should.not.exist(reader0.determination_array);
		reader0.line_offset.should.equal(6); // last read byte
		reader0.current_auto.should.eql(skip);
		reader0.current_object.should.eql({});

		done();
	});


	// it('#fresh reader, first chunk (incomplete), with next chunk', function (done) {
	// 	var reader0 = new reader();

	// 	var chunk = tc('TITLE');
	// 	reader0.read_more(chunk);

	// 	chunk = tc('678901234567890123456789012345678901234567890123456789012345678901234567890\n');
		
	// 	var reader_called = false;
		
	// 	reader.on('skip', function (object) {
	// 		object.should.eql({});
	// 		reader_called = true;
	// 	});



	// 	done();
	// });


});