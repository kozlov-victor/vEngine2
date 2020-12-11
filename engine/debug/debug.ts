
import {httpClient} from "@engine/debug/httpClient";
import {IKeyVal} from "@engine/misc/object";
import {Game} from "@engine/core/game";
import {renderError} from "@engine/debug/errorWidget";

interface IGameHolder {
    game: Game;
}

const devConsole:HTMLElement = document.createElement('div');
const css:IKeyVal<string|number> = {
    position: 'absolute',
    right: 0,
    top: 0,
    'background-color': 'black',
    'min-width': '20px',
    'min-height': '20px',
    opacity: 0.5,
    'pointer-events':'none',
    display:'block',
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

const handleCatchError = async (e:ErrorEvent)=>{
    const lineNum:number = e.lineno;
    const runtimeInfo:string = prepareMessage(e,lineNum);
    const colNum:number = e.colno;
    const filename:string = e.filename;
    if (filename) {
        try {
            const file = await httpClient.get<string>(filename,{r:Math.random()});
            if (file) renderError({filename,runtimeInfo,debugInfo:{file,colNum,lineNum}});
            else renderError({runtimeInfo});
        } catch (e) {
            renderError({runtimeInfo});
        }
    } else {
        renderError({runtimeInfo});
    }
};

const extractPromiseError = (e:any):string=>{
    let r:string = 'Async error\n';
    if ((e as string).substr!==undefined) r+=e;
    if (e.message) r+=`${e.message}\n`;
    if (e.stack) r+=e.stack;

    return r;
};

window.addEventListener('error',async (e:ErrorEvent)=>{
    console.error(e);
    stopGame();
    await handleCatchError(e);
},true);

window.addEventListener('unhandledrejection', (e:PromiseRejectionEvent)=> {
    console.error(e);
    stopGame();
    renderError({filename:'',runtimeInfo:extractPromiseError(e.reason)});
});

