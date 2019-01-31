

import {Game} from "../game";
import {Vec2,CollisionInfo} from './rigidShapes';
import {Rect} from "../geometry/rect";
import {MathEx} from '../mathEx'
import {GameObject} from "../../model/impl/gameObject";

export class ColliderEngine {

    relaxationCount:number = 15;
    // percentage of separation to project objects
    posCorrectionRate:number = 0.8;


    private game:Game;

    constructor(game:Game){
        this.game = game;
    }

    private positionalCorrection(s1, s2, collisionInfo){
        var s1InvMass = s1.mInvMass;
        var s2InvMass = s2.mInvMass;

        var num = collisionInfo.getDepth() / (s1InvMass + s2InvMass) * this.posCorrectionRate;
        var correctionAmount = collisionInfo.getNormal().scale(num);

        s1.move(correctionAmount.scale(-s1InvMass));
        s2.move(correctionAmount.scale(s2InvMass));
    }

    resolveCollision(s1, s2, collisionInfo){

        if ((s1.mInvMass === 0) && (s2.mInvMass === 0)) {
            return;
        }

        //  correct positions
        this.positionalCorrection(s1, s2, collisionInfo);

        var n = collisionInfo.getNormal();

        //the direction of collisionInfo is always from s1 to s2
        //but the Mass is inversed, so start scale with s2 and end scale with s1
        var start = collisionInfo.mStart.scale(s2.mInvMass / (s1.mInvMass + s2.mInvMass));
        var end = collisionInfo.mEnd.scale(s1.mInvMass / (s1.mInvMass + s2.mInvMass));
        var p = start.add(end);
        //r is vector from center of object to collision point
        var r1 = p.subtract(s1.mCenter);
        var r2 = p.subtract(s2.mCenter);

        //newV = V + mAngularVelocity cross R
        var v1 = s1.mVelocity.add(new Vec2(-1 * s1.mAngularVelocity * r1.y, s1.mAngularVelocity * r1.x));
        var v2 = s2.mVelocity.add(new Vec2(-1 * s2.mAngularVelocity * r2.y, s2.mAngularVelocity * r2.x));
        var relativeVelocity = v2.subtract(v1);

        // Relative velocity in normal direction
        var rVelocityInNormal = relativeVelocity.dot(n);

        //if objects moving apart ignore
        if (rVelocityInNormal > 0) {
            return;
        }

        // compute and apply response impulses for each object
        var newRestituion = Math.min(s1.mRestitution, s2.mRestitution);
        var newFriction = Math.min(s1.mFriction, s2.mFriction);

        //R cross N
        var R1crossN = r1.cross(n);
        var R2crossN = r2.cross(n);

        // Calc impulse scalar
        // the formula of jN can be found in http://www.myphysicslab.com/collision.html
        var jN = -(1 + newRestituion) * rVelocityInNormal;
        jN = jN / (s1.mInvMass + s2.mInvMass +
            R1crossN * R1crossN * s1.mInertia +
            R2crossN * R2crossN * s2.mInertia);

        //impulse is in direction of normal ( from s1 to s2)
        var impulse = n.scale(jN);
        // impulse = F dt = m * ?v
        // ?v = impulse / m
        s1.mVelocity = s1.mVelocity.subtract(impulse.scale(s1.mInvMass));
        s2.mVelocity = s2.mVelocity.add(impulse.scale(s2.mInvMass));

        if (!s1.fixedAngle) s1.mAngularVelocity -= R1crossN * jN * s1.mInertia;
        if (!s2.fixedAngle) s2.mAngularVelocity += R2crossN * jN * s2.mInertia;

        var tangent = relativeVelocity.subtract(n.scale(relativeVelocity.dot(n)));

        //relativeVelocity.dot(tangent) should less than 0
        tangent = tangent.normalize().scale(-1);

        var R1crossT = r1.cross(tangent);
        var R2crossT = r2.cross(tangent);

        var jT = -(1 + newRestituion) * relativeVelocity.dot(tangent) * newFriction;
        jT = jT / (s1.mInvMass + s2.mInvMass + R1crossT * R1crossT * s1.mInertia + R2crossT * R2crossT * s2.mInertia);

        //friction should less than force in normal direction
        if (jT > jN) {
            jT = jN;
        }

        //impulse is from s1 to s2 (in opposite direction of velocity)
        impulse = tangent.scale(jT);

        s1.mVelocity = s1.mVelocity.subtract(impulse.scale(s1.mInvMass));
        s2.mVelocity = s2.mVelocity.add(impulse.scale(s2.mInvMass));
        if (!s1.fixedAngle) s1.mAngularVelocity -= R1crossT * jT * s1.mInertia;
        if (!s2.fixedAngle) s2.mAngularVelocity += R2crossT * jT * s2.mInertia;
    }

    private boundAndCollide(a,b,collisionInfo){
        if (a.boundTest(b)) {
            if (a.collisionTest(b, collisionInfo)) {
                //make sure the normal is always from object[i] to object[j]
                if (collisionInfo.getNormal().dot(b.mCenter.subtract(a.mCenter)) < 0) {
                    collisionInfo.changeDir();
                }
                this.resolveCollision(a, b, collisionInfo);
            }
        }
    }

    collision(){
        let rigidObjects =
            this.game.getCurrScene().getAllGameObjects().map(g=>g.rigidBody);
            //concat(this.game.getCurrScene().tileMap.rigidBodies);

        var i, j, k;
        var collisionInfo = new CollisionInfo();
        for (k = 0; k < this.relaxationCount; k++) {
            for (i = 0; i < rigidObjects.length; i++) {
                if (!rigidObjects[i]) continue;

                let tiles = this.game.getCurrScene().tileMap.getTilesAtRect(new Rect(
                    rigidObjects[i].mCenter.x -  rigidObjects[i].mWidth/2,
                    rigidObjects[i].mCenter.y -  rigidObjects[i].mHeight/2,
                    rigidObjects[i].mWidth,
                    rigidObjects[i].mHeight
                ));
                if (tiles.length) {
                    tiles.forEach(t=>{
                        this.boundAndCollide(rigidObjects[i],t.rect,collisionInfo);
                    })
                }

                for (j = i + 1; j < rigidObjects.length; j++) {
                    if (!rigidObjects[j]) continue;
                    this.boundAndCollide(rigidObjects[i],rigidObjects[j],collisionInfo);
                }
            }
        }
    }

    private isIntersect(arr1:string[] = [], arr2:string[] = []):boolean{
        return arr1.filter(value => arr2.indexOf(value)!==-1).length>0;
    }

    private boundAndCollideAcrade(a:GameObject,b:GameObject){
        if (a.velocity.equal(0) && b.velocity.equal(0)) return;
        let numOfIterations = 0;
        let isOverlapped = MathEx.overlapTest(a.getRect(),b.getRect());
        if (!isOverlapped) return;
        if (!a.rigid || !b.rigid) {
            a.trigger('overlap',b);
            b.trigger('overlap',a);
            return;
        }
        while (isOverlapped) {
            if (numOfIterations>3) break;
            const dt = 0.01;
            a.pos.x += -a.velocity.x*dt;
            a.pos.y += -a.velocity.y*dt;
            b.pos.x += -b.velocity.x*dt;
            b.pos.y += -b.velocity.y*dt;
            isOverlapped = MathEx.overlapTest(a.getRect(),b.getRect());
            numOfIterations++;
        }
        a.trigger('collide',b);
        b.trigger('collide',a);
    }

    collisionArcade() {
        let rigidObjects =
            this.game.getCurrScene().getAllGameObjects();

        for (let i = 0; i < rigidObjects.length; i++) {
            for (let j = i + 1; j < rigidObjects.length; j++) {
                let a = rigidObjects[i], b = rigidObjects[j];
                if (
                    this.isIntersect(a.collideWith,b.groupNames) ||
                    this.isIntersect(b.collideWith,a.groupNames)
                ) {
                    this.boundAndCollideAcrade(a,b);
                }
            }
        }
    }

}