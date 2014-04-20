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
}

var j = jsstr.prototype;

j._transform = function (obj, e, fin) {
	var _;
	var json;

	_ = this;

	if (obj) {
		json = tostr(obj);
		if (!_.started) {
			_.push('[' + json);
			_.started = true;
		} else {
			_.push(',' + json);
		}
	}
  console.log(obj);

	fin();
};

j._flush = function (fin) {
	var _;

	_ = this;

	_.push(']\n');

  fin();
};

module.exports = jsstr;