import {Game} from "../../core/game";
import {DebugError} from "../../debugError";
import {CommonObject} from "../commonObject";

export class Sound extends CommonObject {

    type:string = 'Sound';
    resourcePath:string = '';
    _gain:number = 1;
    loop:boolean =false;

    constructor(protected game:Game){
        super();
    }

    play(){
        this.game.audioPlayer.play(this);
    }
    stop(){
        this.game.audioPlayer.stop(this);
    }
    pause(){
        throw new DebugError('not implemented');
    }
    setGain(val:number,time:number,easeFnName:string){
        //audioPlayer.setGain(this,val,time,easeFnName);
    }
}