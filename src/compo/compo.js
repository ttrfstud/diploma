var dstr   = require('stream').Duplex;
var req    = require('../req/req');
var reader = require('../reader/reader');
var parser = require('../parser/parser');
var jsstr = require('../jsstr/jsstr');
var util   = require('util');
util.inherits(compo, dstr);

function err(msg) {
	throw new Error;
}

function isnl(ch) {
  return ch === '\r' || ch === '\n';
}

function compo(uf) {
	var _;

	_ = this;

	dstr.call(_, { objectMode: true });

	_.buf = '';
  _.uf = uf;
}

var c = compo.prototype;

c._write = function (chunk, e, fin) {
	var _;
  var splt;

	_ = this;

  if (_.used) {
    return fin();
  }

	_.buf += chunk.toString('utf8');

  _.skipnl();

	if (_.buf.substr(-1) !== ';') {
		return fin();
	} else {
    _.buf = _.buf.substr(0, _.buf.length - 1);
  }

	// malicious user
	if (_.buf.length > 10) {
		return err();
	}

  splt = _.buf.split(',');

  if (!splt || splt.length > 2) {
    return err();
  }

  if (!splt[0].match(/[A-Za-z0-9]{4}/)) {
    return err();
  }

  if (splt[1]) {
    if (!splt[1].match(/[0-9]{1,4}/)) {
      return err();
    }
  }

  _.used = true;
  _.id = splt[0];
  _.mdl = splt[1];
  
  fin();
  _.init();
};

c._read = function () {
  var _;
  var obj;

  _ = this;


  if(!_.used) {
    return;
  }

  while ( obj = _.parser.read() ) {
    _.push(obj);
  }
};

c.init = function () {
  var _;

  _ = this;

  // pipe is: req | ungzip | reader | parser

  _.req = new req(_.id, _.uf);
  _.reader = new reader({atom: 1, hetatm: 1, model: 1, endmdl: 1, conect: 1, master: 1});
  _.parser = new parser(_.id, _.mdl);

  _.parser.on('end', function () {
    _.push(null);
  });  

  _.parser.on('readable', function () {
      // first read happens when jsstr is piped into compo
      // compo is supposed to return objects, but it did not have any objects then
      // so it did not push anything
      // that's why compo was left in "reading" state
      // now, if we want to give it a kick to read from the _.parser
      // we can't use _.read(0) because that function would return if the stream is _.readingState.reading (reading)
      // that's why we call _._read() which in this case will read the chunk from _.parser (causing _.parser to set _.parser._readableState.needReadable)
      // and when we _.push it will also reset itself from the "reading" state

      // it would probably be unsafe to call _._read() just for the second read and here is the reason
      // the consumer may be greedy and  call read() faster than parser has data
      // consider two cases:
      // 1. something is piped into compo. then we need to consider first read too.
      // when dest is piped into compo it has no data in buffers. two things are done:
      //  1. event handler to readable is attached. and needReadable is turned on
      //  2. flow is called. flow will try to suck all data from the compo. but compo has no data yet. so flow will declare that compo _.readableState.ranOut of data (while compo is left is reading state, it just did not return)
      //  3. now the flow has ended. if there is new data in compo, it would need to somehow notify dest about it.
      //  4. so compo is now "reading" and "ranOut" and "needReadable"
      //  5. new data comes into compo. it comes from parser and the flow should be continued
      //  6. to continue flow we need to emit 'readable', so pipeOnReadable gets called
      //  7. if we are last in pipe the flow would still need to be continued if there is end consumer in stream
      //  8. in that case the consumer will listen to 'readable' and then suck all data from readable.
      //  9. in either case we need to emit 'readable' event, no matter if end consumer or pipeOnReadable will suck data
      // 10. to emit 'readable' event, needReadable must be true.
      // 11. just by calling _.push we will fire 'readable'
      // 12. that will start flow which will read()! all the data (in this case, one object) in a loop
      // 13. all data read in loop would be fetched to jsstr (1 object). when it checks the state after fetching that object it finds that there is empty state and sets needReadable
      // 14. the last call to read() in a loop will return null and leave compo in "reading" state
      // 15. on the next data from _.parser 11. - 14. get repeated
      // TODO: this works because of node current internals only.
      _._read();
  });

  _.req.pipe(_.reader).pipe(_.parser);
};

c.skipnl = function () {
  var _;

  _ = this;

  if (_.buf) {
    while(isnl(_.buf.substr(-1))) {
      _.buf = _.buf.substr(0, _.buf.length - 1);
    }
  }
};

module.exports = compo;