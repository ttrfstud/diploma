var automata_tree = require('./automata_tree');
var should = require('should');

describe('automata_tree', function () {
	var tc = function (string) {
		var arr = [];

		for (var i = 0; i < string.length; i++) {
			arr.push(string.charCodeAt(i));
		}

		return arr;
	};

	var allowed = function allowed (word, tree) {
		word = tc(word);
		var walk_len = 0;
		var i = 0;
		while(tree = tree[word[i++]]) { walk_len++; };
		walk_len.should.equal(6);
	};

	it('#exhaustive test, allowed', function (done) {
		allowed('HEADER', automata_tree);
		allowed('HET   ', automata_tree);
		allowed('HETNAM', automata_tree);
		allowed('HETSYN', automata_tree);
		allowed('HETATM', automata_tree);
		allowed('HELIX ', automata_tree);
		allowed('OBSLTE', automata_tree);
		allowed('ORIGX1', automata_tree);
		allowed('ORIGX2', automata_tree);
		allowed('ORIGX3', automata_tree);
		allowed('TITLE ', automata_tree);
		allowed('TER   ', automata_tree);
		allowed('SPLIT ', automata_tree);
		allowed('SPRSDE', automata_tree);
		allowed('SOURCE', automata_tree);
		allowed('SEQADV', automata_tree);
		allowed('SSBOND', automata_tree);
		allowed('SCALE1', automata_tree);
		allowed('SCALE2', automata_tree);
		allowed('SCALE3', automata_tree);
		allowed('CAVEAT', automata_tree);
		allowed('COMPND', automata_tree);
		allowed('CONECT', automata_tree);
		allowed('CISPEP', automata_tree);
		allowed('CRYST1', automata_tree);
		allowed('KEYWDS', automata_tree);
		allowed('EXPDTA', automata_tree);
		allowed('ENDMDL', automata_tree);
		allowed('END   ', automata_tree);
		allowed('NUMMDL', automata_tree);
		allowed('MDLTYP', automata_tree);
		allowed('MODRES', automata_tree);
		allowed('MTRIX1', automata_tree);
		allowed('MTRIX2', automata_tree);
		allowed('MTRIX3', automata_tree);
		allowed('MODEL ', automata_tree);
		allowed('MASTER', automata_tree);
		allowed('AUTHOR', automata_tree);
		allowed('ATOM  ', automata_tree);
		allowed('ANISOU', automata_tree);
		allowed('REVDAT', automata_tree);
		allowed('REMARK', automata_tree);
		allowed('JRNL  ', automata_tree);
		allowed('DBREF ', automata_tree);
		allowed('FORMUL', automata_tree);
		allowed('LINK  ', automata_tree);

		done();
	});

	it('#actual automata', function (done) {
		var tree = automata_tree;

		tree[0x41][0x54][0x4f][0x4d][0x20][0x20].should.be.instanceof(Array);
		tree[0x41][0x54][0x4f][0x4d][0x20][0x20].length.should.not.equal(0);
		tree[0x48][0x45][0x54][0x41][0x54][0x4d].should.be.instanceof(Array);
		tree[0x48][0x45][0x54][0x41][0x54][0x4d].length.should.not.equal(0);
		tree[0x4d][0x4f][0x44][0x45][0x4c][0x20].should.be.instanceof(Array);
		tree[0x4d][0x4f][0x44][0x45][0x4c][0x20].length.should.not.equal(0);
		tree[0x45][0x4e][0x44][0x4d][0x44][0x4c].should.be.instanceof(Array);
		tree[0x45][0x4e][0x44][0x4d][0x44][0x4c].length.should.not.equal(0);

		done();																	
	})
});