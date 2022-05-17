import {Mat4} from "@engine/misc/math/mat4";
import Mat16Holder = Mat4.Mat16Holder;

const zToWMatrix:Mat16Holder = Mat16Holder.create();
Mat4.makeZToWMatrix(zToWMatrix,1);

export const Z_To_W_MATRIX_SOURCE = zToWMatrix.mat16.join(',');
