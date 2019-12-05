import {Game} from "@engine/core/game";
import {DebugError} from "@engine/debug/debugError";
import {TaskRef} from "@engine/resources/queue";

declare class FontFace {
    constructor(fontFaceName: string, url: string);
    public load():Promise<FontFace>;
}

interface IDocumentEx extends Document{
    fonts:{
        add:(f:FontFace)=>void
    };
}


export namespace fontLoader {

    const loadViaFontFace = (game:Game,url:string,fontFaceName:string)=>{
        const fontFace = new FontFace(fontFaceName, `url(${url})`);
        const taskRef:TaskRef = game.getCurrScene().resourceLoader.q.addTask(()=>{
            fontFace.load().then((loaded_face:FontFace)=> {
                (document as IDocumentEx).fonts.add(loaded_face);
                game.getCurrScene().resourceLoader.q.resolveTask(taskRef);
            }).catch((error:Error)=> {
                console.error(error);
                const event = new Event('error');
                (event as Event&{message:string}).message = `can not load font: ${url}`;
                window.dispatchEvent(event);
                throw new DebugError(`can not load font: ${url}`);
            });
        });
    };

    const loadViaDomCss = (game:Game,url:string,fontFaceName:string)=>{
        const taskRef:TaskRef = game.getCurrScene().resourceLoader.q.addTask(()=>{
            const cssNode = document.createElement('style');
            cssNode.innerHTML = `
                  @font-face {
                      font-family: '${fontFaceName}';
                      src: url('${url}');
                  }
            `;
            document.head.appendChild(cssNode);

            setTimeout(()=>{
                game.getCurrScene().resourceLoader.q.resolveTask(taskRef);
            },2000);

        });

    };

    export const loadFont = (game:Game,url:string,fontFaceName:string):void=>{
        if ((window as unknown as {FontFace:{}}).FontFace!==undefined) {
            loadViaFontFace(game,url,fontFaceName);
        } else {
            loadViaDomCss(game,url,fontFaceName);
        }
    };

}