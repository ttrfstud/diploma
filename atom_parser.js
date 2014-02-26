var req = require('http').request;
var read = require('fs').createReadStream;
var a = [0x65];
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

var MODEL_AUTOMATON = [
[m, '_'],
[o, '_'],
[d, '_'],
[e, '_'],
[l, '_'],
[w, '_'],
[w, '_'],
[w, '_'],
[w, '_'],
[w, '_'],
[dec, 'model'],
[dec, 'model'],
[dec, 'model'],
[dec, 'model']
];

var AUTOMATON = [
[a.concat(h), 'rec'], /* 'ATOM  ' */
[t.concat(e), '_'],
[o.concat(t), '_'],
[m.concat(a), '_'],
[w.concat(t), '_'],
[w.concat(m), '_'],
[dec, 'serial'], /* serial */
[dec, 'serial'], 
[dec, 'serial'],  
[dec, 'serial'],  
[w, '_'], /* ws */
[an.concat(w), 'atom_name'], /* atom name */
[an, 'atom_name'],
[an.concat(w), 'atom_name'],
[an.concat(w), 'atom_name'],
[an, 'alt_loc'], /* alt_loc */
[an, 'residue_name'], /* residue_name */
[an, 'residue_name'], 
[an, 'residue_name'], 
[an, 'chain_id'], /* chain_id */
[dec.concat(w), 'res_seq'], /* res_seq */
[dec.concat(w), 'res_seq'], 
[dec.concat(w), 'res_seq'], 
[dec.concat(w), 'res_seq'], 
[an, 'i_code'], /* i_code */
[w, '_'], /* ws 28-30 */
[w, '_'],
[w, '_'],
[dec.concat(dot), 'x'], /* x */
[dec.concat(dot), 'x'],
[dec.concat(dot), 'x'],
[dec.concat(dot), 'x'],
[dec.concat(dot), 'x'],
[dec.concat(dot), 'x'],
[dec.concat(dot), 'x'],
[dec.concat(dot), 'x'],
[w, '_'],
[dec.concat(dot), 'y'], /* y */
[dec.concat(dot), 'y'],
[dec.concat(dot), 'y'],
[dec.concat(dot), 'y'],
[dec.concat(dot), 'y'],
[dec.concat(dot), 'y'],
[dec.concat(dot), 'y'],
[dec.concat(dot), 'y'],
[w, '_'],
[dec.concat(dot), 'z'], /* z */
[dec.concat(dot), 'z'],
[dec.concat(dot), 'z'],
[dec.concat(dot), 'z'],
[dec.concat(dot), 'z'],
[dec.concat(dot), 'z'],
[dec.concat(dot), 'z'],
[dec.concat(dot), 'z'],
[w, '_'],
[dec.concat(dot), 'occupancy'], /* occupancy */
[dec.concat(dot), 'occupancy'],
[dec.concat(dot), 'occupancy'],
[dec.concat(dot), 'occupancy'],
[dec.concat(dot), 'occupancy'],
[dec.concat(dot), 'occupancy'],
[w, '_'],
[dec.concat(dot), 'temp_factor'], /* temp_factor */
[dec.concat(dot), 'temp_factor'],
[dec.concat(dot), 'temp_factor'],
[dec.concat(dot), 'temp_factor'],
[dec.concat(dot), 'temp_factor'],
[dec.concat(dot), 'temp_factor'],
[w, '_'], /* ws 67 - 76 */
[w, '_'], 
[w, '_'], 
[w, '_'], 
[w, '_'], 
[w, '_'], 
[w, '_'], 
[w, '_'], 
[w, '_'], 
[w, '_'], 
[an.concat(w), 'element'], /* element */
[an.concat(w), 'element'],
[w.concat(plus_minus).concat(dec), 'charge'], /* charge */
[w.concat(plus_minus).concat(dec), 'charge']
 ];

function parser(id, model, callback) {
	this._id = id;
	this._model = model;
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

			while(null !== (chunk = res.read())) {
				var i = 0;
				if (_this._hunt) {
					console.log('huntin');
					for (; i < chunk.length; i++) {
						console.log(i);
						var ch = chunk[i];
						if (MODEL_AUTOMATON[_this._hunt_ofs][0].indexOf(ch) > -1) {

							if (!_this._hunt_cur[MODEL_AUTOMATON[_this.hunt_ofs][1]]) {
								_this._hunt_cur[MODEL_AUTOMATON[_this.hunt_ofs][1]] = [];
							}
							_this._hunt_cur[MODEL_AUTOMATON[_this.hunt_ofs][1]].push(ch);
							_this._hunt_ofs++;
						} else if (_this._hunt_ofs === 14) {
							var mdl = _this._hunt_cur.model;
							if (_this._model === mdl.map(String.fromCharCode).join('')) {
								_this._hunt = false;
								_this._hunt_cur = null;
								_this._hunt_ofs = 0;
								_this._messenger = true;
							}
						} else {
							_this._hunt_cur = null;
							_this._hunt_ofs = 0;
						}
					}
				} else if (_this._messenger) {
					while (chunk[i] === w[0]) {
						i++;
					}

					_this._eat = true;
					_this._messenger = false;
				} else if (_this._eat) {
					for (; i < chunk.length; i++) {
							var ch = chunk[i];
							if (AUTOMATON[_this._ofs].indexOf(ch) > -1) {
								if (!_this._cur[AUTOMATON[_this._ofs][1]]) {
									_this._cur[AUTOMATON[_this._ofs][1]] = [];
								}
								_this._cur[AUTOMATON[_this._ofs][1]].push(ch);
								_this._ofs++;
							} else if (_this._ofs === 80) {
								_this._ofs = 0;
								if (_this._cur) {
									if (_this._cur[0] === 0x65) {
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
	console.log(arguments);
});