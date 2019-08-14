import {WebAudioContext} from "./context/webAudioContext";
import {HtmlAudioContext} from "./context/htmlAudioContext";
import {AudioNodeSet} from "./audioNodeSet";
import {Sound} from "./sound";
import {AudioNode} from "./audioNode";
import {Game} from "../core/game";
import {ResourceLink} from "@engine/resources/resourceLink";
import {BasicAudioContext} from "@engine/media/context/basicAudioContext";
import {IAudioPlayer} from "@engine/media/interface/iAudioPlayer";


export  class AudioPlayer implements IAudioPlayer {

    public static cache:{[key:string]:any} = {};
    public static DEFAULT_AUDIO_NODES_COUNT:number = 6;

    private readonly audioContext:BasicAudioContext;
    private audioNodeSet:AudioNodeSet;

    constructor(private game:Game) {
        if (WebAudioContext.isAcceptable()) {
            this.audioContext = new WebAudioContext(game);
        } else if (HtmlAudioContext.isAcceptable()) {
            this.audioContext = new HtmlAudioContext(game);
        } else {
            this.audioContext = new BasicAudioContext(game);
        }
        this.audioNodeSet = new AudioNodeSet(game,this.audioContext,AudioPlayer.DEFAULT_AUDIO_NODES_COUNT);
    }

    public loadSound(buffer:ArrayBuffer, link:ResourceLink<void>, onLoad:()=>void):void {
        this.audioContext.load(buffer,link,onLoad);
    }

    public isCached(link:ResourceLink<void>):boolean {
        return this.audioContext.isCached(link);
    }

    public play(sound:Sound):void {

        if (DEBUG) sound.revalidate();

        const node:AudioNode|null = this.audioNodeSet.getFreeNode();
        if (DEBUG && !node) {
            console.log('no free node to play sound');
        }
        if (node===null) return;
        node.play(sound);
    }

    public stop(sound:Sound):void {
        const node:AudioNode|null = this.audioNodeSet.getNodeBySound(sound);
        if (node===null) return;
        node.stop();
    }

    public getContext():BasicAudioContext {
        return this.audioContext;
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

    public setGain(sound:Sound):void {
        const node:AudioNode|null = this.audioNodeSet.getNodeBySound(sound);
        if (node===null) return;
        node.setGain(sound.gain);
    }

    public setVelocity(sound:Sound):void {
        const node:AudioNode|null = this.audioNodeSet.getNodeBySound(sound);
        if (node===null) return;
        node.setVelocity(sound.velocity);
    }

    public update(time:number,delta:number):void {

    }

}