
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

const getCh = ()=>{
    return new Promise((resolve,reject)=>{

        const readline = require('readline');

        readline.emitKeypressEvents(process.stdin);
        process.stdin.setRawMode(true);

        process.stdin.once('keypress', (str, key) => {
            resolve(key);
        })

    })
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

const showTable = (arr)=>{
    let res = '';
    const maxLengthArr = [];
    arr.forEach((rowArr,i)=>{
       const maxColLength = Math.max();
    });
};

const showErrorWindow = (text)=>{
    showWindow(text,colors.bg.Magenta,colors.fg.White);
};

const prompt = (text)=>{
    return new Promise((resolve)=>{
        showInfoWindow(text);
        console.log(colors.fg.Green);
        readline.question('>', val => {
            readline.close();
            resolve(val);
            console.log(colors.Reset);
        });
    });
};

const choose = async (message,chooseArray)=>{
    let chosenPosition = 0;
    const createPrompt = ()=>{
        const maxLengthOfMessage = Math.max(...chooseArray.map(it=>it.length));
        let startPosition = chosenPosition - 10;
        let canScrollUp = false;
        if (startPosition<0) {
            startPosition = 0;
        } else {
            canScrollUp = true;
        }
        let endPosition = startPosition + 10;
        let canScrollDown = false;
        if (endPosition>chooseArray.length) {
            endPosition = chooseArray.length;
        } else {
            canScrollDown = true;
        }
        const arrToShow = chooseArray.slice(startPosition,endPosition + 1);
        let popup = arrToShow.map((it,index)=>{
            const paddedLine = centerPad(it,maxLengthOfMessage);
            if (index+startPosition===chosenPosition) return `<${paddedLine}>`;
            else return ` ${paddedLine} `;
        }).join('\n');
        if (canScrollUp) popup = '...\n' + popup;
        if (canScrollDown) popup+='\n...';
        console.clear();
        if (message) console.log(message);
        showInfoWindow(popup);
    };
    let loop = true;
    while (loop) {
        createPrompt();
        const char = await getCh();
        console.clear();
        if (char.name==='up') {
            chosenPosition--;
            if (chosenPosition===-1) chosenPosition = chooseArray.length -1;
        }
        else if (char.name==='down') {
            chosenPosition++;
            if (chosenPosition===chooseArray.length) chosenPosition = 0;
        }
        else if (char.name==='return') loop = false;
    }
    return chosenPosition;

};

module.exports.showWindow = showWindow;
module.exports.showInfoWindow = showInfoWindow;
module.exports.showErrorWindow = showErrorWindow;
module.exports.prompt = prompt;
module.exports.choose = choose;


