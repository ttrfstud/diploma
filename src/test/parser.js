var parser = require('../parser');
var read = require('fs').createReadStream;
var write = require('fs').writeFileSync;
var should = require('should');

describe.skip('atom parser', function () { // float bias
  it('"two lines"', function (done) {
    parser('id', void 0, function (res) {
      res.should.eql({ 
        hets: [ 
         { x: 33.172, y: -21.829, z: -10.791 },
         { x: 32.8, y: -21.824, z: -12.941 },
         { x: 35.618, y: -19.473, z: -8.843 },
         { x: 36.608, y: -20.661, z: -10.411 },
         { x: 34.353, y: -16.736, z: -13.351 },
         { x: 32.775, y: -17.391, z: -12.001 } 
        ],
        atoms: [ 
         { x: -67.367, y: 37.777, z: -51.345 },
         { x: -69.186, y: 37.101, z: -50.206 },
         { x: -69.731, y: 38.456, z: -50.035 },
         { x: -69.731, y: 38.456, z: -50.035 },
         { x: -70.156, y: 38.819, z: -48.601 } 
        ]});

      done();
    }, function (id) {
      return read(__dirname + '/fixtures/two_lines.pdb');
    })
  });

  it('"two lines" with model', function (done) {
    parser('id', 1, function (res) {
      res.should.eql({
        hets:[
          {x: 33.172, y: -21.829, z: -10.791},
          {x: 32.8, y: -21.824, z: -12.941}],
        atoms: [
          {x: -69.731, y: 38.456, z: -50.035},
          {x:-70.156, y: 38.819, z: -48.601}]
        })

      done();
    }, function (id) {
      return read(__dirname + '/fixtures/two_lines.model.pdb');
    })
  });

  it('bigger one', function (done) {
    parser('id', void 0, function (res) {
      var tercount = 2;
      res.atoms.concat(res.hets).length.should.equal(16106 - tercount);

      done();
    }, function (id) {
      return read(__dirname + '/fixtures/2HRT_size1.pdb');
    })
  });

  it('2HRT', function (done) {
    parser('id', void 0, function (res) {
      var tercount = 6;
      res.atoms.concat(res.hets).length.should.equal(47104 - tercount);

      done();
    }, function (id) {
      return read(__dirname + '/fixtures/2HRT.pdb');
    })
  });
});