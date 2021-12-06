import {HTMLElementWrap} from "@engine/renderable/tsx/dom/HTMLElementWrap";
import {Widget} from "./widget";
import {CommandsAttacher} from "./commandsAttacher";

const style = document.createElement('style');
style.textContent =
    `
        * {font-family: monospace}
        input,input:focus{border-color: transparent;outline-color: transparent;background-color: #f4f5f4}
    `;
document.head.appendChild(style);

const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

const widget = new Widget();
widget.mountTo(new HTMLElementWrap(root));

let codeToExecute = '';
const allScriptNodes = document.querySelectorAll('script[type="jscript"]');
for (let i=0;i<allScriptNodes.length;i++) {
    codeToExecute+=allScriptNodes.item(i).textContent+'\n';
}

const commands = new CommandsAttacher(widget).init();

//language=javaScript
const codeToExecuteProcessed =
    `
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
                codeToExecute
                    .split('input(').join('await input(')
                    .split('wait(').join('await wait(')
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
    console.log(fn.toString());
    fn(commands);
} catch (e:any) {
    widget.catchError(e);
}


