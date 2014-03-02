var automaton = require('./automaton');
var endmdl      = require('./endmdl');
var signal    = require('./signals');
var should    = require('should');

function tc(string) {
	var arr = [];

	for (var i = 0; i < string.length; i++) {
		arr.push(string.charCodeAt(i));
	}

	return arr;
}

var ENDMDL_TO_RESULT = [
	{		 //12345678901234567890123456789012345678901234567890123456789012345678901234567890 
		line: 'ENDMDL                                                                          \n',
		object: {
			_: tc('ENDMDL                                                                          ')
		}
	}
];

describe('endmdl automaton array', function () {
	// This is a kind of stress test
	// Various models, many of them, and all are feed to automaton with model array
	// And it should return correct result in all cases

	it('#test', function (done) {
		for (var i = 0; i < ENDMDL_TO_RESULT.length; i++) {
			var object = {};
			var line = tc(ENDMDL_TO_RESULT[i].line);
			var chunk_offset = 0;
			var line_offset = 0;

			var result = automaton(object, line, chunk_offset, line_offset, endmdl);

			result.should.eql({
				signal: signal.READ_LINE,
				chunk_offset: 80
			});

			object.should.eql(ENDMDL_TO_RESULT[i].object);
		}

		console.log('Tested', ENDMDL_TO_RESULT.length, 'lines');
		done();
	});

	it('#name test', function (done) {
		endmdl.name.should.equal('endmdl');
		done();
	});
});