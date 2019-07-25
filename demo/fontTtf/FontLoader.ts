import {Game} from "@engine/game";
import {DebugError} from "@engine/debug/debugError";
import {TaskRef} from "@engine/resources/queue";

declare const FontFace:any;

if ((window as any).FontFace===undefined) throw new DebugError(`FontFace is not supported`);

export namespace fontLoader {

    export const loadFont = (game:Game,url:string,fontFaceName:string):void=>{
        const fontFace = new FontFace(fontFaceName, `url(${url})`);
        const taskRef:TaskRef = game.getCurrScene().resourceLoader.q.addTask(()=>{
            fontFace.load().then((loaded_face:any)=> {
                (document as any).fonts.add(loaded_face);
                console.log('custom font loaded');
                game.getCurrScene().resourceLoader.q.resolveTask(taskRef);
            }).catch((error:any)=> {
                console.error(error);
                const event = new Event('error');
                (event as any).message = `can not load font: ${url}`;
                window.dispatchEvent(event);
                throw new DebugError(error);
            });
        });
    };

}