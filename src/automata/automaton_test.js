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
	// a = b => sb, eb | se, ee | sa, ea
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
	// a < b => sb, eb | se, eb | sa, eb | sa, ee | sa, ea
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
	// a > b => sb, eb | sb, ee | sb, ea | se, ea | sa, ea

	// a = b here means: |a| = 80 & b = |81|
	// a < b here means: |a| = 79 & b = |81|
	// a > b here means: |a| = 80 & b = |80}
	it('#a = b, sb, eb', function (done) {
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
	
	it('#ce - se - eo - ne', function (done) {
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

	it('#cl - se - eo - ne', function (done) {
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
	// cm - sb - neo - ne
	// ce - sb - neo - ne
	// cl - sb - neo - ne

	// cm - sa - eo - ne
	// ce - sa - eo - ne
	// cl
	it('#cm - sb - neo - ne', function (done) {
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

});