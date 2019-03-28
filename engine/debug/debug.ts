import {httpClient} from "@engine/debug/httpClient";
import {IKeyVal} from "@engine/misc/object";
import {Game} from "@engine/game";

let devConsole:HTMLElement = document.createElement('div');
let css:IKeyVal = {
    position: 'absolute',
    right: 0,
    top: 0,
    'background-color': 'black',
    'min-width': '20px',
    'min-height': '20px',
    opacity: 0.5
};
Object.keys(css).forEach(key=>devConsole.style.setProperty(key,css[key]));

let label:HTMLElement = document.createElement('span');
label.style.color = 'white';
devConsole.appendChild(label);

window.addEventListener('load',(e:Event)=>{
    document.body.appendChild(devConsole);
    let game:Game = (window as any).game;
    if (!game) return;
    setInterval(function(){
        label.textContent = 'fps:'+`${game.fps}`||`?`;
    },1000);

});


const prepareMessage = function(e:any,lineNum:number){
    let msg;
    if (typeof e === 'string') {
        msg = e;
    }
    else msg = e.message || e.reason;
    if (msg && msg.message) msg = msg.message;
    if (!msg) {
        if (e.target) {
            ['img','audio','link'].some(function(it){
                if (e.target.tagName && e.target.tagName.toLowerCase()===it) {
                    msg = `can not load ${it} with location ${(e.target.src||e.target.href)}`;
                    return true;
                }
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


window.addEventListener('error',function(e:any){
    let lineNum:number = e.lineno;
    let colNum:number = e.colno;
    let filename:string = e.filename;

    let runtimeInfo = '';
    if (e.error && e.error.name && e.error.name==='DebugError') {
        runtimeInfo = prepareMessage(e,lineNum);
    }

    try {
        let tmpl = `

  <div class="errorBlock"> 
        <style>
            .errorHeader {text-align: center;}
            .errorText {
                color: #f3170d;
                white-space: pre-wrap;
            }
            .errorCol {color: #f30000;text-decoration: underline;}
            .errorRow {
                color: #bf1313;
                font-weight: bold;
            }
            .errorBlock {
                position: absolute;
                left: 0;top:0;right:0;
                border: 1px solid grey;
                background-color: rgba(255,215,200,0.99);
                font-family: monospace;
                padding: 10px;
            }
            .errorClose {
                position: absolute;
                top: 5px;
                right: 5px;
                content: 'x';
                width: 20px;
                height: 20px;
                cursor: pointer;
                color: black;
            }    
       </style>
       <div class="errorClose" onclick="this.closest('.errorBlockHolder').remove();">x</div>
       <h1 class="errorHeader">Runtime error!</h1>
       <h3 class="errorText">${runtimeInfo}</h3>
       <div>${filename}</div>
       <div>-------------------</div>
       <pre>$_content</pre>
  </div> 
  
`;
        httpClient.get(filename,{r:Math.random()},(file:string)=>{
            let strings:string[] = file.split('\n');
            let linesAfter:number = 5;
            let linesBefore:number = 5;
            let errorString:string = strings[lineNum - 1] || '';
            errorString = `${errorString.substr(0,colNum-1)}<span class="errorCol">${errorString[colNum-1]}</span>${errorString.substr(colNum)}`;
            errorString=`<span class="errorRow">${errorString}</span>\n`;
            let res:string='';
            for (let i=-linesBefore;i<linesAfter;i++) {
                let index = lineNum + i;
                if (index<0 || index>strings.length-1) continue;
                let s = strings[index];
                if (index==lineNum-1) res+=errorString;
                else res+=s+'\n';
            }
            let errDiv:HTMLElement = document.createElement('div');
            errDiv.className = 'errorBlockHolder';
            errDiv.innerHTML = tmpl.replace('$_content',res);
            document.body.appendChild(errDiv);
            document.title = 'runtime error!';
        });
    } catch (e) {
        console.error(e);
    }
},true);