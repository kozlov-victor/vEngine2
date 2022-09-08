
const path = './node_tools/build/__cache__';
const fs = require('fs');

const read = ()=>{
    let json = {};
    try {
        if (fs.existsSync(path)) json = JSON.parse(fs.readFileSync(path,'utf8'));
    } catch (e) {
        console.error(e);
    }
    return json;
}

const save = (json)=>{
    fs.writeFileSync(path,JSON.stringify(json));
}

module.exports.get = (key)=>{
    return read()[key];
}

module.exports.set = (key,val)=>{
    const json = read();
    json[key] = val;
    save(json);
}
