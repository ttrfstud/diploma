
var union   = require('./union');
var classes = require('./classes');

module.exports = [
/* 7 */union(classes.dec, classes.w), /* serial */
/* 8 */union(classes.dec, classes.w), 
/* 9 */union(classes.dec, classes.w),  
/*10 */union(classes.dec, classes.w),  
/*11 */classes.dec,  
/*12 */classes.w, /* ws */
/*13 */union(classes.an, classes.dec, classes.apostrophe, classes.w), /* atom name */
/*14 */union(classes.an, classes.dec, classes.apostrophe),
/*15 */union(classes.an, classes.dec, classes.apostrophe, classes.w),
/*16 */union(classes.an, classes.dec, classes.apostrophe, classes.w),
/*17 */union(classes.an, classes.w), /* alt_loc */
/*18 */union(classes.an, classes.w), /* residue_name */
/*19 */union(classes.an, classes.w), 
/*20 */classes.an, 
/*21 */classes.w, 
/*22 */union(classes.an, classes.w), /* chain_id */
/*23 */union(classes.dec, classes.w), /* res_seq */
/*24 */union(classes.dec, classes.w), 
/*25 */union(classes.dec, classes.w), 
/*26 */union(classes.dec, classes.w), 
/*27 */union(classes.an, classes.w), /* i_code */
/*28 */classes.w, /* ws 28-30 */
/*29 */classes.w,
/*30 */classes.w,
/*31 */union(classes.dec, classes.w, classes.minus), /* x */
/*32 */union(classes.dec, classes.w, classes.minus),
/*33 */union(classes.dec, classes.w, classes.minus),
/*34 */classes.dec,
/*35 */classes.dot,
/*36 */classes.dec,
/*37 */classes.dec,
/*38 */classes.dec,
/*39 */union(classes.dec, classes.w, classes.minus), /* y */
/*40 */union(classes.dec, classes.w, classes.minus),
/*41 */union(classes.dec, classes.w, classes.minus),
/*42 */classes.dec,
/*43 */classes.dot,
/*44 */classes.dec,
/*45 */classes.dec,
/*46 */classes.dec,
/*47 */union(classes.dec, classes.w, classes.minus), /* z */
/*48 */union(classes.dec, classes.w, classes.minus),
/*49 */union(classes.dec, classes.w, classes.minus),
/*50 */classes.dec,
/*51 */classes.dot,
/*52 */classes.dec,
/*53 */classes.dec,
/*54 */classes.dec,
/*55 */union(classes.dec, classes.w, classes.minus), /* occupancy */
/*56 */union(classes.dec, classes.w, classes.minus),
/*57 */classes.dec,
/*58 */classes.dot,
/*59 */classes.dec,
/*60 */classes.dec,
/*61 */union(classes.dec, classes.w, classes.minus), /* temp_factor */
/*62 */union(classes.dec, classes.w, classes.minus),
/*63 */classes.dec,
/*64 */classes.dot,
/*65 */classes.dec,
/*66 */classes.dec,
/*67 */classes.w, /* ws 67 - 76 */
/*68 */classes.w, 
/*69 */classes.w, 
/*70 */classes.w, 
/*71 */classes.w, 
/*72 */classes.w, 
/*73 */classes.w, 
/*74 */classes.w, 
/*75 */classes.w, 
/*76 */classes.w, 
/*77 */union(classes.an, classes.w), /* element */
/*78 */classes.an,
/*79 */union(classes.w, classes.plus, classes.minus, classes.dec), /* charge */
/*80 */union(classes.w, classes.plus, classes.minus, classes.dec)
];

module.exports.name = 'atom';