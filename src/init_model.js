module.exports = function init_model(model) {
	var _model = [];

	while(model) {
		var digit = model % 10;
		_model.unshift(digit + 0x30);
		model = (model - digit) / 10;
	}

	while(_model.length !== 4) {
		_model.unshift(0x20);
	}

	return _model;
}