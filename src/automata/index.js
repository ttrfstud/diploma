var assert                  = require('assert');

var tree                    = require('./automata_tree');
var signals                 = require('./signals');
var detauto     			= require('../util').detauto;
var automaton               = require('./automaton');

var debug					= require('../debug');

function reader () {
	this.linofs = 0;
	this.curauto = null;
	this.curobj = {};

	this.subs = {};

	this.detarr = null;

	this.chread = 0;
}

reader.prototype.on = function (type, sub) {
	this.subs[type] = sub;
};

reader.prototype.readmore = function (chunk) {
	var decision;
	var i;

	console.log('chread', this.chread);

	console.log('chunk0', chunk);

	console.log(this.linofs);
	for (i = 0; i < chunk.length; i++, this.linofs++) {
		if (!this.curauto && !this.detarr) {
			debug.addline();
			decision = detauto(tree, chunk, i, null);

			if (this.curauto = decision.auto) {
				this.linofs = 5;
				i += 5;
			} else {
				this.detarr = decision.darr;
				this.linofs = this.detarr.length;
				break;
			}
			continue;
		}

		if (this.detarr) {
			assert.equal(this.curauto, null);
			assert.equal(i, 0);

			decision = detauto(tree, chunk, i, this.detarr);

			if (decision.auto) {
				this.curauto = decision.auto;
				this.linofs = i = 5;
				this.detarr = null;
			} else {
				this.detarr = decision.darr;
				this.linofs = this.detarr.length;
				break;	
			}

			continue;
		}

		if (this.curauto) {
			assert.equal(this.detarr, null);

			decision = automaton(this.curobj, chunk, i, this.linofs, this.curauto);
			
			switch (decision.signal) {
				case signals.WRONG:
					throw 'Error in pdb!';
					break;
				case signals.INCOMPLETE_LINE:
					assert.equal(decision.chunk_offset + 1 < chunk.length, false);
					this.linofs = decision.line_offset;
					break;
				case signals.READ_LINE:
					this.linofs = -1;
					i = decision.chunk_offset;
					console.log(chunk.slice(i - 81, i).toString());
					if (this.subs[this.curauto.name]) {
						this.subs[this.curauto.name].call(null, this.curobj);
					}

					this.curobj = {};
					this.curauto = null;
					break;
				default:
					assert.equal(1, 0);
			}
		}
	}


	console.log('end', this.linofs);

	this.chread++;
	this.linofs++;
};	

reader.prototype.consider = function (decision) {

}

module.exports = reader;