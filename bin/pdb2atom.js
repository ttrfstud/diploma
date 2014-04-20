#!/usr/bin/env node

var compo = require('../src/compo/compo');
var idstr = require('../src/idstr/idstr');
var jsstr = require('../src/jsstr/jsstr');
var req = require('../src/req/req');
var reader = require('../src/reader/reader');
var parser = require('../src/parser/parser');


function fail() {
	console.log('format: pdb2atom <PDB ID>[,model number];');
	process.exit(1);
}

if (process.argv.length !== 3) {
	fail();
}

try {
	(new idstr(process.argv[2])).pipe(new compo).pipe(process.stdout);
	// (new req('2hrt')).pipe(new reader({atom: 1, hetatm: 1, model: 1, endmdl: 1, conect: 1, master: 1})).pipe(new parser('2hrt')).pipe(new jsstr).pipe(process.stdout);
} catch (e) {
	console.log(e.stack);
	fail();
}
