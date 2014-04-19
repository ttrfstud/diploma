var dstr   = require('stream').Duplex;
var req    = require('../req/req');
var reader = require('../reader/reader');
var parser = require('../parser/parser');

function err() {
	var _;
  var e;

	_ = this;
  e = new Error();

	if (_._events && _._events['error']) {
		_.emit('error', e);
	} else {
    throw e;
  }
}

function compo() {
	var _;

	_ = this;

	tstr.call(_, { objectMode: true });

	_.buf = '';
}

var c = compo.prototype;

c._write = function (chunk, e, fin) {
	var _;
  var splt;

	_ = this;

  if (_.used) {
    return;
  }

	_.buf += chunk.toString(e);

	if (_.buf.length.substr(-1) !== ';') {
		return fin();
	}

	// malicious user
	if (_.buf.length > 10) {
		return err.call(_);
	}

  splt = _.buf.split(',');

  if (!splt || splt.length > 2) {
    return _err.call(_);
  }

  if (!splt[0].match(/[A-Za-z0-9]{4}/)) {
    return _err.call(_);
  }

  if (splt[1] && !splt[1].match(/[0-9]{1,4}/)) {
    return _err.call(_);
  }

  _.used = true;
  _.id = splt[0];
  _.mdl = splt[1];

  fin();
};

c._read = function () {
  var _;
  var obj;

  _ = this;

  if (!_.used) {
    return _.push('');
  }

  if ( obj = _.parse.read() ) {
    _.push(obj);
  } else {
    _.push('');
  }
};

c._init = function () {
  var _;

  _ = this;

  // pipe is: req | ungzip | reader | parser
  _.req = new req(_.id);
  _.read = new reader();
  _.parse = new parser(_.id, _.mdl);

  _.req.pipe(_.read).pipe(_.parse).on('readable', function () {
    _.read(0);
  });
}

