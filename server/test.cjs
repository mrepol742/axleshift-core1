const Blowfish = require('blowfish-node');
const bf = new Blowfish('mrepol742-key', Blowfish.MODE.CBC, Blowfish.PADDING.NULL); 
bf.setIv('bhgdjkio');

const encoded = '23,203,206,8,182,79,21,145,125,52,122,101,2,219,19,30,70,177,119,58,248,133,155,235,186,67,227,59,37,9,95,119';
console.log('encoded: ' + encoded);
const decoded = bf.decode(encoded); 
console.log('decoded: ' + decoded);