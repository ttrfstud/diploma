var reader = require('./index');
var should = require('should');
var skip   = require('./skip');

describe('reader', function () {
	var tc = function (string) {
		var arr = [];

		for (var i = 0; i < string.length; i++) {
			arr.push(string.charCodeAt(i));
		}

		return arr;
	};

	describe('life cycle of skip chunk', function () {
		it('#fresh reader, first chunk (incomplete)', function (done) {
			var reader0 = new reader();

			var chunk = tc('TITLE');
			reader0.read_more(chunk);

			// Checking state
			should.not.exist(reader0.current_auto);
			reader0.line_offset.should.equal(5); // last read byte + increment for the next iteration + failed loop check
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
			reader0.line_offset.should.equal(6); // last read byte + increment + no more iterations
			reader0.current_auto.should.eql(skip);
			reader0.current_object.should.eql({});

			done();
		});


		it('#fresh reader, first chunk (incomplete 3, but automaton and a piece of line)', function (done) {
			var reader0 = new reader();

			var chunk = tc('TITLE blahblah');
			reader0.read_more(chunk);

			// Checking state
			// as title is skip automaton it should have immediately returned that it "read" the string
			should.not.exist(reader0.determination_array);
			reader0.line_offset.should.equal(0);
			should.not.exist(reader0.current_auto);
			reader0.current_object.should.eql({});

			done();
		});
	});

	it('#fresh reader, first chunk (incomplete), with next chunk', function (done) {
		var reader0 = new reader();

		var chunk = tc('TITLE');
		reader0.read_more(chunk);

		chunk = tc(' 78901234567890123456789012345678901234567890123456789012345678901234567890\n');
		
		var reader_called = false;
		
		reader0.on('skip', function (object) {
			object.should.eql({});
			reader_called = true;
		});

		reader0.read_more(chunk);

		var timeout;
		var interval = setInterval(function () {
			if (reader_called) {
				clearInterval(interval);
				timeout = setTimeout(function () {
					reader0.line_offset.should.equal(0);
					done();
				}, 100);
			}
		})
	});


	it('#fresh reader, first chunk (incomplete), with next chunk and the start of third chunk', function (done) {
		var reader0 = new reader();

		var chunk = tc('TITLE');
		reader0.read_more(chunk);

		chunk = tc(' 78901234567890123456789012345678901234567890123456789012345678901234567890\n');
		reader0.read_more(chunk);

		chunk = tc("ATOM");

		reader0.read_more(chunk);

		should.not.exist(reader0.automaton);
		reader0.determination_array.should.eql(tc('ATOM'));
		reader0.line_offset.should.equal(4); // last read byte + increment for the next iteration + failed loop check
		reader0.current_object.should.eql({});

		done();
	});


	it('#fresh reader, first chunk (incomplete), with next chunk and the start of third chunk and the fourth chunk is a complete atom', function (done) {
		var reader0 = new reader();

		var chunk = tc('TITLE');
		reader0.read_more(chunk);

		chunk = tc(' 78901234567890123456789012345678901234567890123456789012345678901234567890\n');
		
		var reader_called = false;
		
		reader0.on('atom', function (object) {
			object.should.eql({});
			reader_called = true;
		});

		reader0.read_more(chunk);

		chunk = tc("ATOM");

		reader0.read_more(chunk);

		chunk = tc('  24201  N   LEU D  92     -63.514  81.703 -35.081  1.00 54.82           N  \n')

		var atom_read = false;
		reader0.on('atom', function (obj) {
			obj.should.eql({
			_: tc('               '),
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
		}); atom_read = true;});

		var timeout;
		var interval = setInterval(function () {
			if (atom_read) {
				setTimeout(function () {
					reader0.line_offset.should.equal(0);
					done();
				}, 100);

				clearInterval(interval);
			}
		});

		reader0.read_more(chunk);

	});


	it('#fresh reader, first chunk (incomplete), with next chunk and the start of third chunk and the fourth chunk is a complete atom', function (done) {
		var reader0 = new reader();

		var chunk = tc('TITLE');
		reader0.read_more(chunk);

		chunk = tc(' 78901234567890123456789012345678901234567890123456789012345678901234567890\n');
		
		reader0.read_more(chunk);

		chunk = tc("ATOM");

		reader0.read_more(chunk);

		chunk = tc('  24201  N   LEU D  92     -63.514  81.703 -35.081  1.00 54.82           N  \nH');

		reader0.read_more(chunk);

		chunk = tc('ETATM47053  CAC FLC B1058      33.445 -21.436 -11.942  1.00 32.83           C  \n');

		var hetatm_read = false;
		reader0.on('hetatm', function (obj) {
			console.log('hi');
			obj.should.eql({
				_: tc('               '),
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
			});

			hetatm_read = true;
		});

		reader0.read_more(chunk);

		var timeout;
		var interval = setInterval(function () {
			if (hetatm_read) {
				setTimeout(function () {
					reader0.line_offset.should.equal(0);
					done();
				}, 100);

				clearInterval(interval);
			}
		});
	});


});