
// according to https://developer.ibm.com/tutorials/wa-build2dphysicsengine/

import {Size} from "@engine/geometry/size";
import {Point2d} from "@engine/geometry/point2d";
import {Game} from "@engine/core/game";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/ArcadePhysicsSystem";
import {IRect, Rect} from "@engine/geometry/rect";
import {IRigidBody} from "@engine/physics/common/interfaces";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ICloneable} from "@engine/core/declarations";

export enum ARCADE_RIGID_BODY_TYPE {
    // Kinematic entities are not affected by gravity, and
    // will not allow the solver to solve these elements
    // These entities will be our platforms in the stage
    KINEMATIC ,

    // Dynamic entities will be completely changing and are
    // affected by all aspects of the physics system
    DYNAMIC
}

export interface ICollisionFlags {
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
}

class CollisionFlags implements ICollisionFlags {
    public left: boolean = false;
    public right: boolean = false;
    public top: boolean = false;
    public bottom: boolean = false;

    public reset(){
        this.left = this.right = this.top = this.bottom = false;
    }
}

export class ArcadeRigidBody implements IRigidBody, ICloneable<ArcadeRigidBody> {

    // collideWorldBounds

    public readonly type:'ArcadeRigidBody';
    public readonly velocity:Point2d = new Point2d();
    public readonly acceleration:Point2d = new Point2d();

    public _modelType: ARCADE_RIGID_BODY_TYPE = ARCADE_RIGID_BODY_TYPE.DYNAMIC;
    public readonly _boundRect:Rect = new Rect();
    public _restitution:number = 0.5;
    public readonly _halfSize:Size = new Size();
    public readonly collisionFlags:ICollisionFlags = new CollisionFlags();
    public _pos:Point2d;
    public _size:Size;

    private model:RenderableModel;

    private constructor(private game:Game) {
    }

    public nextTick():void {
        const delta:number = this.game.getDeltaTime() / 1000;
        (this.collisionFlags as CollisionFlags).reset();
        switch (this._modelType) {
            case ARCADE_RIGID_BODY_TYPE.DYNAMIC:
                this.velocity.x += this.acceleration.x * delta + ArcadePhysicsSystem.gravity.x;
                this.velocity.y += this.acceleration.y * delta + ArcadePhysicsSystem.gravity.y;
                this._pos.x  += this.velocity.x * delta;
                this._pos.y  += this.velocity.y * delta;
                break;
            case ARCADE_RIGID_BODY_TYPE.KINEMATIC:
                this.velocity.x += this.acceleration.x * delta;
                this.velocity.y += this.acceleration.y * delta;
                this._pos.x  += this.velocity.x * delta;
                this._pos.y  += this.velocity.y * delta;
                break;
        }
    }

    public updateBounds(model:RenderableModel):void {
        model.revalidate();
        this.model = model;
        this._pos = model.pos;
        if (!this._size) this._size = new Size(model.size.width,model.size.height);
        this._halfSize.width = this._size.width/2;
        this._halfSize.height = this._size.height/2;
    }

    // Getters for the mid point of the rect
    public getMidX():number {
        return this._halfSize.width + this._pos.x;
    }

    public getMidY():number {
        return this._halfSize.height + this._pos.y;
    }

    // Getters for the top, left, right, and bottom
    // of the rectangle
    public getTop():number {
        return this._pos.y;
    }

    public getLeft():number {
        return this._pos.x;
    }

    public getRight():number {
        return this._pos.x + this._size.width;
    }

    public getBottom():number {
        return this._pos.y + this._size.height;
    }

    public calcAndGetBoundRect():IRect {
        this._boundRect.setXYWH(
            this._pos.x,
            this._pos.y,
            this._size.width,
            this._size.height
        );
        return this._boundRect;
    }

    public clone():ArcadeRigidBody{
        const body:ArcadeRigidBody = new ArcadeRigidBody(this.game);
        this.setClonedProperties(body);
        return body;
    }

    private setClonedProperties(body:ArcadeRigidBody):void {
        body._modelType = this._modelType;
        body.velocity.set(this.velocity);
        body.acceleration.set(this.acceleration);
        body._restitution = this._restitution;
        body._size = this._size.clone();
        body.updateBounds(this.model);
    }

}
