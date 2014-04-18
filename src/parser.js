var assert      = require('assert');
var Reader      = require('./reader/reader');
var debuf       = require('./debuf');

var meq = function (a1, a2) {
  var i;
  var len1, len2;

  a2 = a2.slice(4, 8);

  len1 = a1.length;
  len2 = a2.length;

  if (len1 !== len2) {
    return false;
  }

  for (i = 0; i < len1; i++) {
    if (a1[i] !== a2[i]) {
      return false;
    }
  }

  return true;
};

var initm = function (mdl0) {
  var mdl;
  var dgt;

  if (mdl0 > 9999 || mdl0 < 0) {
    throw 1;
  }

  mdl = [];

  while(mdl0) {
    dgt = mdl0 % 10;
    mdl.unshift(dgt + 0x30);
    mdl0 = (mdl0 - dgt) / 10;
  }

  while(mdl.length !== 4) {
    mdl.unshift(0x20);
  }

  return mdl;
};

function parser(id, model, callback, req) {
  var _;

  _ = this;

  assert(id);
  assert(callback);
  assert(req);

  _.id = id;

  if (model) {
    _.model = initm(model);
  }

  _.cb = callback;
  _.req = req;

  _.atoms = [];
  _.hets = [];

  _.reader = new Reader();

  if (model) {
    _.reader.on('model', _.model_read.bind(_));
    _.reader.on('endmdl', _.model_ended.bind(_));
  } else {
    _.inside_model = true;

    _.reader.on('conect', _.model_ended.bind(_));
    _.reader.on('master', _.model_ended.bind(_));
  }

  _.reader.on('atom', _.atom_read.bind(_, _.atoms));
  _.reader.on('hetatm', _.atom_read.bind(_, _.hets));

  _.should_parse = true;
  _.parse();
}

parser.prototype.model_read = function (mbuf) {
  var _;

  _ = this;

  if (meq(_.model, mbuf)) {
    _.inside_model = true;
  };
}

parser.prototype.atom_read = function (atoms, abuf) {
  var _;
  var atom;

  _ = this;

  if (_.inside_model) {
    atom = debuf(abuf);
    atoms.push(atom);
  }
}

parser.prototype.model_ended = function () {
  var _;

  _ = this;

  if (_.inside_model) {
    assert(_.should_parse);
    
    _.inside_model = false;
    _.should_parse = false;

    _.cb({atoms : _.atoms, hets: _.hets});
  }
}

parser.prototype.parse = function () {
  var _;

  _ = this;

  res = _.req(_.id, _.model);

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

module.exports = function (id, model, callback, req) {
  new parser(id, model, callback, req);
}