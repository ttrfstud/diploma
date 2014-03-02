
var union   = require('../util').object_concat;
var classes = require('./classes');

module.exports = [
/* 1 */[union(classes.h), 'rec'], /* 'HETATM' */
/* 2 */[union(classes.e), '_'],
/* 3 */[union(classes.t), '_'],
/* 4 */[union(classes.a), '_'],
/* 5 */[union(classes.t), '_'],
/* 6 */[union(classes.m), '_'],
/* 7 */[union(classes.dec, classes.w), 'serial'], /* serial */
/* 8 */[union(classes.dec, classes.w), 'serial'], 
/* 9 */[union(classes.dec, classes.w), 'serial'],  
/*10 */[union(classes.dec, classes.w), 'serial'],  
/*11 */[union(classes.dec), 'serial'],  
/*12 */[union(classes.w), '_'], /* ws */
/*13 */[union(classes.an, classes.dec, classes.w), 'atom_name'], /* atom name */
/*14 */[union(classes.an, classes.dec), 'atom_name'],
/*15 */[union(classes.an, classes.dec, classes.w), 'atom_name'],
/*16 */[union(classes.an, classes.dec, classes.w), 'atom_name'],
/*17 */[union(classes.an, classes.w), 'alt_loc'], /* alt_loc */
/*18 */[union(classes.an, classes.w), 'residue_name'], /* residue_name */
/*19 */[union(classes.an, classes.w), 'residue_name'], 
/*20 */[union(classes.an), 'residue_name'], 
/*21 */[union(classes.w), '_'], 
/*22 */[union(classes.an, classes.w), 'chain_id'], /* chain_id */
/*23 */[union(classes.dec, classes.w), 'res_seq'], /* res_seq */
/*24 */[union(classes.dec, classes.w), 'res_seq'], 
/*25 */[union(classes.dec, classes.w), 'res_seq'], 
/*26 */[union(classes.dec, classes.w), 'res_seq'], 
/*27 */[union(classes.an, classes.w), 'i_code'], /* i_code */
/*28 */[union(classes.w), '_'], /* ws 28-30 */
/*29 */[union(classes.w), '_'],
/*30 */[union(classes.w), '_'],
/*31 */[union(classes.dec, classes.w, classes.minus), 'x'], /* x */
/*32 */[union(classes.dec, classes.w, classes.minus), 'x'],
/*33 */[union(classes.dec, classes.w, classes.minus), 'x'],
/*34 */[union(classes.dec), 'x'],
/*35 */[union(classes.dot), 'x'],
/*36 */[union(classes.dec), 'x'],
/*37 */[union(classes.dec), 'x'],
/*38 */[union(classes.dec), 'x'],
/*39 */[union(classes.dec, classes.w, classes.minus), 'y'], /* y */
/*40 */[union(classes.dec, classes.w, classes.minus), 'y'],
/*41 */[union(classes.dec, classes.w, classes.minus), 'y'],
/*42 */[union(classes.dec), 'y'],
/*43 */[union(classes.dot), 'y'],
/*44 */[union(classes.dec), 'y'],
/*45 */[union(classes.dec), 'y'],
/*46 */[union(classes.dec), 'y'],
/*47 */[union(classes.dec, classes.w, classes.minus), 'z'], /* z */
/*48 */[union(classes.dec, classes.w, classes.minus), 'z'],
/*49 */[union(classes.dec, classes.w, classes.minus), 'z'],
/*50 */[union(classes.dec), 'z'],
/*51 */[union(classes.dot), 'z'],
/*52 */[union(classes.dec), 'z'],
/*53 */[union(classes.dec), 'z'],
/*54 */[union(classes.dec), 'z'],
/*55 */[union(classes.dec, classes.w, classes.minus), 'occupancy'], /* occupancy */
/*56 */[union(classes.dec, classes.w, classes.minus), 'occupancy'],
/*57 */[union(classes.dec), 'occupancy'],
/*58 */[union(classes.dot), 'occupancy'],
/*59 */[union(classes.dec), 'occupancy'],
/*60 */[union(classes.dec), 'occupancy'],
/*61 */[union(classes.dec, classes.w, classes.minus), 'temp_factor'], /* temp_factor */
/*62 */[union(classes.dec, classes.w, classes.minus), 'temp_factor'],
/*63 */[union(classes.dec), 'temp_factor'],
/*64 */[union(classes.dot), 'temp_factor'],
/*65 */[union(classes.dec), 'temp_factor'],
/*66 */[union(classes.dec), 'temp_factor'],
/*67 */[union(classes.w), '_'], /* ws 67 - 76 */
/*68 */[union(classes.w), '_'], 
/*69 */[union(classes.w), '_'], 
/*70 */[union(classes.w), '_'], 
/*71 */[union(classes.w), '_'], 
/*72 */[union(classes.w), '_'], 
/*73 */[union(classes.w), '_'], 
/*74 */[union(classes.w), '_'], 
/*75 */[union(classes.w), '_'], 
/*76 */[union(classes.w), '_'], 
/*77 */[union(classes.an, classes.w), 'element'], /* element */
/*78 */[union(classes.an), 'element'],
/*79 */[union(classes.w, classes.plus, classes.minus, classes.dec), 'charge'], /* charge */
/*80 */[union(classes.w, classes.plus, classes.minus, classes.dec), 'charge']
 ];

 module.exports.name = 'hetatm';