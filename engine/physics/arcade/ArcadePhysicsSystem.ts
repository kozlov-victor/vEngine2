import {Point2d} from "@engine/geometry/point2d";
import {Game} from "@engine/core/game";
import {IPhysicsSystem} from "@engine/physics/common/interfaces";
import {ARCADE_RIGID_BODY_TYPE, ArcadeRigidBody} from "@engine/physics/arcade/arcadeRigidBody";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {MathEx} from "@engine/misc/mathEx";
import {Optional} from "@engine/core/declarations";
import {Size} from "@engine/geometry/size";

export interface ICreateRigidBodyParams {
    type?: ARCADE_RIGID_BODY_TYPE;
    size?:Size;
    restitution?:number;
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

        const commonRestitution:number = (player._restitution + entity._restitution)/2;

        // If the distance between the normalized x and y
        // position is less than a small threshold (.1 in this case)
        // then this object is approaching from a corner
        if (Math.abs(absDX - absDY) < .1) {

            // If the player is approaching from positive X
            if (dx < 0) {

                // Set the player x to the right side
                player._pos.x = entity.getRight();
                player.collisionFlags.left =
                    entity.collisionFlags.right = true;

                // If the player is approaching from negative X
            } else {

                // Set the player x to the left side
                player._pos.x = entity.getLeft() - player._size.width;
                player.collisionFlags.right =
                    entity.collisionFlags.left = true;
            }

            // If the player is approaching from positive Y
            if (dy < 0) {

                // Set the player y to the bottom
                player._pos.y = entity.getBottom();
                player.collisionFlags.top =
                    entity.collisionFlags.bottom = true;

                // If the player is approaching from negative Y
            } else {

                // Set the player y to the top
                player._pos.y = entity.getTop() - player._size.height;
                player.collisionFlags.bottom =
                    entity.collisionFlags.top = true;
            }

            // Randomly select a x/y direction to reflect velocity on
            if (Math.random() < .5) {

                // Reflect the velocity at a reduced rate
                player.velocity.x = -player.velocity.x * commonRestitution;

                // If the object's velocity is nearing 0, set it to 0
                // STICKY_THRESHOLD is set to .0004
                if (Math.abs(player.velocity.x) < ArcadePhysicsSystem.STICKY_THRESHOLD) {
                    player.velocity.x = 0;
                }
            } else {

                player.velocity.y = -player.velocity.y * commonRestitution;
                if (Math.abs(player.velocity.y) < ArcadePhysicsSystem.STICKY_THRESHOLD) {
                    player.velocity.y = 0;
                }
            }

            // If the object is approaching from the sides
        } else if (absDX > absDY) {

            // If the player is approaching from positive X
            if (dx < 0) {
                player._pos.x = entity.getRight();
                player.collisionFlags.left =
                    entity.collisionFlags.right = true;

            } else {
                // If the player is approaching from negative X
                player._pos.x = entity.getLeft() - player._size.width;
                player.collisionFlags.right =
                    entity.collisionFlags.left = true;
            }

            // Velocity component
            player.velocity.x = -player.velocity.x * commonRestitution;

            if (Math.abs(player.velocity.x) < ArcadePhysicsSystem.STICKY_THRESHOLD) {
                player.velocity.x = 0;
            }

            // If this collision is coming from the top or bottom more
        } else {

            // If the player is approaching from positive Y
            if (dy < 0) {
                player._pos.y = entity.getBottom();
                player.collisionFlags.top =
                    entity.collisionFlags.bottom = true;

            } else {
                // If the player is approaching from negative Y
                player._pos.y = entity.getTop() - player._size.height;
                player.collisionFlags.bottom =
                    entity.collisionFlags.top = true;
            }

            // Velocity component
            player.velocity.y = -player.velocity.y * commonRestitution;
            if (Math.abs(player.velocity.y) < ArcadePhysicsSystem.STICKY_THRESHOLD) {
                player.velocity.y = 0;
            }
        }
    }

    constructor(private game:Game) {
    }

    public createRigidBody(params?:ICreateRigidBodyParams): ArcadeRigidBody {
        type Clazz = new(game:Game) => ArcadeRigidBody; // "unprivate" constructor
        const body:ArcadeRigidBody = new (ArcadeRigidBody as Clazz)(this.game);
        body._modelType = params?.type??body._modelType;
        body._restitution = params?.restitution??body._restitution;
        if (params?.size!==undefined) body._size = new Size(params.size.width,params.size.height);
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
