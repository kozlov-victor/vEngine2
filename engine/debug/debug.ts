import {httpClient} from "@engine/debug/httpClient";
import {IKeyVal} from "@engine/misc/object";
import {Game} from "@engine/core/game";
import {VEngineTsxComponent} from "@engine/renderable/tsx/genetic/vEngineTsxComponent";

interface IGameHolder {
    game: Game;
}

const devConsole:HTMLElement = document.createElement('div');
const css:IKeyVal<string|number> = {
    "position": 'absolute',
    "right": 0,
    "top": 0,
    'background-color': 'black',
    'min-width': '20px',
    'min-height': '20px',
    'opacity': 0.5,
    'pointer-events':'none',
    'display':'block',
    'z-index':1000
};
Object.keys(css).forEach((key:string)=>devConsole.style.setProperty(key,''+css[key]));

const fpsLabel:HTMLElement = document.createElement('span');
fpsLabel.style.cssText = 'color:white;user-select: none;';
devConsole.appendChild(fpsLabel);
let tmr:number;

const onLoad = (fn:()=>void)=>{
    if (document.readyState==='complete') fn();
    else {
        window.addEventListener('load',(e:Event)=>{
            fn();
        });
    }
};

onLoad(()=>{
    document.body.appendChild(devConsole);
    tmr = setInterval(()=>{
        const game:Game = (window as unknown as IGameHolder).game;
        if (!game) return;
        fpsLabel.textContent = 'fps:'+`${game.fps}`||`?`;
    },1000) as unknown as number;
});


const prepareMessage = (e:any,lineNum:number)=>{
    //console.log(e);
    let msg;
    if (typeof e === 'string') {
        msg = e;
    }
    else msg = e.message || e.reason || e.error;
    if (msg && msg.message) msg = msg.message;
    if (!msg) {
        if (e.target) {
            ['img','audio','link','script'].some((it:string)=>{
                if (e.target.tagName && e.target.tagName.toLowerCase()===it) {
                    msg = `can not load ${it} with location ${(e.target.src||e.target.href)}`;
                    return true;
                }
                return false;
            });
        }
    }
    if (!msg) msg = '';
    if (msg.indexOf('Uncaught')===0) msg = msg.replace('Uncaught','').trim();
    if (!msg) {
        msg = 'Unknown error: ' + e.toString();
    }
    if (lineNum) msg=`error in line ${lineNum}:  ${msg}`;
    return msg;
};

const renderError = (filename:string,runtimeInfo:string,debugInfo:string)=>{

    document.title = 'runtime error!';
    devConsole.style.display = 'none';

    if (!document.querySelector('.errorBlockHolder')) {
        const tmpl:string = `

            <style>
                .errorHeader {text-align: center;}
                .errorText {
                    color: #ff8882;
                    white-space: pre-wrap;
                }
                .errorCol {color: #f30000;text-decoration: underline;}
                .errorRow {
                    color: #bf1313;
                    font-weight: bold;
                }
                .errorBlockHolder {
                    background: #615f5fb8;
                    height: 100%;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    top: 0;
                    position: absolute;
                }
                ::selection {
                        color: #efff00;
                        background-color: #127315;
                }
                .errorBlock {
                    border: 1px solid grey;
                    background-color: rgba(21, 15, 121, 0.88);
                    font-family: monospace;
                    -webkit-touch-callout: default;
                    color: #fffef8;
                }
                .errorBlock, .errorBlock * {
                    user-select: text;
                }
                .errorBlockInternal {
                    position: relative;
                    padding: 5px;
                    margin: 5px;
                    border: 1px solid #8f9624;
                    user-select: text;
                }
                .errorClose {
                    position: absolute;
                    top: 15px;
                    right: 5px;
                    content: 'x';
                    width: 20px;
                    height: 20px;
                    cursor: pointer;
                    color: white;
                }
            </style>

            <div class="errorBlock">

            </div>

        `;
        const errDiv:HTMLElement = document.createElement('div');
        errDiv.className = 'errorBlockHolder';
        errDiv.innerHTML = tmpl;
        document.body.appendChild(errDiv);
    }

    const errorBlockTmpl = `
        <div class="errorBlockInternal">
            <div class="errorClose"
            onclick="
                this.closest('.errorBlockInternal').remove();
                if (!document.querySelector('.errorBlockInternal')) document.querySelector('.errorBlockHolder').remove();"
            >x</div>
            <h3 class="errorText">${runtimeInfo}</h3>
            <div>${filename?filename:''}</div>
            <div>-------------------</div>
            <pre>${debugInfo}</pre>
            </div>
        </div>
    `;
    const d = document.createElement('div');
    d.innerHTML = errorBlockTmpl;
    document.querySelector('.errorBlock')!.appendChild(d);
};


const stopGame = ()=>{
    clearInterval(tmr);
    const game:Game = (window as unknown as IGameHolder).game as Game;
    if (game) {
        try {
            game.destroy();
        } catch (e) {
            console.error(e);
        }
    }
};

const handleCatchError = (e:ErrorEvent)=>{
    const lineNum:number = e.lineno;
    const colNum:number = e.colno;
    const filename:string = e.filename;
    const runtimeInfo:string = prepareMessage(e,lineNum);

    if (filename) {
        try {
            httpClient.get(filename,{r:Math.random()},
                (file)=>{
                    if (!file) return;
                    try {
                        const strings:string[] = (file as string).split('\n');
                        const linesAfter:number = 5;
                        const linesBefore:number = 5;
                        let errorString:string = strings[lineNum - 1] || '';
                        errorString = `${errorString.substr(0,colNum-1)}<span class="errorCol">${errorString[colNum-1]}</span>${errorString.substr(colNum)}`;
                        errorString=`<span class="errorRow">${errorString}</span>\n`;
                        let debugInfo:string='';
                        for (let i=-linesBefore;i<linesAfter;i++) {
                            const index = lineNum + i;
                            if (index<0 || index>strings.length-1) continue;
                            const s = strings[index];
                            if (index===lineNum-1) debugInfo+=errorString;
                            else debugInfo+=s+'\n';
                        }
                        renderError(filename,runtimeInfo,debugInfo);
                    } catch (e) {
                        console.error(e);
                        renderError('',runtimeInfo,'');
                    }
                },
                (err)=>{
                    console.error(err);
                    renderError('',runtimeInfo,'');
                }
            );
        } catch (e) {
            renderError('',runtimeInfo,'');
        }

    } else {
        renderError('',runtimeInfo,'');
    }
};

const extractPromiseError = (e:any):string=>{
    let r:string = 'Async error\n';
    if ((e as string).substr!==undefined) r+=e;
    if (e.message) r+=`${e.message}\n`;
    if (e.stack) r+=e.stack;

    return r;
};

window.addEventListener('error',(e:ErrorEvent)=>{
    stopGame();
    handleCatchError(e);
},true);

window.addEventListener('unhandledrejection', (e:PromiseRejectionEvent)=> {
    stopGame();
    renderError('',extractPromiseError(e.reason),'');
});

