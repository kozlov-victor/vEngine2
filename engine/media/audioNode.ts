import {BasicAudioContext} from "@engine/media/context/basicAudioContext";
import {Sound} from "@engine/media/sound";
import {Optional} from "@engine/core/declarations";


export class AudioNode {

    private currSound:Optional<Sound>;

    constructor(public context:BasicAudioContext){}

    public play(sound:Sound):void {
        this.stop();
        this.context.play(sound);
        this.currSound = sound;
    }

    public stop():void {
        this.context.stop();
        this.currSound = undefined;
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

    public resume():void {
        this.context.resume();
    }

    public isFree():boolean {
        return this.context.isFree();
    }

    public getCurrSound():Optional<Sound> {
        return this.currSound;
    }

}

