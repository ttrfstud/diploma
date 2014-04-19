var _req = require('http').request;
var rstr = require('stream').Readable;

var options = {
  hostname: 'www.rcsb.org',
  port: 80,
  path: '/pdb/files/',
  method: 'GET',
  headers: {'Accept-Encoding': 'gzip;q=1.0, identity; q=0.5, *;q=0'}
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

function req(id) {
  var _;

  _ = this;

  assert(id);

  rstr.call(this);

  _.id = id;

  _.init();
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

  opts = copy(options);
  opts.path = opts.path + _.id + '.pdb';

  _req(opts, function (res) {
    _.src = res;

    _.src.on('end', function () {
      _.push(null);
    });

    // TODO why
    _.src.on('readable', function () {
      _.read(0);
    });
  });
};

r._read = function () {
  var _;
  var chunk;

  _ = this;

  if (!_.res) {
    return _.push('');
  }

  if (chunk = _.res.read()) {
    _.push(chunk);
  }
};