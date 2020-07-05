
const fs = require('fs');

const allDirectories = [];

const dirs = fs.readdirSync('./demo');
dirs.forEach((dir)=>{
    if (['_index','assets','out','index.html','demo.html','.DS_Store','generateIndexPage.js','application.hta','VEngineNavigator.exe'].includes(dir)) return;
    allDirectories.push(dir);
});


fs.writeFileSync('./demo/index.json',JSON.stringify(allDirectories));
