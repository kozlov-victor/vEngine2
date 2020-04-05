
// according to https://developer.ibm.com/tutorials/wa-build2dphysicsengine/

import {Size} from "@engine/geometry/size";
import {Point2d} from "@engine/geometry/point2d";
import {Game} from "@engine/core/game";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/ArcadePhysicsSystem";
import {Rect} from "@engine/geometry/rect";
import {IRigidBody} from "@engine/physics/common/interfaces";

export enum PHYSICS_MODEL_TYPE {
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

export class ArcadeRigidBody implements IRigidBody {

    public readonly type:'ArcadeRigidBody';
    public modelType: PHYSICS_MODEL_TYPE = PHYSICS_MODEL_TYPE.DYNAMIC;
    public readonly velocity:Point2d = new Point2d();
    public readonly acceleration:Point2d = new Point2d();
    public readonly rect:Rect = new Rect();
    public restitution:number = 0.5;
    public readonly halfSize:Size = new Size();
    public readonly collisionFlags:ICollisionFlags = new CollisionFlags();

    constructor(private game:Game, public pos:Point2d, public size:Size) {
        this.updateSpatial(size);
    }

    public nextTick():void {
        const delta:number = this.game.getDeltaTime() / 1000;
        (this.collisionFlags as CollisionFlags).reset();
        switch (this.modelType) {
            case PHYSICS_MODEL_TYPE.DYNAMIC:
                this.velocity.x += this.acceleration.x * delta + ArcadePhysicsSystem.gravity.x;
                this.velocity.y += this.acceleration.y * delta + ArcadePhysicsSystem.gravity.y;
                this.pos.x  += this.velocity.x * delta;
                this.pos.y  += this.velocity.y * delta;
                break;
            case PHYSICS_MODEL_TYPE.KINEMATIC:
                this.velocity.x += this.acceleration.x * delta;
                this.velocity.y += this.acceleration.y * delta;
                this.pos.x  += this.velocity.x * delta;
                this.pos.y  += this.velocity.y * delta;
                break;
        }
    }

    public updateSpatial(size:Size):void {
        this.size = size;
        this.halfSize.width = size.width/2;
        this.halfSize.height = size.height/2;
    }

    // Getters for the mid point of the rect
    public getMidX():number {
        return this.halfSize.width + this.pos.x;
    }

    public getMidY():number {
        return this.halfSize.height + this.pos.y;
    }

    // Getters for the top, left, right, and bottom
    // of the rectangle
    public getTop():number {
        return this.pos.y;
    }

    public getLeft():number {
        return this.pos.x;
    }

    public getRight():number {
        return this.pos.x + this.size.width;
    }

    public getBottom():number {
        return this.pos.y + this.size.height;
    }

    public getBoundRect():Rect {
        this.rect.setPoint(this.pos);
        this.rect.setSize(this.size);
        return this.rect;
    }
}
