import {Game} from "@engine/core/game";
import {DebugError} from "@engine/debug/debugError";
import {TaskRef} from "@engine/resources/queue";
import {ResourceLoader} from "@engine/resources/resourceLoader";

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

    const loadViaFontFace = (game:Game,resourceLoader:ResourceLoader,url:string,fontFaceName:string)=>{
        const fontFace = new FontFace(fontFaceName, `url(${url})`);

        resourceLoader.addNextTask(async _=>{
            try {
                const loadedFace:FontFace = await fontFace.load();
                (document as IDocumentEx).fonts.add(loadedFace);
            } catch (e:any) {
                console.error(e);
                const event = new Event('error');
                (event as Event&{message:string}).message = `can not load font: ${url}`;
                window.dispatchEvent(event);
                throw new DebugError(`can not load font: ${url}`);
            }
        });
    };

    const loadViaDomCss = (game:Game,resourceLoader:ResourceLoader,url:string,fontFaceName:string)=>{

        resourceLoader.addNextTask(async _=>{
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

    export const loadFont = (game:Game,resourceLoader:ResourceLoader,url:string,fontFaceName:string):void=>{
        if ((window as unknown as {FontFace:{}}).FontFace!==undefined) {
            loadViaFontFace(game,resourceLoader,url,fontFaceName);
        } else {
            loadViaDomCss(game,resourceLoader,url,fontFaceName);
        }
    };

}
