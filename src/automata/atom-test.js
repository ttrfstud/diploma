var automaton = require('./automaton');
var atom      = require('./atom');
var signal    = require('./signals');
var should    = require('should');

function tc(string) {
	var arr = [];

	for (var i = 0; i < string.length; i++) {
		arr.push(string.charCodeAt(i));
	}

	return arr;
}

var ATOMS_TO_RESULTS = [
	{		 //12345678901234567890123456789012345678901234567890123456789012345678901234567890 
		line: 'ATOM  24236  N   SER D  96     -55.172  82.561 -44.453  1.00 53.56           N  \n',
		object: {
			rec: tc('A'),
			_: tc('TOM                 '),
			serial: tc('24236'),
			atom_name: tc(' N  '),
			alt_loc: tc(' '),
			residue_name: tc('SER'),
			chain_id: tc('D'),
			res_seq: tc('  96'),
			i_code: tc(' '),
			x: tc(' -55.172'),
			y: tc('  82.561'),
			z: tc(' -44.453'),
			occupancy: tc('  1.00'),
			temp_factor: tc(' 53.56'),
			element: tc(' N'),
			charge: tc('  ')
		}
	},
	{		 //12345678901234567890123456789012345678901234567890123456789012345678901234567890 
		line: 'ATOM  24201  N   LEU D  92     -63.514  81.703 -35.081  1.00 54.82           N  \n',
		object: {
			rec: tc('A'),
			_: tc('TOM                 '),
			serial: tc('24201'),
			atom_name: tc(' N  '),
			alt_loc: tc(' '),
			residue_name: tc('LEU'),
			chain_id: tc('D'),
			res_seq: tc('  92'),
			i_code: tc(' '),
			x: tc(' -63.514'),
			y: tc('  81.703'),
			z: tc(' -35.081'),
			occupancy: tc('  1.00'),
			temp_factor: tc(' 54.82'),
			element: tc(' N'),
			charge: tc('  ')
		}
	},
	{		 //12345678901234567890123456789012345678901234567890123456789012345678901234567890 
		line: 'ATOM   2334  CG  LEU B  83     -15.252  25.542  19.999  1.00 83.36           C  \n',
		object: {
			rec: tc('A'),
			_: tc('TOM                 '),
			serial: tc(' 2334'),
			atom_name: tc(' CG '),
			alt_loc: tc(' '),
			residue_name: tc('LEU'),
			chain_id: tc('B'),
			res_seq: tc('  83'),
			i_code: tc(' '),
			x: tc(' -15.252'),
			y: tc('  25.542'),
			z: tc('  19.999'),
			occupancy: tc('  1.00'),
			temp_factor: tc(' 83.36'),
			element: tc(' C'),
			charge: tc('  ')
		}
	},
	{		 //12345678901234567890123456789012345678901234567890123456789012345678901234567890 
		line: 'ATOM   2107  OG1 THR B  13     -20.005 -32.537  -9.854  1.00 37.77           O  \n',
		object: {
			rec: tc('A'),
			_: tc('TOM                 '),
			serial: tc(' 2107'),
			atom_name: tc(' OG1'),
			alt_loc: tc(' '),
			residue_name: tc('THR'),
			chain_id: tc('B'),
			res_seq: tc('  13'),
			i_code: tc(' '),
			x: tc(' -20.005'),
			y: tc(' -32.537'),
			z: tc('  -9.854'),
			occupancy: tc('  1.00'),
			temp_factor: tc(' 37.77'),
			element: tc(' O'),
			charge: tc('  ')
		}
	},
	{		 //12345678901234567890123456789012345678901234567890123456789012345678901234567890 
		line: 'ATOM   2924  N   PHE B 121     -14.398 -25.445 -11.458  1.00 31.95           N  \n',
		object: {
			rec: tc('A'),
			_: tc('TOM                 '),
			serial: tc(' 2924'),
			atom_name: tc(' N  '),
			alt_loc: tc(' '),
			residue_name: tc('PHE'),
			chain_id: tc('B'),
			res_seq: tc(' 121'),
			i_code: tc(' '),
			x: tc(' -14.398'),
			y: tc(' -25.445'),
			z: tc(' -11.458'),
			occupancy: tc('  1.00'),
			temp_factor: tc(' 31.95'),
			element: tc(' N'),
			charge: tc('  ')
		}
	},
];

describe('atom automaton array', function () {
	// This is a kind of stress test
	// Various atoms, many of them, and all are feed to automaton with atom array
	// And it should return correct result in all cases

	it('#test', function (done) {
		for (var i = 0; i < ATOMS_TO_RESULTS.length; i++) {
			var object = {};
			var line = tc(ATOMS_TO_RESULTS[i].line);
			var chunk_offset = 0;
			var line_offset = 0;

			var result = automaton(object, line, chunk_offset, line_offset, atom);

			result.should.eql({
				signal: signal.READ_LINE,
				chunk_offset: 80
			});

			object.should.eql(ATOMS_TO_RESULTS[i].object);
		}

		console.log('Tested', ATOMS_TO_RESULTS.length, 'lines');
		done();
	});

	it('#name test', function (done) {
		atom.name.should.equal('atom');
		done();
	});
});