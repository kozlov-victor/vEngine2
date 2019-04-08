import {Sound} from "../model/impl/sound";
import {ResourceLink} from "@engine/resources/resourceLink";
import {BasicAudioContext} from "@engine/media/context/basicAudioContext";

// todo incrementer
const getOrder = ():number=> {
    return 0;
};

export class AudioNode {

    currSound:Sound = null;

    constructor(public context:BasicAudioContext){}

    play(link:ResourceLink,loop:boolean = false):void {
        this.context.play(link,loop);
    }

    stop():void {
        this.context.stop();
        this.currSound = null;
    }

    setGain(val:number):void {
        this.context.setGain(val);
    }

    pause():void {
        this.context.pause();
    }

    resume():void {
        this.context.resume();
    }

    isFree():boolean {
        return this.context.isFree();
    }

    getCurrSound():Sound {
        return this.currSound;
    }

}

