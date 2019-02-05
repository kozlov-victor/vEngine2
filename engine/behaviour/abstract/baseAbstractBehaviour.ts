
import {DebugError} from "../../debugError";

import {GameObject} from "../../model/impl/gameObject";
import {Game} from "../../core/game";
import {IKeyVal} from "../../core/misc/object";


export class BaseAbstractBehaviour {

    protected game:Game;
    protected parameters:IKeyVal;

    constructor(game:Game,parameters:IKeyVal){
        this.game = game;
        this.parameters = parameters;
    }

    manage(gameObject:GameObject){
        console.error(this);
        if (DEBUG) throw new DebugError(`BaseAbstractBehaviour: method 'manage' not implemented`);
    }

    onUpdate(time:number,delta:number){}

    destroy(){}

}