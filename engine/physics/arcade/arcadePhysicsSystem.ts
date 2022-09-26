import {Point2d} from "@engine/geometry/point2d";
import {Game} from "@engine/core/game";
import {IPhysicsSystem, IRigidBody} from "@engine/physics/common/interfaces";
import {ARCADE_COLLISION_EVENT, ARCADE_RIGID_BODY_TYPE, ArcadeRigidBody} from "@engine/physics/arcade/arcadeRigidBody";
import {MathEx} from "@engine/misc/math/mathEx";
import {IRectJSON, Rect} from "@engine/geometry/rect";
import {Scene} from "@engine/scene/scene";
import {SpatialSpace} from "@engine/physics/common/spatialSpace";
import {CollisionGroup} from "@engine/physics/arcade/collisionGroup";
import {Int} from "@engine/core/declarations";
import {Size} from "@engine/geometry/size";

export interface ICreateRigidBodyParams {
    type?: ARCADE_RIGID_BODY_TYPE;
    rect?:Rect;
    restitution?:number;
    debug?:boolean;
    groupNames?:string[];
    ignoreCollisionWithGroupNames?:string[];
    gravityImpact?:number; // 0..1
    acceptCollisions?:boolean;
}

const intersect = (a:Int,b:Int):boolean=> {
    return ((a as number) & (b as number))>0;
};

const include = (a:Int,b:Int):boolean=> { // true if "a" contains all elements of "b"
    if (a===0 || b===0) return false;
    return (((a as Int) | (b as Int)) as Int)===a;
}

const testedCollisionsCache = new Set();
const p1 = new Point2d();
const p2 = new Point2d();

export class ArcadePhysicsSystem implements IPhysicsSystem {

    public static readonly gravity:Point2d = new Point2d(0,5);
    public static STICKY_THRESHOLD:number = 0.01;
    public static SPATIAL_CELL_SIZE = new Size(32,32);


    constructor(private game:Game) {
    }

    public createRigidBody(params?:ICreateRigidBodyParams): ArcadeRigidBody {
        type Clazz = new(game:Game) => ArcadeRigidBody; // "unprivate" constructor
        const body:ArcadeRigidBody = new (ArcadeRigidBody as Clazz)(this.game);
        body._modelType = params?.type??body._modelType;
        body._restitution = params?.restitution??body._restitution;
        body.gravityImpact = params?.gravityImpact??body.gravityImpact;
        if (params?.acceptCollisions!==undefined) body.acceptCollisions = params.acceptCollisions;
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
        return body;
    }

    public nextTick(scene:Scene):void {

        if (scene._spatialSpace===undefined) {
            scene._spatialSpace =
                new SpatialSpace(
                    this.game,
                    ArcadePhysicsSystem.SPATIAL_CELL_SIZE.width,ArcadePhysicsSystem.SPATIAL_CELL_SIZE.height,
                    scene.size.width, scene.size.height
                );
        }

        testedCollisionsCache.clear();

        for (let i=0,max_i=scene._spatialSpace.cells.length;i<max_i;i++) {
            const cell = scene._spatialSpace.cells[i];
            const bodies:IRigidBody[] = cell.objects;
            for (let j=0,max_j=bodies.length;j<max_j;j++) {
                const playerBody = bodies[j] as ArcadeRigidBody;
                //if we can ignore the whole spatial cell
                if (include(cell.groupNames,playerBody.ignoreCollisionWithGroupNames)) {
                    continue;
                }
                const playerBodyRect = playerBody.calcAndGetBoundRect();
                p1.setFrom(playerBody.pos);
                playerBody.overlappedWith = undefined;

                for (let k=j+1;k<max_j;k++) {
                    const entityBody = bodies[k] as ArcadeRigidBody;
                    const abKey = `${playerBody.id}_${entityBody.id}`;
                    const baKey = `${entityBody.id}_${playerBody.id}`;
                    if (testedCollisionsCache.has(baKey) || testedCollisionsCache.has(abKey)) {
                        continue;
                    }
                    testedCollisionsCache.add(abKey);
                    const entityBodyRect = entityBody.calcAndGetBoundRect();
                    entityBody.overlappedWith = undefined;
                    if (!MathEx.overlapTest(playerBodyRect,entityBodyRect)) continue;
                    if (
                        !playerBody.acceptCollisions                                               ||
                        !entityBody.acceptCollisions                                               ||
                        intersect(playerBody.groupNames, entityBody.ignoreCollisionWithGroupNames) ||
                        intersect(entityBody.groupNames,playerBody.ignoreCollisionWithGroupNames)
                    ) {
                        p2.setFrom(entityBody.pos);
                        this.resolveOverlap(playerBody, entityBody);
                    } else {
                        this.interpolateAndResolveCollision(playerBody, p1, entityBody);
                        this.interpolateAndResolveCollision(entityBody, p2, playerBody);
                        playerBody.pos.setFrom(p1);
                        entityBody.pos.setFrom(p2);
                    }
                }
            }
            cell.clear();
        }
    }


    private resolveCollision(player:ArcadeRigidBody, pos:Point2d, entity:ArcadeRigidBody):void {

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
                this.collidePlayerWithLeft(player,pos, entity);
            } else {
                // If the player is approaching from negative X
                this.collidePlayerWithRight(player, pos, entity);
            }

            // If this collision is coming from the top or bottom more
        } else {
            // If the player is approaching from positive Y
            if (dy < 0) {
                this.collidePlayerWithTop(player, pos, entity);
            } else {
                // If the player is approaching from negative Y
                this.collidePlayerWithBottom(player, pos, entity);
            }
        }
    }

    private interpolateAndResolveCollision(playerBody:ArcadeRigidBody, pos:Point2d, entityBody:ArcadeRigidBody):void {
        if (playerBody._modelType===ARCADE_RIGID_BODY_TYPE.KINEMATIC) return;
        let oldEntityPosX:number = entityBody._modelType===ARCADE_RIGID_BODY_TYPE.KINEMATIC?entityBody.pos.x:entityBody._oldPos.x;
        let oldEntityPosY:number = entityBody._modelType===ARCADE_RIGID_BODY_TYPE.KINEMATIC?entityBody.pos.y:entityBody._oldPos.y;
        const newEntityPosX:number = entityBody.pos.x;
        const newEntityPosY:number = entityBody.pos.y;
        const entityLengthX:number = newEntityPosX - oldEntityPosX;
        const entityLengthY:number = newEntityPosY - oldEntityPosY;
        const entityLengthMax:number = Math.max(Math.abs(entityLengthX),Math.abs(entityLengthY));
        const entityDeltaX:number = entityLengthX/entityLengthMax;
        const entityDeltaY:number = entityLengthY/entityLengthMax;
        let steps:number = 0;
        while (steps<=entityLengthMax) {
            entityBody.pos.setXY(oldEntityPosX,oldEntityPosY);
            if (MathEx.overlapTest(playerBody.calcAndGetBoundRect(),entityBody.calcAndGetBoundRect())) {
                break;
            }
            oldEntityPosX+=entityDeltaX;
            oldEntityPosY+=entityDeltaY;
            steps++;
        }
        this.resolveCollision(playerBody, pos, entityBody);
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
        // v' = (m1v1 + m2v2)/(m1 + m2)
        player.velocity.x = this.getComparedToSticky(-player.velocity.x * restitution);
    }

    private emitCollisionEvents(player:ArcadeRigidBody,entity:ArcadeRigidBody):void {
        if (player.getHostModel().isDetached() || entity.getHostModel().isDetached()) return;
        player.collisionEventHandler.trigger(ARCADE_COLLISION_EVENT.COLLIDED, entity);
        entity.collisionEventHandler.trigger(ARCADE_COLLISION_EVENT.COLLIDED, player);
    }

    private resolveOverlap(player:ArcadeRigidBody,entity:ArcadeRigidBody):void {
        if (player.getHostModel().isDetached() || entity.getHostModel().isDetached()) return;
        player.overlappedWith = entity;
        entity.overlappedWith = player;
        player.collisionEventHandler.trigger(ARCADE_COLLISION_EVENT.OVERLAPPED, entity);
        entity.collisionEventHandler.trigger(ARCADE_COLLISION_EVENT.OVERLAPPED, player);
    }

    private collidePlayerWithTop(player:ArcadeRigidBody,pos:Point2d, entity:ArcadeRigidBody):void {
        if (!player._collisionFlagsOld.bottom) { // check to prevent penetration through floor
           pos.y = entity.getBottom() - player._rect.y;
        }
        player.collisionFlags.top =
            entity.collisionFlags.bottom = true;
        this.reflectVelocityY(player, entity);
        this.emitCollisionEvents(player, entity);
    }

    private collidePlayerWithBottom(player:ArcadeRigidBody, pos:Point2d, entity:ArcadeRigidBody):void{
        pos.y = entity.getTop() - player._rect.height - player._rect.y;
        pos.x+=entity._offsetX;
        entity._offsetX = 0;
        player.collisionFlags.bottom =
            entity.collisionFlags.top = true;
        this.reflectVelocityY(player, entity);
        this.emitCollisionEvents(player, entity);
    }

    private collidePlayerWithLeft(player:ArcadeRigidBody, pos:Point2d, entity:ArcadeRigidBody):void{
        pos.x = entity.getRight() - player._rect.x;
        player.collisionFlags.left =
            entity.collisionFlags.right = true;
        this.reflectVelocityX(player, entity);
        this.emitCollisionEvents(player, entity);
    }

    private collidePlayerWithRight(player:ArcadeRigidBody, pos:Point2d, entity:ArcadeRigidBody):void{
        pos.x = entity.getLeft() - player._rect.width - player._rect.x;
        player.collisionFlags.right =
            entity.collisionFlags.left = true;
        this.reflectVelocityX(player, entity);
        this.emitCollisionEvents(player, entity);
    }


}
