
const stringAsFilteredArray = require('../../common/common').stringAsClearedArray;


module.exports = (content)=> {
    // @ts-ignore
    const debug = !!(this.query||{}).debug;
    let arr = stringAsFilteredArray(content);

    if (!debug) arr = arr.map(it=>it.trim());

    return `module.exports = ${JSON.stringify(arr, undefined, 4)}.join('\\n');`;
};
