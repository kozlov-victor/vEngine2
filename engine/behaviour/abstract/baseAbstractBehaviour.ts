import {Game} from "../../core/game";
import {IKeyVal} from "../../misc/object";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ICloneable, IDestroyable, IUpdatable} from "@engine/core/declarations";


export abstract class BaseAbstractBehaviour implements IUpdatable, IDestroyable, ICloneable<BaseAbstractBehaviour>{

    protected game:Game;
    protected parameters:IKeyVal<any>;

    private _destroyed = false;

    protected constructor(game:Game,parameters:IKeyVal<unknown>){
        this.game = game;
        this.parameters = parameters;
    }

    public abstract manage(gameObject:RenderableModel):void;

    public update():void{}

    public revalidate():void{}

    public destroy():void{
        this._destroyed = true;
    }

    public isDestroyed(): boolean {
        return this._destroyed;
    }

    public abstract clone(): this;


}
