var tstr = require('stream').Transform;
var util = require('util');
util.inherits(jsstr, tstr);

function jsstr() {
	var _;

	_ = this;

	tstr.call(_, { objectMode: true });
}

var j = jsstr.prototype;

j._transform = function (obj, e, fin) {
	var _;

	_ = this;

	_.push(JSON.stringify(obj) + '\n');

	fin();
};