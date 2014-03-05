var automaton = require('./automaton');
var signal    = require('./signals');
var should    = require('should');
var atom_auto = require('./atom');
var classes   = require('./classes');
var union     = require('../util').object_concat;

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
	describe('skip automata', function (done) {
		it('#skip automaton (complete line)', function (done) {
			var chunk = tc('123456789012345678901234567890123456789012345678901234567890');
			automaton('whatever', chunk, 30, 50, []).should.eql({
				chunk_offset: 59, // last traversed, not next to traverse!
				signal: signal.READ_LINE
			});

			done();
		});		

		it('#skip automaton (complete line and new lines)', function (done) {
			var chunk = tc('123456789012345678901234567890123456789012345678901234567890\n\n\n\n\n\n1234567890123456789012345678901234567890');
			automaton('whatever', chunk, 30, 50, []).should.eql({
				chunk_offset: 65, // last traversed, not next to traverse!
				signal: signal.READ_LINE
			});

			done();
		});		

		it('#skip automaton (incomplete line)', function (done) {
			var chunk = tc('12345678901234567890123456789012345678901234567890123456789');
			automaton('whatever', chunk, 30, 50, []).should.eql({
				chunk_offset: 58, // last traversed, not next to traverse!
				line_offset: 78,
				signal: signal.INCOMPLETE_LINE
			});

			done();
		});

		

	});

	// cm - chunk contains more bytes than current line needs to the end (e.g. 39 bytes, but the current line is already at 68)
	// ce - chunk contains exactly as much bytes as needed to complete line (e.g. 3 bytes, and the line is already 78 bytes long - chunk should also include whitespace)
	// cl - chunk contains less bytes than current lines needs
	// -------
	// se - start exact - object is started where this chunk is started (therefore, always eo)
	// sb - start before - object is started before this chunk was started (therefore, always neo)
	// sa - start after - object starts somewhere in the middle of this chunk (therefore, always eo)
	// -------
	// eo - empty object
	// neo - not empty object
	// -------
	// e - automaton should report error
	// ne - automaton should not reports error

	// another classification
	// a - line length
	// b - chunk length
	// sb - a starts before
	// se - a and b start together
	// sa - a starts after
	// eb - a ends before
	// ee - a and b end together
	// ea - a ends after
	// 1. a = b
	// -- sb, eb (cm, sb, neo)
	// -- sb, ee (impossible)
	// -- sb, ea (impossible)
	// -- se, eb (impossible)
	// -- se, ee (ce, se, eo)
	// -- se, ea (impossible)
	// -- sa, eb (impossible)
	// -- sa, ee (impossible)
	// -- sa, ea
	// =>
	// a = b => sb, eb (v)| se, ee (v)| sa, ea (v)
	// 2. a < b
	// -- sb, eb (cm, sb, neo) <--- same as a = b, sb, eb, but a sub-case!
	// -- sb, ee (impossible)
	// -- sb, ea (impossible)
	// -- se, eb
	// -- se, ee (impossible)
	// -- se, ea (impossible)
	// -- sa, eb
	// -- sa, ee
	// -- sa, ea
	// =>
	// a < b => sb, eb (v)| se, eb (v)| sa, eb (v)| sa, ee (v)| sa, ea (v)
	// 3. a > b
	// -- sb, eb
	// -- sb, ee
	// -- sb, ea
	// -- se, eb (impossible)
	// -- se, ee (impossible)
	// -- se, ea
	// -- sa, eb (impossible)
	// -- sa, ee (impossible)
	// -- sa, ea
	// =>
	// a > b => sb, eb (v)| sb, ee (v)| sb, ea (v)| se, ea (v)| sa, ea (v)

	// a = b here means: |a| = 80 & b = |81|
	// a < b here means: |a| = 80 & b = |82|
	// a > b here means: |a| = 80 & b = |80|

	// # a = b tests
	it('#a = b, sb, eb', function (done) {
		var object = {rec: tc('A'), '_': tc('T')};
					12345678901234567890123456789012345678901234567890123456789012345678901234567890;
		var line = 'OM  16596  N   GLN C 123       8.285  -2.726 -26.326  1.00 43.96           N  \nAT';
		var chunk_offset = 0;
		var line_offset = 2;
		var auto = atom_auto;

		var result = automaton(object, tc(line), chunk_offset, line_offset, auto);

		result.should.eql({
			chunk_offset: 78, // last read byte was newline
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

		// We want to read chunk to the end
		object = {};
		result = automaton(object, tc(line), 79, 0, auto);

		result.should.eql({
			chunk_offset: 80,
			line_offset: 1,
			signal: signal.INCOMPLETE_LINE
		});

		object.should.eql({
			rec: tc('A'),
			'_': tc('T')
		})

		done();
	});	

	it('#a = b, se, ee', function (done) {
		var object = {};
					12345678901234567890123456789012345678901234567890123456789012345678901234567890;
		var line = 'ATOM  16596  N   GLN C 123       8.285  -2.726 -26.326  1.00 43.96           N  \n';
		var chunk_offset = 0;
		var line_offset = 0;
		var auto = atom_auto;

		var result = automaton(object, tc(line), chunk_offset, line_offset, auto);

		result.should.eql({
			chunk_offset: 80, // last read byte was newline
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
	

	it('#a = b, sa, ea', function (done) {
		var object = {};
					12345678901234567890123456789012345678901234567890123456789012345678901234567890;
		var line = '  \nATOM  16596  N   GLN C 123       8.285  -2.726 -26.326  1.00 43.96           N';
		var chunk_offset = 3;
		var line_offset = 0;
		var auto = atom_auto;

		var result = automaton(object, tc(line), chunk_offset, line_offset, auto);

		result.should.eql({
			chunk_offset: 80,
			line_offset: 77,
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
			element: tc(' N')
		});

		// Test continues, we want to read to the end. New chunk comes in
		var result = automaton(object, tc('  \nA'), 0, 78, auto);

		result.should.eql({
			chunk_offset: 2, // last read byte was newline
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
	

	// a < b tests
	it('#a < b, sb, eb', function (done) {
		var object = {rec: tc('A'), '_': tc('T')};
					012345678901234567890123456789012345678901234567890123456789012345678901234567890;
		var line = 'OM  16596  N   GLN C 123       8.285  -2.726 -26.326  1.00 43.96           N  \nATO';
		var chunk_offset = 0;
		var line_offset = 2; // next line byte to fetch
		var auto = atom_auto;

		var result = automaton(object, tc(line), chunk_offset, line_offset, auto);

		result.should.eql({
			chunk_offset: 78, // last read byte was newline
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

		// We want to read line to the end
		object = {};
		result = automaton(object, tc(line), 79, 0, atom_auto);

		result.should.eql({
			chunk_offset: 81,
			line_offset: 2,
			signal: signal.INCOMPLETE_LINE
		});

		object.should.eql({
			rec: tc('A'),
			'_': tc('TO')
		});

		done();
	});

	it('#a < b, se, eb', function (done) {
		var object = {};
					012345678901234567890123456789012345678901234567890123456789012345678901234567890;
		var line = 'ATOM  16596  N   GLN C 123       8.285  -2.726 -26.326  1.00 43.96           N  \nA';
		var chunk_offset = 0;
		var line_offset = 0; // next line byte to fetch
		var auto = atom_auto;

		var result = automaton(object, tc(line), chunk_offset, line_offset, auto);

		result.should.eql({
			chunk_offset: 80, // last read byte was newline
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

		// We want to read line to the end
		object = {};
		result = automaton(object, tc(line), 81, 0, atom_auto);

		result.should.eql({
			chunk_offset: 81,
			line_offset: 0,
			signal: signal.INCOMPLETE_LINE
		});

		object.should.eql({
			rec: tc('A'),
		});

		done();
	});

	// In this test chunk length is greater than 81
	it('#a < b, sa, eb', function (done) {
		var object = {};
					012345678901234567890123456789012345678901234567890123456789012345678901234567890;
		var line = ' \nATOM  16596  N   GLN C 123       8.285  -2.726 -26.326  1.00 43.96           N  \nA';
		var chunk_offset = 2;
		var line_offset = 0; // next line byte to fetch
		var auto = atom_auto;

		var result = automaton(object, tc(line), chunk_offset, line_offset, auto);

		result.should.eql({
			chunk_offset: 82, // last read byte was newline
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

		// We want to read line to the end
		object = {};
		result = automaton(object, tc(line), 83, 0, atom_auto);

		result.should.eql({
			chunk_offset: 83,
			line_offset: 0,
			signal: signal.INCOMPLETE_LINE
		});

		object.should.eql({
			rec: tc('A'),
		});

		done();
	});

	it('#a < b, sa, ee', function (done) {
		var object = {};
					012345678901234567890123456789012345678901234567890123456789012345678901234567890;
		var line = ' \nATOM  16596  N   GLN C 123       8.285  -2.726 -26.326  1.00 43.96           N  \n';
		var chunk_offset = 2;
		var line_offset = 0; // next line byte to fetch
		var auto = atom_auto;

		var result = automaton(object, tc(line), chunk_offset, line_offset, auto);

		result.should.eql({
			chunk_offset: 82, // last read byte was newline
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

	it('#a < b, sa, ea', function (done) {
		var object = {};
					012345678901234567890123456789012345678901234567890123456789012345678901234567890;
		var line = ' \nATOM  16596  N   GLN C 123       8.285  -2.726 -26.326  1.00 43.96           N  ';
		var chunk_offset = 2;
		var line_offset = 0; // next line byte to fetch
		var auto = atom_auto;

		var result = automaton(object, tc(line), chunk_offset, line_offset, auto);

		result.should.eql({
			chunk_offset: 81,
			line_offset: 79,
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

		// New chunk comes in ...
		result = automaton(object, tc('\nAT'), 0, 80, atom_auto);

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

	// a > b tests

	it('#a > b, sb, eb', function (done) {
		var object = {rec: tc('A'), '_': tc('T')};
					012345678901234567890123456789012345678901234567890123456789012345678901234567890;
		var line = 'OM  16596  N   GLN C 123       8.285  -2.726 -26.326  1.00 43.96           N  \nA';
		var chunk_offset = 0;
		var line_offset = 2; // next line byte to fetch
		var auto = atom_auto;

		var result = automaton(object, tc(line), chunk_offset, line_offset, auto);

		result.should.eql({
			chunk_offset: 78,
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

		// We want to read chunk to the end
		object = {};
		result = automaton(object, tc(line), 79, 0, atom_auto);

		result.should.eql({
			chunk_offset: 79,
			line_offset: 0,
			signal: signal.INCOMPLETE_LINE
		});

		object.should.eql({
			rec: tc('A')
		});

		done();
	});
	it('#a > b, sb, eb ( copy )', function (done) {
		var object = {rec: tc('A'), '_': tc('T')};
					012345678901234567890123456789012345678901234567890123456789012345678901234567890;
		var line = 'OM  16596  N   GLN C 123       8.285  -2.726 -26.326  1.00 43.96           N  \n\n\n\nA';
		var chunk_offset = 0;
		var line_offset = 2; // next line byte to fetch
		var auto = atom_auto;

		var result = automaton(object, tc(line), chunk_offset, line_offset, auto);

		result.should.eql({
			chunk_offset: 81,
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

		// We want to read chunk to the end
		object = {};
		result = automaton(object, tc(line), 82, 0, atom_auto);

		result.should.eql({
			chunk_offset: 82,
			line_offset: 0,
			signal: signal.INCOMPLETE_LINE
		});

		object.should.eql({
			rec: tc('A')
		});

		done();
	});

	it('#a > b, sb, ee', function (done) {
		var object = {rec: tc('A'), '_': tc('T')};
					012345678901234567890123456789012345678901234567890123456789012345678901234567890;
		var line = 'OM  16596  N   GLN C 123       8.285  -2.726 -26.326  1.00 43.96           N  \n';
		var chunk_offset = 0;
		var line_offset = 2; // next line byte to fetch
		var auto = atom_auto;

		var result = automaton(object, tc(line), chunk_offset, line_offset, auto);

		result.should.eql({
			chunk_offset: 78,
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

	it('#a > b, sb, ea', function (done) {
		var object = {rec: tc('A'), '_': tc('T')};
					2345678901234567890123456789012345678901234567890123456789012345678901234567890;
		var line = 'OM  16596  N   GLN C 123       8.285  -2.726 -26.326  1.00 43.96           N  ';
		var chunk_offset = 0;
		var line_offset = 2; // next line byte to fetch
		var auto = atom_auto;

		var result = automaton(object, tc(line), chunk_offset, line_offset, auto);

		result.should.eql({
			chunk_offset: 77,
			line_offset: 79,
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

		// Next chunk comes in..
		result = automaton(object, tc('\nA'), 0, 80, atom_auto);

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

		// To the end..
		object = {};
		result = automaton(object, tc('\nA'), 1, 0, atom_auto);

		result.should.eql({
			chunk_offset: 1,
			line_offset: 0,
			signal: signal.INCOMPLETE_LINE
		});

		object.should.eql({
			rec: tc('A')
		});

		done();
	});

	it('#a > b, sb, ea', function (done) {
		var object = {};
					012345678901234567890123456789012345678901234567890123456789012345678901234567890;
		var line = 'ATOM  16596  N   GLN C 123       8.285  -2.726 -26.326  1.00 43.96           N ';
		var chunk_offset = 0;
		var line_offset = 0; // next line byte to fetch
		var auto = atom_auto;

		var result = automaton(object, tc(line), chunk_offset, line_offset, auto);

		result.should.eql({
			chunk_offset: 78,
			line_offset: 78,
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
			charge: tc(' ')
		});

		// Next chunk comes in..
		result = automaton(object, tc(' \n\n\nA'), 0, 79, atom_auto);

		result.should.eql({
			chunk_offset: 3,
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

	it('#a > b, sa, ea', function (done) {
		var object = {};
					012345678901234567890123456789012345678901234567890123456789012345678901234567890;
		var line = '  \nATOM  16596  N   GLN C 123       8.285  -2.726 -26.326  1.00 43.96          ';
		var chunk_offset = 3;
		var line_offset = 0; // next line byte to fetch
		var auto = atom_auto;

		var result = automaton(object, tc(line), chunk_offset, line_offset, auto);

		result.should.eql({
			chunk_offset: 78,
			line_offset: 75,
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
			temp_factor: tc(' 43.96')
		});

		// Next chunk comes in..
		result = automaton(object, tc(' N  \r\r\n\r\nA'), 0, 76, atom_auto);

		result.should.eql({
			chunk_offset: 8,
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

	// There are two obvious errors that can happen inside automaton processor
	// 1. Automaton array is broken and does not contain a mapping for an offset
	// 2. Chunk is broken and contains a character not belonging to a character class
	// described by automaton array at that offset

	it('#error1', function (done) {
		// Testing this error condition on the previous test, by breaking automaton array at offset 35,
		// and restoring it after test
	
		atom_auto[35] = null;

		try {
			var object = {};
						012345678901234567890123456789012345678901234567890123456789012345678901234567890;
			var line = '  \nATOM  16596  N   GLN C 123       8.285  -2.726 -26.326  1.00 43.96          ';
			var chunk_offset = 3;
			var line_offset = 0; // next line byte to fetch
			var auto = atom_auto;
			
			(function () {
				automaton(object, tc(line), chunk_offset, line_offset, auto);
			}).should.throw('State error: no value in automaton array in the middle of string: automaton name: atom, offset: 35!');
		} finally {
			atom_auto[35] = [union(classes.dec), 'x'];
		}

		done();
	});

	it('#error2', function (done) {
		// Testing this error condition on the previous test as well, by breaking a line and adding 'a' into the middle of x
		// and restoring it after test
		var object = {};
					012345678901234567890123456789012345678901234567890123456789012345678901234567890;
		var line = '  \nATOM  16596  N   GLN C 123       8A285  -2.726 -26.326  1.00 43.96          ';
		var chunk_offset = 3;
		var line_offset = 0; // next line byte to fetch
		var auto = atom_auto;
		
		var result = automaton(object, tc(line), chunk_offset, line_offset, auto);

		result.should.eql({
			signal: signal.WRONG
		});

		done();
	});
});