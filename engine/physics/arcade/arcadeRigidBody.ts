
// according to https://developer.ibm.com/tutorials/wa-build2dphysicsengine/

import {Size} from "@engine/geometry/size";
import {Point2d} from "@engine/geometry/point2d";
import {Game} from "@engine/core/game";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/arcadePhysicsSystem";
import {Rect} from "@engine/geometry/rect";
import {IRigidBody} from "@engine/physics/common/interfaces";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ICloneable, Int, Optional} from "@engine/core/declarations";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {EventEmitterDelegate} from "@engine/delegates/eventDelegates/eventEmitterDelegate";
import {SpatialCell} from "@engine/physics/common/spatialSpace";
import {CollisionGroup} from "@engine/physics/arcade/collisionGroup";

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

let bodyCnt = 0;
let rectCnt = 0;

export class RectWithUpdateId extends Rect {
    public readonly id = ++rectCnt;
}

export class ArcadeRigidBody implements IRigidBody, ICloneable<ArcadeRigidBody> {

    // todo collideWorldBounds

    public readonly type:'ArcadeRigidBody';
    public readonly velocity:Point2d = new Point2d();
    public readonly acceleration:Point2d = new Point2d();
    public groupNames:Int = 0 as Int;
    public ignoreCollisionWithGroupNames:Int = 0 as Int;
    public readonly spatialCellsOccupied:SpatialCell[] = [];

    public readonly collisionEventHandler:EventEmitterDelegate<ARCADE_COLLISION_EVENT, ArcadeRigidBody> = new EventEmitterDelegate(this.game);

    public debug:boolean = false;
    public readonly id:number = bodyCnt++;

    public gravityImpact:number = 1;
    public acceptCollisions:boolean = true;

    public addInfo:Record<any, any> = {};
    public _modelType: ARCADE_RIGID_BODY_TYPE = ARCADE_RIGID_BODY_TYPE.DYNAMIC;
    public readonly _boundRect = new RectWithUpdateId();
    public _restitution:number = 0.5;
    public readonly _halfSize:Size = new Size();
    public readonly collisionFlags:ICollisionWith = new CollisionFlags();
    public overlappedWith:Optional<IRigidBody>;
    public readonly _collisionFlagsOld:ICollisionWith = new CollisionFlags();
    public readonly pos:Point2d;
    public _oldPos:Point2d;
    public _rect:Rect;
    public lastBoundRectId: number;


    public _offsetX:number = 0; // to calculate character offset if it stands on KINEMATIC platform

    private _model:RenderableModel;
    private _debugRectangle:Rectangle;

    private _dirtyBoundRect:boolean = true;

    private constructor(private game:Game) {
    }

    public nextTick():void {

        if (this._modelType===ARCADE_RIGID_BODY_TYPE.DYNAMIC) {
            this._oldPos.setFrom(this.pos);
            const delta:number = this.game.getDeltaTime() / 1000;
            (this._collisionFlagsOld as CollisionFlags).copyFrom(this.collisionFlags as CollisionFlags);
            (this.collisionFlags as CollisionFlags).reset();
            this.overlappedWith = undefined;

            this.velocity.x += this.acceleration.x * delta;
            if (!this._collisionFlagsOld.bottom) this.velocity.y += this.acceleration.y * delta;
            this.velocity.x += ArcadePhysicsSystem.gravity.x;
            this.velocity.y += ArcadePhysicsSystem.gravity.y*this.gravityImpact;
            this.pos.x += this.velocity.x * delta;
            this.pos.y += this.velocity.y * delta;
        }

        const spatialSpace = this.game.getCurrentScene()._spatialSpace;
        if (spatialSpace!==undefined) {
            spatialSpace.updateSpaceByObject(this,this.calcAndGetBoundRect());
        }
    }

    public setBoundsAndObserveModel(model:RenderableModel):void {
        model.revalidate();
        this._model = model;
        this.setBounds(model.pos,model.size);
        model.size.observe(()=>this._dirtyBoundRect = true);
        model.pos.observe(()=>this._dirtyBoundRect = true);
        if (this._modelType===ARCADE_RIGID_BODY_TYPE.KINEMATIC) {
            let oldX:Optional<number>;
            this.pos.observe(()=>{
                if (oldX===undefined) oldX = this.pos.x;
                this._offsetX = this.pos.x - oldX;
                oldX = this.pos.x;
            });
        }
    }

    public setModel(model:RenderableModel):void {
        this._model = model;
    }

    public setBounds(pos:Point2d, size:Size):void {
        (this as {pos:Point2d}).pos = pos;
        this._oldPos = this.pos.clone();
        if (!this._rect) this._rect = new Rect(0,0,size.width,size.height);
        this._halfSize.width = this._rect.width/2;
        this._halfSize.height = this._rect.height/2;
    }

    // Getters for the mid point of the rect
    public getMidX():number {
        return this._halfSize.width + this.pos.x + this._rect.x;
    }

    public getMidY():number {
        return this._halfSize.height + this.pos.y + this._rect.y;
    }

    // Getters for the top, left, right, and bottom
    // of the rectangle
    public getTop():number {
        return this.pos.y + this._rect.y;
    }

    public getLeft():number {
        return this.pos.x + this._rect.x;
    }

    public getRight():number {
        return this.pos.x + this._rect.x + this._rect.width;
    }

    public getBottom():number {
        return this.pos.y + this._rect.y + this._rect.height;
    }

    public calcAndGetBoundRect():RectWithUpdateId {
        if (!this._dirtyBoundRect) return this._boundRect;
        this._boundRect.setXYWH(
            this.pos.x + this._rect.x,
            this.pos.y + this._rect.y,
            this._rect.width,
            this._rect.height
        );
        (this._boundRect as {id:number}).id = ++rectCnt;
        this._dirtyBoundRect = false;
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
        this._debugRectangle.pos.setXY(this.pos.x + this._rect.x,this.pos.y + this._rect.y);
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
            const groupNameMask = CollisionGroup.getBitMaskByName(groupName);
            if (groupNameMask===undefined) return;
            if ((e.groupNames & groupNameMask)>0) {
                callBack(e);
            }
        });
    }
    public onOverlappedWithGroup(groupName:string, callBack: (arg:ArcadeRigidBody)=>void): (arg:ArcadeRigidBody)=>void {
        return this.collisionEventHandler.on(ARCADE_COLLISION_EVENT.OVERLAPPED,e=>{
            const groupNameMask = CollisionGroup.getBitMaskByName(groupName);
            if (groupNameMask===undefined) return;
            if ((e.groupNames & groupNameMask)>0) {
                callBack(e);
            }
        });
    }

    private setClonedProperties(body:ArcadeRigidBody):void {
        body._modelType = this._modelType;
        body.velocity.setFrom(this.velocity);
        body.acceleration.setFrom(this.acceleration);
        body._restitution = this._restitution;
        body._rect = this._rect.clone();
        body.groupNames = this.groupNames;
        body.ignoreCollisionWithGroupNames = this.ignoreCollisionWithGroupNames;
        body.setBoundsAndObserveModel(this._model);
        body.gravityImpact = this.gravityImpact;
    }

}
