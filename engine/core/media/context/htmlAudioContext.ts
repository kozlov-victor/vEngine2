import {IAudioContext} from "./iAudioContext";
import {Game} from "../../game";




interface Clazz<T> {
    new() : T;
}

class CtxHolder {
    static getCtx():HTMLAudioElement{
        let Ctx:Clazz<HTMLAudioElement> = window && (window as any).Audio;
        return new Ctx();
    };

}


export class HtmlAudioContext implements IAudioContext{
    readonly type: string = 'htmlAudioContext';
    private free: boolean = true;
    private _ctx: HTMLAudioElement;

    static isAcceptable():boolean{
        return !!(window && (window as any).Audio);
    }
    load(url:string,progress:Function,callBack:Function){
        callBack();
    }

    constructor(private game:Game) {
        this._ctx = CtxHolder.getCtx();
    }

    isFree(): boolean {
        return this.free;
    }

    play(resourcePath:string, loop: boolean) {

        let url:string;
        // if (EMBED_RESOURCES) { // todo
        //     // let base64Url = this.game.repository.embeddedResources[resourcePath];
        //     // url = base64Url;
        //     // if (DEBUG && !base64Url) throw new DebugError(`no embedded resource provided by url ${resourcePath}`)
        // } else

        url = resourcePath;

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


}
