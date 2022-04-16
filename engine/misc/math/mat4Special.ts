import {Mat4} from "@engine/misc/math/mat4";

// some special cases of matrix multiplication

export namespace Mat4Special {
    import Mat16Holder = Mat4.Mat16Holder;
    import MAT16 = Mat4.MAT16;

    /**
     * multiply translation matrix by any matrix
     */
    export const multiplyTranslationByAny = (out:Mat16Holder, aHolder:Mat16Holder, bHolder:Mat16Holder):void => {

        if (bHolder.identityFlag && out===aHolder) {
            return;
        }

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
        const a12 = a[12], a13 = a[13], a14 = a[14];
        const b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7];
        const b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11], b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
        r.set(b);

        r[12] = a12 * b0 + a13 * b4 + a14 * b8  + b12;
        r[13] = a12 * b1 + a13 * b5 + a14 * b9  + b13;
        r[14] = a12 * b2 + a13 * b6 + a14 * b10 + b14;
        r[15] = a12 * b3 + a13 * b7 + a14 * b11 + b15;

    };

    /**
     * multiply rotationX matrix by any matrix
     */
    export const multiplyRotationXByAny = (out:Mat16Holder, aHolder:Mat16Holder, bHolder:Mat16Holder):void => {

        if (bHolder.identityFlag && out===aHolder) {
            return;
        }

        const r:MAT16 = out.mat16 as MAT16;
        const a:MAT16 = aHolder.mat16 as MAT16;
        const b:MAT16 = bHolder.mat16 as MAT16;

        const a5 = a[5], a6 = a[6], a9 = a[9], a10 = a[10];
        const b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7];
        const b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11];

        r[0] = b[0];
        r[1] = b[1];
        r[2] = b[2];
        r[3] = b[3];

        r[4] = a5 * b4 + a6 * b8;
        r[5] = a5 * b5 + a6 * b9;
        r[6] = a5 * b6 + a6 * b10;
        r[7] = a5 * b7 + a6 * b11;

        r[8]  =  a9 * b4 + a10 * b8;
        r[9]  =  a9 * b5 + a10 * b9;
        r[10] =  a9 * b6 + a10 * b10;
        r[11] =  a9 * b7 + a10 * b11;

        r[12] = b[12];
        r[13] = b[13];
        r[14] = b[14];
        r[15] = b[15];

    };

    /**
     * multiply rotationY matrix by any matrix
     */
    export const multiplyRotationYByAny = (out:Mat16Holder, aHolder:Mat16Holder, bHolder:Mat16Holder):void => {

        if (bHolder.identityFlag && out===aHolder) {
            return;
        }

        const r:MAT16 = out.mat16 as MAT16;
        const a:MAT16 = aHolder.mat16 as MAT16;
        const b:MAT16 = bHolder.mat16 as MAT16;

        const a0 = a[0], a2 = a[2], a8 = a[8], a10 = a[10];
        const b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
        const b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11];

        r[0] = a0 * b0 + a2 * b8;
        r[1] = a0 * b1 + a2 * b9;
        r[2] = a0 * b2 + a2 * b10;
        r[3] = a0 * b3 + a2 * b11;

        r[4] = b[4];
        r[5] = b[5];
        r[6] = b[6];
        r[7] = b[7];

        r[8] =  a8 * b0 + a10 * b8;
        r[9] =  a8 * b1 + a10 * b9;
        r[10] = a8 * b2 + a10 * b10;
        r[11] = a8 * b3 + a10 * b11;

        r[12] = b[12];
        r[13] = b[13];
        r[14] = b[14];
        r[15] = b[15];

    };

    /**
     * multiply rotationZ matrix by any matrix
     */
    export const multiplyRotationZByAny = (out:Mat16Holder, aHolder:Mat16Holder, bHolder:Mat16Holder):void => {

        if (bHolder.identityFlag && out===aHolder) {
            return;
        }

        const r:MAT16 = out.mat16 as MAT16;
        const a:MAT16 = aHolder.mat16 as MAT16;
        const b:MAT16 = bHolder.mat16 as MAT16;

        const a0 = a[0], a1 = a[1], a4 = a[4], a5 = a[5];
        const b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
        const b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7];

        r[0] = a0 * b0 + a1 * b4;
        r[1] = a0 * b1 + a1 * b5;
        r[2] = a0 * b2 + a1 * b6;
        r[3] = a0 * b3 + a1 * b7;

        r[4] = a4 * b0 + a5 * b4;
        r[5] = a4 * b1 + a5 * b5;
        r[6] = a4 * b2 + a5 * b6;
        r[7] = a4 * b3 + a5 * b7;

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

        if (bHolder.identityFlag && out===aHolder) {
            return;
        }

        const r:MAT16 = out.mat16 as MAT16;
        const a:MAT16 = aHolder.mat16 as MAT16;
        const b:MAT16 = bHolder.mat16 as MAT16;

        const a0 = a[0], a5 = a[5], a10 = a[10];

        const b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7];
        const b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11], b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];

        r[0] = a0 * b0;
        r[1] = a0 * b1;
        r[2] = a0 * b2;
        r[3] = a0 * b3;

        r[4] = a5 * b4;
        r[5] = a5 * b5;
        r[6] = a5 * b6;
        r[7] = a5 * b7;

        r[8] =  a10 * b8;
        r[9] =  a10 * b9;
        r[10] = a10 * b10;
        r[11] = a10 * b11;

        r[12] = b12;
        r[13] = b13;
        r[14] = b14;
        r[15] = b15;

    };

    /**
     * multiply skewX matrix by any matrix
     */
    export const multiplySkewXByAny = (out:Mat16Holder, aHolder:Mat16Holder, bHolder:Mat16Holder):void => {

        if (bHolder.identityFlag && out===aHolder) {
            return;
        }

        const r:MAT16 = out.mat16 as MAT16;
        const a:MAT16 = aHolder.mat16 as MAT16;
        const b:MAT16 = bHolder.mat16 as MAT16;

        const a4 = a[4];
        const b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];

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
        const b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7];
        r.set(b);

        r[0] = b0;
        r[1] = b1;
        r[2] = b2;
        r[3] = b3;

        r[4] = a4 * b0 + b4;
        r[5] = a4 * b1 + b5;
        r[6] = a4 * b2 + b6;
        r[7] = a4 * b3 + b7;


    };

    /**
     * multiply skewY matrix by any matrix
     */
    export const multiplySkewYByAny = (out:Mat16Holder, aHolder:Mat16Holder, bHolder:Mat16Holder):void => {

        if (bHolder.identityFlag && out===aHolder) {
            return;
        }

        const r:MAT16 = out.mat16 as MAT16;
        const a:MAT16 = aHolder.mat16 as MAT16;
        const b:MAT16 = bHolder.mat16 as MAT16;

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

        const a1 = a[1];
        const b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
        const b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7];

        r.set(b);

        r[0] = b0 + a1 * b4;
        r[1] = b1 + a1 * b5;
        r[2] = b2 + a1 * b6;
        r[3] = b3 + a1 * b7;

    };

    /**
     * multiply any matrix by ZtoW matrix
     */
    export const multiplyAnyByZtoW = (out:Mat16Holder, aHolder:Mat16Holder, bHolder:Mat16Holder):void => {

        if (bHolder.identityFlag && out===aHolder) {
            return;
        }

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
        const b11 = b[11];
        const a2 = a[2], a6 = a[6], a10 = a[10], a14 = a[14], a15 = a[15];
        r.set(a);
        r[3] += a2 * b11;
        r[7] += a6 * b11;
        r[11] = a10 * b11 + a15;
        r[15] += a14 * b11;
    };

    /**
     * multiply any matrix by projection matrix
     */
    export const multiplyAnyByProjection = (out:Mat16Holder, aHolder:Mat16Holder, bHolder:Mat16Holder):void => {

        if (bHolder.identityFlag && out===aHolder) {
            return;
        }

        const r:MAT16 = out.mat16 as MAT16;
        const a:MAT16 = aHolder.mat16 as MAT16;
        const b:MAT16 = bHolder.mat16 as MAT16;

        const a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7];
        const a8 = a[8], a9 = a[9], a10 = a[10], a11 = a[11], a12 = a[12], a13 = a[13], a14 = a[14], a15 = a[15];
        const b0 = b[0], b5 = b[5], b10 = b[10];
        const b12 = b[12], b13 = b[13], b14 = b[14];

        r[0] = a0 * b0 + a3 * b12;
        r[1] = a1 * b5 + a3 * b13;
        r[2] = a2 * b10 + a3 * b14;
        r[3] = a3;

        r[4] = a4 * b0 + a7 * b12;
        r[5] = a5 * b5 + a7 * b13;
        r[6] = a6 * b10 + a7 * b14;
        r[7] = a7;

        r[8] = a8 * b0 + a11 * b12;
        r[9] = a9 * b5 + a11 * b13;
        r[10] = a10 * b10 + a11 * b14;
        r[11] = a11;

        r[12] = a12 * b0 + a15 * b12;
        r[13] = a13 * b5 + a15 * b13;
        r[14] = a14 * b10 + a15 * b14;
        r[15] = a15;

    };

}
