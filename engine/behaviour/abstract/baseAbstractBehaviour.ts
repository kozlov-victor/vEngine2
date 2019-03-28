import {DebugError} from "../../debug/debugError";
import {Game} from "../../game";
import {IKeyVal} from "../../misc/object";
import {RenderableModel} from "@engine/model/renderableModel";


export abstract class BaseAbstractBehaviour {

    protected game:Game;
    protected parameters:IKeyVal;

    protected constructor(game:Game,parameters:IKeyVal){
        this.game = game;
        this.parameters = parameters;
    }

    manage(gameObject:RenderableModel){
        console.error(this);
        if (DEBUG) throw new DebugError(`BaseAbstractBehaviour: method 'manage' not implemented`);
    }

    onUpdate(){}

    destroy(){}

}