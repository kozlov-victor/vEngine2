const fs = require('fs');
const querystring = require('node:querystring');

const compare = (val1,val2,asc)=>{
    if (val1===null || val1===undefined) return 0;
    if (val2===null || val2===undefined) return 0;
    if (asc==='1') return val1>val2?1:-1;
    else return val1>val2?-1:1;
}

const sort = (a,b,field,asc)=>{
    if (!a || !b) return 0;
    return compare(a[field],b[field],asc);
}


module.exports = function(content) {
    const ls = [];
    const resourceDirPath = this.context;
    const resourceDirName = resourceDirPath.replace(/\\/g, '/').split('/').pop();
    fs.readdirSync(resourceDirPath).forEach(f=>{
        if (f==='index.js' || f==='index.ts') return;
        const name = `./${resourceDirName}/${f}`;
        const { birthtime: creationDate } = fs.statSync(`${resourceDirPath}/${f}`);
        ls.push({creationDate,name});
    });
    const queryStr = (this.resourceQuery || '').replace('?','');
    const queryObj = querystring.parse(queryStr);
    if (queryObj.sort) {
        ls.sort((a,b)=>sort(a,b,queryObj.sort,queryObj.asc));
    }

    return `
        module.exports = ${JSON.stringify(ls.map(it=>it.name),undefined,4)};
    `;
};
