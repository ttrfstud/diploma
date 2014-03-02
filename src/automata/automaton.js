var signals = require('./signals');

module.exports = function automaton (object, chunk, chunk_offset, line_offset, auto) {
	// if it is a skip automaton, well, skip!
	if (!auto) {
		chunk_offset += 80 - line_offset;

		return {
			chunk_offset: i,
			signal: signal.READ_LINE
		};
	}

	for (var i = chunk_offset, i < chunk.length; i++, line_offset++) {
		if (!auto[line_offset]) {
			// there can only be one case when there is no value for the line_offset
			// in automaton array (auto) : when line_offset is greater than 80.
			// that means the line is read
			return {
				chunk_offset: i,
				signal: signal.READ_LINE
			};
		} else if (!auto[line_offset][0][chunk[i]]) {
			// as the previous check failed, we are in the middle of the line.
			// as this check passed, the char at chunk[i] is not compatible with the automaton array
			// this is an error
			return {
				signal: signal.WRONG
			}
		} else {
			// we are in the middle of the line and the property can be appended a value
			safe_prop_append(object, auto[line_offset][1], chunk[i]);
		}
	}

	return {
			line_offset: line_offset,
			chunk_offset: i, // for assertion
			signal: signal.INCOMPLETE_LINE
		};
}

function safe_prop_append(obj, prop, val) {
	if (!obj.prop) {
		obj.prop = [];
	}

	obj.prop.push(val);
}