var automaton = require('./automaton');
var signal    = require('./signals');
var should    = require('should');
var atom_auto = require('./atom_hetatm');

// automaton processor should return the offset of the last traversed symbol
describe('automaton', function () {
	var tc = function to_code(string) {
		var arr = [];

		for (var i = 0; i < string.length; i++) {
			arr.push(string.charCodeAt(i));
		}

		return arr;
	};

	// it is following the automaton array via chunk
	it('#skip automaton', function (done) {
		automaton('whatever', 'whatever as well', 30, 50, -1).should.eql({
			chunk_offset: 59, // last traversed, not next to traverse!
			signal: signal.READ_LINE
		});

		done();
	});

	it('chunk is over line end long (from chunk start), empty object, no errors', function (done) {
		var object = {};
					12345678901234567890123456789012345678901234567890123456789012345678901234567890;
		var line = 'ATOM  16596  N   GLN C 123       8.285  -2.726 -26.326  1.00 43.96           N  \nAT';
		var chunk_offset = 0;
		var line_offset = 0;
		var auto = atom_auto;

		var result = automaton(object, tc(line), chunk_offset, line_offset, auto);

		result.should.eql({
			chunk_offset: 80, // because we read with newline, but skipped it
			signal: signal.READ_LINE
		});

		object.should.eql({
			rec: tc('A'),
			'_': tc('TOM  ').
					concat(tc(' ')).concat(tc(' ')).
					concat(tc('   ')).concat(tc('          ')),
			serial: tc('16596'),
			atom_name: tc(' N  '),
			alt_loc: tc(' '),
			residue_name: tc('GLN'),
			chain_id: tc('C'),
			res_seq: tc(' 123'),
			i_code: tc(' '),
			x: tc('   8.285'),
			y: tc('  -2.726'),
			z: tc(' -26.326'),
			occupancy: tc('  1.00'),
			temp_factor: tc(' 43.96'),
			element: tc(' N'),
			charge: tc('  ')
		});

		done();
	});
	
	it('chunk is exactly to line end long (from chunk start), empty object, no errors', function (done) {
		var object = {};
					12345678901234567890123456789012345678901234567890123456789012345678901234567890;
		var line = 'ATOM  16596  N   GLN C 123       8.285  -2.726 -26.326  1.00 43.96           N  \n';
		var chunk_offset = 0;
		var line_offset = 0;
		var auto = atom_auto;

		var result = automaton(object, tc(line), chunk_offset, line_offset, auto);

		result.should.eql({
			chunk_offset: 80,
			signal: signal.READ_LINE
		});

		object.should.eql({
			rec: tc('A'),
			'_': tc('TOM  ').
					concat(tc(' ')).concat(tc(' ')).
					concat(tc('   ')).concat(tc('          ')),
			serial: tc('16596'),
			atom_name: tc(' N  '),
			alt_loc: tc(' '),
			residue_name: tc('GLN'),
			chain_id: tc('C'),
			res_seq: tc(' 123'),
			i_code: tc(' '),
			x: tc('   8.285'),
			y: tc('  -2.726'),
			z: tc(' -26.326'),
			occupancy: tc('  1.00'),
			temp_factor: tc(' 43.96'),
			element: tc(' N'),
			charge: tc('  ')
		});

		done();
	});

	it('chunk is less than to the line end long (from chunk start), empty object, no errors', function (done) {
		var object = {};
					12345678901234567890123456789012345678901234567890123456789012345678901234567890;
		var line = 'ATOM  16596  N   GLN C 123       8.285  -2.726 -26.326  1.00 43.96           N  ';
		var chunk_offset = 0;
		var line_offset = 0;
		var auto = atom_auto;

		var result = automaton(object, tc(line), chunk_offset, line_offset, auto);

		result.should.eql({
			line_offset: 79,
			chunk_offset: 79,
			signal: signal.INCOMPLETE_LINE
		});

		object.should.eql({
			rec: tc('A'),
			'_': tc('TOM  ').
					concat(tc(' ')).concat(tc(' ')).
					concat(tc('   ')).concat(tc('          ')),
			serial: tc('16596'),
			atom_name: tc(' N  '),
			alt_loc: tc(' '),
			residue_name: tc('GLN'),
			chain_id: tc('C'),
			res_seq: tc(' 123'),
			i_code: tc(' '),
			x: tc('   8.285'),
			y: tc('  -2.726'),
			z: tc(' -26.326'),
			occupancy: tc('  1.00'),
			temp_factor: tc(' 43.96'),
			element: tc(' N'),
			charge: tc('  ')
		});

		result = automaton(object, tc('\nATOM  '), 0, 80, auto);

		result.should.eql({
			chunk_offset: 0,
			signal: signal.READ_LINE
		});

		object.should.eql({
			rec: tc('A'),
			'_': tc('TOM  ').
					concat(tc(' ')).concat(tc(' ')).
					concat(tc('   ')).concat(tc('          ')),
			serial: tc('16596'),
			atom_name: tc(' N  '),
			alt_loc: tc(' '),
			residue_name: tc('GLN'),
			chain_id: tc('C'),
			res_seq: tc(' 123'),
			i_code: tc(' '),
			x: tc('   8.285'),
			y: tc('  -2.726'),
			z: tc(' -26.326'),
			occupancy: tc('  1.00'),
			temp_factor: tc(' 43.96'),
			element: tc(' N'),
			charge: tc('  ')
		});

		done();
	});
});