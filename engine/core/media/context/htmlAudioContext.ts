import {Game} from "../../game";
import {ResourceLink} from "@engine/core/resources/resourceLink";
import {BasicAudioContext} from "@engine/core/media/context/basicAudioContext";
import {AudioPlayer} from "@engine/core/media/audioPlayer";
import {DebugError} from "@engine/debugError";
import {Cloneable} from "@engine/declarations";




interface Clazz<T> {
    new() : T;
}

class CtxHolder {
    static getCtx():HTMLAudioElement{
        let Ctx:Clazz<HTMLAudioElement> = window && (window as any).Audio;
        return new Ctx();
    };

}


export class HtmlAudioContext extends BasicAudioContext implements Cloneable<HtmlAudioContext>{
    readonly type: string = 'htmlAudioContext';
    private free: boolean = true;
    private _ctx: HTMLAudioElement;

    static isAcceptable():boolean{
        return !!(window && (window as any).Audio);
    }
    load(url:string,link:ResourceLink,callBack:()=>void){
        AudioPlayer.cache[link.getId()] = url;
        callBack();
    }

    constructor(game:Game) {
        super(game);
        this._ctx = CtxHolder.getCtx();
    }

    isFree(): boolean {
        return this.free;
    }

    play(link:ResourceLink, loop: boolean) {
        this.setLastTimeId();
        const url:string = AudioPlayer.cache[link.getId()];
        if (DEBUG && !url) throw new DebugError(`can not retrieve audio from cache (link id=${link.getId()})`);

        this.free = false;
        this._ctx.src = url;
        this._ctx.play();
        this._ctx.loop = loop;
        this._ctx.onended = () => {
            this.stop();
        }
    }

    stop() {
        this.free = true;
    }

    setGain(val: number) {
        this._ctx.volume = val;
    }

    pause() {
        this._ctx.pause();
    }

    resume() {
        if (DEBUG) throw "not implemented for now"
    }

    clone():HtmlAudioContext{
        return new HtmlAudioContext(this.game);
    }


}
