const fs = require('fs');

module.exports = function(content) {
    const ls = [];
    const resourceDirPath = this.context;
    const resourceDirName = resourceDirPath.replace(/\\/g, '/').split('/').pop();
    fs.readdirSync(resourceDirPath).forEach(f=>{
        if (f==='index.js' || f==='index.ts') return;
        ls.push(`./${resourceDirName}/${f}`);
    });

    return `
        module.exports = ${JSON.stringify(ls,undefined,4)};
    `;
};
