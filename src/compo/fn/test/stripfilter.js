var test = require('taptap');
var assert = require('assert');
var stripfilter = require('../stripfilter');

test(function (done) { /* no filters in string */
  var ths = { filters: [] };
  var line = 'something  f: -f f:';

  var res = stripfilter.call(ths, line);

  assert.equal(res, line);
  assert.equal(ths.filters.length, 0);

  done();
});

test(function (done) { /* one filter */
  var ths = { filters: [] };
  var line = 'something  f: -f f:a -f:aa ';

  var res = stripfilter.call(ths, line);

  assert.equal(res, 'something  f: -f f:a ');
  assert.equal(ths.filters.length, 1);
  assert.equal(ths.filters[0], 'aa');

  done();
});

test(function (done) { /* multiple filters, only the first one would be stript */
  var ths = { filters: [] };
  var line = 'something  f: -f f:a -f:aa -f:ab ';

  var res = stripfilter.call(ths, line);

  assert.equal(res, 'something  f: -f f:a -f:ab ');
  assert.equal(ths.filters.length, 1);
  assert.equal(ths.filters[0], 'aa');

  done();
});

test(function (done) { /* multiple filters, repetitive executions */
  var ths = { filters: [] };
  var line = 'something  f: -f f:a -f:aa -f:ab ';

  var res = stripfilter.call(ths, line);
  res = stripfilter.call(ths, res);

  assert.equal(res, 'something  f: -f f:a ');
  assert.equal(ths.filters.length, 2);
  assert.equal(ths.filters[0], 'aa');
  assert.equal(ths.filters[1], 'ab');

  done();
});