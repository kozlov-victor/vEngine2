import {WebAudioContext} from "./context/webAudioContext";
import {HtmlAudioContext} from "./context/htmlAudioContext";
import {AudioNodeSet} from "./audioNodeSet";
import {Sound} from "./sound";
import {AudioNode} from "./audioNode";
import {Game} from "../core/game";
import {FREE_AUDIO_NODE_SEARCH_STRATEGY, IAudioPlayer, UploadedSoundLink} from "@engine/media/interface/iAudioPlayer";
import {Optional} from "@engine/core/declarations";
import {BasicAudioContext} from "@engine/media/context/basicAudioContext";

export  class AudioPlayer implements IAudioPlayer {

    public static cache:{[key:string]:AudioBuffer|string} = {};
    public static DEFAULT_AUDIO_NODES_COUNT:number = 6;

    public freeNodeSearchStrategy:FREE_AUDIO_NODE_SEARCH_STRATEGY = FREE_AUDIO_NODE_SEARCH_STRATEGY.GET_OLDEST;

    private readonly _audioContext:BasicAudioContext;
    private _audioNodeSet:AudioNodeSet;

    constructor(private game:Game) {
        if (WebAudioContext.isAcceptable()) {
            this._audioContext = new WebAudioContext(game,this);
        } else if (HtmlAudioContext.isAcceptable()) {
            this._audioContext = new HtmlAudioContext(game,this);
        } else {
            this._audioContext = new BasicAudioContext(game,this);
        }
        this._audioNodeSet = new AudioNodeSet(game,this._audioContext,AudioPlayer.DEFAULT_AUDIO_NODES_COUNT);
    }

    public async uploadBufferToContext(url:string, buffer:ArrayBuffer):Promise<UploadedSoundLink> {
        return await this._audioContext.uploadBufferToContext(url, buffer);
    }

    public isCached(url:string):boolean {
        return this._audioContext.isCached(url);
    }

    public play(sound:Sound):void {

        const node:Optional<AudioNode> = this._audioNodeSet.getFreeNode(sound.getUrl());

        if (node===undefined) {
            if (DEBUG) {
                console.log('no free node to play sound');
            }
            return;
        }
        node.play(sound);
    }

    public stop(sound:Sound):void {
        const node:Optional<AudioNode> = this._audioNodeSet.getNodeBySound(sound);
        if (node===undefined) return;
        node.stop();
    }

    public loop(sound:Sound):void {
        const node:Optional<AudioNode> = this._audioNodeSet.getNodeBySound(sound);
        if (node===undefined) return;
        node.loop(sound.loop);
    }

    public getContext():BasicAudioContext {
        return this._audioContext;
    }

    public setGain(sound: Sound): void {
        const node:Optional<AudioNode> = this._audioNodeSet.getNodeBySound(sound);
        if (node===undefined) return;
        node.setGain(sound.velocity);
    }

    public setStereoPan(sound: Sound): void {
        const node:Optional<AudioNode> = this._audioNodeSet.getNodeBySound(sound);
        if (node===undefined) return;
        node.setStereoPan(sound.stereoPan);
    }

    public stopAll():void {
        this._audioNodeSet.stopAll();
    }

    public pauseAll():void {
        this._audioNodeSet.pauseAll();
    }

    public resumeAll():void {
        this._audioNodeSet.resumeAll();
    }

    public getNodeBySound(sound:Sound):Optional<AudioNode> {
        return this._audioNodeSet.getNodeBySound(sound);
    }

    public update(time:number,delta:number):void {

    }

}
