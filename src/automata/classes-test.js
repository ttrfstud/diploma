var classes = require('./classes');
var should = require('should');

describe('classes', function () {
	function num_own_properties(obj) {
		var len = 0;
		for (i in obj) if (obj.hasOwnProperty(i)) {
			len++;
		}

		return len;
	}

	function in_class(class_name) {
		return {only: function (members) {
			for (var i = 0; i < members.length; i++) {
				classes[class_name].should.have.ownProperty(members[i].charCodeAt(0));
				classes[class_name][members[i].charCodeAt(0)].should.equal(1);
			}

			var own_properties_len = num_own_properties(classes[class_name]);

			own_properties_len.should.equal(members.length);
		}};
	}

	function number_of_classes_is(expected_amount) {
		num_own_properties(classes).should.equal(expected_amount);
	}

	it('#exhaustive test', function (done) {
		in_class('a').only(['A']);
		in_class('t').only(['T']);
		in_class('o').only(['O']);
		in_class('m').only(['M']);
		in_class('d').only(['D']);
		in_class('e').only(['E']);
		in_class('l').only(['L']);
		in_class('h').only(['H']);
		in_class('dec').only(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']);
		in_class('an').only(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']);
		in_class('w').only([' ']);
		in_class('dot').only(['.']);
		in_class('plus').only(['+']);
		in_class('minus').only(['-']);
		in_class('nl').only(['\r', '\n']);
		in_class('apostrophe').only(['\'']);
		in_class('n').only(['N']);

		number_of_classes_is(17);

		done();
	});
});