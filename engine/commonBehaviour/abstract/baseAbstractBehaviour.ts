
import {DebugError} from "../../debugError";

import {GameObject} from "../../model/impl/gameObject";
import {Game} from "../../core/game";
import {IKeyVal} from "../../core/misc/object";


export class BaseAbstractBehaviour {

    protected game:Game;
    public static instances:Array<BaseAbstractBehaviour> = [];

    constructor(game:Game){
        this.game = game;
        BaseAbstractBehaviour.instances.push(this);
    }

    manage(gameObject:GameObject,parameters:IKeyVal){
        console.error(this);
        if (DEBUG) throw new DebugError(`BaseAbstractBehaviour: method 'manage' not implemented`);
    }

    onUpdate(time:number,delta:number){}

    destroy(){}

    static destroyAll(){
        BaseAbstractBehaviour.instances.forEach((it:BaseAbstractBehaviour)=>{
            it.destroy();
        });
    }

}