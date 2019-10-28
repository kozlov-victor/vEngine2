import {DebugError} from "@engine/debug/debugError";
import {AudioPlayer} from "../audioPlayer";
import {Game} from "../../core/game";
import {ResourceLink} from "@engine/resources/resourceLink";
import {BasicAudioContext} from "@engine/media/context/basicAudioContext";
import {Clazz, ICloneable, Optional} from "@engine/core/declarations";
import {Sound} from "@engine/media/sound";


class CtxHolder {

    public static getCtx():AudioContext{
        if (CtxHolder.ctx && !CtxHolder.res) {
            CtxHolder.res = new CtxHolder.ctx();
            CtxHolder.fixAutoPlayPolicy();
        }
        return CtxHolder.res;
    }
    private static ctx:Clazz<AudioContext> =
        (window as any).AudioContext ||
        (window as any).webkitAudioContext;
    private static res:AudioContext;

    private static fixAutoPlayPolicy():void { // chrome allow playing only with user gesture
        const listener =()=>{
            CtxHolder.res.resume();
            document.removeEventListener('click',listener);
        };
        document.addEventListener('click',listener);
    }
}



const decode =(buffer:ArrayBuffer,callback:(data:AudioBuffer)=>void)=>{
    CtxHolder.getCtx().decodeAudioData(
        buffer,
        (decoded:AudioBuffer)=> {
            callback(decoded);
        },
        (err:DOMException)=>{
            if (DEBUG) throw new DebugError(err.message);
        }
    );
};


export class WebAudioContext extends BasicAudioContext implements ICloneable<WebAudioContext>{

    public static isAcceptable():boolean {
        return !!(window && CtxHolder.getCtx());
    }

    public _ctx: AudioContext;
    public _currSource: Optional<AudioBufferSourceNode>;
    public _gainNode: GainNode;
    public _stereoPanNode: Optional<StereoPannerNode>;
    public _free: boolean = true;

    public readonly type: string = 'webAudioContext';

    constructor(game:Game) {
        super(game);
        this._ctx = CtxHolder.getCtx();
        this._gainNode = this._ctx.createGain();
        if (this._ctx.createStereoPanner) {
            this._stereoPanNode = this._ctx.createStereoPanner();
            this._stereoPanNode.pan.value = 0.5;
            this._stereoPanNode.connect(this._ctx.destination);
            this._gainNode.connect(this._stereoPanNode);
        } else {
            this._gainNode.connect(this._ctx.destination);
        }

    }

    public load(buffer:ArrayBuffer, link:ResourceLink<void>, onLoad:()=>void):void {
        if (AudioPlayer.cache[link.getUrl()]) {
            onLoad();
            return;
        }
        decode(buffer, (decoded:AudioBuffer)=>{
            AudioPlayer.cache[link.getUrl()] = decoded;
            onLoad();
        });
    }


    public isCached(l:ResourceLink<void>):boolean{
        return !!AudioPlayer.cache[l.getUrl()];
    }

    public isFree(): boolean {
        return this._free;
    }

    public play(sound:Sound):void {
        this.setLastTimeId();
        this._free = false;
        const currSource:AudioBufferSourceNode = this._ctx.createBufferSource();
        currSource.buffer = AudioPlayer.cache[sound.getResourceLink().getUrl()] as AudioBuffer;
        currSource.loop = sound.loop;
        currSource.connect(this._gainNode);
        currSource.start(0,sound.offset,sound.duration);
        currSource.playbackRate.value = sound.velocity;
        this._gainNode.gain.value = sound.gain;
        if (this._stereoPanNode!==undefined) this._stereoPanNode.pan.value = sound.stereoPan;
        currSource.onended = ()=> {
            this.stop();
        };
        this._currSource = currSource;
    }

    public stop():void {
        const currSource:Optional<AudioBufferSourceNode> = this._currSource;
        if (currSource!==undefined) {
            currSource.stop();
            currSource.disconnect(this._gainNode);
            // tslint:disable-next-line:no-null-keyword
            currSource.onended = null;
        }
        this._currSource = undefined;
        this._free = true;
    }

    public setGain(val:number):void {
        this._gainNode.gain.value = val;
    }

    public setVelocity(val:number):void {
        this._currSource!.playbackRate.value = val;
    }

    public setStereoPan(val:number):void {
        if (this._stereoPanNode!==undefined) this._stereoPanNode.pan.value = val;
    }

    public pause():void {
        this._ctx.suspend();
    }

    public resume():void {
        this._ctx.resume();
    }

    public clone():WebAudioContext{
        return new WebAudioContext(this.game);
    }
}
