import {Game} from "../../game";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Cloneable} from "@engine/declarations";
import {Incrementer} from "@engine/resources/incrementer";


export class BasicAudioContext implements Cloneable<BasicAudioContext>{

    readonly type:string = 'basicAudioContext';
    private _lastTimeId:number = 0;

    static isAcceptable():boolean{
        DEBUG && console.log('audio not supported');
        return true
    }

    constructor(protected game:Game){

    }

    protected setLastTimeId():void {
        this._lastTimeId = Incrementer.getValue();
    };

    public getLastValueId():number{
        return this._lastTimeId;
    }

    play(link:ResourceLink,loop:boolean){}
    stop():void{}
    isFree():boolean{return false}
    setGain(val:number):void{}
    pause():void{}
    resume():void{}
    load(url:string,link:ResourceLink,callBack:()=>void):void{
        callBack();
    }
    clone():BasicAudioContext{
        return new BasicAudioContext(this.game);
    }

}

