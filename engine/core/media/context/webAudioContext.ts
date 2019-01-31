import {DebugError} from "../../../debugError";
import {IAudioContext} from "./iAudioContext";
import {LoaderUtil} from "../../resources/loaderUtil";
import {AudioPlayer} from "../audioPlayer";
import {Game} from "../../game";



interface Clazz<T> {
    new() : T;
}

class CtxHolder {
    private static ctx:Clazz<AudioContext> = (window as any).AudioContext;
    private static res:AudioContext = null;

    private static fixAutoPlayPolicy(){
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
        function(decoded) {
            callback(decoded);
        },
        function(err){
            if (DEBUG) throw new DebugError(err.message);
        }
    );
};

const base64ToArrayBuffer = (base64:string):ArrayBuffer=> {
    let binary_string =  window.atob(base64);
    let len = binary_string.length;
    let bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
};

export class WebAudioContext implements IAudioContext {

    static isAcceptable() {
        return !!(window && CtxHolder.getCtx());
    }

    load(url:string, progress:Function, onLoad:()=>void) {
        if (AudioPlayer.cache[url]) {
            onLoad();
            return;
        }
        LoaderUtil.loadBinary(url, progress,  (buffer:ArrayBuffer)=> {
            decode(buffer, (decoded)=>{
                AudioPlayer.cache[url] = decoded;
                onLoad();
            });
        });

    }

    constructor(private game:Game) {
        this._ctx = CtxHolder.getCtx();
        this._gainNode = this._ctx.createGain();
        this._gainNode.connect(this._ctx.destination);
    }

    readonly type: string = 'webAudioContext';
    _ctx: AudioContext = null;
    _currSource: AudioBufferSourceNode = null;
    _gainNode: GainNode = null;
    _free: boolean = true;

    isFree(): boolean {
        return this._free;
    }

    play(resourcePath:string, loop:boolean) {
        this._free = false;
        let currSource:AudioBufferSourceNode = this._ctx.createBufferSource();
        currSource.buffer = AudioPlayer.cache[resourcePath];
        currSource.loop = loop;
        currSource.connect(this._gainNode);
        currSource.start(0);
        currSource.onended = ()=> {
            this.stop();
        };
        this._currSource = currSource;
    }

    stop() {
        let currSource = this._currSource;
        if (currSource) {
            currSource.stop();
            currSource.disconnect(this._gainNode);
        }
        this._currSource = null;
        this._free = true;
    }

    setGain(val) {
        this._gainNode.gain.value = val;

    }

    pause() {
        this._ctx.suspend();
    }

    resume() {
        this._ctx.resume();
    }
}
