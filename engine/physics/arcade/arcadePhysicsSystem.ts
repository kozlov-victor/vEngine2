import {Point2d} from "@engine/geometry/point2d";
import {Game} from "@engine/core/game";
import {IPhysicsSystem} from "@engine/physics/common/interfaces";
import {ARCADE_COLLISION_EVENT, ARCADE_RIGID_BODY_TYPE, ArcadeRigidBody} from "@engine/physics/arcade/arcadeRigidBody";
import {MathEx} from "@engine/misc/math/mathEx";
import {IRectJSON, Rect} from "@engine/geometry/rect";
import {Scene} from "@engine/scene/scene";
import {SpatialSpace} from "@engine/physics/common/spatialSpace";
import {CollisionGroup} from "@engine/physics/arcade/collisionGroup";
import {Int} from "@engine/core/declarations";

export interface ICreateRigidBodyParams {
    type?: ARCADE_RIGID_BODY_TYPE;
    rect?:Rect;
    restitution?:number;
    debug?:boolean;
    groupNames?:string[];
    ignoreCollisionWithGroupNames?:string[];
}

const intersect = (a:Int,b:Int):boolean=> {
    return ((a as number) & (b as number))>0;
};

const include = (a:Int,b:Int):boolean=> { // true if "a" contains all elements of "b"
    if (a===0 || b===0) return false;
    return (((a as Int) | (b as Int)) as Int)===a;
}

const testedCollisionsCache = new Set();

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
        if (params?.groupNames) {
            params.groupNames.forEach(g=>{
                const mask = CollisionGroup.createGroupBitMaskByName(g);
                body.groupNames = ((body.groupNames as number) | (mask as number)) as Int;
            });
        }
        if (params?.ignoreCollisionWithGroupNames) {
            params.ignoreCollisionWithGroupNames.forEach(g=>{
                const mask = CollisionGroup.createGroupBitMaskByName(g);
                body.ignoreCollisionWithGroupNames = ((body.ignoreCollisionWithGroupNames as number) | (mask as number)) as Int;
            });
        }

        return body as unknown as ArcadeRigidBody;
    }

    public nextTick(scene:Scene):void {

        if (scene._spatialSpace===undefined) {
            scene._spatialSpace = new SpatialSpace(this.game,32,32, scene.size.width, scene.size.height);
        }

        testedCollisionsCache.clear();
        const all:ArcadeRigidBody[] = scene._spatialSpace.allBodies as ArcadeRigidBody[];
        for (let i=0,max=all.length;i<max;i++) {
            const playerBody = all[i];

            const playerBodyRect = playerBody.calcAndGetBoundRect();

            for (const c of playerBody.spatialCellsOccupied) {

                //if we can ignore the whole spatial cell
                if (include(c.groupNames,playerBody.ignoreCollisionWithGroupNames)) {
                    continue;
                }

                for (const obj of c.objects) {
                    const entityBody = obj as ArcadeRigidBody;
                    if (entityBody===playerBody) continue;
                    const abKey = `${playerBody.id}_${entityBody.id}`;
                    const baKey = `${entityBody.id}_${playerBody.id}`;
                    if (testedCollisionsCache.has(baKey) || testedCollisionsCache.has(abKey)) {
                        continue;
                    }
                    testedCollisionsCache.add(abKey);
                    const entityBodyRect = entityBody.calcAndGetBoundRect();
                    if (!MathEx.overlapTest(playerBodyRect,entityBodyRect)) continue;
                    if (
                        intersect(playerBody.groupNames,entityBody.ignoreCollisionWithGroupNames) ||
                        intersect(entityBody.groupNames,playerBody.ignoreCollisionWithGroupNames)
                    ) {
                        this.emitOverlapEvents(playerBody, entityBody);
                    } else {
                        this.interpolateAndResolveCollision(playerBody, playerBodyRect, entityBody);
                        this.interpolateAndResolveCollision(entityBody, entityBodyRect, playerBody);
                    }
                }
            }

        }

        scene._spatialSpace.clear();
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

    private interpolateAndResolveCollision(playerBody:ArcadeRigidBody, playerBodyRect: IRectJSON, entityBody:ArcadeRigidBody):void {
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
            if (MathEx.overlapTest(playerBodyRect,entityBody.calcAndGetBoundRect())) {
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
