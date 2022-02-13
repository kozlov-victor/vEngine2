
// according to https://developer.ibm.com/tutorials/wa-build2dphysicsengine/

import {Size} from "@engine/geometry/size";
import {Point2d} from "@engine/geometry/point2d";
import {Game} from "@engine/core/game";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/arcadePhysicsSystem";
import {IRectJSON, Rect} from "@engine/geometry/rect";
import {IRigidBody} from "@engine/physics/common/interfaces";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ICloneable, Optional} from "@engine/core/declarations";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {EventEmitterDelegate} from "@engine/delegates/eventDelegates/eventEmitterDelegate";

export const enum ARCADE_RIGID_BODY_TYPE {
    // Kinematic entities are not affected by gravity, and
    // will not allow the solver to solve these elements
    // These entities will be our platforms in the stage
    KINEMATIC ,

    // Dynamic entities will be completely changing and are
    // affected by all aspects of the physics system
    DYNAMIC
}

export const enum ARCADE_COLLISION_EVENT {
    COLLIDED = 'collided',
    OVERLAPPED = 'overlapped',
}

export interface ICollisionWith {
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
}

class CollisionFlags implements ICollisionWith {
    public left: boolean = false;
    public right: boolean = false;
    public top: boolean = false;
    public bottom: boolean = false;

    public reset():void{
        this.left = this.right = this.top = this.bottom = false;
    }

    public copyFrom(source:CollisionFlags):void {
        this.left = source.left;
        this.right = source.right;
        this.top = source.top;
        this.bottom = source.bottom;
    }
}

let cnt = 0;

export class ArcadeRigidBody implements IRigidBody, ICloneable<ArcadeRigidBody> {

    // collideWorldBounds

    public readonly type:'ArcadeRigidBody';
    public readonly velocity:Point2d = new Point2d();
    public readonly acceleration:Point2d = new Point2d();
    public readonly groupNames:string[] = [];
    public readonly ignoreCollisionWithGroupNames:string[] = [];

    public readonly collisionEventHandler:EventEmitterDelegate<ARCADE_COLLISION_EVENT, ArcadeRigidBody> = new EventEmitterDelegate(this.game);

    public debug:boolean = false;
    public readonly id:number = cnt++;

    public _modelType: ARCADE_RIGID_BODY_TYPE = ARCADE_RIGID_BODY_TYPE.DYNAMIC;
    public readonly _boundRect:Rect = new Rect();
    public _restitution:number = 0.5;
    public readonly _halfSize:Size = new Size();
    public readonly collisionFlags:ICollisionWith = new CollisionFlags();
    public readonly _collisionFlagsOld:ICollisionWith = new CollisionFlags();
    public _pos:Point2d;
    public _oldPos:Point2d;
    public _rect:Rect;

    public _offsetX:number = 0; // to calculate character offset if it stands on KINEMATIC platform

    private _model:RenderableModel;
    private _debugRectangle:Rectangle;

    private constructor(private game:Game) {
    }

    public nextTick():void {
        this._oldPos.set(this._pos);
        const delta:number = this.game.getDeltaTime() / 1000;
        (this._collisionFlagsOld as CollisionFlags).copyFrom(this.collisionFlags as CollisionFlags);
        (this.collisionFlags as CollisionFlags).reset();

        this.velocity.x += this.acceleration.x * delta;
        if (!this._collisionFlagsOld.bottom) this.velocity.y += this.acceleration.y * delta;
        if (this._modelType===ARCADE_RIGID_BODY_TYPE.DYNAMIC) {
            this.velocity.x += ArcadePhysicsSystem.gravity.x;
            this.velocity.y += ArcadePhysicsSystem.gravity.y;
        }
        this._pos.x  += this.velocity.x * delta;
        this._pos.y  += this.velocity.y * delta;

        const spatialSpace = this.game.getPhysicsSystem<ArcadePhysicsSystem>().spatialSpace;
        if (spatialSpace) {
            spatialSpace.updateSpaceByObject(this,this.calcAndGetBoundRect());
        }
    }

    public updateBounds(model:RenderableModel):void {
        model.revalidate();
        this._model = model;
        this._pos = model.pos;
        this._oldPos = this._pos.clone();
        if (!this._rect) this._rect = new Rect(0,0,model.size.width,model.size.height);
        this._halfSize.width = this._rect.width/2;
        this._halfSize.height = this._rect.height/2;
        if (this._modelType===ARCADE_RIGID_BODY_TYPE.KINEMATIC) {
            let oldX:Optional<number>;
            this._pos.observe(()=>{
                if (oldX===undefined) oldX = this._pos.x;
                this._offsetX = this._pos.x - oldX;
                oldX = this._pos.x;
            });
        }
    }

    // Getters for the mid point of the rect
    public getMidX():number {
        return this._halfSize.width + this._pos.x + this._rect.x;
    }

    public getMidY():number {
        return this._halfSize.height + this._pos.y + this._rect.y;
    }

    // Getters for the top, left, right, and bottom
    // of the rectangle
    public getTop():number {
        return this._pos.y + this._rect.y;
    }

    public getLeft():number {
        return this._pos.x + this._rect.x;
    }

    public getRight():number {
        return this._pos.x + this._rect.x + this._rect.width;
    }

    public getBottom():number {
        return this._pos.y + this._rect.y + this._rect.height;
    }

    public calcAndGetBoundRect():IRectJSON {
        this._boundRect.setXYWH(
            this._pos.x + this._rect.x,
            this._pos.y + this._rect.y,
            this._rect.width,
            this._rect.height
        );
        return this._boundRect;
    }

    public debugRender():void {
        if (!DEBUG) return;
        if (!this.debug) return;
        if (this._debugRectangle===undefined) {
            this._debugRectangle = new Rectangle(this.game);
            this._debugRectangle.size.setWH(this._rect.width,this._rect.height);
            this._debugRectangle.fillColor = Color.RGBA(0,233,0,50);
        }
        this._debugRectangle.pos.setXY(this._pos.x + this._rect.x,this._pos.y + this._rect.y);
        this._debugRectangle.render();
    }

    public getHostModel(): RenderableModel {
        return this._model;
    }

    public clone():ArcadeRigidBody{
        const body:ArcadeRigidBody = new ArcadeRigidBody(this.game);
        this.setClonedProperties(body);
        return body;
    }

    public onCollidedWithGroup(groupName:string, callBack: (arg:ArcadeRigidBody)=>void): (arg:ArcadeRigidBody)=>void {
        return this.collisionEventHandler.on(ARCADE_COLLISION_EVENT.COLLIDED,e=>{
            if (e.groupNames.indexOf(groupName)>-1) {
                callBack(e);
            }
        });
    }
    public onOverlappedWithGroup(groupName:string, callBack: (arg:ArcadeRigidBody)=>void): (arg:ArcadeRigidBody)=>void {
        return this.collisionEventHandler.on(ARCADE_COLLISION_EVENT.OVERLAPPED,e=>{
            if (e.groupNames.indexOf(groupName)>-1) {
                callBack(e);
            }
        });
    }

    private setClonedProperties(body:ArcadeRigidBody):void {
        body._modelType = this._modelType;
        body.velocity.set(this.velocity);
        body.acceleration.set(this.acceleration);
        body._restitution = this._restitution;
        body._rect = this._rect.clone();
        body.groupNames.push(...this.groupNames);
        body.ignoreCollisionWithGroupNames.push(...this.ignoreCollisionWithGroupNames);
        body.updateBounds(this._model);
    }

}
