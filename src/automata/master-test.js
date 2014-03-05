var automaton = require('./automaton');
var master    = require('./master');
var signal    = require('./signals');
var should    = require('should');

function tc(string) {
	var arr = [];

	for (var i = 0; i < string.length; i++) {
		arr.push(string.charCodeAt(i));
	}

	return arr;
}

var MASTER_TO_RESULT = [
	{		 //12345678901234567890123456789012345678901234567890123456789012345678901234567890 
		line: 'MASTER      349    0    3    9   11    0   10    6 2105    1   40   21          \n',
		object: {
			_: tc('MASTER      349    0    3    9   11    0   10    6 2105    1   40   21          ')
		}
	},
	{		 //12345678901234567890123456789012345678901234567890123456789012345678901234567890 
		line: 'MASTER      472    0    3   17   14    0    8    6 2844    1   36   28          \n',
		object: {
			_: tc('MASTER      472    0    3   17   14    0    8    6 2844    1   36   28          ')
		}
	},
	{		 //12345678901234567890123456789012345678901234567890123456789012345678901234567890 
		line: 'MASTER       98    0    0    0    5    0    0    6  959    1    8    5          \n',
		object: {
			_: tc('MASTER       98    0    0    0    5    0    0    6  959    1    8    5          ')
		}
	},
	{		 //12345678901234567890123456789012345678901234567890123456789012345678901234567890 
		line: 'MASTER      215    0   32    0    0    0    6    6  719    3  297    9          \n',
		object: {
			_: tc('MASTER      215    0   32    0    0    0    6    6  719    3  297    9          ')
		}
	},
];

describe('master automaton array', function () {
	// This is a kind of stress test
	// Various masters, many of them, and all are feed to automaton with master array
	// And it should return correct result in all cases

	it('#test', function (done) {
		for (var i = 0; i < MASTER_TO_RESULT.length; i++) {
			var object = {};
			var line = tc(MASTER_TO_RESULT[i].line);
			var chunk_offset = 0;
			var line_offset = 0;

			var result = automaton(object, line, chunk_offset, line_offset, master);

			result.should.eql({
				signal: signal.READ_LINE,
				chunk_offset: 80
			});

			object.should.eql(MASTER_TO_RESULT[i].object);
		}

		console.log('Tested', MASTER_TO_RESULT.length, 'lines');
		done();
	});

	it('#name test', function (done) {
		master.name.should.equal('master');
		done();
	});
});