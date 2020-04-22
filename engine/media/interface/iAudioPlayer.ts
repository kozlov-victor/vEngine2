import {ResourceLink} from "@engine/resources/resourceLink";
import {Sound} from "@engine/media/sound";
import {BasicAudioContext} from "@engine/media/context/basicAudioContext";

export const enum FREE_AUDIO_NODE_SEARCH_STRATEGY  {
    GET_OLDEST,
    GET_OLDEST_NOT_LOOP,
    SKIP_IF_NOT_FREE
}

export interface IAudioPlayer {

    freeNodeSearchStrategy:FREE_AUDIO_NODE_SEARCH_STRATEGY;

    loadSound(buffer:ArrayBuffer, link:ResourceLink<void>):Promise<void>;
    play(sound:Sound):void;
    stop(sound:Sound):void;
    stopAll():void;
    pauseAll():void;
    resumeAll():void;
    isCached(link:ResourceLink<void>):boolean;
    getContext():BasicAudioContext;

}
