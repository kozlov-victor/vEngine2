import {mat4} from "@engine/geometry/mat4";

if (!Float32Array.prototype.slice) {
    Float32Array.prototype.slice = function(begin:number, end:number) {
        (this as any).slicedPortion = (this as any).slicedPortion || [];
        let cnt:number = 0;
        (this as any).slicedPortion.length = 0;
        for (let i:number=begin;i<end;i++) {
            (this as any).slicedPortion[cnt++] = this[i];
        }
        return (this as any).slicedPortion;
    }
}

export namespace mat4Special {
    import Mat16Holder = mat4.Mat16Holder;
    import MAT16 = mat4.MAT16;

    /**
     * multiply translation matrix by matrix
     */
    export const matrixTranslationMultiply = (out:Mat16Holder, aHolder:Mat16Holder, bHolder:Mat16Holder):void => {

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
        // destination.set(source.slice(limit), offset);
        (r as unknown as Float32Array).set(b.slice(0,12),0);

        r[12] = a[12] * b[0] + a[13] * b[4] + a[14] * b[8]  + b[12];
        r[13] = a[12] * b[1] + a[13] * b[5] + a[14] * b[9]  + b[13];
        r[14] = a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + b[14];
        r[15] = a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + b[15];

    };

    export const matrixRotationXMultiply = (out:Mat16Holder, aHolder:Mat16Holder, bHolder:Mat16Holder):void => {

        const r:MAT16 = out.mat16 as MAT16;
        const a:MAT16 = aHolder.mat16 as MAT16;
        const b:MAT16 = bHolder.mat16 as MAT16;

        r[0] = b[0];
        r[1] = b[1];
        r[2] = b[2];
        r[3] = b[3];

        r[4] = a[5] * b[4] + a[6] * b[8];
        r[5] = a[5] * b[5] + a[6] * b[9];
        r[6] = a[5] * b[6] + a[6] * b[10];
        r[7] = a[5] * b[7] + a[6] * b[11];

        r[8]  =  a[9] * b[4] + a[10] * b[8];
        r[9]  =  a[9] * b[5] + a[10] * b[9];
        r[10] =  a[9] * b[6] + a[10] * b[10];
        r[11] =  a[9] * b[7] + a[10] * b[11];

        r[12] = b[12];
        r[13] = b[13];
        r[14] = b[14];
        r[15] = b[15];

    };

    export const matrixRotationYMultiply = (out:Mat16Holder, aHolder:Mat16Holder, bHolder:Mat16Holder):void => {

        const r:MAT16 = out.mat16 as MAT16;
        const a:MAT16 = aHolder.mat16 as MAT16;
        const b:MAT16 = bHolder.mat16 as MAT16;

        r[0] = a[0] * b[0] + a[2] * b[8];
        r[1] = a[0] * b[1] + a[2] * b[9];
        r[2] = a[0] * b[2] + a[2] * b[10];
        r[3] = a[0] * b[3] + a[2] * b[11];

        r[4] = b[4];
        r[5] = b[5];
        r[6] = b[6];
        r[7] = b[7];

        r[8] =  a[8] * b[0] + a[10] * b[8];
        r[9] =  a[8] * b[1] + a[10] * b[9];
        r[10] = a[8] * b[2] + a[10] * b[10];
        r[11] = a[8] * b[3] + a[10] * b[11];

        r[12] = b[12];
        r[13] = b[13];
        r[14] = b[14];
        r[15] = b[15];

    };

    export const matrixRotationZMultiply = (out:Mat16Holder, aHolder:Mat16Holder, bHolder:Mat16Holder):void => {

        const r:MAT16 = out.mat16 as MAT16;
        const a:MAT16 = aHolder.mat16 as MAT16;
        const b:MAT16 = bHolder.mat16 as MAT16;

        r[0] = a[0] * b[0] + a[1] * b[4];
        r[1] = a[0] * b[1] + a[1] * b[5];
        r[2] = a[0] * b[2] + a[1] * b[6];
        r[3] = a[0] * b[3] + a[1] * b[7];

        r[4] = a[4] * b[0] + a[5] * b[4];
        r[5] = a[4] * b[1] + a[5] * b[5];
        r[6] = a[4] * b[2] + a[5] * b[6];
        r[7] = a[4] * b[3] + a[5] * b[7];

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
        // destination.set(source.slice(limit), offset);
        (r as unknown as Float32Array).set(b.slice(8,16),8);

    };

    export const matrixScaleMultiply = (out:Mat16Holder, aHolder:Mat16Holder, bHolder:Mat16Holder):void => {

        const r:MAT16 = out.mat16 as MAT16;
        const a:MAT16 = aHolder.mat16 as MAT16;
        const b:MAT16 = bHolder.mat16 as MAT16;

        r[0] = a[0] * b[0];
        r[1] = a[0] * b[1];
        r[2] = a[0] * b[2];
        r[3] = a[0] * b[3];

        r[4] = a[5] * b[4];
        r[5] = a[5] * b[5];
        r[6] = a[5] * b[6];
        r[7] = a[5] * b[7];

        r[8] =  a[10] * b[8];
        r[9] =  a[10] * b[9];
        r[10] = a[10] * b[10];
        r[11] = a[10] * b[11];

        r[12] = b[12];
        r[13] = b[13];
        r[14] = b[14];
        r[15] = b[15];

    };

    export const matrixSkewXMultiply = (out:Mat16Holder, aHolder:Mat16Holder, bHolder:Mat16Holder):void => {

        const r:MAT16 = out.mat16 as MAT16;
        const a:MAT16 = aHolder.mat16 as MAT16;
        const b:MAT16 = bHolder.mat16 as MAT16;

        r[0] = b[0];
        r[1] = b[1];
        r[2] = b[2];
        r[3] = b[3];

        r[4] = a[4] * b[0] + b[4];
        r[5] = a[4] * b[1] + b[5];
        r[6] = a[4] * b[2] + b[6];
        r[7] = a[4] * b[3] + b[7];

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
        // destination.set(source.slice(limit), offset);
        (r as unknown as Float32Array).set(b.slice(8,16),8);

    };

    export const matrixSkewYMultiply = (out:Mat16Holder, aHolder:Mat16Holder, bHolder:Mat16Holder):void => {

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
        // destination.set(source.slice(limit), offset);
        (r as unknown as Float32Array).set(b.slice(4,16),4);

    };

}
