import {DebugError} from "../debug/debugError";
import {ObjectPool} from "@engine/misc/objectPool";
import {ICloneable} from "@engine/core/declarations";
import {ReleaseableEntity} from "@engine/misc/releaseableEntity";
import {Vec4} from "@engine/geometry/vec4";
import {Point2d} from "@engine/geometry/point2d";


// https://evanw.github.io/lightgl.js/docs/matrix.html

export namespace Mat4 {

    import Vec4Holder = Vec4.Vec4Holder;
    import VEC4 = Vec4.VEC4;

    type n = number;

    export type MAT16 = [
        n,n,n,n,
        n,n,n,n,
        n,n,n,n,
        n,n,n,n
    ] & Float32Array;

    export class Mat16Holder extends ReleaseableEntity implements ICloneable<Mat16Holder>{

        public constructor(){
            super();
            this.set(
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0
            );
        }


        private static m16hPool:ObjectPool<Mat16Holder> = new ObjectPool<Mat16Holder>(Mat16Holder,512);

        public readonly mat16:Readonly<MAT16> = (new Float32Array(16) as unknown) as MAT16; // exports only readonly arr

        public static fromPool():Mat16Holder {
            return Mat16Holder.m16hPool.getFreeObject()!;
        }

        public static create(): Mat4.Mat16Holder {
            return new Mat16Holder();
        }

        public set(v0:n,v1:n,v2:n,v3:n,v4:n,v5:n,v6:n,v7:n,v8:n,v9:n,v10:n,v11:n,v12:n,v13:n,v14:n,v15:n):void{
            const mat16:MAT16 = this.mat16 as MAT16;
            mat16[0 ]= v0;mat16[1 ]=v1 ;mat16[2 ]=v2 ;mat16[3 ]=v3;
            mat16[4 ]= v4;mat16[5 ]=v5 ;mat16[6 ]=v6 ;mat16[7 ]=v7;
            mat16[8 ]= v8;mat16[9 ]=v9 ;mat16[10]=v10;mat16[11]=v11;
            mat16[12]=v12;mat16[13]=v13;mat16[14]=v14;mat16[15]=v15;
        }

        public fromMat16(mat16:Readonly<MAT16>):void{
            this.mat16.set(mat16,0);
        }

        public clone(): Mat4.Mat16Holder {
            const m:Mat16Holder = new Mat16Holder();
            for (let i:n=0;i<this.mat16.length;i++) {
                (m.mat16 as MAT16)[i] = this.mat16[i];
            }
            return m;
        }

    }


    const identityArray = Float32Array.from([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]) as unknown as Readonly<MAT16>;

    export const makeIdentity = (out:Mat16Holder):void => {
        out.fromMat16(identityArray);
    };


    export const makeZToWMatrix = (out:Mat16Holder,fudgeFactor:n):void => {
        // 1, 0, 0, 0,
        // 0, 1, 0, 0,
        // 0, 0, 1, fudgeFactor,
        // 0, 0, 0, 1
        out.fromMat16(identityArray);
        (out.mat16 as MAT16)[11] = fudgeFactor;
    };

    export const make2DProjection = (out: Mat16Holder,width:n, height:n, depth:n):void => {
        // Note: This matrix flips the Y axis so 0 is at the top.
        out.set(
            2 / width, 0,          0,          0,
            0,         -2 / height,0,          0,
            0,         0,          2 / depth, 0,
            -1,       1,         0,         1
        );
    };


    export const ortho = (
        out:Mat16Holder,
        left:n, right:n,
        bottom:n, top:n,
        near:n, far:n):void =>
    {

        if (DEBUG) {
            if (left===right || bottom===top || near===far) {
                console.error({left,right,bottom,top,near,far});
                throw new DebugError(`Can not create ortho matrix with wrong parameters`);
            }
        }

        const lr:n = 1.0 / (left - right),
            bt:n = 1.0 / (bottom - top),
            nf:n = 1.0 / (near - far);
        const outMat16:MAT16 = out.mat16 as MAT16;
        outMat16[0] = -2 * lr;
        outMat16[1] = 0;
        outMat16[2] = 0;
        outMat16[3] = 0;

        outMat16[4] = 0;
        outMat16[5] = -2 * bt;
        outMat16[6] = 0;
        outMat16[7] = 0;

        outMat16[8] = 0;
        outMat16[9] = 0;
        outMat16[10] = 2 * nf;
        outMat16[11] = 0;

        outMat16[12] = (left + right) * lr;
        outMat16[13] = (top + bottom) * bt;
        outMat16[14] = (far + near) * nf;
        outMat16[15] = 1;
    };

    export const perspective = (out:Mat16Holder,fovy:n, aspect:n, near:n, far:n):void => {
        const f:n = 1.0 / Math.tan(fovy / 2),
            nf:n = 1 / (near - far);

        const outMat16:MAT16 = out.mat16 as MAT16;

        outMat16[0] = f / aspect;
        outMat16[1] = 0;
        outMat16[2] = 0;
        outMat16[3] = 0;

        outMat16[4] = 0;
        outMat16[5] = f;
        outMat16[6] = 0;
        outMat16[7] = 0;

        outMat16[8] = 0;
        outMat16[9] = 0;
        outMat16[10] = (far + near) * nf;
        outMat16[11] = -1;

        outMat16[12] = 0;
        outMat16[13] = 0;
        outMat16[14] = (2 * far * near) * nf;
        outMat16[15] = 0;
    };


    export const makeTranslation = (out:Mat16Holder,tx:n, ty:n, tz:n):void => {

        // 1,  0,  0,  0,
        // 0,  1,  0,  0,
        // 0,  0,  1,  0,
        // tx, ty, tz,  1

        out.fromMat16(identityArray);
        (out.mat16 as MAT16)[12] = tx;
        (out.mat16 as MAT16)[13] = ty;
        (out.mat16 as MAT16)[14] = tz;

    };


    export const makeXSkew = (out:Mat16Holder,angle:n):void => {

        const t:n = Math.tan(angle);

        // 1,  0,  0,  0,
        // t,  1,  0,  0,
        // 0,  0,  1,  0,
        // 0,  0,  0,  1
        out.fromMat16(identityArray);
        (out.mat16 as MAT16)[4] = t;
    };

    export const makeYSkew = (out:Mat16Holder,angle:n):void => {

        const t:n = Math.tan(angle);

        // 1,  t,  0,  0,
        // 0,  1,  0,  0,
        // 0,  0,  1,  0,
        // 0,  0,  0,  1

        out.fromMat16(identityArray);
        (out.mat16 as MAT16)[1] = t;
    };

    export const makeXRotation = (out:Mat16Holder,angleInRadians:n):void=> {
        const c:n = Math.cos(angleInRadians);
        const s:n = Math.sin(angleInRadians);

        // 1, 0, 0, 0,
        // 0, c, s, 0,
        // 0, -s, c, 0,
        // 0, 0, 0, 1
        out.fromMat16(identityArray);
        (out.mat16 as MAT16)[5] = c;
        (out.mat16 as MAT16)[6] = s;
        (out.mat16 as MAT16)[9] = -s;
        (out.mat16 as MAT16)[10] = c;
    };

    export const makeYRotation = (out:Mat16Holder,angleInRadians:n):void=> {
        const c:n = Math.cos(angleInRadians);
        const s:n = Math.sin(angleInRadians);

        // c, 0, -s, 0,
        // 0, 1, 0, 0,
        // s, 0, c, 0,
        // 0, 0, 0, 1

        out.fromMat16(identityArray);
        (out.mat16 as MAT16)[0]  =  c;
        (out.mat16 as MAT16)[2]  = -s;
        (out.mat16 as MAT16)[8]  =  s;
        (out.mat16 as MAT16)[10] =  c;
    };

    export const makeZRotation = (out:Mat16Holder,angleInRadians:n):void=> {
        const c:n = Math.cos(angleInRadians);
        const s:n = Math.sin(angleInRadians);

        // c, s, 0, 0,
        // -s, c, 0, 0,
        // 0, 0, 1, 0,
        // 0, 0, 0, 1

        out.fromMat16(identityArray);
        (out.mat16 as MAT16)[0] = c;
        (out.mat16 as MAT16)[1] = s;
        (out.mat16 as MAT16)[4] = -s;
        (out.mat16 as MAT16)[5] = c;
    };

    export const makeRotationReset = (out:Mat16Holder):void=>{
        const matrix:MAT16 = out.mat16 as MAT16;
        const d:n = Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1] + matrix[2] * matrix[2]);
        matrix[0] = d;
        matrix[4] = 0;
        matrix[8] = 0;
        matrix[1] = 0;
        matrix[5] = d;
        matrix[9] = 0;
        matrix[2] = 0;
        matrix[6] = 0;
        matrix[10] = d;
        matrix[3] = 0;
        matrix[7] = 0;
        matrix[11] = 0;
        matrix[15] = 1;
    };

    export const makeScale = (out:Mat16Holder,sx:n, sy:n, sz:n):void=> {

        // sx, 0,  0,  0,
        // 0, sy,  0,  0,
        // 0,  0, sz,  0,
        // 0,  0,  0,  1

        out.fromMat16(identityArray);
        (out.mat16 as MAT16)[0] = sx;
        (out.mat16 as MAT16)[5] = sy;
        (out.mat16 as MAT16)[10] = -sz;
    };


    export const matrixMultiply = (out:Mat16Holder,aHolder:Mat16Holder, bHolder:Mat16Holder):void => {

        const r:MAT16 = out.mat16 as MAT16;
        const a:MAT16 = aHolder.mat16 as MAT16;
        const b:MAT16 = bHolder.mat16 as MAT16;

        r[0] = a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12];
        r[1] = a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13];
        r[2] = a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14];
        r[3] = a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15];

        r[4] = a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12];
        r[5] = a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13];
        r[6] = a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14];
        r[7] = a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15];

        r[8] = a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12];
        r[9] = a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13];
        r[10] = a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14];
        r[11] = a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15];

        r[12] = a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12];
        r[13] = a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13];
        r[14] = a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14];
        r[15] = a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15];

    };

    export const multVecByMatrix = (out:Vec4Holder, matrix:Mat16Holder, vec4Arr:Vec4Holder):void => {
        for (let i:n = 0; i < 4; i++) {
            (out.vec4 as VEC4)[i] =
                vec4Arr.vec4[0] * matrix.mat16[0 * 4 + i] +
                vec4Arr.vec4[1] * matrix.mat16[1 * 4 + i] +
                vec4Arr.vec4[2] * matrix.mat16[2 * 4 + i] +
                vec4Arr.vec4[3] * matrix.mat16[3 * 4 + i];
        }
    };

    export const inverse = (out:Mat16Holder,mHolder:Mat16Holder):void=>{
        const r:MAT16 = out.mat16 as MAT16;
        const m:MAT16 = mHolder.mat16 as MAT16;

        r[0] = m[5]*m[10]*m[15] - m[5]*m[14]*m[11] - m[6]*m[9]*m[15] + m[6]*m[13]*m[11] + m[7]*m[9]*m[14] - m[7]*m[13]*m[10];
        r[1] = -m[1]*m[10]*m[15] + m[1]*m[14]*m[11] + m[2]*m[9]*m[15] - m[2]*m[13]*m[11] - m[3]*m[9]*m[14] + m[3]*m[13]*m[10];
        r[2] = m[1]*m[6]*m[15] - m[1]*m[14]*m[7] - m[2]*m[5]*m[15] + m[2]*m[13]*m[7] + m[3]*m[5]*m[14] - m[3]*m[13]*m[6];
        r[3] = -m[1]*m[6]*m[11] + m[1]*m[10]*m[7] + m[2]*m[5]*m[11] - m[2]*m[9]*m[7] - m[3]*m[5]*m[10] + m[3]*m[9]*m[6];

        r[4] = -m[4]*m[10]*m[15] + m[4]*m[14]*m[11] + m[6]*m[8]*m[15] - m[6]*m[12]*m[11] - m[7]*m[8]*m[14] + m[7]*m[12]*m[10];
        r[5] = m[0]*m[10]*m[15] - m[0]*m[14]*m[11] - m[2]*m[8]*m[15] + m[2]*m[12]*m[11] + m[3]*m[8]*m[14] - m[3]*m[12]*m[10];
        r[6] = -m[0]*m[6]*m[15] + m[0]*m[14]*m[7] + m[2]*m[4]*m[15] - m[2]*m[12]*m[7] - m[3]*m[4]*m[14] + m[3]*m[12]*m[6];
        r[7] = m[0]*m[6]*m[11] - m[0]*m[10]*m[7] - m[2]*m[4]*m[11] + m[2]*m[8]*m[7] + m[3]*m[4]*m[10] - m[3]*m[8]*m[6];

        r[8] = m[4]*m[9]*m[15] - m[4]*m[13]*m[11] - m[5]*m[8]*m[15] + m[5]*m[12]*m[11] + m[7]*m[8]*m[13] - m[7]*m[12]*m[9];
        r[9] = -m[0]*m[9]*m[15] + m[0]*m[13]*m[11] + m[1]*m[8]*m[15] - m[1]*m[12]*m[11] - m[3]*m[8]*m[13] + m[3]*m[12]*m[9];
        r[10] = m[0]*m[5]*m[15] - m[0]*m[13]*m[7] - m[1]*m[4]*m[15] + m[1]*m[12]*m[7] + m[3]*m[4]*m[13] - m[3]*m[12]*m[5];
        r[11] = -m[0]*m[5]*m[11] + m[0]*m[9]*m[7] + m[1]*m[4]*m[11] - m[1]*m[8]*m[7] - m[3]*m[4]*m[9] + m[3]*m[8]*m[5];

        r[12] = -m[4]*m[9]*m[14] + m[4]*m[13]*m[10] + m[5]*m[8]*m[14] - m[5]*m[12]*m[10] - m[6]*m[8]*m[13] + m[6]*m[12]*m[9];
        r[13] = m[0]*m[9]*m[14] - m[0]*m[13]*m[10] - m[1]*m[8]*m[14] + m[1]*m[12]*m[10] + m[2]*m[8]*m[13] - m[2]*m[12]*m[9];
        r[14] = -m[0]*m[5]*m[14] + m[0]*m[13]*m[6] + m[1]*m[4]*m[14] - m[1]*m[12]*m[6] - m[2]*m[4]*m[13] + m[2]*m[12]*m[5];
        r[15] = m[0]*m[5]*m[10] - m[0]*m[9]*m[6] - m[1]*m[4]*m[10] + m[1]*m[8]*m[6] + m[2]*m[4]*m[9] - m[2]*m[8]*m[5];

        const det:n = m[0]*r[0] + m[1]*r[4] + m[2]*r[8] + m[3]*r[12];
        if (DEBUG && det===0) {
            console.error(m);
            throw new DebugError("can not invert matrix with zero determinant");
        }
        for (let i:n = 0; i < 16; i++) r[i] /= det;
    };

    export const transpose = (out:Mat16Holder,mHolder:Mat16Holder):void=>{
        const m:MAT16 = mHolder.mat16 as MAT16;

        out.set(
            m[0], m[4], m[ 8], m[12],
            m[1], m[5], m[ 9], m[13],
            m[2], m[6], m[10], m[14],
            m[3], m[7], m[11], m[15]
        );

    };

    export const unproject = (x:number, y:number, projectionView:Mat16Holder):Point2d=> {
        const vec4Holder:Vec4Holder = Vec4Holder.fromPool();
        vec4Holder.set(x, y, 0, 1);
        const invProjectionView:Mat16Holder = Mat16Holder.fromPool();
        Mat4.inverse(invProjectionView,projectionView);

        const vec4Transformed:Vec4Holder = Vec4Holder.fromPool();
        Mat4.multVecByMatrix(vec4Transformed, invProjectionView, vec4Holder);
        invProjectionView.release();
        vec4Holder.release();
        const pointResult:Point2d = Point2d.fromPool();
        pointResult.setXY(vec4Transformed.x,vec4Transformed.y);
        vec4Transformed.release();
        return pointResult;
    };

    const m16h:Mat16Holder = Mat16Holder.create();
    makeIdentity(m16h);

    export const IDENTITY:Readonly<MAT16> = identityArray;
    export const IDENTITY_HOLDER:Readonly<Mat16Holder> = new Mat16Holder();
    IDENTITY_HOLDER.fromMat16(IDENTITY);
}

