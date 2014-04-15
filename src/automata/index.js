var assert                  = require('assert');

var tree                    = require('./automata_tree');


var isnl = function (c) {
  return c === 10 || c === 13;
}


function reader () {
  this.subs = [];
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

  while(_.chnk.length) {
    if (!_.arr && !_.auto) { // new line; needs 6 bytes to determine what line it is on
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

      try {
        _.run();
      } catch (e) {
        throw 1;
      }
      
      if (_.auto) {
        break;
      } else {
        if (_.subs[_.auto.name]) {
          _.subs[_.auto.name].call(null, _.obj);
        }

        _.buf = null;
      }
    }
  }
};  

r.det = function () {
  var _, i, isarr;

  _ = this;

  isarr = Array.isArray;
  _.arr = _.arr || tree;

  while (_.chnk.length && _.arr && !isarr(_.arr)) {
    _.arr = _.arr[_.chnk[0]];
    _.chnk = _.chnk.slice(1);
  }

  if (isarr(_.arr)) {
    _.arr = null;
    _.auto = _.arr;
  }
};

// 6 first chars can be skipped
r.run = function () {
  var _, isarr, cc, ac;

  _ = this;

  while (1) {
    _.getch();

   if (!_.cc) {
    return;
   }

   if (!_.ac) {
    break;
   }

   if (!_.ac[_.cc]) {
    throw 1; // error
   }

   _.buf.push[_.cc];
  }

  _.skipnl();
};

r.getch = function () {
  var _;

  _ = this;

  _.cc = _.chnk[0];
  _.ac = _.auto[0];

  _.chnk = _.chnk.slice(1);
  _.arr = _.arr.slice(1);
};

r.ungetch = function () {
  var _;

  _ = this;

  _.chnk = Buffer.concat([new Buffer(_.cc), _.chnk]);
}

r.skipnl = function () {
  var _;

  _ = this;

  while (isnl(_.chnk[0])) {
    _.chnk = _.chnk.slice(1);
  }

  _.ungetch();
};

module.exports = reader;