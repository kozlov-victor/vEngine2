
// according to https://developer.ibm.com/tutorials/wa-build2dphysicsengine/

import {Size} from "@engine/geometry/size";
import {Point2d} from "@engine/geometry/point2d";
import {Game} from "@engine/core/game";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/ArcadePhysicsSystem";
import {IRect, Rect} from "@engine/geometry/rect";
import {IRigidBody} from "@engine/physics/common/interfaces";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ICloneable, IEventemittable} from "@engine/core/declarations";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {EventEmitterDelegate} from "@engine/delegates/eventEmitterDelegate";

export enum ARCADE_RIGID_BODY_TYPE {
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

export class ArcadeRigidBody implements IRigidBody, ICloneable<ArcadeRigidBody>, IEventemittable {

    // collideWorldBounds

    public readonly type:'ArcadeRigidBody';
    public readonly velocity:Point2d = new Point2d();
    public readonly acceleration:Point2d = new Point2d();
    public readonly groupNames:string[] = [];
    public readonly ignoreCollisionWithGroupNames:string[] = [];

    public debug:boolean = false;

    public _modelType: ARCADE_RIGID_BODY_TYPE = ARCADE_RIGID_BODY_TYPE.DYNAMIC;
    public readonly _boundRect:Rect = new Rect();
    public _restitution:number = 0.5;
    public readonly _halfSize:Size = new Size();
    public readonly collisionFlags:ICollisionFlags = new CollisionFlags();
    public _pos:Point2d;
    public _rect:Rect;

    private model:RenderableModel;
    private debugRectangle:Rectangle;
    //eventEmitter
    private readonly _eventEmitterDelegate:EventEmitterDelegate = new EventEmitterDelegate();


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
        if (!this._rect) this._rect = new Rect(0,0,model.size.width,model.size.height);
        this._halfSize.width = this._rect.width/2;
        this._halfSize.height = this._rect.height/2;
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

    public calcAndGetBoundRect():IRect {
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
        if (this.debugRectangle===undefined) {
            this.debugRectangle = new Rectangle(this.game);
            this.debugRectangle.size.setWH(this._rect.width,this._rect.height);
            this.debugRectangle.fillColor = Color.RGBA(0,233,0,50);
        }
        this.debugRectangle.pos.setXY(this._pos.x + this._rect.x,this._pos.y + this._rect.y);
        this.debugRectangle.render();
    }

    public getHostModel(): RenderableModel {
        return this.model;
    }

    public clone():ArcadeRigidBody{
        const body:ArcadeRigidBody = new ArcadeRigidBody(this.game);
        this.setClonedProperties(body);
        return body;
    }

    public off(eventName: ARCADE_COLLISION_EVENT, callBack: (arg:ArcadeRigidBody)=>void): void {
        this._eventEmitterDelegate.off(eventName,callBack as (arg:any)=>void);
    }
    public on(eventName: ARCADE_COLLISION_EVENT, callBack: (arg:ArcadeRigidBody)=>void): (arg?:unknown)=>void {
        return this._eventEmitterDelegate.on(eventName,callBack as (arg:any)=>void);
    }
    public once(eventName: ARCADE_COLLISION_EVENT, callBack: (arg:ArcadeRigidBody)=>void):void {
        this._eventEmitterDelegate.once(eventName,callBack as (arg:any)=>void);
    }
    public trigger(eventName: ARCADE_COLLISION_EVENT, data: ArcadeRigidBody): void {
        this._eventEmitterDelegate.trigger(eventName,data);
    }

    private setClonedProperties(body:ArcadeRigidBody):void {
        body._modelType = this._modelType;
        body.velocity.set(this.velocity);
        body.acceleration.set(this.acceleration);
        body._restitution = this._restitution;
        body._rect = this._rect.clone();
        body.groupNames.push(...this.groupNames);
        body.ignoreCollisionWithGroupNames.push(...this.ignoreCollisionWithGroupNames);
        body.updateBounds(this.model);
    }

}
