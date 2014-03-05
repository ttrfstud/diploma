var tree                    = require('./automata_tree');
var signals                 = require('./signals');
var determine_automaton     = require('../util').determine_automaton;
var automaton               = require('./automaton');

function reader () {
	this.line_offset = 0;
	this.current_auto = null;
	this.current_object = {};

	this.listeners = {};

	this.determination_array = null;
}

reader.prototype.on = function (record, listener) {
	this.listeners[record] = listener;
};

reader.prototype.read_more = function (chunk) {
	var decision;

	// console.log('Reading new chunk');
	// console.log('Chunk length is', this.line_offset,  chunk.length, chunk.slice(0, chunk.length).toString());
	// console.log('Fresh chunk starting with', String.fromCharCode(chunk[0]) === ' ' ? 'whitespace' : String.fromCharCode(chunk[0]));

	for (var i = 0; i < chunk.length; i++, this.line_offset++) {
		// console.log('line offset at start', this.line_offset);
		// console.log('chunk offset at start', i);
		if (this.line_offset === 0) {
			if (this.current_auto) {
				throw new Error('State error: current automaton is not reset on the new line!');
			}

			try {
				decision = determine_automaton(tree, chunk, i, null);
} catch (e) {
	console.log('chunk ofs', i);
	console.log('line ofs', this.line_offset);
	// console.log('tree', JSON.stringify(tree, null, ''));
	throw e;
}
			if (decision.auto) {
				this.current_auto = decision.auto;
				this.determination_array = null;
				this.line_offset += 5;
				i += 5;
			} else {
				// console.log('Incomplete chunk, recording det_array', decision.determination_array.length, 'bytes');
				this.determination_array = decision.determination_array;
				this.line_offset += decision.determination_array.length;
				break;
			}

			continue;
		}

		if (this.determination_array) {
			if (this.current_auto) {
				throw new Error('State error: Current automaton is set, while determination array is not empty!');
			}

			// console.log('Was incomplete array');
			// console.log('Trying to determine automaton');
			decision = determine_automaton(tree, chunk, i, this.determination_array);

			if (decision.auto) {
				// console.log('Automaton determined:', decision.auto.name);
				this.current_auto = decision.auto;
				this.line_offset += 6 - this.determination_array.length - 1;
				i += 6 - this.determination_array.length - 1;
				this.determination_array = null;
			} else {
				this.line_offset += decision.determination_array.length - this.determination_array.length + 1;
				this.determination_array = decision.determination_array;
				break;	
			}

			continue;
		}

		if (this.current_auto) {
			if (this.determination_array) {
				throw new Error('State error: Determination array is not unset while current_auto is set!');
			}

			// console.log('Passing chunk to automaton with line offset and chunk offset', this.line_offset, i);
			decision = automaton(this.current_object, chunk, i, this.line_offset, this.current_auto);
			
			switch (decision.signal) {
				case signals.WRONG:
					throw new Error('Reader is reporting an error in PDB file!');
					break;
				case signals.INCOMPLETE_LINE:
					if (decision.chunk_offset < chunk.length) {
						throw new Error('State error: INCOMPLETE_LINE signal returned while the chunk is not fully read');
					}

					this.line_offset = decision.line_offset;
					return;
				case signals.READ_LINE:
					this.line_offset = -1;
					i = decision.chunk_offset;
					// console.log
					// console.log('I', i, 'decision', JSON.stringify(decision));
					// console.log('Line offset after decision', this.line_offset);
					if (this.listeners[this.current_auto.name]) {
						this.listeners[this.current_auto.name].apply(null, [this.current_object]);
					}
					this.current_object = {};
					this.current_auto = null;
					break;
				default:
					throw new Error('State error: Automaton returned unknown signal!');
			}
		}
	}

	// console.log('Chunk is fully read');
	console.log(this.line_offset);
};	

module.exports = reader;