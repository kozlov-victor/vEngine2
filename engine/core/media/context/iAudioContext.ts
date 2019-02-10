
import {Game} from "../../game";
export interface IAudioContext {
    type:string,
    //new(private game: Game): IAudioContext,
    play(resourcePath:string,loop:boolean):void,
    stop():void,
    isFree():boolean,
    setGain(val:number):void,
    pause():void,
    resume():void,
    load(url:string,progress:Function,callBack:Function):void
}