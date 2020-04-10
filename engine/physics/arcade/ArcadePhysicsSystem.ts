import {Point2d} from "@engine/geometry/point2d";
import {Game} from "@engine/core/game";
import {IPhysicsSystem} from "@engine/physics/common/interfaces";
import {ARCADE_RIGID_BODY_TYPE, ArcadeRigidBody} from "@engine/physics/arcade/arcadeRigidBody";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {MathEx} from "@engine/misc/mathEx";
import {Optional} from "@engine/core/declarations";
import {Rect} from "@engine/geometry/rect";

export interface ICreateRigidBodyParams {
    type?: ARCADE_RIGID_BODY_TYPE;
    rect?:Rect;
    restitution?:number;
    debug?:boolean;
}

export class ArcadePhysicsSystem implements IPhysicsSystem {

    public static readonly gravity:Point2d = new Point2d(0,5);
    public static STICKY_THRESHOLD:number = 0.01;

    private static resolveCollision(player:ArcadeRigidBody, entity:ArcadeRigidBody):void {

        if (player._modelType===ARCADE_RIGID_BODY_TYPE.KINEMATIC && entity._modelType===ARCADE_RIGID_BODY_TYPE.DYNAMIC) {
            const tmp:ArcadeRigidBody = player;
            player = entity;
            entity = tmp;
        }

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
        if (Math.abs(absDX - absDY) < .1) {
            // If the player is approaching from positive X
            if (dx < 0) {
                // Set the player x to the right side
                ArcadePhysicsSystem.collidePlayerWithLeft(player, entity);
                // If the player is approaching from negative X
            } else {
                // Set the player x to the left side
                ArcadePhysicsSystem.collidePlayerWithRight(player, entity);
            }
            // If the player is approaching from positive Y
            if (dy < 0) {
                // Set the player y to the bottom
                ArcadePhysicsSystem.collidePlayerWithTop(player, entity);
                // If the player is approaching from negative Y
            } else {
                // Set the player y to the top
                ArcadePhysicsSystem.collidePlayerWithBottom(player, entity);
            }
        }

        // If the object is approaching from the sides
        else if (absDX > absDY) {

            // If the player is approaching from positive X
            if (dx < 0) {
                ArcadePhysicsSystem.collidePlayerWithLeft(player, entity);
            } else {
                // If the player is approaching from negative X
                ArcadePhysicsSystem.collidePlayerWithRight(player, entity);
            }

            // If this collision is coming from the top or bottom more
        } else {
            // If the player is approaching from positive Y
            if (dy < 0) {
                ArcadePhysicsSystem.collidePlayerWithTop(player,entity);
            } else {
                // If the player is approaching from negative Y
                ArcadePhysicsSystem.collidePlayerWithBottom(player,entity);
            }
        }
    }

    private static calcCommonRestitution(player:ArcadeRigidBody,entity:ArcadeRigidBody):number {
        return (player._restitution + entity._restitution)/2;
    }

    private static reflectVelocityY(player:ArcadeRigidBody,entity:ArcadeRigidBody){
        player.velocity.y = -player.velocity.y * ArcadePhysicsSystem.calcCommonRestitution(player, entity);
        if (Math.abs(player.velocity.y) < ArcadePhysicsSystem.STICKY_THRESHOLD) {
            player.velocity.y = 0;
        }
    }

    private static reflectVelocityX(player:ArcadeRigidBody,entity:ArcadeRigidBody){
        player.velocity.x = -player.velocity.x * ArcadePhysicsSystem.calcCommonRestitution(player, entity);
        if (Math.abs(player.velocity.x) < ArcadePhysicsSystem.STICKY_THRESHOLD) {
            player.velocity.x = 0;
        }
    }

    private static collidePlayerWithTop(player:ArcadeRigidBody,entity:ArcadeRigidBody):void {
        player._pos.y = entity.getBottom() - player._rect.y;
        player.collisionFlags.top =
            entity.collisionFlags.bottom = true;
        ArcadePhysicsSystem.reflectVelocityY(player, entity);
    }

    private static collidePlayerWithBottom(player:ArcadeRigidBody,entity:ArcadeRigidBody):void{
        player._pos.y = entity.getTop() - player._rect.height - player._rect.y;
        player.collisionFlags.bottom =
            entity.collisionFlags.top = true;
        ArcadePhysicsSystem.reflectVelocityY(player, entity);
    }

    private static collidePlayerWithLeft(player:ArcadeRigidBody,entity:ArcadeRigidBody):void{
        player._pos.x = entity.getRight() - player._rect.x;
        player.collisionFlags.left =
            entity.collisionFlags.right = true;
        ArcadePhysicsSystem.reflectVelocityX(player, entity);
    }

    private static collidePlayerWithRight(player:ArcadeRigidBody,entity:ArcadeRigidBody):void{
        player._pos.x = entity.getLeft() - player._rect.width - player._rect.x;
        player.collisionFlags.right =
            entity.collisionFlags.left = true;
        ArcadePhysicsSystem.reflectVelocityX(player, entity);
    }

    constructor(private game:Game) {
    }

    public createRigidBody(params?:ICreateRigidBodyParams): ArcadeRigidBody {
        type Clazz = new(game:Game) => ArcadeRigidBody; // "unprivate" constructor
        const body:ArcadeRigidBody = new (ArcadeRigidBody as Clazz)(this.game);
        body._modelType = params?.type??body._modelType;
        body._restitution = params?.restitution??body._restitution;
        if (params?.rect!==undefined) body._rect = params.rect.clone();
        if (params?.debug!==undefined) body.debug = params.debug;
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
                ArcadePhysicsSystem.resolveCollision(playerBody, entityBody);
            }
        }
    }

}
