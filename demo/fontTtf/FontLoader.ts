import {Game} from "@engine/game";
import {Queue} from "@engine/resources/queue";
import {DebugError} from "@engine/debug/debugError";
import {Font} from "@engine/model/impl/font";
import {Color} from "@engine/renderer/color";

declare const FontFace:any;

export namespace fontLoader {

    export const loadFont = (game:Game,url:string):void=>{
        const fontFace = new FontFace('customFont', `url(${url})`);
        game.getCurrScene().resourceLoader.q.addTask(()=>{
            fontFace.load().then((loaded_face:any)=> {
                (document as any).fonts.add(loaded_face);
                console.log('custom font loaded');
                game.getCurrScene().resourceLoader.q.resolveTask(url);
            }).catch((error:any)=> {
                console.error(error);
                throw new DebugError(error);
            });
        },url);
    }

}