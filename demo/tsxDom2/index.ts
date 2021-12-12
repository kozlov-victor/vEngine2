import {HTMLElementWrap} from "@engine/renderable/tsx/dom/HTMLElementWrap";
import {Widget} from "./widget";
import {CommandsAttacher} from "./commandsAttacher";
import {Game, SCALE_STRATEGY} from "@engine/core/game";
import {DrawingScene} from "./drawingScene";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";

const game = new Game({width:1024,height:800,scaleStrategy:SCALE_STRATEGY.NO_SCALE});
game.setRenderer(WebGlRenderer);
const drawingScene = new DrawingScene(game);
game.runScene(drawingScene);

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
        input,input:focus{border-color: transparent;outline-color: transparent;background-color: #f4f5f4}
    `;
document.head.appendChild(style);

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

const commands = new CommandsAttacher(widget,drawingScene.getCanvas()).init();

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
                    .split('drawLine(').join('await drawLine(')
                    .split('drawCircle(').join('await drawCircle(')
                    .split('drawPoint(').join('await drawPoint(')
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


