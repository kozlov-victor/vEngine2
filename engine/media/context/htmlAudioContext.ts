import {Game} from "../../core/game";
import {BasicAudioContext} from "@engine/media/context/basicAudioContext";
import {AudioPlayer} from "@engine/media/audioPlayer";
import {DebugError} from "@engine/debug/debugError";
import {Clazz, ICloneable} from "@engine/core/declarations";
import {Sound} from "@engine/media/sound";
import {UploadedSoundLink, UploadSoundLinkImpl} from "@engine/media/interface/iAudioPlayer";

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

    constructor(protected game:Game,protected audioPlayer:AudioPlayer) {
        super(game,audioPlayer);
        this._ctx = CtxHolder.getCtx();
    }
    public readonly type: string = 'htmlAudioContext';
    private free: boolean = true;
    private _ctx: HTMLAudioElement;

    public static isAcceptable():boolean{
        return !!(window && (window as unknown as IWindow).Audio);
    }
    public async uploadBufferToContext(url: string, buffer: ArrayBuffer):Promise<UploadedSoundLink> {
        if (typeof URL !== undefined && typeof Blob !== "undefined") {
            const blob: Blob = new Blob([buffer]);
            AudioPlayer.cache[url] = URL.createObjectURL(blob);
        } else {
            if (DEBUG) {
                const type: string = url.split('.').pop() ?? '';
                if (type === '') throw new DebugError(`Can not define audio type from url: ${url}`);
                const canPlayType: CanPlayTypeResult = this._ctx.canPlayType(`audio/${type}`);
                if (canPlayType === '') throw new DebugError(`Can not play this audio type: ${type}`);
            }
            AudioPlayer.cache[url] = url;
        }
        return new UploadSoundLinkImpl(url);
    }

    public isFree(): boolean {
        return this.free;
    }

    public play(sound:Sound):void {
        this.setLastTimeId();
        const url:string = AudioPlayer.cache[sound.getUrl()] as string;
        if (DEBUG && !url) throw new DebugError(`can not retrieve audio from cache (link id=${sound.getUrl()})`);
        this.free = false;
        this._ctx.src = url;
        this._ctx.play()?.then(_=>{
            this.duration = ~~(this._ctx.duration*1000);
        }).catch(e=>{
            console.log(e);
        });
        this.startedTime = ~~(this._ctx.currentTime*1000);
        this.duration = -1;
        this.loop(sound.loop);
        this.setGain(sound.gain);
        this._ctx.onended = () => {
            this.stop();
        };
        super.play(sound);
    }

    public stop():void {
        this.free = true;
        // tslint:disable-next-line:no-null-keyword
        this._ctx.onended = null;
        this._ctx.pause();
        this._ctx.currentTime = 0;

    }

    public getCurrentTime():number {
        return (~~(this._ctx.currentTime*1000) - this.startedTime) % this.duration;
    }

    public setGain(val: number):void {
        this._ctx.volume = val;
    }


    public loop(val: boolean): void {
        this._ctx.loop = val;
    }

    public pause():void {
        this._ctx.pause();
    }

    public resume():void {
        if (DEBUG) throw new Error("not implemented for now");
    }

    public clone():HtmlAudioContext{
        return new HtmlAudioContext(this.game,this.audioPlayer);
    }


}
