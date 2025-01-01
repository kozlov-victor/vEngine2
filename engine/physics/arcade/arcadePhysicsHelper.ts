import {ARCADE_COLLISION_EVENTS, ARCADE_RIGID_BODY_TYPE, ArcadeRigidBody} from "@engine/physics/arcade/arcadeRigidBody";
import {Point2d} from "@engine/geometry/point2d";
import {MathEx} from "@engine/misc/math/mathEx";
import {Optional} from "@engine/core/declarations";
import {SLOPE_TYPE} from "@engine/physics/arcade/arcadePhysicsSystem";

const enum SLOPE_KIND {
    FLOOR,
    CEIL
}

const enum SLOPE_DIRECTION {
    UP,
    DOWN
}

class InterpolationInfo {
    lengthMax = 0;
    delta = new Point2d();
    dynamic = false;
    oldPos = new Point2d();
    newPos = new Point2d();
}

export namespace arcadePhysicsHelper {

    const abs = Math.abs;
    const max = Math.max;

    const STICKY_THRESHOLD = 0.01;


    const playerInterpolationInfo = new InterpolationInfo();
    const entityInterpolationInfo = new InterpolationInfo();

    const calculateInterpolationInfo = (body:ArcadeRigidBody, info:InterpolationInfo):void=> {
        info.oldPos.setFrom(body._oldPos);
        info.newPos.setFrom(body.pos);
        const lengthX = body.pos.x - body._oldPos.x;
        const lengthY = body.pos.y - body._oldPos.y;
        info.lengthMax = max(abs(lengthX),abs(lengthY));
        info.delta.setXY(info.lengthMax===0?0:lengthX/info.lengthMax, info.lengthMax===0?0:lengthY/info.lengthMax);
        info.dynamic = body._modelType===ARCADE_RIGID_BODY_TYPE.DYNAMIC;
    }

    export const interpolate_AABB = (playerBody:ArcadeRigidBody, entityBody:ArcadeRigidBody):void=>{
        if (playerBody._modelType===ARCADE_RIGID_BODY_TYPE.DYNAMIC || entityBody._modelType===ARCADE_RIGID_BODY_TYPE.DYNAMIC) {

            calculateInterpolationInfo(playerBody, playerInterpolationInfo);
            calculateInterpolationInfo(entityBody, entityInterpolationInfo);

            let step = Math.max(playerInterpolationInfo.lengthMax,entityInterpolationInfo.lengthMax);
            while (step-->0) {
                if (step===0) {
                    if (playerInterpolationInfo.dynamic) playerBody.pos.setFrom(playerInterpolationInfo.newPos);
                    if (entityInterpolationInfo.dynamic) entityBody.pos.setFrom(entityInterpolationInfo.newPos);
                } else {
                    if (playerInterpolationInfo.dynamic) playerBody.pos.setFrom(playerInterpolationInfo.oldPos);
                    if (entityInterpolationInfo.dynamic) entityBody.pos.setFrom(entityInterpolationInfo.oldPos);
                }

                if (MathEx.overlapTest(playerBody.calcAndGetBoundRect(),entityBody.calcAndGetBoundRect())) break;

                if (playerInterpolationInfo.dynamic) playerInterpolationInfo.oldPos.add(playerInterpolationInfo.delta);
                if (entityInterpolationInfo.dynamic) entityInterpolationInfo.oldPos.add(entityInterpolationInfo.delta);
            }
        }
    }

    export const resolveCollision_AABB2 = (player:ArcadeRigidBody, pos:Point2d, vel: Point2d, entity:ArcadeRigidBody):void=> {

        if (player._modelType!==ARCADE_RIGID_BODY_TYPE.DYNAMIC) return;

        // Find the mid-points of the entity and player
        const pMidX = player.getMidX();
        const pMidY = player.getMidY();
        const eMidX = entity.getMidX();
        const eMidY = entity.getMidY();

        // To find the side of entry calculate based on
        // the normalized sides
        const dx = (eMidX - pMidX) / entity._halfSize.width;
        const dy = (eMidY - pMidY) / entity._halfSize.height;

        // Calculate the absolute change in x and y
        const absDX = abs(dx);
        const absDY = abs(dy);

        //If the object is approaching from the sides
        if (absDX > absDY) {
            // If the player is approaching from positive X
            if (dx < 0) {
                collidePlayerWithLeft_AABB(player,pos, vel, entity);
            } else {
                // If the player is approaching from negative X
                collidePlayerWithRight_AABB(player, pos, vel, entity);
            }
            // If this collision is coming from the top or bottom more
        } else {
            const currPenetrationDeepness = absDY;
            // If the player is approaching from positive Y
            if (dy < 0) {
                collidePlayerWithTop_AABB(player, pos, vel, entity);
            } else {
                // If the player is approaching from negative Y
                collidePlayerWithBottom_AABB(player, pos, vel, entity);
            }
        }
    }


    export const resolveCollision_AABB_withSlope = (player:ArcadeRigidBody,pos:Point2d, vel: Point2d, entity:ArcadeRigidBody):void=> {
        const slopeType = entity.addInfo.slopeType as Optional<SLOPE_TYPE>;
        if (slopeType===undefined) return;
        const slopeKind:SLOPE_KIND = (slopeType===SLOPE_TYPE.FLOOR_UP || slopeType===SLOPE_TYPE.FLOOR_DOWN)?
            SLOPE_KIND.FLOOR:SLOPE_KIND.CEIL;
        const slopeDirection:SLOPE_DIRECTION = (slopeType===SLOPE_TYPE.FLOOR_UP || slopeType===SLOPE_TYPE.CEIL_UP)?
            SLOPE_DIRECTION.UP:
            SLOPE_DIRECTION.DOWN;
        if (slopeKind===SLOPE_KIND.FLOOR) {
            if (player.getBottom()<=entity.getBottom()+1) {
                collidePlayer_AABB_withFloorSlope(player, pos, vel, entity, slopeDirection);
            } else {
                interpolate_AABB(player, entity);
                resolveCollision_AABB2(player, pos, vel, entity);
            }
        } else {
            if (player.getTop()>=entity.getTop()-1) {
                collidePlayer_AABB_withCeilSlope(player, pos, vel, entity, slopeDirection);
            } else {
                interpolate_AABB(player, entity);
                resolveCollision_AABB2(player, pos, vel, entity);
            }
        }
    }

    export const resolveOverlap_AABB = (player:ArcadeRigidBody, entity:ArcadeRigidBody):void=> {
        if (player.getHostModel().isDetached() || entity.getHostModel().isDetached()) return;
        player.overlappedWith = entity;
        entity.overlappedWith = player;
        player.collisionEventHandler.trigger(ARCADE_COLLISION_EVENTS.OVERLAPPED, entity);
        entity.collisionEventHandler.trigger(ARCADE_COLLISION_EVENTS.OVERLAPPED, player);
    }

    const calcCommonRestitution = (player:ArcadeRigidBody, entity:ArcadeRigidBody):number=> {
        return (player._restitution + entity._restitution)/2;
    }

    const getComparedToSticky = (val:number):number=> {
        if (abs(val) < STICKY_THRESHOLD) {
            return 0;
        } else {
            return val;
        }
    }

    const _reflectVelocity = (player:ArcadeRigidBody, playerVelocity: Point2d, entity:ArcadeRigidBody, dim:'x'|'y')=> {
        const restitution = calcCommonRestitution(player, entity);
        if (entity._modelType===ARCADE_RIGID_BODY_TYPE.STATIC || entity._modelType===ARCADE_RIGID_BODY_TYPE.KINEMATIC) {
            // v` = -v1
            playerVelocity[dim] =
                getComparedToSticky(
                    -playerVelocity[dim] * restitution
                );
        }
        else {
            // v' = (m1v1 + m2v2)/(m1 + m2)
            playerVelocity[dim] = getComparedToSticky(
                (player.velocity[dim] + entity.velocity[dim]) * restitution
            );
        }
    }

    const reflectVelocityY = (player:ArcadeRigidBody, playerVelocity: Point2d, entity:ArcadeRigidBody):void=> {
        _reflectVelocity(player, playerVelocity, entity, 'y');
    }

    const reflectVelocityX = (player:ArcadeRigidBody, playerVelocity: Point2d, entity:ArcadeRigidBody):void=> {
        _reflectVelocity(player, playerVelocity, entity, 'x');
    }

    const emitCollisionEvents = (player:ArcadeRigidBody, entity:ArcadeRigidBody):void=> {
        if (player.getHostModel().isDetached() || entity.getHostModel().isDetached()) return;
        player.collisionEventHandler.trigger(ARCADE_COLLISION_EVENTS.COLLIDED, entity);
        entity.collisionEventHandler.trigger(ARCADE_COLLISION_EVENTS.COLLIDED, player);
    }

    const collidePlayer_AABB_withFloorSlope =(player:ArcadeRigidBody, pos: Point2d, vel: Point2d, slope:ArcadeRigidBody,slopeType:SLOPE_DIRECTION):void=> {
        const dxFactor =
            slopeType===SLOPE_DIRECTION.UP?
                player.getRight() - slope.getLeft():
                player.getLeft()  - slope.getLeft();
        const dx = MathEx.clamp(dxFactor,0,slope._rect.width);
        const slopeFactor = slope._rect.height * dx/slope._rect.width;
        const slopeCorrection =
            slopeType===SLOPE_DIRECTION.UP?
                slopeFactor:
                slope._rect.height - slopeFactor;
        const onSlopePosY = slope.getBottom() - slopeCorrection - player._rect.height - player._rect.y - 1;
        if (player.pos.y>onSlopePosY) {
            pos.y = onSlopePosY;

            emitCollisionEvents(player, slope);
            player.collisionFlags.bottom = slope.collisionFlags.top = true;
            reflectVelocityY(player, vel, slope);
        }
    }


    const collidePlayer_AABB_withCeilSlope =(player:ArcadeRigidBody, pos: Point2d, vel: Point2d, slope:ArcadeRigidBody,slopeType:SLOPE_DIRECTION):void=> {
        const dxFactor =
            slopeType===SLOPE_DIRECTION.DOWN?
                player.getRight() - slope.getLeft():
                player.getLeft()  - slope.getLeft();
        const dx = MathEx.clamp(dxFactor,0,slope._rect.width);
        const slopeFactor = slope._rect.height * dx/slope._rect.width;
        const slopeCorrection =
            slopeType===SLOPE_DIRECTION.DOWN?
                slopeFactor:
                slope._rect.height - slopeFactor;
        const onSlopePosY = slope.getTop() + slopeCorrection - player._rect.y + 1;
        if (player.pos.y<onSlopePosY) {
            pos.y = onSlopePosY;

            emitCollisionEvents(player, slope);
            player.collisionFlags.top = slope.collisionFlags.bottom = true;
            reflectVelocityY(player, vel, slope);
        }
    }

    const collidePlayerWithTop_AABB = (player:ArcadeRigidBody, pos:Point2d, vel: Point2d, entity:ArcadeRigidBody):void=> {
        if (!player._collisionFlagsOld.bottom) { // check to prevent penetration through floor
            pos.y = entity.getBottom() - player._rect.y;
        }
        player.collisionFlags.top = entity.collisionFlags.bottom = true;
        emitCollisionEvents(player, entity);
        reflectVelocityY(player, vel, entity);
    }

    const collidePlayerWithBottom_AABB = (player:ArcadeRigidBody, pos:Point2d, vel: Point2d, entity:ArcadeRigidBody):void=> {
        pos.y = entity.getTop() - player._rect.height - player._rect.y;
        pos.x+=entity._offsetX; // move player with platform
        entity._offsetX = 0;
        player.collisionFlags.bottom = entity.collisionFlags.top = true;
        emitCollisionEvents(player, entity);
        reflectVelocityY(player, vel, entity);
    }

    const collidePlayerWithLeft_AABB = (player:ArcadeRigidBody, pos:Point2d, vel: Point2d, entity:ArcadeRigidBody):void=>{
        pos.x = entity.getRight() - player._rect.x;
        player.collisionFlags.left = entity.collisionFlags.right = true;
        emitCollisionEvents(player, entity);
        reflectVelocityX(player, vel, entity);
    }

    const collidePlayerWithRight_AABB = (player:ArcadeRigidBody, pos:Point2d, vel: Point2d, entity:ArcadeRigidBody):void=>{
        pos.x = entity.getLeft() - player._rect.width - player._rect.x;
        player.collisionFlags.right = entity.collisionFlags.left = true;
        emitCollisionEvents(player, entity);
        reflectVelocityX(player, vel, entity);
    }

}
