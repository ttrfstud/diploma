var req = require('http').request;
var read = require('fs').createReadStream;
var a = [0x41];
var t = [0x54];
var o = [0x4f];
var m = [0x4d];
var d = [0x44];
var e = [0x45];
var l = [0x4c];
var h = [0x48];
var dec = [0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x40];
var an = [0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x50, 0x51, 0x52, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5a];
var w = [0x20];
var dot = [0x2e];
var plus_minus = [0x2b, 0x2d];
var nl = [0x0a, 0x0d];

var AUTO2 = [
/* 1 */[m, '_'],
/* 2 */[o, '_'],
/* 3 */[d, '_'],
/* 4 */[e, '_'],
/* 5 */[l, '_'],
/* 6 */[w, '_'],
/* 7 */[w, '_'],
/* 8 */[w, '_'],
/* 9 */[w, '_'],
/*10 */[w, '_'],
/*11 */[dec.concat(w), 'model'],
/*12 */[dec.concat(w), 'model'],
/*13 */[dec.concat(w), 'model'],
/*14 */[dec, 'model'],
];

var AUTO1 = [
/* 1 */[a.concat(h), 'rec'], /* 'ATOM  ' */
/* 2 */[t.concat(e), '_'],
/* 3 */[o.concat(t), '_'],
/* 4 */[m.concat(a), '_'],
/* 5 */[w.concat(t), '_'],
/* 6 */[w.concat(m), '_'],
/* 7 */[dec.concat(w), 'serial'], /* serial */
/* 8 */[dec.concat(w), 'serial'], 
/* 9 */[dec.concat(w), 'serial'],  
/*10 */[dec.concat(w), 'serial'],  
/*11 */[dec, 'serial'],  
/*12 */[w, '_'], /* ws */
/*13 */[an.concat(dec).concat(w), 'atom_name'], /* atom name */
/*14 */[an.concat(dec), 'atom_name'],
/*15 */[an.concat(dec).concat(w), 'atom_name'],
/*16 */[an.concat(dec).concat(w), 'atom_name'],
/*17 */[an.concat(w), 'alt_loc'], /* alt_loc */
/*18 */[an.concat(w), 'residue_name'], /* residue_name */
/*19 */[an.concat(w), 'residue_name'], 
/*20 */[an, 'residue_name'], 
/*21 */[w, '_'], 
/*22 */[an.concat(w), 'chain_id'], /* chain_id */
/*23 */[dec.concat(w), 'res_seq'], /* res_seq */
/*24 */[dec.concat(w), 'res_seq'], 
/*25 */[dec.concat(w), 'res_seq'], 
/*26 */[dec.concat(w), 'res_seq'], 
/*27 */[an.concat(w), 'i_code'], /* i_code */
/*28 */[w, '_'], /* ws 28-30 */
/*29 */[w, '_'],
/*30 */[w, '_'],
/*31 */[dec.concat(w), 'x'], /* x */
/*32 */[dec.concat(w), 'x'],
/*33 */[dec.concat(w), 'x'],
/*34 */[dec, 'x'],
/*35 */[dot, 'x'],
/*36 */[dec, 'x'],
/*37 */[dec, 'x'],
/*38 */[dec, 'x'],
/*39 */[dec.concat(w), 'y'], /* y */
/*40 */[dec.concat(w), 'y'],
/*41 */[dec.concat(w), 'y'],
/*42 */[dec, 'y'],
/*43 */[dot, 'y'],
/*44 */[dec, 'y'],
/*45 */[dec, 'y'],
/*46 */[dec, 'y'],
/*47 */[dec.concat(w), 'z'], /* z */
/*48 */[dec.concat(w), 'z'],
/*49 */[dec.concat(w), 'z'],
/*50 */[dec.concat(dot), 'z'],
/*51 */[dot, 'z'],
/*52 */[dec, 'z'],
/*53 */[dec, 'z'],
/*54 */[dec, 'z'],
/*55 */[dec.concat(w), 'occupancy'], /* occupancy */
/*56 */[dec.concat(w), 'occupancy'],
/*57 */[dec.concat(dot), 'occupancy'],
/*58 */[dot, 'occupancy'],
/*59 */[dec, 'occupancy'],
/*60 */[dec, 'occupancy'],
/*61 */[dec.concat(w), 'temp_factor'], /* temp_factor */
/*62 */[dec.concat(w), 'temp_factor'],
/*63 */[dec, 'temp_factor'],
/*64 */[dot, 'temp_factor'],
/*65 */[dec, 'temp_factor'],
/*66 */[dec, 'temp_factor'],
/*67 */[w, '_'], /* ws 67 - 76 */
/*68 */[w, '_'], 
/*69 */[w, '_'], 
/*70 */[w, '_'], 
/*71 */[w, '_'], 
/*72 */[w, '_'], 
/*73 */[w, '_'], 
/*74 */[w, '_'], 
/*75 */[w, '_'], 
/*76 */[w, '_'], 
/*77 */[an.concat(w), 'element'], /* element */
/*78 */[an, 'element'],
/*79 */[w.concat(plus_minus).concat(dec), 'charge'], /* charge */
/*80 */[w.concat(plus_minus).concat(dec), 'charge']
 ];

function parser(id, model, callback) {
	this._id = id;

	this._model = init_model(model);

	console.log(this._model);
	this._cb = callback;
	this._hunt = true;
	this._hunt_ofs = 0;
	this._hunt_cur = null;
	this._eat = false;
	this._ofs = 0;
	this._cur = null;
	this._messenger = false;

	this._atoms = [];
	this._hets = [];

	this.parse();
}

function init_model(model) {
	var _model = [];
	model = (model).toString();
	for (var i = 0; i < model.length; i++) {
		_model[i] = model.charCodeAt(i);
	}

	while(_model.length !== 4) {
		_model.unshift(0x20);
	}

	return _model;
}

parser.prototype.parse = function () {
	var options = {
		hostname: 'www.rcsb.org',
		port: 80,
		path: '/pdb/files/' + this._id + '.pdb',
		method: 'GET'
	};

	var _this = this;
	var res = read('file');
	// req(options, function (res) {
		// res.on('readable', function () {
			res.on('readable', function () {
			var chunk;
			console.log('parsing chunk');
			while(null !== (chunk = res.read())) {
				var i = 0;
				for (; i < chunk.length; i++)
					if (_this._hunt) {
						for (; i < chunk.length; i++) {
							var ch = chunk[i];
							console.log('in hunt state', '[', i, ']', String.fromCharCode(ch));

							if (AUTO2[_this._hunt_ofs] && AUTO2[_this._hunt_ofs][0].indexOf(ch) > -1) {
								console.log(' hunt state: spotted AUTO conincidence');
								if (!_this._hunt_cur) {
									_this._hunt_cur = {};
								}

								console.log(' hunt state: AUTO property:', AUTO2[_this._hunt_ofs][1]);
								if (!_this._hunt_cur[AUTO2[_this._hunt_ofs][1]]) {
									_this._hunt_cur[AUTO2[_this._hunt_ofs][1]] = [];
								}
								_this._hunt_cur[AUTO2[_this._hunt_ofs][1]].push(ch);
								_this._hunt_ofs++;
								console.log(' hunt state:', 'current collection: ', JSON.stringify(_this._hunt_cur));
								console.log(' hunt state: ', 'offset', _this._hunt_ofs);
							} else if (_this._hunt_ofs === 14) {
								var mdl = _this._hunt_cur.model;
								if (utils.arraysEqual(_this._model, mdl)) {
									console.log('arrays are equal');
									_this._hunt = false;
									_this._messenger = true;
									_this._hunt_cur = null;
									_this._hunt_ofs = 0;
									console.log('messenger mode', _this._messenger);
									break;
								} else {
									_this._hunt_cur = null;
									_this._hunt_ofs = 0;
								}
							} else {
								_this._hunt_cur = null;
								_this._hunt_ofs = 0;
							}
						}
					} else if (_this._messenger) {
						while (chunk[i] === w[0] || chunk[i] === nl[0] || chunk[i] === nl[1]) {
							console.log('in messenger mode', '[', i, ']');
							i++;
						}

						_this._eat = true;
						_this._messenger = false;
						i--;
					} else if (_this._eat) {
						for (; i < chunk.length; i++) {
							var ch = chunk[i];
							console.log('in eat mode [', i, '] character', _this._ofs + 1, ch, String.fromCharCode(ch));
								if (AUTO1[_this._ofs] && AUTO1[_this._ofs][0].indexOf(ch) > -1) {
									if (!_this._cur) {
										_this._cur = {};
									}

									if (!_this._cur[AUTO1[_this._ofs][1]]) {
										_this._cur[AUTO1[_this._ofs][1]] = [];
									}
									_this._cur[AUTO1[_this._ofs][1]].push(ch);
									_this._ofs++;
								} else if (_this._ofs === 80) {
									_this._ofs = 0;

									while (chunk[i] === w[0] || chunk[i] === nl[0] || chunk[i] === nl[1]) {
										console.log('in eat mode, skipping', '[', i, ']');
										i++;
									}

									i--;
									if (_this._cur) {
										console.log('hi', _this._cur.rec);
										if (_this._cur.rec[0] === 0x41) {
											_this._atoms.push(_this._cur);
										} else {
											_this._hets.push(_this._cur);
										}

										_this._cur = null;
										_this._ofs = 0;
									}
								} else {
									_this._ofs = 0;
									_this._cur = null;
									_this._eat = false;
									if (_this._atoms.length || _this._hets.length) {
										_this._cb(false, _this._atoms, _this._hets);
										return;
									} else {
										_this._cb(true, null, null);
										return;
									}								
								}
							}
						} else {

					}
			}
		});
	// }).end();
};

module.exports = function (id, model, callback) {
	new parser(id, model, callback);
}

// var str = read('file');

// str.on('readable', function () {
// 	var chunk;

// 	while (null !== (chunk = str.read())) {
// 		console.log(chunk);
// 	}
// });

new parser('2hrt', 123, function () {
	console.log(JSON.stringify(arguments));
});

var utils = {};

utils.arraysEqual = function (a1, a2) {
	console.log('checking arrays for equality');
	console.log(a1, 'length', a1.length);
	console.log(a2, 'length', a2.length);
	if (a1.length !== a2.length) {
		return false;
	}

	console.log('length test passed');

	for (var i = 0; i < a1.length; i++) {
		if (a1[i] !== a2[i]) {
			return false;
		}
	}

	return true;
}

function cha(ch) {
	return String.fromCharCode(ch);
}
