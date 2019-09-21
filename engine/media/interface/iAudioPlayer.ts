import {ResourceLink} from "@engine/resources/resourceLink";
import {Sound} from "@engine/media/sound";
import {BasicAudioContext} from "@engine/media/context/basicAudioContext";

export interface IAudioPlayer {

    loadSound(buffer:ArrayBuffer, link:ResourceLink<void>, onLoad:()=>void):void;
    play(sound:Sound):void;
    stop(sound:Sound):void;
    stopAll():void;
    pauseAll():void;
    resumeAll():void;
    setGain(sound:Sound):void;
    setVelocity(sound:Sound):void;
    setStereoPan(sound:Sound):void;
    isCached(link:ResourceLink<void>):boolean;
    getContext():BasicAudioContext;

}
