import {WebAudioContext} from "./context/webAudioContext";
import {HtmlAudioContext} from "./context/htmlAudioContext";
import {AudioNodeSet} from "./audioNodeSet";
import {Sound} from "./sound";
import {AudioNode} from "./audioNode";
import {Game} from "../core/game";
import {ResourceLink} from "@engine/resources/resourceLink";
import {FREE_AUDIO_NODE_SEARCH_STRATEGY, IAudioPlayer} from "@engine/media/interface/iAudioPlayer";
import {Optional} from "@engine/core/declarations";
import {BasicAudioContext} from "@engine/media/context/basicAudioContext";

export  class AudioPlayer implements IAudioPlayer {

    public static cache:{[key:string]:AudioBuffer|string} = {};
    public static DEFAULT_AUDIO_NODES_COUNT:number = 6;

    public freeNodeSearchStrategy:FREE_AUDIO_NODE_SEARCH_STRATEGY = FREE_AUDIO_NODE_SEARCH_STRATEGY.GET_OLDEST;

    private readonly audioContext:BasicAudioContext;
    private audioNodeSet:AudioNodeSet;

    constructor(private game:Game) {
        if (WebAudioContext.isAcceptable()) {
            this.audioContext = new WebAudioContext(game,this);
        } else if (HtmlAudioContext.isAcceptable()) {
            this.audioContext = new HtmlAudioContext(game,this);
        } else {
            this.audioContext = new BasicAudioContext(game,this);
        }
        this.audioNodeSet = new AudioNodeSet(game,this.audioContext,AudioPlayer.DEFAULT_AUDIO_NODES_COUNT);
    }

    public async loadSound(buffer:ArrayBuffer, link:ResourceLink<void>):Promise<void> {
        await this.audioContext.load(buffer,link);
    }

    public isCached(link:ResourceLink<void>):boolean {
        return this.audioContext.isCached(link);
    }

    public play(sound:Sound):void {

        if (DEBUG) sound.revalidate();

        const node:Optional<AudioNode> = this.audioNodeSet.getFreeNode(sound.getResourceLink().url);

        if (node===undefined) {
            if (DEBUG) {
                console.log('no free node to play sound');
            }
            return;
        }
        node.play(sound);
    }

    public stop(sound:Sound):void {
        const node:Optional<AudioNode> = this.audioNodeSet.getNodeBySound(sound);
        if (node===undefined) return;
        node.stop();
    }

    public loop(sound:Sound):void {
        const node:Optional<AudioNode> = this.audioNodeSet.getNodeBySound(sound);
        if (node===undefined) return;
        node.loop(sound.loop);
    }

    public getContext():BasicAudioContext {
        return this.audioContext;
    }

    public setGain(sound: Sound): void {
        const node:Optional<AudioNode> = this.audioNodeSet.getNodeBySound(sound);
        if (node===undefined) return;
        node.setGain(sound.velocity);
    }

    public setStereoPan(sound: Sound): void {
        const node:Optional<AudioNode> = this.audioNodeSet.getNodeBySound(sound);
        if (node===undefined) return;
        node.setStereoPan(sound.stereoPan);
    }

    public stopAll():void {
        this.audioNodeSet.stopAll();
    }

    public pauseAll():void {
        this.audioNodeSet.pauseAll();
    }

    public resumeAll():void {
        this.audioNodeSet.resumeAll();
    }


    public update(time:number,delta:number):void {

    }

}
