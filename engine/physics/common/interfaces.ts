import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ICloneable} from "@engine/core/declarations";
import {Point2d} from "@engine/geometry/point2d";
import {Scene} from "@engine/scene/scene";

export interface IRigidBody extends ICloneable<IRigidBody>{
    type:string;
    velocity:Point2d;
    acceleration:Point2d;
    groupNames:string[];
    ignoreCollisionWithGroupNames:string[];
    updateBounds(model:RenderableModel):void;
    nextTick():void;
    debugRender():void;
    getHostModel():RenderableModel;
}

export interface IPhysicsSystem {
    createRigidBody(params:never):IRigidBody;
    nextTick(scene:Scene):void;
}
