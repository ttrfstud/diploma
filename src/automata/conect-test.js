var automaton = require('./automaton');
var conect      = require('./conect');
var signal    = require('./signals');
var should    = require('should');

function tc(string) {
	var arr = [];

	for (var i = 0; i < string.length; i++) {
		arr.push(string.charCodeAt(i));
	}

	return arr;
}

var CONECT_TO_RESULT = [
	{		 //12345678901234567890123456789012345678901234567890123456789012345678901234567890 
		line: 'CONECT47053470544705947060                                                      \n',
		object: {
			_: tc('CONECT47053470544705947060                                                      ')
		}
	},
	{		 //12345678901234567890123456789012345678901234567890123456789012345678901234567890 
		line: 'CONECT470544705347055                                                           \n',
		object: {
			_: tc('CONECT470544705347055                                                           ')
		}
	},
	{		 //12345678901234567890123456789012345678901234567890123456789012345678901234567890 
		line: 'CONECT4705547054470564705747065                                                 \n',
		object: {
			_: tc('CONECT4705547054470564705747065                                                 ')
		}
	},
	{		 //12345678901234567890123456789012345678901234567890123456789012345678901234567890 
		line: 'CONECT4705947053                                                                \n',
		object: {
			_: tc('CONECT4705947053                                                                ')
		}
	},
];

describe('conect automaton array', function () {
	// This is a kind of stress test
	// Various conects, many of them, and all are feed to automaton with conect array
	// And it should return correct result in all cases

	it('#test', function (done) {
		for (var i = 0; i < CONECT_TO_RESULT.length; i++) {
			var object = {};
			var line = tc(CONECT_TO_RESULT[i].line);
			var chunk_offset = 0;
			var line_offset = 0;

			var result = automaton(object, line, chunk_offset, line_offset, conect);

			result.should.eql({
				signal: signal.READ_LINE,
				chunk_offset: 80
			});

			object.should.eql(CONECT_TO_RESULT[i].object);
		}

		console.log('Tested', CONECT_TO_RESULT.length, 'lines');
		done();
	});

	it('#name test', function (done) {
		conect.name.should.equal('conect');
		done();
	});
});