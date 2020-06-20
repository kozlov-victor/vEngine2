
const colors = require('./colors');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const leftPad = (str,toLength)=>{
    let pad = "";
    for (let i=str.length;i<toLength;i++) pad+=" ";
    return pad + str;
};

const rightPad = (str,toLength)=>{
    let pad = "";
    for (let i=str.length;i<toLength;i++) pad+=" ";
    return str + pad;
};

const centerPad = (str,toLength)=>{
    let leftPadded = leftPad(str,~~(toLength/2+str.length/2));
    return rightPad(leftPadded,toLength);
};

const getLine = (symbol,length)=>{
    return new Array(length).fill(symbol).join('');
};

const showWindow = (text,colorBg,colorFg)=>{
    const strings = text.substr?text.split('\n'):text;
    let maxLength = Math.max(...strings.map(it=>it.length));
    if (maxLength<3) maxLength = 3;

    console.log('    ',colorBg,colorFg,`╔═▓${getLine('═',maxLength-2)}╗`,colors.Reset);
    for (const string of strings) {
        console.log('    ',colorBg,colorFg,`║${centerPad(string,maxLength)}║`,colors.Reset);
    }
    console.log('    ',colorBg,colorFg,`╚${getLine('═',maxLength)}╝`,colors.Reset);
};

const showInfoWindow = (text)=>{
   showWindow(text,colors.bg.Blue,colors.fg.Cyan);
};

const showErrorWindow = (text)=>{
    showWindow(text,colors.bg.Magenta,colors.fg.White);
};

const prompt = (text,cb)=>{
    return new Promise((resolve)=>{
        showInfoWindow(text);
        console.log(colors.fg.Green);
        readline.question('>', val => {
            readline.close();
            if (cb) cb(val);
            resolve(val);
            console.log(colors.Reset);
        });
    });

};

module.exports.showWindow = showWindow;
module.exports.showInfoWindow = showInfoWindow;
module.exports.showErrorWindow = showErrorWindow;
module.exports.prompt = prompt;
