import {Point2d} from "@engine/geometry/point2d";
import {Game} from "@engine/core/game";
import {IPhysicsSystem} from "@engine/physics/common/interfaces";
import {ARCADE_RIGID_BODY_TYPE, ArcadeRigidBody} from "@engine/physics/arcade/arcadeRigidBody";
import {MathEx} from "@engine/misc/math/mathEx";
import {IRectJSON, Rect} from "@engine/geometry/rect";
import {Scene} from "@engine/scene/scene";
import {SpatialSpace} from "@engine/physics/common/spatialSpace";
import {CollisionGroup} from "@engine/physics/arcade/collisionGroup";
import {Int} from "@engine/core/declarations";
import {Size} from "@engine/geometry/size";
import {arcadePhysicsHelper} from "@engine/physics/arcade/arcadePhysicsHelper";
import resolveOverlap_AABB = arcadePhysicsHelper.resolveOverlap_AABB;
import resolveCollision_AABB_withSlope = arcadePhysicsHelper.resolveCollision_AABB_withSlope;
import interpolateAndResolveCollision_AABB = arcadePhysicsHelper.interpolateAndResolveCollision_AABB;

export interface ICreateRigidBodyParams {
    type?: ARCADE_RIGID_BODY_TYPE;
    rect?:IRectJSON;
    restitution?:number;
    debug?:boolean;
    groupNames?:string[];
    ignoreCollisionWithGroupNames?:string[];
    ignoreOverlapWithGroupNames?:string[];
    gravityImpact?:number; // 0..1
    acceptCollisions?:boolean;
}

const intersect = (a:Int,b:Int):boolean=> {
    return ((a as number) & (b as number))>0;
};

export const enum SLOPE_TYPE {
    FLOOR_UP = 200,
    FLOOR_DOWN,
    CEIL_UP,
    CEIL_DOWN
}


// const include = (a:Int,b:Int):boolean=> { // true if "a" contains all elements of "b"
//     if (a===0 || b===0) return false;
//     return (((a as Int) | (b as Int)) as Int)===a;
// }

const testedCollisionsCache = new Map<number,number>();
const p1 = new Point2d();
const p2 = new Point2d();

export class ArcadePhysicsSystem implements IPhysicsSystem {

    public static readonly gravity:Point2d = new Point2d(0,5);
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
        if (params?.rect!==undefined) {
            const rect = new Rect();
            rect.setFrom(params.rect);
            body._rect = rect;
        }
        if (params?.debug!==undefined) (body as {debug:boolean}).debug = params.debug;
        if (params?.groupNames) {
            params.groupNames.forEach(g=>{
                const mask = CollisionGroup.createOrFindGroupBitMaskByName(g);
                body.groupNames = ((body.groupNames as number) | (mask as number)) as Int;
            });
        }
        params?.ignoreCollisionWithGroupNames?.forEach(g=>{
            const mask = CollisionGroup.createOrFindGroupBitMaskByName(g);
            body.ignoreCollisionWithGroupNames = ((body.ignoreCollisionWithGroupNames as number) | (mask as number)) as Int;
        });
        params?.ignoreOverlapWithGroupNames?.forEach(g=>{
            const mask = CollisionGroup.createOrFindGroupBitMaskByName(g);
            body.ignoreOverlapWithGroupNames = ((body.ignoreOverlapWithGroupNames as number) | (mask as number)) as Int;
        });
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
        const cells = scene._spatialSpace.getCellsToCheck();
        for (let i=0,max_i=cells.length;i<max_i;++i) {
            const cell = cells[i];
            const bodies = cell.objects;
            for (let j=0,max_j=bodies.length;j<max_j;++j) {
                const playerBody = bodies[j] as ArcadeRigidBody;
                const playerBodyRect = playerBody.calcAndGetBoundRect();
                p1.setFrom(playerBody.pos);

                for (let k=j+1;k<max_j;++k) {
                    const entityBody = bodies[k] as ArcadeRigidBody;
                    if (testedCollisionsCache.get(playerBody.id)===entityBody.id || testedCollisionsCache.get(entityBody.id)===playerBody.id) {
                        continue;
                    }
                    testedCollisionsCache.set(playerBody.id,entityBody.id);
                    const entityBodyRect = entityBody.calcAndGetBoundRect();
                    if (!MathEx.overlapTest(playerBodyRect,entityBodyRect)) continue;
                    p2.setFrom(entityBody.pos);
                    if (
                        !playerBody.acceptCollisions                                               ||
                        !entityBody.acceptCollisions                                               ||
                        intersect(playerBody.groupNames, entityBody.ignoreCollisionWithGroupNames) ||
                        intersect(entityBody.groupNames,playerBody.ignoreCollisionWithGroupNames)
                    ) {
                        if (
                            !intersect(playerBody.groupNames, entityBody.ignoreOverlapWithGroupNames) &&
                            !intersect(entityBody.groupNames, playerBody.ignoreOverlapWithGroupNames)
                        ) {
                            resolveOverlap_AABB(playerBody, entityBody);
                        }
                    } else {
                        if (playerBody.addInfo.slopeType!==undefined || entityBody.addInfo.slopeType!==undefined) {
                            resolveCollision_AABB_withSlope(playerBody, p1, entityBody);
                            resolveCollision_AABB_withSlope(entityBody, p2, playerBody);
                        } else {
                            interpolateAndResolveCollision_AABB(playerBody, p1, entityBody);
                            interpolateAndResolveCollision_AABB(entityBody, p2, playerBody);
                        }
                    }
                    playerBody.pos.setFrom(p1);
                    entityBody.pos.setFrom(p2);
                }
            }
            cell.clear();
        }
        scene._spatialSpace.clear();
    }


}
