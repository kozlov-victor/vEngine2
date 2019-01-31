
import {Game} from "../../game";
export interface IAudioContext {
    type:string,
    //new(private game: Game): IAudioContext,
    play(resourcePath:string,loop:boolean),
    stop(),
    isFree():boolean,
    setGain(val:number),
    pause(),
    resume(),
    load(url:string,progress:Function,callBack:Function)
}