import {DebugError} from "../../debug/debugError";
import {Game} from "../../core/game";
import {IKeyVal} from "../../misc/object";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";


export abstract class BaseAbstractBehaviour {

    protected game:Game;
    protected parameters:IKeyVal<unknown>;

    protected constructor(game:Game,parameters:IKeyVal<unknown>){
        this.game = game;
        this.parameters = parameters;
    }

    public manage(gameObject:RenderableModel):void{
        console.error(this);
        if (DEBUG) throw new DebugError(`BaseAbstractBehaviour: method 'manage' not implemented`);
    }

    public onUpdate():void{}

    public revalidate(){}

    public destroy():void{}

}