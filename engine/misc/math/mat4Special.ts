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

        // r[12] = a[12] * b[0] + a[13] * b[4] + a[14] * b[8]  + b[12];
        // r[13] = a[12] * b[1] + a[13] * b[5] + a[14] * b[9]  + b[13];
        // r[14] = a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + b[14];
        // r[15] = a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + b[15];

        // fast version of above code block
        const r:MAT16 = out.mat16 as MAT16;
        const a:MAT16 = aHolder.mat16 as MAT16;
        const b:MAT16 = bHolder.mat16 as MAT16;

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
        const b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
        const b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7];
        const b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11];
        const b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];

        r[0] = b0;
        r[1] = b1;
        r[2] = b2;
        r[3] = 0;//b3;

        r[4] = a5 * b4 + a6 * b8;
        r[5] = a5 * b5 + a6 * b9;
        r[6] = a5 * b6 + a6 * b10;
        r[7] = 0;//a5 * b7 + a6 * b11;

        r[8]  =  a9 * b4 + a10 * b8;
        r[9]  =  a9 * b5 + a10 * b9;
        r[10] =  a9 * b6 + a10 * b10;
        r[11] =  0;//a9 * b7 + a10 * b11;

        r[12] = b12;
        r[13] = b13;
        r[14] = b14;
        r[15] = b15;

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
        const b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7];
        const b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11];
        const b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];

        r[0] = a0 * b0 + a2 * b8;
        r[1] = a0 * b1 + a2 * b9;
        r[2] = a0 * b2 + a2 * b10;
        r[3] = 0;//a0 * b3 + a2 * b11;

        r[4] = b4;
        r[5] = b5;
        r[6] = b6;
        r[7] = 0;//b7;

        r[8] =  a8 * b0 + a10 * b8;
        r[9] =  a8 * b1 + a10 * b9;
        r[10] = a8 * b2 + a10 * b10;
        r[11] = 0;//a8 * b3 + a10 * b11;

        r[12] = b12;
        r[13] = b13;
        r[14] = b14;
        r[15] = b15;

    };

    /**
     * multiply rotationZ matrix by any matrix
     */
    export const multiplyRotationZByAny = (out:Mat16Holder, aHolder:Mat16Holder, bHolder:Mat16Holder):void => {

        if (bHolder.identityFlag && out===aHolder) {
            return;
        }

        // r[0] = a[0] * b[0] + a[1] * b[4];
        // r[1] = a[0] * b[1] + a[1] * b[5];
        // r[2] = a[0] * b[2] + a[1] * b[6];
        // r[3] = a[0] * b[3] + a[1] * b[7];
        //
        // r[4] = a[4] * b[0] + a[5] * b[4];
        // r[5] = a[4] * b[1] + a[5] * b[5];
        // r[6] = a[4] * b[2] + a[5] * b[6];
        // r[7] = a[4] * b[3] + a[5] * b[7];
        //
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
        const r:MAT16 = out.mat16 as MAT16;
        const a:MAT16 = aHolder.mat16 as MAT16;
        const b:MAT16 = bHolder.mat16 as MAT16;

        const a0 = a[0], a1 = a[1], a4 = a[4], a5 = a[5];
        const b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
        const b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7];

        r.set(b);

        r[0] = a0 * b0 + a1 * b4;
        r[1] = a0 * b1 + a1 * b5;
        r[2] = a0 * b2 + a1 * b6;
        r[3] = 0;//a0 * b3 + a1 * b7;

        r[4] = a4 * b0 + a5 * b4;
        r[5] = a4 * b1 + a5 * b5;
        r[6] = a4 * b2 + a5 * b6;
        r[7] = 0;//a4 * b3 + a5 * b7;

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
        r[3] = 0;//a0 * b3;

        r[4] = a5 * b4;
        r[5] = a5 * b5;
        r[6] = a5 * b6;
        r[7] = 0;//a5 * b7;

        r[8] =  a10 * b8;
        r[9] =  a10 * b9;
        r[10] = a10 * b10;
        r[11] = 0;//a10 * b11;

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

        // r[0] = b[0];
        // r[1] = b[1];
        // r[2] = b[2];
        // r[3] = b[3];
        //
        // r[4] = a[4] * b[0] + b[4];
        // r[5] = a[4] * b[1] + b[5];
        // r[6] = a[4] * b[2] + b[6];
        // r[7] = a[4] * b[3] + b[7];
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
        const r:MAT16 = out.mat16 as MAT16;
        const a:MAT16 = aHolder.mat16 as MAT16;
        const b:MAT16 = bHolder.mat16 as MAT16;
        const a4 = a[4];
        const b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
        const b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7];
        r.set(b);

        r[0] = b0;
        r[1] = b1;
        r[2] = b2;
        r[3] = 0;//b3;

        r[4] = a4 * b0 + b4;
        r[5] = a4 * b1 + b5;
        r[6] = a4 * b2 + b6;
        r[7] = 0;//a4 * b3 + b7;


    };

    /**
     * multiply skewY matrix by any matrix
     */
    export const multiplySkewYByAny = (out:Mat16Holder, aHolder:Mat16Holder, bHolder:Mat16Holder):void => {

        if (bHolder.identityFlag && out===aHolder) {
            return;
        }

        // r[0] = b[0] + a[1] * b[4];
        // r[1] = b[1] + a[1] * b[5];
        // r[2] = b[2] + a[1] * b[6];
        // r[3] = b[3] + a[1] * b[7];
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
        //
        // r[12] = b[12];
        // r[13] = b[13];
        // r[14] = b[14];
        // r[15] = b[15];

        // fast version of above code block
        const r:MAT16 = out.mat16 as MAT16;
        const a:MAT16 = aHolder.mat16 as MAT16;
        const b:MAT16 = bHolder.mat16 as MAT16;
        const a1 = a[1];
        const b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
        const b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7];

        r.set(b);

        r[0] = b0 + a1 * b4;
        r[1] = b1 + a1 * b5;
        r[2] = b2 + a1 * b6;
        r[3] = 0;//b3 + a1 * b7;

    };

    export const matrixMultiplyOptimized = (out:Mat16Holder,aHolder:Mat16Holder, bHolder:Mat16Holder):void => {

        const r:MAT16 = out.mat16 as MAT16;
        const a:MAT16 = aHolder.mat16 as MAT16;
        const b:MAT16 = bHolder.mat16 as MAT16;

        const a0 = a[0], a1 = a[1], a2 = a[2], a4 = a[4], a5 = a[5], a6 = a[6] , a8 = a[8];
        const a9 = a[9], a10 = a[10], a12 = a[12], a13 = a[13], a14 = a[14];

        const b0 = b[0], b1 = b[1], b2 = b[2], b4 = b[4], b5 = b[5], b6 = b[6], b8 = b[8];
        const b9 = b[9], b10 = b[10], b12 = b[12], b13 = b[13], b14 = b[14];

        r[0 ] =  a0 * b0 +  a1 * b4 +  a2 *  b8;
        r[1 ] =  a0 * b1 +  a1 * b5 +  a2 *  b9;
        r[2 ] =  a0 * b2 +  a1 * b6 +  a2 * b10;
        r[3 ] =  0;

        r[4 ] =  a4 * b0 +  a5 * b4 +  a6 *  b8;
        r[5 ] =  a4 * b1 +  a5 * b5 +  a6 *  b9;
        r[6 ] =  a4 * b2 +  a5 * b6 +  a6 * b10;
        r[7 ] =  0;

        r[8 ] =  a8 * b0 +  a9 * b4 + a10 *  b8;
        r[9 ] =  a8 * b1 +  a9 * b5 + a10 *  b9;
        r[10] =  a8 * b2 +  a9 * b6 + a10 * b10;
        r[11] =  0;

        r[12] = a12 * b0 + a13 * b4 + a14 *  b8 + b12;
        r[13] = a12 * b1 + a13 * b5 + a14 *  b9 + b13;
        r[14] = a12 * b2 + a13 * b6 + a14 * b10 + b14;
        r[15] = 1;

    };

}
