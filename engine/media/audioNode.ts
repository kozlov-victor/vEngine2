import {BasicAudioContext} from "@engine/media/context/basicAudioContext";
import {Sound} from "@engine/media/sound";
import {Optional} from "@engine/core/declarations";


export class AudioNode {

    private _currSound:Optional<Sound>;
    private _lastPlayedUrl:Optional<string>;

    constructor(public context:BasicAudioContext){}

    public play(sound:Sound):void {
        this.stop();
        this.context.play(sound);
        this._currSound = sound;
        this._lastPlayedUrl = sound.getUrl();
    }

    public stop():void {
        this.context.stop();
        this._currSound = undefined;
    }

    public setGain(val:number):void {
        this.context.setGain(val);
    }

    public setStereoPan(val:number):void {
        this.context.setStereoPan(val);
    }

    public setVelocity(val:number):void {
        this.context.setVelocity(val);
    }

    public pause():void {
        this.context.pause();
    }

    public loop(val:boolean):void{
        this.context.loop(val);
    }

    public resume():void {
        this.context.resume();
    }

    public isFree():boolean {
        return this.context.isFree();
    }

    public getLastPlayedUrl():Optional<string> {
        return this._lastPlayedUrl;
    }

    public isLooped():boolean {
        if (this._currSound===undefined) return false;
        return this._currSound.loop;
    }

    public getCurrSound():Optional<Sound> {
        return this._currSound;
    }

    public getCurrentTime():number {
        return this.context.getCurrentTime();
    }

}

