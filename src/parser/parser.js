var assert = require('assert');
var Reader = require('./reader/reader');
var debuf  = require('./debuf');
var tstr   = require('stream').Transform;

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

function parser(id, model) {
  tstr.call(this, { objectMode: true });

  var _;

  _ = this;

  assert(id);

  _.id = id;

  if (model) {
    _.model = initm(model);
  } else {
    _.inside_model = true;
  }

  _.parse();
}

var p = parser.prototype;

p._transform = function (typ, e, fin) {
  var _;

  _ = this;

  if (_.model) {
    switch(typ.name) {
      case 'model':
        _.mdl(typ.buf, fin);
        break;
      case 'endmdl':
        _.emd(fin);
      break;
    }
  }

  switch(typ.name) {
    case 'conect':
    case 'master':
      _.emd(fin);
      break;
    case 'atom':
      _.atm(typ.buf, 0, fin);
      break;
    case 'hetatm':
      _.atm(typ.buf, 1, fin);
      break;
    default:
      fin();
      break;
  }
};

p.mdl = function (mbuf, fin) {
  var _;

  _ = this;

  if (meq(_.model, mbuf)) {
    _.inside_model = true;
  }

  fin();
};

p.emd = function (fin) {
  _.inside_model = false;
  fin();
};

p.atm = function (abuf, atyp, fin) {
  var _;

  _ = this;

  _.push({type: atyp ? 'atom' : 'het', loc: debuf(abuf) });
  fin();
};