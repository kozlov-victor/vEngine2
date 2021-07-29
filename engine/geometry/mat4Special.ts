import {Mat4} from "@engine/geometry/mat4";

// some special cases of matrix multiplication

export namespace Mat4Special {
    import Mat16Holder = Mat4.Mat16Holder;
    import MAT16 = Mat4.MAT16;

    /**
     * multiply translation matrix by any matrix
     */
    export const multiplyTranslationByAny = (out:Mat16Holder, aHolder:Mat16Holder, bHolder:Mat16Holder):void => {

        const r:MAT16 = out.mat16 as MAT16;
        const a:MAT16 = aHolder.mat16 as MAT16;
        const b:MAT16 = bHolder.mat16 as MAT16;

        // r[0] = b[0];
        // r[1] = b[1];
        // r[2] = b[2];
        // r[3] = b[3];
        //
        // r[4] = b[4];
        // r[5] = b[5];
        // r[6] = b[6];
        // r[7] = b[7];
        //
        // r[8] =  b[8];
        // r[9] =  b[9];
        // r[10] = b[10];
        // r[11] = b[11];

        // fast version of above code block
        r.set(b.subarray(0,12),0);

        const a12 = a[12], a13 = a[13], a14 = a[14];

        r[12] = a12 * b[0] + a13 * b[4] + a14 * b[8]  + b[12];
        r[13] = a12 * b[1] + a13 * b[5] + a14 * b[9]  + b[13];
        r[14] = a12 * b[2] + a13 * b[6] + a14 * b[10] + b[14];
        r[15] = a12 * b[3] + a13 * b[7] + a14 * b[11] + b[15];

    };

    /**
     * multiply rotationX matrix by any matrix
     */
    export const multiplyRotationXByAny = (out:Mat16Holder, aHolder:Mat16Holder, bHolder:Mat16Holder):void => {

        const r:MAT16 = out.mat16 as MAT16;
        const a:MAT16 = aHolder.mat16 as MAT16;
        const b:MAT16 = bHolder.mat16 as MAT16;

        const a5 = a[5], a6 = a[6], a9 = a[9], a10 = a[10];
        r[0] = b[0];
        r[1] = b[1];
        r[2] = b[2];
        r[3] = b[3];

        r[4] = a5 * b[4] + a6 * b[8];
        r[5] = a5 * b[5] + a6 * b[9];
        r[6] = a5 * b[6] + a6 * b[10];
        r[7] = a5 * b[7] + a6 * b[11];

        r[8]  =  a9 * b[4] + a10 * b[8];
        r[9]  =  a9 * b[5] + a10 * b[9];
        r[10] =  a9 * b[6] + a10 * b[10];
        r[11] =  a9 * b[7] + a10 * b[11];

        r[12] = b[12];
        r[13] = b[13];
        r[14] = b[14];
        r[15] = b[15];

    };

    /**
     * multiply rotationY matrix by any matrix
     */
    export const multiplyRotationYByAny = (out:Mat16Holder, aHolder:Mat16Holder, bHolder:Mat16Holder):void => {

        const r:MAT16 = out.mat16 as MAT16;
        const a:MAT16 = aHolder.mat16 as MAT16;
        const b:MAT16 = bHolder.mat16 as MAT16;

        const a0 = a[0], a2 = a[2], a8 = a[8], a10 = a[10];

        r[0] = a0 * b[0] + a2 * b[8];
        r[1] = a0 * b[1] + a2 * b[9];
        r[2] = a0 * b[2] + a2 * b[10];
        r[3] = a0 * b[3] + a2 * b[11];

        r[4] = b[4];
        r[5] = b[5];
        r[6] = b[6];
        r[7] = b[7];

        r[8] =  a8 * b[0] + a10 * b[8];
        r[9] =  a8 * b[1] + a10 * b[9];
        r[10] = a8 * b[2] + a10 * b[10];
        r[11] = a8 * b[3] + a10 * b[11];

        r[12] = b[12];
        r[13] = b[13];
        r[14] = b[14];
        r[15] = b[15];

    };

    /**
     * multiply rotationZ matrix by any matrix
     */
    export const multiplyRotationZByAny = (out:Mat16Holder, aHolder:Mat16Holder, bHolder:Mat16Holder):void => {

        const r:MAT16 = out.mat16 as MAT16;
        const a:MAT16 = aHolder.mat16 as MAT16;
        const b:MAT16 = bHolder.mat16 as MAT16;

        const a0 = a[0], a1 = a[1], a4 = a[4], a5 = a[5];

        r[0] = a0 * b[0] + a1 * b[4];
        r[1] = a0 * b[1] + a1 * b[5];
        r[2] = a0 * b[2] + a1 * b[6];
        r[3] = a0 * b[3] + a1 * b[7];

        r[4] = a4 * b[0] + a5 * b[4];
        r[5] = a4 * b[1] + a5 * b[5];
        r[6] = a4 * b[2] + a5 * b[6];
        r[7] = a4 * b[3] + a5 * b[7];

        // r[8]  = b[8];
        // r[9]  = b[9];
        // r[10] = b[10];
        // r[11] = b[11];
        //
        // r[12] = b[12];
        // r[13] = b[13];
        // r[14] = b[14];
        // r[15] = b[15];

        // fast version of above code block
        r.set(b.subarray(8,8+16),8);

    };

    /**
     * multiply scale matrix by any matrix
     */
    export const multiplyScaleByAny = (out:Mat16Holder, aHolder:Mat16Holder, bHolder:Mat16Holder):void => {

        const r:MAT16 = out.mat16 as MAT16;
        const a:MAT16 = aHolder.mat16 as MAT16;
        const b:MAT16 = bHolder.mat16 as MAT16;

        const a0 = a[0], a5 = a[5], a10 = a[10];

        r[0] = a0 * b[0];
        r[1] = a0 * b[1];
        r[2] = a0 * b[2];
        r[3] = a0 * b[3];

        r[4] = a5 * b[4];
        r[5] = a5 * b[5];
        r[6] = a5 * b[6];
        r[7] = a5 * b[7];

        r[8] =  a10 * b[8];
        r[9] =  a10 * b[9];
        r[10] = a10 * b[10];
        r[11] = a10 * b[11];

        r[12] = b[12];
        r[13] = b[13];
        r[14] = b[14];
        r[15] = b[15];

    };

    /**
     * multiply skewX matrix by any matrix
     */
    export const multiplySkewXByAny = (out:Mat16Holder, aHolder:Mat16Holder, bHolder:Mat16Holder):void => {

        const r:MAT16 = out.mat16 as MAT16;
        const a:MAT16 = aHolder.mat16 as MAT16;
        const b:MAT16 = bHolder.mat16 as MAT16;

        const a4 = a[4];

        r[0] = b[0];
        r[1] = b[1];
        r[2] = b[2];
        r[3] = b[3];

        r[4] = a4 * b[0] + b[4];
        r[5] = a4 * b[1] + b[5];
        r[6] = a4 * b[2] + b[6];
        r[7] = a4 * b[3] + b[7];

        // r[8] =  b[8];
        // r[9] =  b[9];
        // r[10] = b[10];
        // r[11] = b[11];
        //
        // r[12] = b[12];
        // r[13] = b[13];
        // r[14] = b[14];
        // r[15] = b[15];

        // fast version of above code block
        r.set(b.subarray(8,8+16),8);

    };

    /**
     * multiply skewY matrix by any matrix
     */
    export const multiplySkewYByAny = (out:Mat16Holder, aHolder:Mat16Holder, bHolder:Mat16Holder):void => {

        const r:MAT16 = out.mat16 as MAT16;
        const a:MAT16 = aHolder.mat16 as MAT16;
        const b:MAT16 = bHolder.mat16 as MAT16;

        r[0] = b[0] + a[1] * b[4];
        r[1] = b[1] + a[1] * b[5];
        r[2] = b[2] + a[1] * b[6];
        r[3] = b[3] + a[1] * b[7];

        // r[4] = b[4];
        // r[5] = b[5];
        // r[6] = b[6];
        // r[7] = b[7];
        //
        // r[8] =  b[8];
        // r[9] =  b[9];
        // r[10] = b[10];
        // r[11] = b[11];
        //
        // r[12] = b[12];
        // r[13] = b[13];
        // r[14] = b[14];
        // r[15] = b[15];

        // fast version of above code block
        r.set(b.subarray(4,4+16),4);

    };

    /**
     * multiply any matrix by ZtoW matrix
     */
    export const multiplyAnyByZtoW = (out:Mat16Holder, aHolder:Mat16Holder, bHolder:Mat16Holder):void => {

        const r:MAT16 = out.mat16 as MAT16;
        const a:MAT16 = aHolder.mat16 as MAT16;
        const b:MAT16 = bHolder.mat16 as MAT16;

        // r[0] = a[0];
        // r[1] = a[1];
        // r[2] = a[2];
        // r[3] = a[2] * b[11] + a[3];
        //
        // r[4] = a[4];
        // r[5] = a[5];
        // r[6] = a[6];
        // r[7] = a[6] * b[11] + a[7];
        //
        // r[8]  = a[8];
        // r[9]  = a[9];
        // r[10] = a[10];
        // r[11] = a[10] * b[11] + a[15];
        //
        // r[12] = a[12];
        // r[13] = a[13];
        // r[14] = a[14];
        // r[15] = a[14] * b[11] + a[15];

        // fast version of above code block
        r.set(a);
        r[3] += a[2] * b[11];
        r[7] += a[6] * b[11];
        r[11] = a[10] * b[11] + a[15];
        r[15] += a[14] * b[11];
    };

    /**
     * multiply any matrix by projection matrix
     */
    export const multiplyAnyByProjection = (out:Mat16Holder, aHolder:Mat16Holder, bHolder:Mat16Holder):void => {

        const r:MAT16 = out.mat16 as MAT16;
        const a:MAT16 = aHolder.mat16 as MAT16;
        const b:MAT16 = bHolder.mat16 as MAT16;

        const a3 = a[3], a7 = a[7], a11 = a[11], a15 = a[15];

        r[0] = a[0] * b[0] + a3 * b[12];
        r[1] = a[1] * b[5] + a3 * b[13];
        r[2] = a[2] * b[10] + a3 * b[14];
        r[3] = a[3];

        r[4] = a[4] * b[0] + a7 * b[12];
        r[5] = a[5] * b[5] + a7 * b[13];
        r[6] = a[6] * b[10] + a7 * b[14];
        r[7] = a[7];

        r[8] = a[8] * b[0] + a11 * b[12];
        r[9] = a[9] * b[5] + a11 * b[13];
        r[10] = a[10] * b[10] + a11 * b[14];
        r[11] = a[11];

        r[12] = a[12] * b[0] + a15 * b[12];
        r[13] = a[13] * b[5] + a15 * b[13];
        r[14] = a[14] * b[10] + a15 * b[14];
        r[15] = a[15];

    };

}
