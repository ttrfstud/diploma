var assert  = require('assert');
var rstream = require('stream').Readable;
var util    = require('util');
util.inherits(idstr, rstream);

function idstr (id) {
	var _;

	_ = this;

	assert(id);

	rstream.call(this);

	_.id = id;
}

var i = idstr.prototype;

i._read = function () {
	var _;

	_ = this;

	if (!_.called) {
		_.push(_.id + ';');
		_.called = true;
	} else {
		_.push(null);
	}
};

module.exports = idstr;