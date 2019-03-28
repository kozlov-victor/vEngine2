import {Game} from "../game";
import {DebugError} from "../debug/debugError";


export class Vec2 {

    x:number;
    y:number;

    constructor(x:number,y:number) {
        this.x = x;
        this.y = y;
    }

    length():number{
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    add(vec:Vec2):Vec2 {
        return new Vec2(vec.x + this.x, vec.y + this.y);
    }

    subtract(vec:Vec2):Vec2 {
        return new Vec2(this.x - vec.x, this.y - vec.y);
    }

    scale(n:number):Vec2{
        return new Vec2(this.x * n, this.y * n);
    }

    dot(vec:Vec2):number{
        return (this.x * vec.x + this.y * vec.y);
    }

    cross(vec:Vec2):number{
        return (this.x * vec.y - this.y * vec.x);
    }

    rotate(center:Vec2, angle:number) {
        //rotate in counterclockwise
        let r:number[] = [];

        let x:number = this.x - center.x;
        let y:number = this.y - center.y;

        r[0] = x * Math.cos(angle) - y * Math.sin(angle);
        r[1] = x * Math.sin(angle) + y * Math.cos(angle);

        r[0] += center.x;
        r[1] += center.y;

        return new Vec2(r[0], r[1]);
    }

    normalize():Vec2{
        let len:number = this.length();
        if (len > 0) {
            len = 1 / len;
        }
        return new Vec2(this.x * len, this.y * len);
    }

    distance(vec:Vec2):number {
        let x:number = this.x - vec.x;
        let y:number = this.y - vec.y;
        return Math.sqrt(x * x + y * y);
    }

}

export class CollisionInfo {
    mDepth:number = 0;
    mNormal:Vec2 = new Vec2(0, 0);
    mStart:Vec2 = new Vec2(0, 0);
    mEnd:Vec2 = new Vec2(0, 0);

    setDepth(s:number) {
        this.mDepth = s;
    }

    setNormal(s:Vec2) {
        this.mNormal = s;
    }

    getDepth(){
        return this.mDepth;
    }

    getNormal(){
        return this.mNormal;
    }

    setInfo(d:number, n:Vec2, s:Vec2){
        this.mDepth = d;
        this.mNormal = n;
        this.mStart = s;
        this.mEnd = s.add(n.scale(d));
    }

    changeDir(){
        this.mNormal = this.mNormal.scale(-1);
        let n:Vec2 = this.mStart;
        this.mStart = this.mEnd;
        this.mEnd = n;
    }

}


export abstract class RigidShape {

    mCenter:Vec2;
    mInertia:number;
    fixedAngle:boolean = false;
    mInvMass:number;
    mFriction:number;
    mRestitution: number;
    mVelocity:Vec2 = new Vec2(0, 0);
    mAcceleration:Vec2;
    mAngle:number = 0;
    mAngularVelocity:number = 0; //negetive-- clockwise, postive-- counterclockwise
    mAngularAcceleration:number = 0;
    mBoundRadius:number = 0;
    game:Game;
    readonly abstract mType:string;

    constructor(game:Game,center:Vec2, mass?:number, friction?:number, restitution?:number){
        this.game = game;
        this.mCenter = center;
        this.mInertia = 0;
        this.fixedAngle = false;
        if (mass !== undefined) {
            this.mInvMass = mass;
        } else {
            this.mInvMass = 1;
        }

        if (friction !== undefined) {
            this.mFriction = friction;
        } else {
            this.mFriction = 0.2;
        }

        if (restitution !== undefined) {
            this.mRestitution = restitution;
        } else {
            this.mRestitution = 0.1;
        }

        if (this.mInvMass !== 0) {
            this.mInvMass = 1 / this.mInvMass;
            this.mAcceleration = new Vec2(0, game.gravityConstant);
        } else {
            this.mAcceleration = new Vec2(0, 0);
        }
    }

    updateMass(delta:number){
        let mass:number;
        if (this.mInvMass !== 0) {
            mass = 1 / this.mInvMass;
        } else {
            mass = 0;
        }

        mass += delta;
        if (mass <= 0) {
            this.mInvMass = 0;
            this.mVelocity = new Vec2(0, 0);
            this.mAcceleration = new Vec2(0, 0);
            this.mAngularVelocity = 0;
            this.mAngularAcceleration = 0;
        } else {
            this.mInvMass = 1 / mass;
            this.mAcceleration = new Vec2(0, this.game.gravityConstant);
        }
        this.updateInertia();
    }

    abstract updateInertia():void
    abstract move(v:Vec2):void
    abstract rotate(a:number):void

    update(){

        const dt:number = this.game.getDeltaTime() / 1000;

        //v += a*t
        this.mVelocity = this.mVelocity.add(this.mAcceleration.scale(dt));
        //s += v*t
        this.move(this.mVelocity.scale(dt));

        this.mAngularVelocity += this.mAngularAcceleration * dt;
        //if (!this.fixedAngle)
        this.rotate(this.mAngularVelocity * dt);
    }

    boundTest(otherShape:RigidShape):boolean {
        let vFrom1to2: Vec2 = otherShape.mCenter.subtract(this.mCenter);
        let rSum: number = this.mBoundRadius + otherShape.mBoundRadius;
        let dist: number = vFrom1to2.length();
        return (dist <= rSum);
    }

}

export class RigidCircle extends RigidShape {

    readonly mType:string = "Circle";
    mRadius:number;
    mStartpoint:Vec2;

    constructor(game:Game,center: Vec2, radius: number, mass?: number, friction?: number, restitution?: number) {
        super(game,center, mass, friction, restitution);
        this.mRadius = radius;
        this.mBoundRadius = radius;
        //The start point of line in circle
        this.mStartpoint = new Vec2(center.x, center.y - radius);
        this.updateInertia();
    }

    move(s:Vec2):RigidCircle{
        this.mStartpoint = this.mStartpoint.add(s);
        this.mCenter = this.mCenter.add(s);
        return this;
    }

    rotate(angle:number):RigidCircle{
        this.mAngle += angle;
        this.mStartpoint = this.mStartpoint.rotate(this.mCenter, angle);
        return this;
    }

    updateInertia(){
        if (this.mInvMass === 0) {
            this.mInertia = 0;
        } else {
            // this.mInvMass is inverted!!
            // Inertia=mass * radius^2
            // 12 is a constant value that can be changed
            this.mInertia = (1 / this.mInvMass) * (this.mRadius * this.mRadius) / 12;
        }
    }

    collisionTest(otherShape:RigidShape, collisionInfo:CollisionInfo):boolean{
        if (RigidCircle.isInstanceOf(otherShape)) {
            return this.collidedCircCirc(this, otherShape as RigidCircle, collisionInfo);
        } else if (RigidRectangle.isInstanceOf(otherShape)){
            return otherShape.collidedRectCirc(this, collisionInfo);
        } else {
            if (DEBUG) {
                console.error(this,otherShape);
                throw new DebugError(`collision test error`);
            }
        }
    }

    collidedCircCirc(c1:RigidCircle, c2:RigidCircle, collisionInfo:CollisionInfo):boolean{
        let vFrom1to2:Vec2 = c2.mCenter.subtract(c1.mCenter);
        let rSum:number = c1.mRadius + c2.mRadius;
        let dist:number = vFrom1to2.length();
        if (dist > Math.sqrt(rSum * rSum)) {
            //not overlapping
            return false;
        }
        if (dist !== 0) {
            // overlapping bu not same position
            let normalFrom2to1:Vec2 = vFrom1to2.scale(-1).normalize();
            let radiusC2:Vec2 = normalFrom2to1.scale(c2.mRadius);
            collisionInfo.setInfo(rSum - dist, vFrom1to2.normalize(), c2.mCenter.add(radiusC2));
        } else {
            //same position
            if (c1.mRadius > c2.mRadius) {
                collisionInfo.setInfo(rSum, new Vec2(0, -1), c1.mCenter.add(new Vec2(0, c1.mRadius)));
            } else {
                collisionInfo.setInfo(rSum, new Vec2(0, -1), c2.mCenter.add(new Vec2(0, c2.mRadius)));
            }
        }
        return true;
    }

    static isInstanceOf(shape:RigidShape): shape is RigidCircle{
        return shape.mType==='Circle'
    }

}

class SupportStruct {
    mSupportPoint:Vec2;
    mSupportPointDist:number = 0;
}

let tmpSupport = new SupportStruct();
let collisionInfoR1:CollisionInfo = new CollisionInfo();
let collisionInfoR2:CollisionInfo = new CollisionInfo();

export class RigidRectangle extends RigidShape {

    readonly mType:string = "Rectangle";
    mWidth:number;
    mHeight:number;
    mVertex:Vec2[] = [];
    mFaceNormal:Vec2[] = [];


    constructor(game:Game,center: Vec2, width: number, height: number, mass?: number, friction?: number, restitution?: number) {
        super(game,center, mass, friction, restitution);

        this.mWidth = width;
        this.mHeight = height;
        this.mBoundRadius = Math.sqrt(width * width + height * height) / 2;

        //0--TopLeft;1--TopRight;2--BottomRight;3--BottomLeft
        this.mVertex[0] = new Vec2(center.x - width / 2, center.y - height / 2);
        this.mVertex[1] = new Vec2(center.x + width / 2, center.y - height / 2);
        this.mVertex[2] = new Vec2(center.x + width / 2, center.y + height / 2);
        this.mVertex[3] = new Vec2(center.x - width / 2, center.y + height / 2);

        //0--Top;1--Right;2--Bottom;3--Left
        //mFaceNormal is normal of face toward outside of rectangle
        this.mFaceNormal[0] = this.mVertex[1].subtract(this.mVertex[2]);
        this.mFaceNormal[0] = this.mFaceNormal[0].normalize();
        this.mFaceNormal[1] = this.mVertex[2].subtract(this.mVertex[3]);
        this.mFaceNormal[1] = this.mFaceNormal[1].normalize();
        this.mFaceNormal[2] = this.mVertex[3].subtract(this.mVertex[0]);
        this.mFaceNormal[2] = this.mFaceNormal[2].normalize();
        this.mFaceNormal[3] = this.mVertex[0].subtract(this.mVertex[1]);
        this.mFaceNormal[3] = this.mFaceNormal[3].normalize();

        this.updateInertia();
    }

    rotate(angle:number):RigidRectangle {
        this.mAngle += angle;
        for (let i = 0; i < this.mVertex.length; i++) {
            this.mVertex[i] = this.mVertex[i].rotate(this.mCenter, angle);
        }
        this.mFaceNormal[0] = this.mVertex[1].subtract(this.mVertex[2]);
        this.mFaceNormal[0] = this.mFaceNormal[0].normalize();
        this.mFaceNormal[1] = this.mVertex[2].subtract(this.mVertex[3]);
        this.mFaceNormal[1] = this.mFaceNormal[1].normalize();
        this.mFaceNormal[2] = this.mVertex[3].subtract(this.mVertex[0]);
        this.mFaceNormal[2] = this.mFaceNormal[2].normalize();
        this.mFaceNormal[3] = this.mVertex[0].subtract(this.mVertex[1]);
        this.mFaceNormal[3] = this.mFaceNormal[3].normalize();
        return this;
    }

    move(v:Vec2):RigidRectangle {
        for (let i = 0; i < this.mVertex.length; i++) {
            this.mVertex[i] = this.mVertex[i].add(v);
        }
        this.mCenter = this.mCenter.add(v);
        return this;
    }

    updateInertia(){
        // Expect this.mInvMass to be already inverted!
        if (this.mInvMass === 0) {
            this.mInertia = 0;
        } else {
            //inertia=mass*width^2+height^2
            this.mInertia = (1 / this.mInvMass) * (this.mWidth * this.mWidth + this.mHeight * this.mHeight) / 12;
            this.mInertia = 1 / this.mInertia;
        }
    }

    collisionTest(otherShape:RigidShape, collisionInfo:CollisionInfo){
        if (RigidCircle.isInstanceOf(otherShape)) {
            return this.collidedRectCirc(otherShape as RigidCircle, collisionInfo);
        } else if (RigidRectangle.isInstanceOf(otherShape)) {
            return this.collidedRectRect(this, otherShape as RigidRectangle, collisionInfo);
        }
        else {
            if (DEBUG) {
                console.error(this,otherShape);
                throw new DebugError(`collision test error`);
            }

        }
    }

    boundTest(otherShape:RigidShape){
        let vFrom1to2:Vec2 = otherShape.mCenter.subtract(this.mCenter);
        let rSum:number = this.mBoundRadius + otherShape.mBoundRadius;
        let dist:number = vFrom1to2.length();
        return dist <= rSum;
    }

    findSupportPoint(dir:Vec2, ptOnEdge:Vec2){
        //the longest project length
        let vToEdge:Vec2;
        let projection:number;

        tmpSupport.mSupportPointDist = -9999999;
        tmpSupport.mSupportPoint = null;
        //check each vector of other object
        for (let i = 0; i < this.mVertex.length; i++) {
            vToEdge = this.mVertex[i].subtract(ptOnEdge);
            projection = vToEdge.dot(dir);

            //find the longest distance with certain edge
            //dir is -n direction, so the distance should be positive
            if ((projection > 0) && (projection > tmpSupport.mSupportPointDist)) {
                tmpSupport.mSupportPoint = this.mVertex[i];
                tmpSupport.mSupportPointDist = projection;
            }
        }
    }

    /**
     * Find the shortest axis that overlapping
     * the code is convert from http://gamedevelopment.tutsplus.com/tutorials/how-to-create-a-custom-2d-physics-engine-oriented-rigid-bodies--gamedev-8032
     */
    findAxisLeastPenetration(otherRect:RigidRectangle, collisionInfo:CollisionInfo):boolean{
        let n:Vec2;
        let supportPoint:Vec2;

        let bestDistance:number = 999999;
        let bestIndex:number = null;

        let hasSupport:boolean = true;
        let i:number = 0;

        while ((hasSupport) && (i < this.mFaceNormal.length)) {
            // Retrieve a face normal from A
            n = this.mFaceNormal[i];

            // use -n as direction and the vectex on edge i as point on edge
            let dir:Vec2 = n.scale(-1);
            let ptOnEdge:Vec2 = this.mVertex[i];
            // find the support on B
            // the point has longest distance with edge i
            otherRect.findSupportPoint(dir, ptOnEdge);
            hasSupport = (tmpSupport.mSupportPoint !== null);

            //get the shortest support point depth
            if ((hasSupport) && (tmpSupport.mSupportPointDist < bestDistance)) {
                bestDistance = tmpSupport.mSupportPointDist;
                bestIndex = i;
                supportPoint = tmpSupport.mSupportPoint;
            }
            i = i + 1;
        }
        if (hasSupport) {
            //all four directions have support point
            let bestVec:Vec2 = this.mFaceNormal[bestIndex].scale(bestDistance);
            collisionInfo.setInfo(bestDistance, this.mFaceNormal[bestIndex], supportPoint.add(bestVec));
        }
        return hasSupport;
    }

    collidedRectRect(r1:RigidRectangle, r2:RigidRectangle, collisionInfo:CollisionInfo):boolean{
        let status1:boolean;
        let status2:boolean;

        //find Axis of Separation for both rectangle
        status1 = r1.findAxisLeastPenetration(r2, collisionInfoR1);

        if (status1) {
            status2 = r2.findAxisLeastPenetration(r1, collisionInfoR2);
            if (status2) {
                //if both of rectangles are overlapping, choose the shorter normal as the normal
                if (collisionInfoR1.getDepth() < collisionInfoR2.getDepth()) {
                    let depthVec:Vec2 = collisionInfoR1.getNormal().scale(collisionInfoR1.getDepth());
                    collisionInfo.setInfo(collisionInfoR1.getDepth(), collisionInfoR1.getNormal(), collisionInfoR1.mStart.subtract(depthVec));
                } else {
                    collisionInfo.setInfo(collisionInfoR2.getDepth(), collisionInfoR2.getNormal().scale(-1), collisionInfoR2.mStart);
                }
            }
        }
        return status1 && status2;
    }

    collidedRectCirc(otherCir:RigidCircle, collisionInfo:CollisionInfo):boolean{
        let inside:boolean = true;
        let bestDistance:number = -99999;
        let nearestEdge:number = 0;
        let i:number, v:Vec2;
        let circ2Pos:Vec2, projection:number;
        for (i = 0; i < 4; i++) { // todo 4!!
            //find the nearest face for center of circle
            circ2Pos = otherCir.mCenter;
            v = circ2Pos.subtract(this.mVertex[i]);
            projection = v.dot(this.mFaceNormal[i]);
            if (projection > 0) {
                //if the center of circle is outside of rectangle
                bestDistance = projection;
                nearestEdge = i;
                inside = false;
                break;
            }
            if (projection > bestDistance) {
                bestDistance = projection;
                nearestEdge = i;
            }
        }
        let dis:number, normal:Vec2, radiusVec:Vec2;
        if (!inside) {
            //the center of circle is outside of rectangle

            //v1 is from left vertex of face to center of circle
            //v2 is from left vertex of face to right vertex of face
            let v1:Vec2 = circ2Pos.subtract(this.mVertex[nearestEdge]);
            let v2:Vec2 = this.mVertex[(nearestEdge + 1) % 4].subtract(this.mVertex[nearestEdge]);

            let dot:number = v1.dot(v2);

            if (dot < 0) {
                //the center of circle is in corner region of mVertex[nearestEdge]
                dis = v1.length();
                //compare the distance with radium to decide collision
                if (dis > otherCir.mRadius) {
                    return false;
                }

                normal = v1.normalize();
                radiusVec = normal.scale(-otherCir.mRadius);
                collisionInfo.setInfo(otherCir.mRadius - dis, normal, circ2Pos.add(radiusVec));
            } else {
                //the center of circle is in corner region of mVertex[nearestEdge+1]

                //v1 is from right vertex of face to center of circle
                //v2 is from right vertex of face to left vertex of face
                v1 = circ2Pos.subtract(this.mVertex[(nearestEdge + 1) % 4]);
                v2 = v2.scale(-1);
                dot = v1.dot(v2);
                if (dot < 0) {
                    dis = v1.length();
                    //compare the distance with radium to decide collision
                    if (dis > otherCir.mRadius) {
                        return false;
                    }
                    normal = v1.normalize();
                    radiusVec = normal.scale(-otherCir.mRadius);
                    collisionInfo.setInfo(otherCir.mRadius - dis, normal, circ2Pos.add(radiusVec));
                } else {
                    //the center of circle is in face region of face[nearestEdge]
                    if (bestDistance < otherCir.mRadius) {
                        radiusVec = this.mFaceNormal[nearestEdge].scale(otherCir.mRadius);
                        collisionInfo.setInfo(otherCir.mRadius - bestDistance, this.mFaceNormal[nearestEdge], circ2Pos.subtract(radiusVec));
                    } else {
                        return false;
                    }
                }
            }
        } else {
            //the center of circle is inside of rectangle
            radiusVec = this.mFaceNormal[nearestEdge].scale(otherCir.mRadius);
            collisionInfo.setInfo(otherCir.mRadius - bestDistance, this.mFaceNormal[nearestEdge], circ2Pos.subtract(radiusVec));
        }
        return true;
    }

    static isInstanceOf(shape:RigidShape): shape is RigidRectangle{
        return shape.mType==='Rectangle'
    }

}

