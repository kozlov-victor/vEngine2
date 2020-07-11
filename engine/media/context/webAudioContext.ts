import {DebugError} from "@engine/debug/debugError";
import {AudioPlayer} from "../audioPlayer";
import {Game} from "../../core/game";
import {ResourceLink} from "@engine/resources/resourceLink";
import {BasicAudioContext} from "@engine/media/context/basicAudioContext";
import {Clazz, ICloneable, Optional} from "@engine/core/declarations";
import {Sound} from "@engine/media/sound";

export class WebAudioContextHolder {
    public static getAudioContextClass():Optional<Clazz<AudioContext>>{
        return (window as any).AudioContext ||
            (window as any).webkitAudioContext || undefined;
    }

    public static getNewAudioContext():Optional<AudioContext>{
        const clazz = WebAudioContextHolder.getAudioContextClass();
        if (clazz===undefined) return undefined;
        const c:AudioContext = new clazz();
        CtxHolder.fixAutoPlayPolicy(c);
        return c;
    }
}

class CtxHolder {

    public static getCtx():Optional<AudioContext>{
        if (CtxHolder._ctx && !CtxHolder._res) {
            CtxHolder._res = new CtxHolder._ctx();
            CtxHolder.fixAutoPlayPolicy(CtxHolder._res);
        }
        return CtxHolder._res;
    }

    public static fixAutoPlayPolicy(res:AudioContext):void { // chrome allow playing only with user gesture
        const listener =()=>{
            res.resume();
            document.removeEventListener('click',listener);
        };
        document.addEventListener('click',listener);
    }
    private static _ctx:Optional<Clazz<AudioContext>> = WebAudioContextHolder.getAudioContextClass();
    private static _res:AudioContext;
}



const decode =(buffer:ArrayBuffer):Promise<AudioBuffer>=>{
    return new Promise<AudioBuffer>((resolve, reject)=>{
        CtxHolder.getCtx()!.decodeAudioData(
            buffer,
            (decoded:AudioBuffer)=> {
                resolve(decoded);
            },
            (err:DOMException)=>{
                reject(err.message);
            }
        );
    });

};

class NodeChain {

    private _currentRoot:AudioNode;

    constructor(private readonly root:AudioNode) {
        this._currentRoot = root;
    }

    public getLastNode():AudioNode{
        return this._currentRoot;
    }

    addNode(node:AudioNode):void{
        node.connect(this._currentRoot);
        this._currentRoot = node;
    }

}

// todo doesnt work yet
const createFeedBackDelayNodePair = (context:AudioContext):Optional<{delayNode: DelayNode, gainNode: GainNode }>=>{
    if (context.createDelay===undefined) return undefined;
    const delayNode = context.createDelay(1);
    delayNode.delayTime.value = 0;
    const gainNode = context.createGain();
    gainNode.gain.value = 0;
    delayNode.connect(gainNode);
    gainNode.connect(delayNode);
    const rootGainNode = context.createGain();
    rootGainNode.gain.value = 1;
    gainNode.connect(rootGainNode);
    return {delayNode,gainNode};
};


export class WebAudioContext extends BasicAudioContext implements ICloneable<WebAudioContext>{

    public static isAcceptable():boolean {
        return !!(window && CtxHolder.getCtx());
    }

    public static getContext():AudioContext{
        return CtxHolder.getCtx()!;
    }

    private readonly _ctx: AudioContext;
    private _currSource: Optional<AudioBufferSourceNode>;
    private readonly _gainNode: GainNode;
    private readonly _stereoPanNode: Optional<StereoPannerNode>;
    private _free: boolean = true;
    private readonly _feedBackDelayNodePair:Optional<{delayNode: DelayNode, gainNode: GainNode }>;

    public readonly type: string = 'webAudioContext';

    private _nodeChain:NodeChain;

    constructor(protected game:Game,protected audioPLayer:AudioPlayer) {
        super(game,audioPLayer);
        this._ctx = CtxHolder.getCtx()!;
        this._nodeChain = new NodeChain(this._ctx.destination);
        this._gainNode = this._ctx.createGain();
        this._nodeChain.addNode(this._gainNode);
        if (this._ctx.createStereoPanner) {
            this._stereoPanNode = this._ctx.createStereoPanner();
            this._stereoPanNode.pan.value = 0.5;
            this._nodeChain.addNode(this._stereoPanNode);
        }
        this._feedBackDelayNodePair = createFeedBackDelayNodePair(this._ctx);
        if (this._feedBackDelayNodePair!==undefined) this._nodeChain.addNode(this._feedBackDelayNodePair.gainNode);
    }

    public async load(buffer:ArrayBuffer, link:ResourceLink<void>):Promise<void> {
        if (AudioPlayer.cache[link.getUrl()]) {
            return undefined;
        }
        AudioPlayer.cache[link.getUrl()] = await decode(buffer);
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
        currSource.connect(this._nodeChain.getLastNode());
        currSource.start(0,sound.offset,sound.duration);
        this._currSource = currSource;
        currSource.onended = ()=> {
            this.stop();
        };
        super.play(sound);

    }

    public stop():void {
        const currSource:Optional<AudioBufferSourceNode> = this._currSource;
        if (currSource!==undefined) {
            currSource.stop();
            currSource.disconnect(this._nodeChain.getLastNode());
            // tslint:disable-next-line:no-null-keyword
            currSource.onended = null;
        }
        this._currSource = undefined;
        this._free = true;
    }

    public setGain(val:number):void {
        this._gainNode.gain.value = val;
    }

    public setFeedbackDelay(delayTime:number,gain:number):void {
        if (this._feedBackDelayNodePair!==undefined) {
            this._feedBackDelayNodePair.delayNode.delayTime.value = delayTime;
            this._feedBackDelayNodePair.gainNode.gain.value = gain;
        }
    }

    public setVelocity(val:number):void {
        this._currSource!.playbackRate.value = val;
    }

    public setStereoPan(val:number):void {
        if (this._stereoPanNode!==undefined) this._stereoPanNode.pan.value = val;
    }

    public loop(val:boolean):void {
        this._currSource!.loop = val;
    }

    public pause():void {
        this._ctx.suspend();
    }

    public resume():void {
        this._ctx.resume();
    }

    public clone():WebAudioContext{
        return new WebAudioContext(this.game,this.audioPLayer);
    }
}
