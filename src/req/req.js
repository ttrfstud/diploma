var assert = require('assert');
var _req   = require('http').request;
var rstr   = require('stream').Readable;
var util   = require('util');
util.inherits(req, rstr);

var options = {
  hostname: 'www.rcsb.org',
  port: 80,
  path: '/pdb/files/',
  method: 'GET',
  // headers: {'Accept-Encoding': 'gzip;q=1.0, identity; q=0.5, *;q=0'}
};

var copy = function (o) {
  var res;
  var key;

  res = {};

  for (key in o) if (o.hasOwnProperty(key)) {
    res[key] = o[key];
  }

  return res;
}

function req(id, uf) {
  var _;

  _ = this;

  assert(id);

  rstr.call(this);

  _.id = id;

  if (uf) {
    _.uf = uf;
    _.bytecount = 0;
  }
};

var r = req.prototype;

r.init = function () {
  // req is a readable stream, but it reads from the www.rcsb.org database
  // in other words, it reads from another readable stream
  // this readable stream it reads from is a response to request to www.rcsb.org
  // to get a response from the request, so time should be wasted, to reach for the server, to initialize response on the server, to gzip the contents, to reach back
  // this is an io operation, therefore it is async
  // while there is still no response, there is no source to read from
  // here we initialize a request to www.rcsb.org and will assign to a req.src field when the response is available

  var _;
  var opts;
  var req;

  _ = this;

  opts = copy(options);
  opts.path = opts.path + _.id + '.pdb';

  req = _req(opts, function (res) {
    _.src = res;

    if (res.statusCode !== 200) {
      // anything else but 200 is ignored
      _.ignore = true;
    }

    _.src.on('end', function () {
      _.push(null);
    });

    // TODO why
    _.src.on('readable', function () {
      _.read(0);
    });
  });

  req.end();
};

r._read = function () {
  var _;
  var chunk;

  _ = this;

  if (!_.src) {
    if (!_.initd) {
      _.initd = true;
      _.init();
    }
    return _.push('');
  }

  if (chunk = _.src.read()) {
    if (_.uf) {
      _.bytecount += chunk.length;
      console.log('Downloaded ', _.bytecount, 'bytes ...');
    }
    _.push(_.ignore? '' : chunk);
  } else {
    _.push('');
  }
};

module.exports = req;