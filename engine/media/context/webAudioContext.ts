import {DebugError} from "@engine/debug/debugError";
import {LoaderUtil} from "../../resources/loaderUtil";
import {AudioPlayer} from "../audioPlayer";
import {Game} from "../../game";
import {ResourceLink} from "@engine/resources/resourceLink";
import {BasicAudioContext} from "@engine/media/context/basicAudioContext";
import {Cloneable} from "@engine/declarations";


interface Clazz<T> {
    new() : T;
}

class CtxHolder {
    private static ctx:Clazz<AudioContext> =
        (window as any).AudioContext ||
        (window as any).webkitAudioContext;
    private static res:AudioContext = null;

    private static fixAutoPlayPolicy():void { // chrome allow playing only with user gesture
        const click =()=>{
            CtxHolder.res.resume();
            document.removeEventListener('click',click);
        };
        document.addEventListener('click',click);
    }

    static getCtx():AudioContext{
        if (CtxHolder.ctx && !CtxHolder.res) {
            CtxHolder.res = new CtxHolder.ctx();
            CtxHolder.fixAutoPlayPolicy();
        }
        return CtxHolder.res;
    }
}



const decode =(buffer:ArrayBuffer,callback:Function)=>{
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


export class WebAudioContext extends BasicAudioContext implements Cloneable<WebAudioContext>{

    _ctx: AudioContext = null;
    _currSource: AudioBufferSourceNode = null;
    _gainNode: GainNode = null;
    _free: boolean = true;

    static isAcceptable():boolean {
        return !!(window && CtxHolder.getCtx());
    }

    load(url:string, link:ResourceLink, onLoad:()=>void):void {
        if (AudioPlayer.cache[url]) {
            onLoad();
            return;
        }
        LoaderUtil.loadBinary(url, 'arraybuffer',(buffer:ArrayBuffer)=> {
            decode(buffer, (decoded:AudioBuffer)=>{
                AudioPlayer.cache[link.getUrl()] = decoded;
                onLoad();
            });
        });

    }

    constructor(game:Game) {
        super(game);
        this._ctx = CtxHolder.getCtx();
        this._gainNode = this._ctx.createGain();
        this._gainNode.connect(this._ctx.destination);
    }

    readonly type: string = 'webAudioContext';

    isFree(): boolean {
        return this._free;
    }

    play(link:ResourceLink, loop:boolean):void {
        this.setLastTimeId();
        this._free = false;
        let currSource:AudioBufferSourceNode = this._ctx.createBufferSource();
        currSource.buffer = AudioPlayer.cache[link.getUrl()];
        currSource.loop = loop;
        currSource.connect(this._gainNode);
        currSource.start(0);
        currSource.onended = ()=> {
            this.stop();
        };
        this._currSource = currSource;
    }

    stop():void {
        const currSource:AudioBufferSourceNode = this._currSource;
        if (currSource) {
            currSource.stop();
            currSource.disconnect(this._gainNode);
        }
        this._currSource = null;
        this._free = true;
    }

    setGain(val:number):void {
        this._gainNode.gain.value = val;

    }

    pause():void {
        this._ctx.suspend();
    }

    resume():void {
        this._ctx.resume();
    }

    clone():WebAudioContext{
        return new WebAudioContext(this.game);
    }
}