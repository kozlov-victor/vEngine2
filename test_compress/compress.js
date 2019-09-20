// https://js1k.com/2017-magic/demo/2699
const fs = require('fs');

var compress = input => {
    var output = ''

    for(var i = 0; i < input.length;) {
        var best = 0
        var bestLength = 0

        for(var j = 0; j < i; ++j) {

            for(var k = 0; k + j < i && input[k + i] === input[k + j]; ++k) {
            }

            if(k > bestLength) {
                bestLength = k
                best = j
            }
        }

        bestLength = Math.min(bestLength, 30)

        if(bestLength < 3) {
            output += input[i]
            ++i
        } else {
            output += String.fromCharCode(best + 2048 * bestLength)
            i += bestLength
        }
    }

    output = output
        .replace(/\\/g, '\\\\')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\0/g, '\\0')
        .replace(/[$]/g, '\\$')
        .replace(/`/g, '\\`')

    return '(f=(i,o,p,c)=>(c=i.charCodeAt(p))?f(i,o+(c<256?i[p]:o.slice(c&2047,(c&2047)+(c>>11))),++p):o)(`' + output
        + '`,``,0)'
};

const file = fs.readFileSync('demo/out/basic.js',{encoding: 'utf-8'});
const compressed = compress(file);
fs.writeFileSync('demo/out/basic1.js',compressed);
