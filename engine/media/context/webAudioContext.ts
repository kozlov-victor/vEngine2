import {DebugError} from "@engine/debug/debugError";
import {LoaderUtil} from "../../resources/loaderUtil";
import {AudioPlayer} from "../audioPlayer";
import {Game} from "../../game";
import {ResourceLink} from "@engine/resources/resourceLink";
import {BasicAudioContext} from "@engine/media/context/basicAudioContext";
import {Clazz, ICloneable} from "@engine/declarations";
import {Sound} from "@engine/model/impl/general/sound";



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
        const click =()=>{
            CtxHolder.res.resume();
            document.removeEventListener('click',click);
        };
        document.addEventListener('click',click);
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
    public _currSource!: AudioBufferSourceNode;
    public _gainNode: GainNode;
    public _free: boolean = true;

    public readonly type: string = 'webAudioContext';

    constructor(game:Game) {
        super(game);
        this._ctx = CtxHolder.getCtx();
        this._gainNode = this._ctx.createGain();
        this._gainNode.connect(this._ctx.destination);
    }

    public load(url:string, link:ResourceLink<void>, onLoad:()=>void):void {
        if (AudioPlayer.cache[url]) {
            onLoad();
            return;
        }
        LoaderUtil.loadRaw(url, 'arraybuffer',(buffer:ArrayBuffer|string)=> {
            decode(buffer as ArrayBuffer, (decoded:AudioBuffer)=>{
                AudioPlayer.cache[link.getUrl()] = decoded;
                onLoad();
            });
        });

    }

    public isFree(): boolean {
        return this._free;
    }

    public play(sound:Sound):void {
        this.setLastTimeId();
        this._free = false;
        const currSource:AudioBufferSourceNode = this._ctx.createBufferSource();
        currSource.buffer = AudioPlayer.cache[sound.getResourceLink().getUrl()];
        currSource.loop = sound.loop;
        currSource.connect(this._gainNode);
        currSource.start(0);
        currSource.playbackRate.value = sound.velocity;
        currSource.onended = ()=> {
            this.stop();
        };
        this._currSource = currSource;
    }

    public stop():void {
        const currSource:AudioBufferSourceNode = this._currSource;
        if (currSource) {
            currSource.stop();
            currSource.disconnect(this._gainNode);
            currSource.onended = undefined;
        }
        this._currSource = null!;
        this._free = true;
    }

    public setGain(val:number):void {
        this._gainNode.gain.value = val;
    }

    public setVelocity(val:number):void {
        this._currSource.playbackRate.value = val;
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
