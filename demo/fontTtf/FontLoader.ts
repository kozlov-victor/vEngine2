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

if ((window as unknown as {FontFace:{}}).FontFace===undefined) throw new DebugError(`FontFace is not supported`);

export namespace fontLoader {

    export const loadFont = (game:Game,url:string,fontFaceName:string):void=>{
        const fontFace = new FontFace(fontFaceName, `url(${url})`);
        const taskRef:TaskRef = game.getCurrScene().resourceLoader.q.addTask(()=>{
            fontFace.load().then((loaded_face:FontFace)=> {
                (document as IDocumentEx).fonts.add(loaded_face);
                console.log('custom font loaded');
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

}