import {Game} from "../../game";
import {DebugError} from "../../debug/debugError";
import {Resource} from "@engine/resources/resource";
import {Revalidatable} from "@engine/declarations";

export class Sound extends Resource implements Revalidatable {

    readonly type:string = 'Sound';
    loop:boolean = false;

    private _gain:number = 1;
    constructor(protected game:Game){
        super();
    }

    revalidate(){
        if (!this.getResourceLink()) throw new DebugError(`can not play sound: resource link is not set`);
    }

    play(){
        this.game.getAudioPlayer().play(this);
    }
    stop(){
        this.game.getAudioPlayer().stop(this);
    }
    pause(){
        throw new DebugError('not implemented');
    }
    setGain(val:number){
        this._gain = val;
        this.game.getAudioPlayer().setGain(this);
    }
    getGain():number{
        return this._gain;
    }
}