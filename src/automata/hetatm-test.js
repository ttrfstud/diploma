var automaton = require('./automaton');
var hetatm    = require('./hetatm');
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
		line: 'HETATM47053  CAC FLC B1058      33.445 -21.436 -11.942  1.00 32.83           C  \n',
		object: {
			rec: tc('H'),
			_: tc('ETATM               '),
			serial: tc('47053'),
			atom_name: tc(' CAC'),
			alt_loc: tc(' '),
			residue_name: tc('FLC'),
			chain_id: tc('B'),
			res_seq: tc('1058'),
			i_code: tc(' '),
			x: tc('  33.445'),
			y: tc(' -21.436'),
			z: tc(' -11.942'),
			occupancy: tc('  1.00'),
			temp_factor: tc(' 32.83'),
			element: tc(' C'),
			charge: tc('  ')
		}
	},
	{		 //12345678901234567890123456789012345678901234567890123456789012345678901234567890 
		line: 'HETATM47053  CAC FLC B1058      33.445 -21.436 -11.942  1.00 32.83           C  \n',
		object: {
			rec: tc('H'),
			_: tc('ETATM               '),
			serial: tc('47053'),
			atom_name: tc(' CAC'),
			alt_loc: tc(' '),
			residue_name: tc('FLC'),
			chain_id: tc('B'),
			res_seq: tc('1058'),
			i_code: tc(' '),
			x: tc('  33.445'),
			y: tc(' -21.436'),
			z: tc(' -11.942'),
			occupancy: tc('  1.00'),
			temp_factor: tc(' 32.83'),
			element: tc(' C'),
			charge: tc('  ')
		}
	},
	{		 //123456789012345 67890123456789012345678901234567890123456789012345678901234567890 
		line: 'HETATM 1306  O5\'BAMP A 171      16.778   7.497  16.477  0.50 32.15           O  \n',
		object: {
			rec: tc('H'),
			_: tc('ETATM               '),
			serial: tc(' 1306'),
			atom_name: tc(' O5\''),
			alt_loc: tc('B'),
			residue_name: tc('AMP'),
			chain_id: tc('A'),
			res_seq: tc(' 171'),
			i_code: tc(' '),
			x: tc('  16.778'),
			y: tc('   7.497'),
			z: tc('  16.477'),
			occupancy: tc('  0.50'),
			temp_factor: tc(' 32.15'),
			element: tc(' O'),
			charge: tc('  ')
		}
	},
	{		 //12345678901234567890123456789012345678901234567890123456789012345678901234567890 
		line: 'HETATM 2132  O   HOH A 552      45.404 108.643-122.200  1.00 51.26           O  \n',
		object: {
			rec: tc('H'),
			_: tc('ETATM               '),
			serial: tc(' 2132'),
			atom_name: tc(' O  '),
			alt_loc: tc(' '),
			residue_name: tc('HOH'),
			chain_id: tc('A'),
			res_seq: tc(' 552'),
			i_code: tc(' '),
			x: tc('  45.404'),
			y: tc(' 108.643'),
			z: tc('-122.200'),
			occupancy: tc('  1.00'),
			temp_factor: tc(' 51.26'),
			element: tc(' O'),
			charge: tc('  ')
		}
	},
];

describe('hetatm automaton array', function () {
	// This is a kind of stress test
	// Various hetatms, many of them, and all are feed to automaton with hetatm array
	// And it should return correct result in all cases

	it('#test', function (done) {
		for (var i = 0; i < ATOMS_TO_RESULTS.length; i++) {
			var object = {};
			var line = tc(ATOMS_TO_RESULTS[i].line);
			var chunk_offset = 0;
			var line_offset = 0;

			var result = automaton(object, line, chunk_offset, line_offset, hetatm);

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
		hetatm.name.should.equal('hetatm');
		done();
	});
});