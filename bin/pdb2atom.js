#!/usr/bin/env node

var compo = require('../src/compo/compo');
var jsstr = require('../src/jsstr/jsstr');
var req = require('../src/req/req');
var reader = require('../src/reader/reader');
var parser = require('../src/parser/parser');
var passer = require('stream').PassThrough;


function fail() {
	console.log('format: pdb2atom <PDB ID>[,model number];');
	process.exit(1);
}

if (process.argv.length !== 3) {
	fail();
}

var passer;

try {
	passer0 = new passer();
	(passer0).pipe(new compo).pipe(new jsstr).pipe(process.stdout);
	
	passer0.write(process.argv[2] + ';');
	passer0.end();
	// (new req('2hrt')).pipe(new reader({atom: 1, hetatm: 1, model: 1, endmdl: 1, conect: 1, master: 1})).pipe(new parser('2hrt')).pipe(new jsstr).pipe(process.stdout);
} catch (e) {
	console.log(e.stack);
	fail();
}
