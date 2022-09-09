
import * as fs from 'fs';

const path = './node_tools/build/__cache__';

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

export const get = (key)=>{
    return read()[key];
}

export const set = (key,val)=>{
    const json = read();
    json[key] = val;
    save(json);
}
