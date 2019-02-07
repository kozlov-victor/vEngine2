import {WebAudioContext} from "./context/webAudioContext";
import {HtmlAudioContext} from "./context/htmlAudioContext";
import {FakeAudioContext} from "./context/fakeAudioContext";
import {AudioNodeSet} from "./audioNodeSet";
import {IAudioContext} from "./context/iAudioContext";
import {Sound} from "../../model/impl/sound";
import {AudioNode} from "./audioNode";
import {Tween} from "../tween";
import {Game} from "../game";
import {Clazz} from "../misc/clazz";
import {removeFromArray} from "@engine/core/misc/object";


export  class AudioPlayer {

    private readonly contextClass:Clazz<IAudioContext>;
    private audioNodeSet:AudioNodeSet;
    private tweens:Tween[] = [];

    static cache:{[key:string]:any} = {};
    static DEFAULT_AUDIO_NODES_COUNT:number = 6;

    constructor(private game:Game){
        if (WebAudioContext.isAcceptable()) {
            this.contextClass = WebAudioContext;
        } else if (HtmlAudioContext.isAcceptable()) {
            this.contextClass = HtmlAudioContext;
        } else {
            this.contextClass = FakeAudioContext;
        }
        this.audioNodeSet = new AudioNodeSet(game,this.contextClass,AudioPlayer.DEFAULT_AUDIO_NODES_COUNT);
    }

    loadSound(url:string, progress:Function, callback:Function) {
        new this.contextClass(this.game).load(url,progress,callback);
    }

    play(sound:Sound){
        let node:AudioNode = this.audioNodeSet.getFreeNode();
        if (DEBUG && !node) {
            console.log('no free node to play sound');
        }
        if (!node) return;
        node.play(sound.resourcePath,sound.loop);
    }

    stop(sound:Sound){
        let node:AudioNode = this.audioNodeSet.getNodeBySound(sound);
        if (!node) return;
        node.stop();
    }

    stopAll(){
        this.audioNodeSet.stopAll();
    }

    pauseAll(){
        this.audioNodeSet.pauseAll();
    }

    resumeAll(){
        this.audioNodeSet.resumeAll();
    }

    setGain(sound:Sound,val:number,time:number = 0){
        let node:AudioNode = this.audioNodeSet.getNodeBySound(sound);
        if (!node) return;
        if (time) {
            let tween:Tween = new Tween({
                target: sound,
                to: {_gain:val},
                time,
                progress:(progressObj)=>{
                    node.setGain(progressObj._gain);
                },
                complete: ()=>{
                    removeFromArray(this.tweens,it=>it===tween);
                }
            });
            this.tweens.push(tween);

        } else {
            sound._gain = val;
            node.setGain(sound._gain);
        }
    }

    update(time:number,delta:number){
        this.tweens.forEach((t:Tween)=>{
            t.update(time);
        })
    }

}