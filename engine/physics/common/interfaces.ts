import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ICloneable} from "@engine/core/declarations";
import {Point2d} from "@engine/geometry/point2d";

export interface IRigidBody extends ICloneable<IRigidBody>{
    type:string;
    velocity:Point2d;
    acceleration:Point2d;
    updateBounds(model:RenderableModel):void;
    nextTick():void;
    debugRender():void;
}

export interface IPhysicsSystem {
    createRigidBody(params:never):IRigidBody;
    nextTick():void;
}
