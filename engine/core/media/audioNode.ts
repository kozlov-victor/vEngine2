import {IAudioContext} from "./context/iAudioContext";
import {Sound} from "../../model/impl/sound";


export class AudioNode {

    currSound:Sound = null;

    constructor(private context:IAudioContext){}


    play(resourcePath:string,loop:boolean = false){
        //this.currSound = ;
        this.context.play(resourcePath,loop);
    }

    stop() {
        this.context.stop();
        this.currSound = null;
    }

    setGain(val){
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

