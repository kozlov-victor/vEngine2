
import {Widget} from "./widget";
import {CommandsAttacher} from "./commandsAttacher";
import {HTMLElementWrap} from "@engine/renderable/tsx/dom/internal/HTMLElementWrap";


const style = document.createElement('style');
style.textContent =
    `
        * {font-family: monospace}
        canvas {
            position: fixed;
            z-index: 1;
        }
        #root {
            position: relative;
            z-index: 2;
        }
        input,input:focus{border-color: transparent;outline-color: grey;background-color: #f4f5f4}
    `;
document.head.appendChild(style);

const canvas = document.createElement('canvas');
canvas.width = 640;
canvas.height = 480;
document.body.appendChild(canvas);

const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

const widget = new Widget();
widget.mountTo(new HTMLElementWrap(root));

let codeToExecute = ``;
const allScriptNodes = document.querySelectorAll('script[type="jscript"]');
for (let i=0;i<allScriptNodes.length;i++) {
    codeToExecute+=allScriptNodes.item(i).textContent+'\n';
}

const commands = new CommandsAttacher(widget,canvas.getContext('2d')!).init();

//language=javaScript
const codeToExecuteProcessed =
    `
    \n
    ${
        Object.keys(commands).map(key=>{
            return `var ${key}=commands.${key};`;
        }).join('\n')
    }

var wait = async (time)=>{
    return new Promise(resolve=>{
        setTimeout(resolve,time);
    });
}
(async ()=>{
    "use strict";
    try {
        ${
            (()=>{
                let s  = codeToExecute;
                ['input','readKey','wait','drawLine','drawCircle','drawPoint'].forEach(l=>{
                    const re = new RegExp(`${l}[ ]*\\(`);
                    s = s.split(re).join(`await ${l}(`);
                });
                return s;
            })()
        }
    }
    catch(e) {
        catchError(e);
    }
})();
    `;

try {
    console.log(codeToExecuteProcessed);
    const fn = new Function('commands',codeToExecuteProcessed);
    fn(commands);
} catch (e:any) {
    widget.catchError(e);
}


