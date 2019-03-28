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

    play(link:ResourceLink,loop:boolean = false){
        this.context.play(link,loop);
    }

    stop() {
        this.context.stop();
        this.currSound = null;
    }

    setGain(val:number){
        this.context.setGain(val);
    }

    pause() {
        this.context.pause();
    }

    resume() {
        this.context.resume();
    }

    isFree():boolean {
        return this.context.isFree();
    }

    getCurrSound():Sound {
        return this.currSound;
    }

}

