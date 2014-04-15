module.exports = {
	a: {
		0x41 : 1
	},
	t: {
		0x54 : 1
	},
	o: {
		0x4f : 1
	},
	m: {
		0x4d : 1
	},
	d: {
		0x44: 1
	},
	e: {
		0x45 : 1
	},
	l: {
		0x4c: 1
	},
	h: {
		0x48: 1
	},
	n: {
		0x4e: 1
	},
	c: {
		0x43: 1
	},
	s: {
		0x53: 1
	},
	r: {
		0x52: 1
	},
	dec: {},
	an: {},
	w: {
		0x20 : 1
	},
	dot: {
		0x2e : 1
	},
	plus: {
		0x2b : 1
	},
	minus: {
		0x2d : 1
	},
	nl: {
		0x0a : 1, 
		0x0d : 1
	},
	apostrophe: {
		0x27: 1
	},
	whatever: {}
};

var i;

for (i = 0; i < 256; i++) {
	module.exports.whatever[i] = 1;
}

for (i = 0x41; i < 0x5b; i++) {
	module.exports.an[i] = 1;
}

for (i = 0x30; i < 0x3a; i++) {
	module.exports.dec[i] = 1;
}