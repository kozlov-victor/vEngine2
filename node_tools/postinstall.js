
const fs = require('fs');

let domLib = fs.readFileSync('node_modules/typescript/lib/lib.dom.d.ts','utf8');

const patch = (code)=>{
    domLib = domLib.split(code).join('');
};

patch('declare var length: number;');
patch('declare const name: never;');


fs.writeFileSync('node_modules/typescript/lib/lib.dom.d.ts',domLib);


