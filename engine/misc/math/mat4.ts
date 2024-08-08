import {DebugError} from "../../debug/debugError";
import {ObjectPool} from "@engine/misc/objectPool";
import {ICloneable} from "@engine/core/declarations";
import {Point2d} from "@engine/geometry/point2d";
import {IPoint3d} from "@engine/geometry/point3d";
import {vec3} from "@engine/misc/math/vec3";
import {Vec4} from "@engine/geometry/vec4";


// https://evanw.github.io/lightgl.js/docs/matrix.html

export namespace Mat4 {

    import Vec4Holder = Vec4.Vec4Holder;

    type n = number;

    const sin = Math.sin;
    const cos = Math.cos;
    const tan = Math.tan;

    export type MAT16 = [
        n,n,n,n,
        n,n,n,n,
        n,n,n,n,
        n,n,n,n
    ] & Float32Array;

    export const IDENTITY = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]) as Readonly<MAT16>;

    export class Mat16Holder implements ICloneable<Mat16Holder>{

        public identityFlag = false;

        public constructor(){
            this.set(
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0
            );
        }

        public static pool = new ObjectPool(Mat16Holder);

        public readonly mat16 = (new Float32Array(16) as unknown) as Readonly<MAT16>;

        public static create(): Mat4.Mat16Holder {
            return new Mat16Holder();
        }

        public set(v0:n,v1:n,v2:n,v3:n,v4:n,v5:n,v6:n,v7:n,v8:n,v9:n,v10:n,v11:n,v12:n,v13:n,v14:n,v15:n):void{
            const mat16:MAT16 = this.mat16 as MAT16;
            mat16[0 ]= v0;mat16[1 ]=v1 ;mat16[2 ]=v2 ;mat16[3 ]=v3;
            mat16[4 ]= v4;mat16[5 ]=v5 ;mat16[6 ]=v6 ;mat16[7 ]=v7;
            mat16[8 ]= v8;mat16[9 ]=v9 ;mat16[10]=v10;mat16[11]=v11;
            mat16[12]=v12;mat16[13]=v13;mat16[14]=v14;mat16[15]=v15;
            this.identityFlag = false;
        }

        public fromMat16(mat16Holder:Readonly<Mat16Holder>):void{
            this.mat16.set(mat16Holder.mat16);
            this.identityFlag = mat16Holder.identityFlag;
        }

        public clone(): Mat4.Mat16Holder {
            const m:Mat16Holder = new Mat16Holder();
            m.fromMat16(this);
            m.identityFlag = this.identityFlag;
            return m;
        }

    }

    export const makeIdentity = (out:Mat16Holder):void => {
        out.mat16.set(IDENTITY);
        out.identityFlag = true;
    };


    export const makeZToWMatrix = (out:Mat16Holder,fudgeFactor:n):void => {
        // 1, 0, 0, 0,
        // 0, 1, 0, 0,
        // 0, 0, 1, fudgeFactor,
        // 0, 0, 0, 1
        out.mat16.set(IDENTITY);
        (out.mat16 as MAT16)[11] = fudgeFactor;
        out.identityFlag = false;
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
        outMat16.set(IDENTITY);

        outMat16[0] = -2 * lr;
        outMat16[5] = -2 * bt;
        outMat16[10] = 2 * nf;

        outMat16[12] = (left + right) * lr;
        outMat16[13] = (top + bottom) * bt;
        outMat16[14] = (near + far) * nf;

        out.identityFlag = false;
    };

    export const perspective = (out:Mat16Holder,fovy:n, aspect:n, near:n, far:n):void => {
        const f:n = 1.0 / tan(fovy / 2),
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

        out.identityFlag = false;

    };

    export const lookAt = (out:Mat16Holder,cameraPosition:IPoint3d, target:IPoint3d, up:IPoint3d):void=> {
        const zAxis = vec3.normalize(vec3.subtract(cameraPosition, target));
        const xAxis = vec3.normalize(vec3.cross(up, zAxis));
        const yAxis = vec3.normalize(vec3.cross(zAxis, xAxis));

        const dst = out.mat16 as Float32Array;
        dst[ 0] = xAxis.x;
        dst[ 1] = xAxis.y;
        dst[ 2] = xAxis.z;
        dst[ 3] = 0;
        dst[ 4] = yAxis.x;
        dst[ 5] = yAxis.y;
        dst[ 6] = yAxis.z;
        dst[ 7] = 0;
        dst[ 8] = zAxis.x;
        dst[ 9] = zAxis.y;
        dst[10] = zAxis.z;
        dst[11] = 0;
        dst[12] = cameraPosition.x;
        dst[13] = cameraPosition.y;
        dst[14] = cameraPosition.z;
        dst[15] = 1;
    }


    export const makeTranslation = (out:Mat16Holder,tx:n, ty:n, tz:n):void => {
        const m:MAT16 = out.mat16 as MAT16;

        // out.set(
        //     1,  0,  0,  0,
        //     0,  1,  0,  0,
        //     0,  0,  1,  0,
        //     tx, ty, tz,  1
        // );

        m.set(IDENTITY);
        m[12] = tx;
        m[13] = ty;
        m[14] = tz;

        out.identityFlag = false;
    };


    export const makeXSkew = (out:Mat16Holder,angle:n):void => {
        const t:n = tan(angle);

        // out.set(
        //     1,  0,  0,  0,
        //     t,  1,  0,  0,
        //     0,  0,  1,  0,
        //     0,  0,  0,  1
        // );

        const m:MAT16 = out.mat16 as MAT16;
        m.set(IDENTITY);
        m[4] = t;

        out.identityFlag = false;

    };

    export const makeYSkew = (out:Mat16Holder,angle:n):void => {
        const t:n = tan(angle);

        // out.set(
        //     1,  t,  0,  0,
        //     0,  1,  0,  0,
        //     0,  0,  1,  0,
        //     0,  0,  0,  1
        // );

        const m:MAT16 = out.mat16 as MAT16;
        m.set(IDENTITY);
        m[1] = t;

        out.identityFlag = false;

    };

    export const makeXRotation = (out:Mat16Holder,angleInRadians:n):void=> {
        const c:n = cos(angleInRadians);
        const s:n = sin(angleInRadians);

        // out.set(
        //     1, 0, 0, 0,
        //     0, c, s, 0,
        //     0, -s, c, 0,
        //     0, 0, 0, 1
        // );

        const m:MAT16 = out.mat16 as MAT16;
        m.set(IDENTITY);
        m[5] = c;
        m[6] = s;
        m[9] = -s;
        m[10] = c;

        out.identityFlag = false;
    };

    export const makeYRotation = (out:Mat16Holder,angleInRadians:n):void=> {
        const c:n = cos(angleInRadians);
        const s:n = sin(angleInRadians);

        // out.set(
        //     c, 0, -s, 0,
        //     0, 1, 0, 0,
        //     s, 0, c, 0,
        //     0, 0, 0, 1
        // );

        const m:MAT16 = out.mat16 as MAT16;
        m.set(IDENTITY);
        m[0] = c;
        m[2] = -s;
        m[8] = s;
        m[10] = c;

        out.identityFlag = false;
    };

    export const makeZRotation = (out:Mat16Holder,angleInRadians:n):void=> {
        const c:n = cos(angleInRadians);
        const s:n = sin(angleInRadians);

        // out.set(
        //     c, s, 0, 0,
        //     -s, c, 0, 0,
        //     0, 0, 1, 0,
        //     0, 0, 0, 1
        // );

        const m:MAT16 = out.mat16 as MAT16;
        m.set(IDENTITY);
        m[0] =  c;
        m[1] =  s;
        m[4] = -s;
        m[5] =  c;

        out.identityFlag = false;
    };


    export const makeRotationReset = (out:Mat16Holder):void=>{
        const m:MAT16 = out.mat16 as MAT16;

        const m0 = m[0], m1 = m[1], m2 = m[2];
        const m12 = m[12], m13 = m[13], m14 = m[14];
        const d:n = Math.sqrt(m0 * m0 + m1 * m1 + m2 * m2);

        // m[0] = d;
        // m[1] = 0;
        // m[2] = 0;
        // m[3] = 0;
        // m[4] = 0;
        // m[5] = d;
        // m[6] = 0;
        // m[7] = 0;
        // m[8] = 0;
        // m[9] = 0;
        // m[10] = d;
        // m[11] = 0;
        // m[15] = 1;

        out.mat16.set(IDENTITY);

        m[ 0] = d;
        m[ 5] = d;
        m[10] = d;
        m[12] = m12;
        m[13] = m13;
        m[14] = m14;

        out.identityFlag = false;

    };

    export const makeScale = (out:Mat16Holder,sx:n, sy:n, sz:n):void=> {
        // out.set(
        //     sx, 0,  0,  0,
        //     0, sy,  0,  0,
        //     0,  0, sz,  0,
        //     0,  0,  0,  1
        // );
        const m = out.mat16 as MAT16;
        out.mat16.set(IDENTITY);
        m[ 0] = sx;
        m[ 5] = sy;
        m[10] = sz;

        out.identityFlag = false;
    };


    export const matrixMultiply = (out:Mat16Holder,aHolder:Mat16Holder, bHolder:Mat16Holder):void => {

        const dst:MAT16 = out.mat16 as MAT16;
        const a:MAT16 = aHolder.mat16 as MAT16;
        const b:MAT16 = bHolder.mat16 as MAT16;

        const b0  = b[0 ], b1  = b[1 ], b2  = b[2 ], b3  = b[3 ];
        const b4  = b[4 ], b5  = b[5 ], b6  = b[6 ], b7  = b[7 ];
        const b8  = b[8 ], b9  = b[9 ], b10 = b[10], b11 = b[11];
        const b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];

        const a0  = a[0 ], a1  = a[1 ], a2  = a[2 ], a3  = a[3 ];
        const a4  = a[4 ], a5  = a[5 ], a6  = a[6 ], a7  = a[7 ];
        const a8  = a[8 ], a9  = a[9 ], a10 = a[10], a11 = a[11];
        const a12 = a[12], a13 = a[13], a14 = a[14], a15 = a[15];

        dst[ 0] = b0  * a0 + b1  * a4  + b2  * a8  + b3  * a12;
        dst[ 1] = b0  * a1 + b1  * a5  + b2  * a9  + b3  * a13;
        dst[ 2] = b0  * a2 + b1  * a6  + b2  * a10 + b3  * a14;
        dst[ 3] = b0  * a3 + b1  * a7  + b2  * a11 + b3  * a15;

        dst[ 4] = b4  * a0 + b5  * a4  + b6  * a8  + b7  * a12;
        dst[ 5] = b4  * a1 + b5  * a5  + b6  * a9  + b7  * a13;
        dst[ 6] = b4  * a2 + b5  * a6  + b6  * a10 + b7  * a14;
        dst[ 7] = b4  * a3 + b5  * a7  + b6  * a11 + b7  * a15;

        dst[ 8] = b8  * a0 + b9  * a4  + b10 * a8  + b11 * a12;
        dst[ 9] = b8  * a1 + b9  * a5  + b10 * a9  + b11 * a13;
        dst[10] = b8  * a2 + b9  * a6  + b10 * a10 + b11 * a14;
        dst[11] = b8  * a3 + b9  * a7  + b10 * a11 + b11 * a15;

        dst[12] = b12 * a0 + b13 * a4  + b14 * a8  + b15 * a12;
        dst[13] = b12 * a1 + b13 * a5  + b14 * a9  + b15 * a13;
        dst[14] = b12 * a2 + b13 * a6  + b14 * a10 + b15 * a14;
        dst[15] = b12 * a3 + b13 * a7  + b14 * a11 + b15 * a15;

    };

    export const multVecByMatrix = (out:Vec4Holder, matrix:Mat16Holder, vec4Arr:Vec4Holder):void => {

        const v = vec4Arr.vec4;
        const mat4 = matrix.mat16;
        const x = v[0], y = v[1], z = v[2], w = v[3];
        const
            c1r1 = mat4[ 0], c2r1 = mat4[ 1], c3r1 = mat4[ 2], c4r1 = mat4[ 3],
            c1r2 = mat4[ 4], c2r2 = mat4[ 5], c3r2 = mat4[ 6], c4r2 = mat4[ 7],
            c1r3 = mat4[ 8], c2r3 = mat4[ 9], c3r3 = mat4[10], c4r3 = mat4[11],
            c1r4 = mat4[12], c2r4 = mat4[13], c3r4 = mat4[14], c4r4 = mat4[15];

        out.set(
            x*c1r1 + y*c1r2 + z*c1r3 + w*c1r4,
            x*c2r1 + y*c2r2 + z*c2r3 + w*c2r4,
            x*c3r1 + y*c3r2 + z*c3r3 + w*c3r4,
            x*c4r1 + y*c4r2 + z*c4r3 + w*c4r4
        );


    };

    export const inverse = (out:Mat16Holder,mHolder:Mat16Holder):void=>{
        const dst:MAT16 = out.mat16 as MAT16;
        const m:MAT16 = mHolder.mat16 as MAT16;

        const m00 = m[0 * 4 + 0];
        const m01 = m[0 * 4 + 1];
        const m02 = m[0 * 4 + 2];
        const m03 = m[0 * 4 + 3];
        const m10 = m[1 * 4 + 0];
        const m11 = m[1 * 4 + 1];
        const m12 = m[1 * 4 + 2];
        const m13 = m[1 * 4 + 3];
        const m20 = m[2 * 4 + 0];
        const m21 = m[2 * 4 + 1];
        const m22 = m[2 * 4 + 2];
        const m23 = m[2 * 4 + 3];
        const m30 = m[3 * 4 + 0];
        const m31 = m[3 * 4 + 1];
        const m32 = m[3 * 4 + 2];
        const m33 = m[3 * 4 + 3];
        const tmp_0  = m22 * m33;
        const tmp_1  = m32 * m23;
        const tmp_2  = m12 * m33;
        const tmp_3  = m32 * m13;
        const tmp_4  = m12 * m23;
        const tmp_5  = m22 * m13;
        const tmp_6  = m02 * m33;
        const tmp_7  = m32 * m03;
        const tmp_8  = m02 * m23;
        const tmp_9  = m22 * m03;
        const tmp_10 = m02 * m13;
        const tmp_11 = m12 * m03;
        const tmp_12 = m20 * m31;
        const tmp_13 = m30 * m21;
        const tmp_14 = m10 * m31;
        const tmp_15 = m30 * m11;
        const tmp_16 = m10 * m21;
        const tmp_17 = m20 * m11;
        const tmp_18 = m00 * m31;
        const tmp_19 = m30 * m01;
        const tmp_20 = m00 * m21;
        const tmp_21 = m20 * m01;
        const tmp_22 = m00 * m11;
        const tmp_23 = m10 * m01;

        const t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) - (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
        const t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) - (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
        const t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) - (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
        const t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) - (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

        const x = (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);
        if (DEBUG && x===0) {
            throw new DebugError(`can not calculate determinant: division by zero`);
        }

        const d = 1.0 / x;

        dst[0] = d * t0;
        dst[1] = d * t1;
        dst[2] = d * t2;
        dst[3] = d * t3;
        dst[4] = d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
            (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30));
        dst[5] = d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
            (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30));
        dst[6] = d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
            (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30));
        dst[7] = d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
            (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20));
        dst[8] = d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
            (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33));
        dst[9] = d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
            (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33));
        dst[10] = d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
            (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33));
        dst[11] = d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
            (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23));
        dst[12] = d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
            (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22));
        dst[13] = d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
            (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02));
        dst[14] = d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
            (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12));
        dst[15] = d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
            (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02));

        out.identityFlag = false;

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
        const vec4Holder = Vec4Holder.pool.get();
        vec4Holder.set(x, y, 0, 1);
        const invProjectionView = Mat16Holder.pool.get();
        Mat4.inverse(invProjectionView,projectionView);

        const vec4Transformed = Vec4Holder.pool.get();
        Mat4.multVecByMatrix(vec4Transformed, invProjectionView, vec4Holder);
        Mat16Holder.pool.recycle(invProjectionView);
        Vec4Holder.pool.recycle(vec4Holder);
        const pointResult = Point2d.pool.get();
        pointResult.setXY(vec4Transformed.x,vec4Transformed.y);
        Vec4Holder.pool.recycle(vec4Transformed);
        return pointResult;
    };

    export const IDENTITY_HOLDER:Readonly<Mat16Holder> = new Mat16Holder();
    IDENTITY_HOLDER.mat16.set(IDENTITY);
    (IDENTITY_HOLDER as Mat16Holder).identityFlag = true;
}

