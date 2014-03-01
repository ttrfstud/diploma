var req         = require('http').request;
var read        = require('fs').createReadStream;
var atom_hetatm = require('./automata').atom_hetatm;
var model       = require('./automata').model;
var util        = require('./util');
var init_model  = require('./init_model');

function parser(id, model, callback) {
	this._id = id;

	this._model = init_model(model);
	this._cb = callback;

	this._atoms = [];
	this._hets = [];

	this._reader = new reader();

	this._reader.on('model', this.model_read.bind(this));
	this._reader.on('atom', this.atom_read.bind(this));
	this._reader.on('hetatm', this.atom_read.bind(this, this._atoms));
	this._reader.on('endmdl', this.model_ended.bind(this, this._hets));

	this.parse();
}

parser.prototype.model_read = function (model_record) {
	if (util.arrays_equal(this._model, model_record.model)) {
		this.inside_model = true;
	};
}

parser.prototype.atom_read = function (atoms, atom_record) {
	var atom = util.raw_atom_2_atom(atom_record);
	atoms.push(atom);
}

parser.prototype.model_ended = function () {
	if (this.inside_model) {
		if (!this.should_parse) {
			throw new Error('State error: should_parse is falsy while inside_model!');
		}
		this.inside_model = false;
		this.should_parse = false;

		this._cb({atoms : atoms, hets: hets});
	}
}

parser.prototype.parse = function () {
	var
		_this = this,
		res = read('file');

	res.on('readable', function () {
		while(null !== (chunk = res.read())) {
			if(_this.should_parse) {
				_this.reader.read_more(chunk);
			} else {
				return;
			}			
		}
	}
};

module.exports = function (id, model, callback) {
	new parser(id, model, callback);
}

new parser('2hrt', 123, function () {
	console.log(JSON.stringify(arguments));
});