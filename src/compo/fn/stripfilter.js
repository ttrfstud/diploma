function stripfilter(str) {
  var _;
  var match;

  _ = this;

  match = /(\-f\:(.+?)\s)/mi.exec(str);

  if (!match) { // no filters found
    return str;
  }

  _.filters.push(match[2]);
  str = str.replace(match[1], '');

  return str;
}

module.exports = stripfilter;