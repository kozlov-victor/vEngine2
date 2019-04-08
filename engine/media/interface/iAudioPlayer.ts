import {ResourceLink} from "@engine/resources/resourceLink";
import {Sound} from "@engine/model/impl/sound";

export interface IAudioPlayer {

    loadSound(url:string, link:ResourceLink, onLoad:()=>void):void,
    play(sound:Sound):void,
    stop(sound:Sound):void,
    stopAll():void,
    pauseAll():void,
    resumeAll():void,
    setGain(sound:Sound):void,

}
