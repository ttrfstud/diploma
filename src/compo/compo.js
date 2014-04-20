var dstr   = require('stream').Duplex;
var req    = require('../req/req');
var reader = require('../reader/reader');
var parser = require('../parser/parser');
var jsstr = require('../jsstr/jsstr');
var util   = require('util');
util.inherits(compo, dstr);

function err(msg) {
	throw new Error;
}

function isnl(ch) {
  return ch === '\r' || ch === '\n';
}

function compo(uf) {
	var _;

	_ = this;

	dstr.call(_, { objectMode: false });

	_.buf = '';
  _.uf = uf;
}

var c = compo.prototype;

c._write = function (chunk, e, fin) {
	var _;
  var splt;

	_ = this;

  if (_.used) {
    return fin();
  }

	_.buf += chunk.toString('utf8');

  _.skipnl();

	if (_.buf.substr(-1) !== ';') {
		return fin();
	} else {
    _.buf = _.buf.substr(0, _.buf.length - 1);
  }

	// malicious user
	if (_.buf.length > 10) {
		return err();
	}

  splt = _.buf.split(',');

  if (!splt || splt.length > 2) {
    return err();
  }

  if (!splt[0].match(/[A-Za-z0-9]{4}/)) {
    return err();
  }

  if (splt[1]) {
    if (!splt[1].match(/[0-9]{1,4}/)) {
      return err();
    }
  }

  _.used = true;
  _.id = splt[0];
  _.mdl = splt[1];
  
  fin();
  _.init();
};

c._read = function () {
  var _;
  var obj;

  _ = this;

  if(!_.used) {
    return _.push('');
  }

  if ( obj = _.parser.read() ) {
    return _.push(JSON.stringify(obj));
  } else {
    _.push('');
  }
};

c.init = function () {
  var _;

  _ = this;

  // pipe is: req | ungzip | reader | parser

  _.req = new req(_.id, _.uf);
  _.reader = new reader({atom: 1, hetatm: 1, model: 1, endmdl: 1, conect: 1, master: 1});
  _.parser = new parser(_.id, _.mdl);

  _.parser.on('end', function () {
    _.push(null);
  });  

  _.parser.on('readable', function () {
    _.read(0);
  });

  _.req.pipe(_.reader).pipe(_.parser);
};

c.skipnl = function () {
  var _;

  _ = this;

  if (_.buf) {
    while(isnl(_.buf.substr(-1))) {
      _.buf = _.buf.substr(0, _.buf.length - 1);
    }
  }
};

module.exports = compo;