import {ResourceLink} from "@engine/resources/resourceLink";
import {BasicAudioContext} from "@engine/media/context/basicAudioContext";
import {Sound} from "@engine/model/impl/general/sound";


export class AudioNode {

    private currSound!:Sound|null;

    constructor(public context:BasicAudioContext){}

    public play(link:ResourceLink<void>,loop:boolean = false):void {
        this.context.play(link,loop);
        // todo currSound is always undefined
    }

    public stop():void {
        this.context.stop();
        this.currSound = null;
    }

    public setGain(val:number):void {
        this.context.setGain(val);
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

    public getCurrSound():Sound|null {
        return this.currSound;
    }

}

