var assert  = require('assert');
var tree    = require('./tree');

var isnl = function (c) {
  return c === 10 || c === 13;
}


function reader () {
  this.subs = [];
  this.tree = tree;
}

var r = reader.prototype;

r.on = function (type, sub) {
  this.subs[type] = sub;
};

r.read = function (chunk) {
  var res;
  var _;
  var bytesread;

  _ = this;
  
  _.chnk = chunk;

  while(_.chnk && _.chnk.length) {
    if (!_.arr && !_.auto) { // new line
      _.det();

      if (_.arr) {
        break;
      }
    }

    if (_.arr) {
      assert.equal(_.auto, null);

      _.det();

      if (_.arr) {
        break;
      }
    }

    if (_.auto) {
      assert.equal(_.arr, null);
      _.buf = _.buf || [];
      _.name = _.auto.name;
      
      _.run();
      
      if (_.auto) {
        break;
      } else {
        if (_.subs[_.name]) {
          _.subs[_.name].call(null, _.buf);
        }

        _.name = null;
        _.buf = null;
      }
    }
  }

  _.chnk = null;
};  

r.det = function () {
  var _, i, isarr;

  _ = this;

  isarr = Array.isArray;
  _.arr = _.arr || _.tree;

  while (_.chnk.length && !isarr(_.arr)) {
    _.arr = _.arr[_.chnk[0]];
    _.chnk = _.chnk.slice(1);

    if (!_.arr) {
      throw 1;
    }
  }

  if (isarr(_.arr)) {
    _.auto = _.arr;
    _.arr = null;
  }

  _.clear();
};

r.run = function () {
  var _, isarr, cc, ac;

  _ = this;

  while (1) {
    _.getch();

   if (!_.cc || !_.ac) {
    _.ungetch();
    break;
   }

   if (!_.ac[_.cc]) {
    throw 1; // error
   }

   _.buf.push(_.cc);
  }

  _.skipnl();
  _.clear();
};

r.ungetch = function () {
  var _, tmp;

  _ = this;
  tmp = [];

  if (_.ac) {
    _.auto = [_.ac].concat(_.auto);
    _.ac = void 0;
  }

  if (_.cc) {
    tmp.push(_.cc);
    _.chnk = Buffer.concat([new Buffer(tmp), _.chnk], 1 + _.chnk.length);
    _.cc = void 0;
  }
};

r.getch = function () {
  var _;

  _ = this;

  _.cc = _.chnk[0];
  _.ac = _.auto[0];

  _.chnk = _.chnk.slice(1);
  _.auto = _.auto.slice(1);
};

r.skipnl = function () {
  var _;

  _ = this;

  while (isnl(_.chnk[0])) {
    _.chnk = _.chnk.slice(1);
  }
};

r.clear = function () {
  var _;

  _ = this;

  if (_.auto && !_.auto.length) {
    _.auto = null;
  }
};

module.exports = reader;