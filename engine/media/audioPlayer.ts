import {WebAudioContext} from "./context/webAudioContext";
import {HtmlAudioContext} from "./context/htmlAudioContext";
import {AudioNodeSet} from "./audioNodeSet";
import {Sound} from "../model/impl/sound";
import {AudioNode} from "./audioNode";
import {Game} from "../game";
import {ResourceLink} from "@engine/resources/resourceLink";
import {BasicAudioContext} from "@engine/media/context/basicAudioContext";
import {IAudioPlayer} from "@engine/media/interface/iAudioPlayer";


export  class AudioPlayer implements IAudioPlayer {

    private readonly audioContext:BasicAudioContext;
    private audioNodeSet:AudioNodeSet;

    static cache:{[key:string]:any} = {};
    static DEFAULT_AUDIO_NODES_COUNT:number = 6;

    constructor(private game:Game){
        if (WebAudioContext.isAcceptable()) {
            this.audioContext = new WebAudioContext(game);
        } else if (HtmlAudioContext.isAcceptable()) {
            this.audioContext = new HtmlAudioContext(game);
        } else {
            this.audioContext = new BasicAudioContext(game);
        }
        this.audioNodeSet = new AudioNodeSet(game,this.audioContext,AudioPlayer.DEFAULT_AUDIO_NODES_COUNT);
    }

    loadSound(url:string, link:ResourceLink, onLoad:()=>void):void {
        this.audioContext.load(url,link,onLoad);
    }

    play(sound:Sound):void {

        if (DEBUG) sound.revalidate();

        let node:AudioNode = this.audioNodeSet.getFreeNode();
        if (DEBUG && !node) {
            console.log('no free node to play sound');
        }
        if (!node) return;
        node.play(sound.getResourceLink(),sound.loop);
    }

    stop(sound:Sound):void {
        let node:AudioNode = this.audioNodeSet.getNodeBySound(sound);
        if (!node) return;
        node.stop();
    }

    stopAll():void {
        this.audioNodeSet.stopAll();
    }

    pauseAll():void {
        this.audioNodeSet.pauseAll();
    }

    resumeAll():void {
        this.audioNodeSet.resumeAll();
    }

    setGain(sound:Sound):void {
        let node:AudioNode = this.audioNodeSet.getNodeBySound(sound);
        if (!node) return;
        node.setGain(sound.getGain());
    }

    update(time:number,delta:number):void {

    }

}