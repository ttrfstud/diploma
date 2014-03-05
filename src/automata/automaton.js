var signal           = require('./signals');
var safe_prop_append = require('../util').safe_prop_append;

module.exports = function automaton (object, chunk, chunk_offset, line_offset, auto) {
	// if it is a skip automaton, well, skip!
	// TODO: write a test!
	// Not so fast and what if the chunk is incomplete
	if (Array.isArray(auto) && auto.length === 0) {
		// console.log('read', chunk.slice(chunk_offset, chunk_offset + 80 + 1 - line_offset).toString());
		
		if (chunk.length >= chunk_offset + 80 - line_offset) {
			chunk_offset += 79 - line_offset; // we are on the last meaningful symbol of the line

			while (chunk[chunk_offset + 1] === 13 || chunk[chunk_offset + 1] === 10) {
				chunk_offset++;
			}

			// This is efing tricky. We need to do -1 to chunk_offset because we are now on the first non NL.
			// But look we iterated one byte AHEAD!	

			return {
				chunk_offset: chunk_offset,
				signal: signal.READ_LINE
			};
		} else {
			line_offset += chunk.length - 1 - chunk_offset;
			chunk_offset = chunk.length - 1; // + skipped new line

			return {
				chunk_offset: chunk_offset,
				line_offset: line_offset,
				signal: signal.INCOMPLETE_LINE
			};
		}
		
	}

	for (var i = chunk_offset; i < chunk.length; i++, line_offset++) {
		if (!auto[line_offset]) {
			// there can only be one case when there is no value for the line_offset
			// in automaton array (auto) : when line_offset is greater than 80.
			// that means the line is read
			if (line_offset < 80) { // 80 because zero-based offset
				throw new Error('State error: no value in automaton array in the middle of string: automaton name: ' + auto.name + ', offset: ' + line_offset + '!');
			}
			// console.log('read atom', chunk.slice(i - 80, i).toString());

			var last_read = chunk[i];
			var last_read_new_line = last_read === 10 || last_read === 13;
			console.log('\t Last read symbol in automaton was', last_read_new_line ? 'nl' : last_read);
			while(chunk[i] && (chunk[i] === 13 || chunk[i] === 10)) {
				i++;
			}

			i--; // because we were on the first non NL symbol (unread yet!)

			return {
				chunk_offset: i,
				signal: signal.READ_LINE
			};
		} else if (!auto[line_offset][0][chunk[i]]) {
			// as the previous check failed, we are in the middle of the line.
			// as this check passed, the char at chunk[i] is not compatible with the automaton array
			// this is an error
			console.log('Log: chunk is broken at:', i, ' actual char is:', String.fromCharCode(chunk[i]), ', automaton name:', auto.name, ', line offset:', line_offset);
			return {
				signal: signal.WRONG
			}
		} else {
			// console.log('\tAppending to property via', auto.name);
			// we are in the middle of the line and the property can be appended a value
			safe_prop_append(object, auto[line_offset][1], chunk[i]);
		}
	}

	return {
			line_offset: line_offset - 1,
			chunk_offset: i - 1, // for assertion
			signal: signal.INCOMPLETE_LINE
		};
}

