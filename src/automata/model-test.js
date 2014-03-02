var automaton = require('./automaton');
var model      = require('./model');
var signal    = require('./signals');
var should    = require('should');

function tc(string) {
	var arr = [];

	for (var i = 0; i < string.length; i++) {
		arr.push(string.charCodeAt(i));
	}

	return arr;
}

var MODELS_TO_RESULTS = [
	{		 //12345678901234567890123456789012345678901234567890123456789012345678901234567890 
		line: 'MODEL       17                                                                  \n',
		object: {
			_: tc('MODEL                                                                       '),
			model: tc('  17')
		}
	},
	{		 //12345678901234567890123456789012345678901234567890123456789012345678901234567890 
		line: 'MODEL       20                                                                  \n',
		object: {
			_: tc('MODEL                                                                       '),
			model: tc('  20')
		}
	},
	{		 //12345678901234567890123456789012345678901234567890123456789012345678901234567890 
		line: 'MODEL      999                                                                  \n',
		object: {
			_: tc('MODEL                                                                       '),
			model: tc(' 999')
		}
	},
	{		 //12345678901234567890123456789012345678901234567890123456789012345678901234567890 
		line: 'MODEL     9999                                                                  \n',
		object: {
			_: tc('MODEL                                                                       '),
			model: tc('9999')
		}
	}
];

describe('model automaton array', function () {
	// This is a kind of stress test
	// Various models, many of them, and all are feed to automaton with model array
	// And it should return correct result in all cases

	it('#test', function (done) {
		for (var i = 0; i < MODELS_TO_RESULTS.length; i++) {
			var object = {};
			var line = tc(MODELS_TO_RESULTS[i].line);
			var chunk_offset = 0;
			var line_offset = 0;

			var result = automaton(object, line, chunk_offset, line_offset, model);

			result.should.eql({
				signal: signal.READ_LINE,
				chunk_offset: 80
			});

			object.should.eql(MODELS_TO_RESULTS[i].object);
		}

		console.log('Tested', MODELS_TO_RESULTS.length, 'lines');
		done();
	});

	it('#name test', function (done) {
		model.name.should.equal('model');
		done();
	});
});