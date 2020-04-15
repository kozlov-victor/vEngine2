import {Point2d} from "@engine/geometry/point2d";
import {Game} from "@engine/core/game";
import {IPhysicsSystem} from "@engine/physics/common/interfaces";
import {ARCADE_COLLISION_EVENT, ARCADE_RIGID_BODY_TYPE, ArcadeRigidBody} from "@engine/physics/arcade/arcadeRigidBody";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {MathEx} from "@engine/misc/mathEx";
import {Optional} from "@engine/core/declarations";
import {Rect} from "@engine/geometry/rect";

export interface ICreateRigidBodyParams {
    type?: ARCADE_RIGID_BODY_TYPE;
    rect?:Rect;
    restitution?:number;
    debug?:boolean;
    groupNames?:string[];
    ignoreCollisionWithGroupNames?:string[];
}

const instersect = (a:string[],b:string[]):boolean=> {
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

    public nextTick():void {
        const all:RenderableModel[] = this.game.getCurrScene().getLayers()[0].children; // todo
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
                    instersect(playerBody.groupNames,entityBody.ignoreCollisionWithGroupNames) ||
                    instersect(entityBody.groupNames,playerBody.ignoreCollisionWithGroupNames)
                ) {
                    this.emitOverlapEvents(playerBody, entityBody);
                } else {
                    this.interpolateAndResolveCollision(playerBody, entityBody);
                    this.interpolateAndResolveCollision(entityBody, playerBody);
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

        // If the distance between the normalized x and y
        // position is less than a small threshold (.1 in this case)
        // then this object is approaching from a corner
        // if (Math.abs(absDX - absDY) < .1) {
        //     // If the player is approaching from positive X
        //     if (dx < 0) {
        //         // Set the player x to the right side
        //         ArcadePhysicsSystem.collidePlayerWithLeft(player, entity);
        //         // If the player is approaching from negative X
        //     } else {
        //         // Set the player x to the left side
        //         ArcadePhysicsSystem.collidePlayerWithRight(player, entity);
        //     }
        //     // If the player is approaching from positive Y
        //     if (dy < 0) {
        //         // Set the player y to the bottom
        //         ArcadePhysicsSystem.collidePlayerWithTop(player, entity);
        //         // If the player is approaching from negative Y
        //     } else {
        //         // Set the player y to the top
        //         ArcadePhysicsSystem.collidePlayerWithBottom(player, entity);
        //     }
        // }

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

    private interpolateAndResolveCollision(player:ArcadeRigidBody, entity:ArcadeRigidBody):void {
        if (player._modelType===ARCADE_RIGID_BODY_TYPE.KINEMATIC) return;
        let oldEntityPosX:number = entity._oldPos.x;
        let oldEntityPosY:number = entity._oldPos.y;
        const newEntityPosX:number = entity._pos.x;
        const newEntityPosY:number = entity._pos.y;
        const lengthX:number = newEntityPosX - oldEntityPosX;
        const lengthY:number = newEntityPosY - oldEntityPosY;
        const lengthXAbs:number = Math.abs(lengthX);
        const lengthYAbs:number = Math.abs(lengthY);
        const lengthMax:number = Math.max(lengthXAbs,lengthYAbs);
        const isMaxLengthX:boolean = lengthMax===lengthXAbs;
        const deltaX:number = isMaxLengthX?Math.sign(lengthX):lengthX/lengthYAbs;
        const deltaY:number = isMaxLengthX?lengthY/lengthXAbs:Math.sign(lengthY);
        let steps:number = 0;
        while (steps<=lengthMax) {
            entity._pos.setXY(oldEntityPosX,oldEntityPosY);
            if (MathEx.overlapTest(player.calcAndGetBoundRect(),entity.calcAndGetBoundRect())) {
                this.resolveCollision(player, entity);
                break;
            }
            oldEntityPosX+=deltaX;
            oldEntityPosY+=deltaY;
            steps++;
        }
    }


    private calcCommonRestitution(player:ArcadeRigidBody,entity:ArcadeRigidBody):number {
        return (player._restitution + entity._restitution)/2;
    }

    private reflectVelocityY(player:ArcadeRigidBody,entity:ArcadeRigidBody){
        player.velocity.y = -player.velocity.y * this.calcCommonRestitution(player, entity);
        if (Math.abs(player.velocity.y) < ArcadePhysicsSystem.STICKY_THRESHOLD) {
            player.velocity.y = 0;
        }
    }

    private reflectVelocityX(player:ArcadeRigidBody,entity:ArcadeRigidBody){
        player.velocity.x = -player.velocity.x * this.calcCommonRestitution(player, entity);
        if (Math.abs(player.velocity.x) < ArcadePhysicsSystem.STICKY_THRESHOLD) {
            player.velocity.x = 0;
        }
    }

    private emitCollisionEvents(player:ArcadeRigidBody,entity:ArcadeRigidBody):void {
        player.trigger(ARCADE_COLLISION_EVENT.COLLIDED, entity);
        entity.trigger(ARCADE_COLLISION_EVENT.COLLIDED, player);
    }

    private emitOverlapEvents(player:ArcadeRigidBody,entity:ArcadeRigidBody):void {
        player.trigger(ARCADE_COLLISION_EVENT.OVERLAPPED, entity);
        entity.trigger(ARCADE_COLLISION_EVENT.OVERLAPPED, player);
    }

    private collidePlayerWithTop(player:ArcadeRigidBody,entity:ArcadeRigidBody):void {
        player._pos.y = entity.getBottom() - player._rect.y;
        player.collisionFlags.top =
            entity.collisionFlags.bottom = true;
        this.reflectVelocityY(player, entity);
        this.emitCollisionEvents(player, entity);
    }

    private collidePlayerWithBottom(player:ArcadeRigidBody,entity:ArcadeRigidBody):void{
        player._pos.y = entity.getTop() - player._rect.height - player._rect.y;
        player.collisionFlags.bottom =
            entity.collisionFlags.top = true;
        this.reflectVelocityY(player, entity);
        this.emitCollisionEvents(player, entity);
        // if (entity._modelType===ARCADE_RIGID_BODY_TYPE.KINEMATIC) {
        //     const delta:number = this.game.getDeltaTime();
        //     const velX:number = (entity._pos.x - entity._oldPos.x)/ delta;
        //     const velY:number = (entity._pos.y - entity._oldPos.y)/ delta;
        //     player.velocity.setXY(velX, velY);
        // }
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
