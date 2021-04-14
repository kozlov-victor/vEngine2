
module.exports.stringAsClearedArray = (content)=>{
    return content.
        split('\r').join('\n').
        split('\n').
        filter(it=>!!it.trim()).
        filter(it=>!it.startsWith('//'));
};


