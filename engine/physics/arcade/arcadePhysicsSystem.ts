import {Point2d} from "@engine/geometry/point2d";
import {Game} from "@engine/core/game";
import {IPhysicsSystem} from "@engine/physics/common/interfaces";
import {ARCADE_COLLISION_EVENT, ARCADE_RIGID_BODY_TYPE, ArcadeRigidBody} from "@engine/physics/arcade/arcadeRigidBody";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {MathEx} from "@engine/misc/mathEx";
import {Optional} from "@engine/core/declarations";
import {Rect} from "@engine/geometry/rect";
import {Scene} from "@engine/scene/scene";
import {Layer} from "@engine/scene/layer";

export interface ICreateRigidBodyParams {
    type?: ARCADE_RIGID_BODY_TYPE;
    rect?:Rect;
    restitution?:number;
    debug?:boolean;
    groupNames?:string[];
    ignoreCollisionWithGroupNames?:string[];
}

const intersect = (a:string[],b:string[]):boolean=> {
    if (a.length===0 || b.length===0) return false;
    for (let i = 0; i < a.length; i++) {
        if (b.indexOf(a[i])>-1) return true;
    }
    return false;
};

export class ArcadePhysicsSystem implements IPhysicsSystem {

    public static readonly gravity:Point2d = new Point2d(0,5);
    public static STICKY_THRESHOLD:number = 0.01;

    constructor(private game:Game) {
    }

    public createRigidBody(params?:ICreateRigidBodyParams): ArcadeRigidBody {
        type Clazz = new(game:Game) => ArcadeRigidBody; // "unprivate" constructor
        const body:ArcadeRigidBody = new (ArcadeRigidBody as Clazz)(this.game);
        body._modelType = params?.type??body._modelType;
        body._restitution = params?.restitution??body._restitution;
        if (params?.rect!==undefined) body._rect = params.rect.clone();
        if (params?.debug!==undefined) body.debug = params.debug;
        if (params?.groupNames) body.groupNames.push(...params.groupNames);
        if (params?.ignoreCollisionWithGroupNames) body.ignoreCollisionWithGroupNames.push(...params.ignoreCollisionWithGroupNames);

        return body as unknown as ArcadeRigidBody;
    }

    public nextTick(scene:Scene):void {
        for (let ind:number = 0, layerLength:number = scene.getLayers().length; ind < layerLength; ind++) {
            const layer:Layer = scene.getLayers()[ind];
            const all:RenderableModel[] = layer.children;
            for (let i:number = 0; i < all.length; i++) {
                const player:RenderableModel = all[i];
                const playerBody:Optional<ArcadeRigidBody> = player.getRigidBody();
                if (playerBody===undefined) continue;
                for (let j:number = i + 1; j < all.length; j++) {
                    const entity:RenderableModel = all[j];
                    const entityBody:Optional<ArcadeRigidBody> = entity.getRigidBody();
                    if (entityBody===undefined) continue;
                    if (!MathEx.overlapTest(playerBody.calcAndGetBoundRect(),entityBody.calcAndGetBoundRect())) continue;
                    if (
                        intersect(playerBody.groupNames,entityBody.ignoreCollisionWithGroupNames) ||
                        intersect(entityBody.groupNames,playerBody.ignoreCollisionWithGroupNames)
                    ) {
                        this.emitOverlapEvents(playerBody, entityBody);
                    } else {
                        //const dotProduct:number = playerBody._pos.x*entityBody._pos.x+playerBody._pos.y*entityBody._pos.y;
                        //if (dotProduct>0) {
                        this.interpolateAndResolveCollision(playerBody, entityBody);
                        this.interpolateAndResolveCollision(entityBody, playerBody);
                        //}
                    }
                }
            }
        }
    }


    private resolveCollision(player:ArcadeRigidBody, entity:ArcadeRigidBody):void {

        // Find the mid points of the entity and player
        const pMidX:number = player.getMidX();
        const pMidY:number = player.getMidY();
        const eMidX:number = entity.getMidX();
        const eMidY:number = entity.getMidY();

        // To find the side of entry calculate based on
        // the normalized sides
        const dx:number = (eMidX - pMidX) / entity._halfSize.width;
        const dy:number = (eMidY - pMidY) / entity._halfSize.height;

        // Calculate the absolute change in x and y
        const absDX:number = Math.abs(dx);
        const absDY:number = Math.abs(dy);

        //If the object is approaching from the sides
        if (absDX > absDY) {

            // If the player is approaching from positive X
            if (dx < 0) {
                this.collidePlayerWithLeft(player, entity);
            } else {
                // If the player is approaching from negative X
                this.collidePlayerWithRight(player, entity);
            }

            // If this collision is coming from the top or bottom more
        } else {
            // If the player is approaching from positive Y
            if (dy < 0) {
                this.collidePlayerWithTop(player,entity);
            } else {
                // If the player is approaching from negative Y
                this.collidePlayerWithBottom(player,entity);
            }
        }
    }

    private interpolateAndResolveCollision(playerBody:ArcadeRigidBody, entityBody:ArcadeRigidBody):void {
        if (playerBody._modelType===ARCADE_RIGID_BODY_TYPE.KINEMATIC) return;
        let oldEntityPosX:number = entityBody._modelType===ARCADE_RIGID_BODY_TYPE.KINEMATIC?entityBody._pos.x:entityBody._oldPos.x;
        let oldEntityPosY:number = entityBody._modelType===ARCADE_RIGID_BODY_TYPE.KINEMATIC?entityBody._pos.y:entityBody._oldPos.y;
        const newEntityPosX:number = entityBody._pos.x;
        const newEntityPosY:number = entityBody._pos.y;
        const entityLengthX:number = newEntityPosX - oldEntityPosX;
        const entityLengthY:number = newEntityPosY - oldEntityPosY;
        const entityLengthMax:number = Math.max(Math.abs(entityLengthX),Math.abs(entityLengthY));
        const entityDeltaX:number = entityLengthX/entityLengthMax;
        const entityDeltaY:number = entityLengthY/entityLengthMax;
        let steps:number = 0;
        while (steps<=entityLengthMax) {
            entityBody._pos.setXY(oldEntityPosX,oldEntityPosY);
            if (MathEx.overlapTest(playerBody.calcAndGetBoundRect(),entityBody.calcAndGetBoundRect())) {
                break;
            }
            oldEntityPosX+=entityDeltaX;
            oldEntityPosY+=entityDeltaY;
            steps++;
        }
        this.resolveCollision(playerBody, entityBody);
    }


    private calcCommonRestitution(player:ArcadeRigidBody,entity:ArcadeRigidBody):number {
        return (player._restitution + entity._restitution)/2;
    }

    private getComparedToSticky(val:number):number {
        if (Math.abs(val) < ArcadePhysicsSystem.STICKY_THRESHOLD) {
            return 0;
        } else return val;
    }

    private reflectVelocityY(player:ArcadeRigidBody,entity:ArcadeRigidBody):void{
        const restitution:number = this.calcCommonRestitution(player, entity);
        player.velocity.y = this.getComparedToSticky(-player.velocity.y * restitution);
    }

    private reflectVelocityX(player:ArcadeRigidBody,entity:ArcadeRigidBody):void{
        const restitution:number = this.calcCommonRestitution(player, entity);
        player.velocity.x = this.getComparedToSticky(-player.velocity.x * restitution);
    }

    private emitCollisionEvents(player:ArcadeRigidBody,entity:ArcadeRigidBody):void {
        if (player.getHostModel().isDetached() || entity.getHostModel().isDetached()) return;
        player.collisionEventHandler.trigger(ARCADE_COLLISION_EVENT.COLLIDED, entity);
        entity.collisionEventHandler.trigger(ARCADE_COLLISION_EVENT.COLLIDED, player);
    }

    private emitOverlapEvents(player:ArcadeRigidBody,entity:ArcadeRigidBody):void {
        if (player.getHostModel().isDetached() || entity.getHostModel().isDetached()) return;
        player.collisionEventHandler.trigger(ARCADE_COLLISION_EVENT.OVERLAPPED, entity);
        entity.collisionEventHandler.trigger(ARCADE_COLLISION_EVENT.OVERLAPPED, player);
    }

    private collidePlayerWithTop(player:ArcadeRigidBody,entity:ArcadeRigidBody):void {
        if (!player._collisionFlagsOld.bottom) { // check to prevent penetration through floor
            player._pos.y = entity.getBottom() - player._rect.y;
        }
        player.collisionFlags.top =
            entity.collisionFlags.bottom = true;
        this.reflectVelocityY(player, entity);
        this.emitCollisionEvents(player, entity);
    }

    private collidePlayerWithBottom(player:ArcadeRigidBody,entity:ArcadeRigidBody):void{
        player._pos.y = entity.getTop() - player._rect.height - player._rect.y;
        player._pos.x+=entity._offsetX;
        entity._offsetX = 0;
        player.collisionFlags.bottom =
            entity.collisionFlags.top = true;
        this.reflectVelocityY(player, entity);
        this.emitCollisionEvents(player, entity);
    }

    private collidePlayerWithLeft(player:ArcadeRigidBody,entity:ArcadeRigidBody):void{
        player._pos.x = entity.getRight() - player._rect.x;
        player.collisionFlags.left =
            entity.collisionFlags.right = true;
        this.reflectVelocityX(player, entity);
        this.emitCollisionEvents(player, entity);
    }

    private collidePlayerWithRight(player:ArcadeRigidBody,entity:ArcadeRigidBody):void{
        player._pos.x = entity.getLeft() - player._rect.width - player._rect.x;
        player.collisionFlags.right =
            entity.collisionFlags.left = true;
        this.reflectVelocityX(player, entity);
        this.emitCollisionEvents(player, entity);
    }


}
