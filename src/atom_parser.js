var req         = require('http').request;
var read        = require('fs').createReadStream;
var util        = require('./util');
var reader      = require('./automata');
var exists      = require('fs').existsSync;

function parser(id, model, callback, options) {
	this._id = id;

	this._options = options;

	if (model) {
		this._model = util.init_model(model);
	}

	this._cb = callback;

	this._atoms = [];
	this._hets = [];

	this._reader = new reader();

	if (model) {
		this._reader.on('model', this.model_read.bind(this));
		this._reader.on('endmdl', this.model_ended.bind(this));
	} else {
		this.inside_model = true;
	}

	this._reader.on('conect', this.model_ended.bind(this));
	this._reader.on('master', this.model_ended.bind(this));

	this.should_parse = true;

	this._reader.on('atom', this.atom_read.bind(this, this._atoms));
	this._reader.on('hetatm', this.atom_read.bind(this, this._hets));

	this.parse();
}

parser.prototype.model_read = function (model_record) {
	if (util.arrays_equal(this._model, model_record.model)) {
		this.inside_model = true;
	};
}

parser.prototype.atom_read = function (atoms, atom_record) {
	console.log('atom!');
	var atom = util.raw_atom_2_atom(atom_record);
	atoms.push(atom);
}

parser.prototype.model_ended = function () {
	console.log('model ended!');
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
		_this = this;


	if (this._options && this._options.file) {
		console.log('Parsing file', this._id, '...');
		res = read('atom_parser-test.' + this._id);
	}

	res.on('readable', function () {
		while(null !== (chunk = res.read())) {
			console.log('chunk!');
			if(_this.should_parse) {
				_this._reader.readmore(chunk);
			} else {
				return;
			}			
		}
	});
};

module.exports = function (id, model, callback, options) {
	new parser(id, model, callback, options);
}