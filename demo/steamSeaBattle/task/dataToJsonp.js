const fs = require('fs');

const processFolder = (folderName) => {
    fs.readdirSync(`./demo/steamSeaBattle/data/${folderName}`).forEach((s) => {
        const content = fs.readFileSync(`./demo/steamSeaBattle/data/${folderName}/${s}`);
        const arr = [...content];
        //language=javascript
        const file = `
            (function(){
                var array = ${JSON.stringify(arr)};
                var length = array.length;
                var buffer = new ArrayBuffer(length);
                var view = new Uint8Array(buffer);
                for ( var i = 0; i < length; i++) {
                    view[i] = array[i];
                }
                if (!window.jsonpHandler['./steamSeaBattle/data_jsonp/${folderName}/${s}.js']) throw new Error('no callback provided for "./steamSeaBattle/data_jsonp/${folderName}/${s}.js"')
                window.jsonpHandler['./steamSeaBattle/data_jsonp/${folderName}/${s}.js'](buffer);
            })();`;
        fs.writeFileSync(`./demo/steamSeaBattle/data_jsonp/${folderName}/${s}.js`, file);
    });
};

processFolder('images');
processFolder('sounds');

