var tstr = require('stream').Transform;

function ca() {
  var _;

  _ = this;

  tstr.call(_, { objectMode: true });
}

var c = ca.prototype;

c._transform = function (typ, e, fin) {
  var _;

  _ = this;

  if (typ.name !== 'atom') {
    _.push(typ);
    return fin();
  } else {
    if (typ.buf[13] === 67 && typ.buf[14] === 65) {
      _.push(typ);
    }
  }

  fin();
}

module.exports = ca;