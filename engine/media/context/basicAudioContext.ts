import {Game} from "../../core/game";
import {ICloneable} from "@engine/core/declarations";
import {Incrementer} from "@engine/resources/incrementer";
import {Sound} from "@engine/media/sound";
import {AudioPlayer} from "@engine/media/audioPlayer";
import {UploadedSoundLink, UploadSoundLinkImpl} from "@engine/media/interface/iAudioPlayer";


export class BasicAudioContext implements ICloneable<BasicAudioContext>{

    constructor(protected game:Game, protected audioPlayer:AudioPlayer){

    }

    public readonly type:string = 'basicAudioContext';

    protected startedTime:number = 0;
    protected duration:number = 1;

    private _lastTimeId:number = 0;


    public static isAcceptable():boolean{
        if (DEBUG) console.log('audio is not supported');
        return true;
    }

    public getLastValueId():number{
        return this._lastTimeId;
    }

    public isCached(url:string):boolean{
        return false;
    }

    public getAudioPlayer():AudioPlayer {
        return this.audioPlayer;
    }

    public play(sound:Sound):void{
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
    public uploadBufferToContext(url: string, buffer: ArrayBuffer):Promise<UploadedSoundLink>{
        return Promise.resolve(new UploadSoundLinkImpl(url));
    }

    public clone():BasicAudioContext{
        return new BasicAudioContext(this.game,this.audioPlayer);
    }

    public getCurrentTime():number {
        return 0;
    }

    protected setLastTimeId():void {
        this._lastTimeId = Incrementer.getValue();
    }

}
