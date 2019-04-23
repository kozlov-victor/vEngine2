import {Game} from "../../game";
import {ResourceLink} from "@engine/resources/resourceLink";
import {BasicAudioContext} from "@engine/media/context/basicAudioContext";
import {AudioPlayer} from "@engine/media/audioPlayer";
import {DebugError} from "@engine/debug/debugError";
import {Cloneable} from "@engine/declarations";
import {LoaderUtil} from "@engine/resources/loaderUtil";


interface Clazz<T> {
    new() : T;
}

class CtxHolder {
    static getCtx():HTMLAudioElement{
        const Ctx:Clazz<HTMLAudioElement> = window && (window as any).Audio;
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
    load(url:string,link:ResourceLink,callBack:()=>void):void {
        LoaderUtil.loadRaw(url,'blob',(buffer:ArrayBuffer)=>{
            AudioPlayer.cache[link.getUrl()] = URL.createObjectURL(buffer);
            callBack();
        });

    }

    constructor(game:Game) {
        super(game);
        this._ctx = CtxHolder.getCtx();
    }

    isFree(): boolean {
        return this.free;
    }

    play(link:ResourceLink, loop: boolean):void {
        this.setLastTimeId();
        const url:string = AudioPlayer.cache[link.getUrl()];
        if (DEBUG && !url) throw new DebugError(`can not retrieve audio from cache (link id=${link.getUrl()})`);

        this.free = false;
        this._ctx.src = url;
        this._ctx.play();
        this._ctx.loop = loop;
        this._ctx.onended = () => {
            this.stop();
        }
    }

    stop():void {
        this.free = true;
    }

    setGain(val: number):void {
        this._ctx.volume = val;
    }

    pause():void {
        this._ctx.pause();
    }

    resume():void {
        if (DEBUG) throw "not implemented for now"
    }

    clone():HtmlAudioContext{
        return new HtmlAudioContext(this.game);
    }


}
