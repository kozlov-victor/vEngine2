import {Game} from "../../core/game";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ICloneable} from "@engine/core/declarations";
import {Incrementer} from "@engine/resources/incrementer";
import {Sound} from "@engine/media/sound";


export class BasicAudioContext implements ICloneable<BasicAudioContext>{


    public static isAcceptable():boolean{
        if (DEBUG) console.log('audio is not supported');
        return true;
    }

    public readonly type:string = 'basicAudioContext';
    private _lastTimeId:number = 0;

    constructor(protected game:Game){

    }

    public getLastValueId():number{
        return this._lastTimeId;
    }

    public setRawData(data:Uint8Array){
        // todo
    }


    public play(sound:Sound){}
    public stop():void{}
    public isFree():boolean{return false;}
    public setGain(val:number):void{}
    public setVelocity(val:number):void{}
    public pause():void{}
    public resume():void{}
    public load(url:string,link:ResourceLink<void>,onProgress:(n:number)=>void,onLoad:()=>void):void{
        onLoad();
    }
    public clone():BasicAudioContext{
        return new BasicAudioContext(this.game);
    }

    protected setLastTimeId():void {
        this._lastTimeId = Incrementer.getValue();
    }
}

