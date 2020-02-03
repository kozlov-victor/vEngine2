import {WebAudioContext} from "./context/webAudioContext";
import {HtmlAudioContext} from "./context/htmlAudioContext";
import {AudioNodeSet} from "./audioNodeSet";
import {Sound} from "./sound";
import {AudioNode} from "./audioNode";
import {Game} from "../core/game";
import {ResourceLink} from "@engine/resources/resourceLink";
import {BasicAudioContext} from "@engine/media/context/basicAudioContext";
import {IAudioPlayer} from "@engine/media/interface/iAudioPlayer";
import {Optional} from "@engine/core/declarations";


export  class AudioPlayer implements IAudioPlayer {

    public static cache:{[key:string]:AudioBuffer|string} = {};
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

    public async loadSound(buffer:ArrayBuffer, link:ResourceLink<void>):Promise<void> {
        await this.audioContext.load(buffer,link);
    }

    public isCached(link:ResourceLink<void>):boolean {
        return this.audioContext.isCached(link);
    }

    public play(sound:Sound):void {

        if (DEBUG) sound.revalidate();

        const node:Optional<AudioNode> = this.audioNodeSet.getFreeNode();

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


    public update(time:number,delta:number):void {

    }

}
