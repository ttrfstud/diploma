var tree                    = require('./automata_tree');
var signals                 = require('./signals');
var determine_automaton     = require('../util').determine_automaton;

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

	for (var i = 0; i < chunk.length; i++, line_offset++) {
		if (this.line_offset === 0) {
			if (this.current_auto) {
				throw new Error('State error: current automaton is not reset on the new line!');
			}

			decision = determine_automaton(chunk, i, null);

			if (decision.auto) {
				this.current_auto = decision.auto;
				this.determination_array = null;
				this.line_offset += 5;
				i += 5;
			} else {
				this.determination_array = decision.determination_array;
				this.line_offset = decision.determination_array.length + 1;
				break;
			}

			continue;
		}

		if (this.determination_array) {
			if (this.current_auto) {
				throw new Error('State error: Current automaton is set, while determination array is not empty!');
			}
			decision = determine_automaton(chunk, i, this.determination_array);

			if (decision.auto) {
				this.current_auto = auto;
				this.line_offset = 6 - this.determination_array.length - 1;
				i = 6 - this.determination_array.length - 1;
				this.determination_array = null;
			} else {
				this.line_offset = decision.determination_array.length - this.determination_array.length + 1;
				this.determination_array = decision.determination_array;
				break;	
			}

			continue;
		}

		if (this.current_auto) {
			if (this.determination_array) {
				throw new Error('State error: Determination array is not unset while current_auto is set!');
			}

			decision = automaton(this.current_object, chunk, i, this.line_offset, this.current_auto);
			
			switch (decision.signal) {
				case signals.WRONG:
					throw new Error('Reader is reporting an error in PDB file!');
					break;
				case signals.INCOMPLETE_LINE:
					if (decision.chunk_offset < chunk.length) {
						throw new Error('State error: INCOMPLETE_LINE signal returned while the chunk is now fully read');
					}

					this.line_offset = decision.line_offset;
					return;
				case signals.READ_LINE:
					this.line_offset = -1;
					i = decision.chunk_offset;
					if (this.listeners[this.current_auto.name]) {
						this.listeners[this.current_auto.name].apply(null, this.current_object);
					}
					this.current_object = null;
					this.current_auto = null;
					break;
				default:
					throw new Error('State error: Automaton returned unknown signal!');
			}
		}
	}
};