import type {Sound} from "@engine/media/sound";
import type {BasicAudioContext} from "@engine/media/context/basicAudioContext";
import {Optional} from "@engine/core/declarations";
import type {AudioNode} from "@engine/media/audioNode";

export const enum FREE_AUDIO_NODE_SEARCH_STRATEGY  {
    GET_OLDEST,
    GET_OLDEST_NOT_LOOP,
    SKIP_IF_NOT_FREE
}

export abstract class UploadedSoundLink {

    protected constructor(public readonly url:string) {
    }

}

export class UploadSoundLinkImpl extends UploadedSoundLink {
    constructor(url:string) {
        super(url);
    }
}

export interface IAudioPlayer {

    freeNodeSearchStrategy:FREE_AUDIO_NODE_SEARCH_STRATEGY;

    uploadBufferToContext(url:string, buffer:ArrayBuffer):Promise<UploadedSoundLink>;
    play(sound:Sound):void;
    stop(sound:Sound):void;
    loop(sound:Sound):void;
    setGain(sound:Sound):void;
    setStereoPan(sound:Sound):void;
    stopAll():void;
    pauseAll():void;
    resumeAll():void;
    isCached(url:string):boolean;
    getContext():BasicAudioContext;
    getNodeBySound(sound:Sound):Optional<AudioNode>;

}
