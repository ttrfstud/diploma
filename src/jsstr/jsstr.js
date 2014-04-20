var tstr = require('stream').Transform;
var util = require('util');
util.inherits(jsstr, tstr);

function tostr(obj) {
  return JSON.stringify(obj);
}

function jsstr() {
	var _;

	_ = this;

	tstr.call(_, { objectMode: true });

	_.push('[');
}

var j = jsstr.prototype;

j._transform = function (obj, e, fin) {
	var _;
	var json;
	var prfx;

	_ = this;

	if (!_.started) {
		prfx = '';
		_.started = true;
	}

	if (obj && !prfx) {
		prfx = ',';
	}

	if (obj) {
		json = tostr(obj);

		if (!_.started) {
			_.started = true;
		} else {
			json = ',' + json;
		}

		_.push(json);
	}
		
	fin();
};

j._flush = function (fin) {
	var _;

	_ = this;

	_.push(']\n');

  fin();
};

module.exports = jsstr;