var classes = require('./classes');

module.exports = [
/* 1 */[classes.a.concat(classes.h), 'rec'], /* 'ATOM  ' */
/* 2 */[classes.t.concat(classes.e), '_'],
/* 3 */[classes.o.concat(classes.t), '_'],
/* 4 */[classes.m.concat(classes.a), '_'],
/* 5 */[classes.w.concat(classes.t), '_'],
/* 6 */[classes.w.concat(classes.m), '_'],
/* 7 */[classes.dec.concat(classes.w), 'serial'], /* serial */
/* 8 */[classes.dec.concat(classes.w), 'serial'], 
/* 9 */[classes.dec.concat(classes.w), 'serial'],  
/*10 */[classes.dec.concat(classes.w), 'serial'],  
/*11 */[classes.dec, 'serial'],  
/*12 */[classes.w, '_'], /* ws */
/*13 */[classes.an.concat(classes.dec).concat(classes.w), 'atom_name'], /* atom name */
/*14 */[classes.an.concat(classes.dec), 'atom_name'],
/*15 */[classes.an.concat(classes.dec).concat(classes.w), 'atom_name'],
/*16 */[classes.an.concat(classes.dec).concat(classes.w), 'atom_name'],
/*17 */[classes.an.concat(classes.w), 'alt_loc'], /* alt_loc */
/*18 */[classes.an.concat(classes.w), 'residue_name'], /* residue_name */
/*19 */[classes.an.concat(classes.w), 'residue_name'], 
/*20 */[classes.an, 'residue_name'], 
/*21 */[classes.w, '_'], 
/*22 */[classes.an.concat(classes.w), 'chain_id'], /* chain_id */
/*23 */[classes.dec.concat(classes.w), 'res_seq'], /* res_seq */
/*24 */[classes.dec.concat(classes.w), 'res_seq'], 
/*25 */[classes.dec.concat(classes.w), 'res_seq'], 
/*26 */[classes.dec.concat(classes.w), 'res_seq'], 
/*27 */[classes.an.concat(classes.w), 'i_code'], /* i_code */
/*28 */[classes.w, '_'], /* ws 28-30 */
/*29 */[classes.w, '_'],
/*30 */[classes.w, '_'],
/*31 */[classes.dec.concat(classes.w), 'x'], /* x */
/*32 */[classes.dec.concat(classes.w), 'x'],
/*33 */[classes.dec.concat(classes.w), 'x'],
/*34 */[classes.dec, 'x'],
/*35 */[classes.dot, 'x'],
/*36 */[classes.dec, 'x'],
/*37 */[classes.dec, 'x'],
/*38 */[classes.dec, 'x'],
/*39 */[classes.dec.concat(classes.w), 'y'], /* y */
/*40 */[classes.dec.concat(classes.w), 'y'],
/*41 */[classes.dec.concat(classes.w), 'y'],
/*42 */[classes.dec, 'y'],
/*43 */[classes.dot, 'y'],
/*44 */[classes.dec, 'y'],
/*45 */[classes.dec, 'y'],
/*46 */[classes.dec, 'y'],
/*47 */[classes.dec.concat(classes.w), 'z'], /* z */
/*48 */[classes.dec.concat(classes.w), 'z'],
/*49 */[classes.dec.concat(classes.w), 'z'],
/*50 */[classes.dec.concat(classes.dot), 'z'],
/*51 */[classes.dot, 'z'],
/*52 */[classes.dec, 'z'],
/*53 */[classes.dec, 'z'],
/*54 */[classes.dec, 'z'],
/*55 */[classes.dec.concat(classes.w), 'occupancy'], /* occupancy */
/*56 */[classes.dec.concat(classes.w), 'occupancy'],
/*57 */[classes.dec.concat(classes.dot), 'occupancy'],
/*58 */[classes.dot, 'occupancy'],
/*59 */[classes.dec, 'occupancy'],
/*60 */[classes.dec, 'occupancy'],
/*61 */[classes.dec.concat(classes.w), 'temp_factor'], /* temp_factor */
/*62 */[classes.dec.concat(classes.w), 'temp_factor'],
/*63 */[classes.dec, 'temp_factor'],
/*64 */[classes.dot, 'temp_factor'],
/*65 */[classes.dec, 'temp_factor'],
/*66 */[classes.dec, 'temp_factor'],
/*67 */[classes.w, '_'], /* ws 67 - 76 */
/*68 */[classes.w, '_'], 
/*69 */[classes.w, '_'], 
/*70 */[classes.w, '_'], 
/*71 */[classes.w, '_'], 
/*72 */[classes.w, '_'], 
/*73 */[classes.w, '_'], 
/*74 */[classes.w, '_'], 
/*75 */[classes.w, '_'], 
/*76 */[classes.w, '_'], 
/*77 */[classes.an.concat(classes.w), 'element'], /* element */
/*78 */[classes.an, 'element'],
/*79 */[classes.w.concat(classes.plus_minus).concat(classes.dec), 'charge'], /* charge */
/*80 */[classes.w.concat(classes.plus_minus).concat(classes.dec), 'charge']
 ];