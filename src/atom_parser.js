var req         = require('http').request;
var read        = require('fs').createReadStream;
var assert      = require('assert');
var util        = require('./util');
var Reader      = require('./automata');
var exists      = require('fs').existsSync;

function parser(id, model, callback, options) {
  assert(id);
  assert(callback);

  this.id = id;

  if (model) {
    this.model = util.init_model(model);
  }

  this.cb = callback;
  this.options = options;

  this.atoms = [];
  this.hets = [];

  this.reader = new Reader();

  if (model) {
    this.reader.on('model', this.model_read.bind(this));
    this.reader.on('endmdl', this.model_ended.bind(this));
  } else {
    this.inside_model = true;
  }

  this.reader.on('conect', this.model_ended.bind(this));
  this.reader.on('master', this.model_ended.bind(this));

  this.should_parse = true;

  this.reader.on('atom', this.atom_read.bind(this, this.atoms));
  this.reader.on('hetatm', this.atom_read.bind(this, this.hets));

  this.parse();
}

parser.prototype.model_read = function (model_record) {
  if (util.arrays_equal(this.model, model_record.model)) {
    this.inside_model = true;
  };
}

parser.prototype.atom_read = function (atoms, atom_record) {
  var atom = util.raw_atom_2_atom(atom_record);
  atoms.push(atom);
}

parser.prototype.model_ended = function () {
  if (this.inside_model) {
    assert(this.should_parse);
    
    this.inside_model = false;
    this.should_parse = false;

    this.cb({atoms : this.atoms, hets: this.hets});
  }
}

parser.prototype.parse = function () {
  var _;

  _ = this;

  if (this.options && this.options.file) {
    console.log('Parsing file', this.id, '...');
    res = read('atom_parser-test.' + this.id);
  } else {
    // do request
  }

  res.on('readable', function () {
    while(null !== (chunk = res.read())) {
      if(_.should_parse) {
        _.reader.read(chunk);
      } else {
        return;
      }     
    }
  });
};

module.exports = function (id, model, callback, options) {
  new parser(id, model, callback, options);
}