var http = require('http');
var Emitter = require('events').EventEmitter;

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

module.exports = function (id) {
	var emitter;
	var opts = copy(options);

	emitter = new Emitter();
	opts.path = opts.path + id + '.pdb';

	console.log(opts);

	var options = {
  hostname: 'www.google.com',
  path: '/',
  method: 'GET'
};

var req = http.request(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
});

	return emitter;
};