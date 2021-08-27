import {Game} from "@engine/core/game";
import {DebugError} from "@engine/debug/debugError";
import {TaskQueue} from "@engine/resources/taskQueue";

declare class FontFace {
    constructor(fontFaceName: string, url: string);
    public load():Promise<FontFace>;
}


export namespace fontLoader {

    const loadViaFontFace = (game:Game,taskQueue:TaskQueue,url:string,fontFaceName:string)=>{
        const fontFace = new FontFace(fontFaceName, `url(${url})`);

        taskQueue.addNextTask(async _=>{
            try {
                const loadedFace:FontFace = await fontFace.load();
                (document.fonts as any).add(loadedFace);
            } catch (e:any) {
                console.error(e);
                const event = new Event('error');
                (event as Event&{message:string}).message = `can not load font: ${url}`;
                window.dispatchEvent(event);
                throw new DebugError(`can not load font: ${url}`);
            }
        });
    };

    const loadViaDomCss = (game:Game,taskQueue:TaskQueue,url:string,fontFaceName:string)=>{

        taskQueue.addNextTask(async _=>{
            const cssNode = document.createElement('style');
            cssNode.innerHTML = `
                  @font-face {
                      font-family: '${fontFaceName}';
                      src: url('${url}');
                  }
            `;
            document.head.appendChild(cssNode);

            return new Promise<void>(resolve=>{
                setTimeout(resolve,100);
            });
       });
    };

    export const loadFont = (game:Game,taskQueue:TaskQueue,url:string,fontFaceName:string):void=>{
        if ((window as unknown as {FontFace:{}}).FontFace!==undefined) {
            loadViaFontFace(game,taskQueue,url,fontFaceName);
        } else {
            loadViaDomCss(game,taskQueue,url,fontFaceName);
        }
    };

}
