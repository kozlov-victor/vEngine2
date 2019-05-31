import {Game} from "../../game";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ICloneable} from "@engine/declarations";
import {Incrementer} from "@engine/resources/incrementer";


export class BasicAudioContext implements ICloneable<BasicAudioContext>{


    public static isAcceptable():boolean{
        if (DEBUG) console.log('audio not supported');
        return true;
    }

    public readonly type:string = 'basicAudioContext';
    private _lastTimeId:number = 0;

    constructor(protected game:Game){

    }

    public getLastValueId():number{
        return this._lastTimeId;
    }

    public play(link:ResourceLink<void>,loop:boolean){}
    public stop():void{}
    public isFree():boolean{return false;}
    public setGain(val:number):void{}
    public pause():void{}
    public resume():void{}
    public load(url:string,link:ResourceLink<void>,callBack:()=>void):void{
        callBack();
    }
    public clone():BasicAudioContext{
        return new BasicAudioContext(this.game);
    }

    protected setLastTimeId():void {
        this._lastTimeId = Incrementer.getValue();
    }
}

