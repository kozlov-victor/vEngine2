
module.exports = function(content) {
    const debug = !!(this.query||{}).debug;
    let arr =
        content.
            split('\n').
            filter(it=>!!it).
            filter(it=>!it.startsWith('//'));

    if (!debug) arr = arr.map(it=>it.trim());

    return `module.exports = ${JSON.stringify(arr, undefined, 4)}.join('\\n');`;
};