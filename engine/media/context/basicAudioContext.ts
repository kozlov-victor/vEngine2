import {Game} from "../../core/game";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ICloneable} from "@engine/core/declarations";
import {Incrementer} from "@engine/resources/incrementer";
import {Sound} from "@engine/media/sound";
import {AudioPlayer} from "@engine/media/audioPlayer";


export class BasicAudioContext implements ICloneable<BasicAudioContext>{


    public static isAcceptable():boolean{
        if (DEBUG) console.log('audio is not supported');
        return true;
    }

    public readonly type:string = 'basicAudioContext';
    private _lastTimeId:number = 0;

    constructor(protected game:Game, protected audioPlayer:AudioPlayer){

    }

    public getLastValueId():number{
        return this._lastTimeId;
    }

    public isCached(l:ResourceLink<void>):boolean{
        return false;
    }

    public getAudioPlayer():AudioPlayer {
        return this.audioPlayer;
    }

    public play(sound:Sound){
        this.loop(sound.loop);
        this.setGain(sound.gain);
        this.setVelocity(sound.velocity);
        this.setStereoPan(sound.stereoPan);
        this.setFeedbackDelay(sound.feedbackDelay.delayTime,sound.feedbackDelay.gain);
    }
    public stop():void{}
    public isFree():boolean{return false;}
    public setGain(val:number):void{}
    public setVelocity(val:number):void{}
    public setStereoPan(val:number):void{}
    public loop(val:boolean):void{}
    public pause():void{}
    public resume():void{}
    public setFeedbackDelay(delayTime:number,gain:number):void {}
    public load(buffer:ArrayBuffer,link:ResourceLink<void>):Promise<void>{
        return Promise.resolve();
    }
    public clone():BasicAudioContext{
        return new BasicAudioContext(this.game,this.audioPlayer);
    }

    protected setLastTimeId():void {
        this._lastTimeId = Incrementer.getValue();
    }
}

