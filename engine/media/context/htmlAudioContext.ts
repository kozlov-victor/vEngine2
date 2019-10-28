import {Game} from "../../core/game";
import {ResourceLink} from "@engine/resources/resourceLink";
import {BasicAudioContext} from "@engine/media/context/basicAudioContext";
import {AudioPlayer} from "@engine/media/audioPlayer";
import {DebugError} from "@engine/debug/debugError";
import {Clazz, ICloneable} from "@engine/core/declarations";
import {Sound} from "@engine/media/sound";

interface IWindow {
    Audio: typeof HTMLAudioElement;
}

class CtxHolder {
    public static getCtx():HTMLAudioElement{
        const Ctx:Clazz<HTMLAudioElement> = window && (window as unknown as IWindow).Audio;
        return new Ctx();
    }

}


export class HtmlAudioContext extends BasicAudioContext implements ICloneable<HtmlAudioContext>{

    public static isAcceptable():boolean{
        return !!(window && (window as unknown as IWindow).Audio);
    }
    public readonly type: string = 'htmlAudioContext';
    private free: boolean = true;
    private _ctx: HTMLAudioElement;

    constructor(game:Game) {
        super(game);
        this._ctx = CtxHolder.getCtx();
    }
    public load(buffer:ArrayBuffer,link:ResourceLink<void>,onLoad:()=>void):void {
        // urlLoader.onLoad = (buffer:ArrayBuffer|string)=>{
        //     AudioPlayer.cache[link.getUrl()] = URL.createObjectURL(buffer as ArrayBuffer);
        //     onLoad();
        // };
        onLoad(); // todo
    }

    public isFree(): boolean {
        return this.free;
    }

    public play(sound:Sound):void {
        this.setLastTimeId();
        const url:string = AudioPlayer.cache[sound.getResourceLink().getUrl()] as string;
        if (DEBUG && !url) throw new DebugError(`can not retrieve audio from cache (link id=${sound.getResourceLink().getUrl()})`);

        this.free = false;
        this._ctx.src = url;
        this._ctx.play();
        this._ctx.loop = sound.loop;
        this._ctx.onended = () => {
            this.stop();
        };
    }

    public stop():void {
        this.free = true;
    }

    public setGain(val: number):void {
        this._ctx.volume = val;
    }

    public pause():void {
        this._ctx.pause();
    }

    public resume():void {
        if (DEBUG) throw new Error("not implemented for now");
    }

    public clone():HtmlAudioContext{
        return new HtmlAudioContext(this.game);
    }


}
