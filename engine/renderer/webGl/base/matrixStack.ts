import {mat4} from "@engine/geometry/mat4";
import MAT16 = mat4.MAT16;
import Mat16Holder = mat4.Mat16Holder;

export class MatrixStack {

    stack:Mat16Holder[] = [];

    constructor(){
       this.restore();
    }

    restore():void {
        this.stack.pop();
        // Never let the stack be totally empty
        if (this.stack.length < 1) {
            this.stack[0] = mat4.makeIdentity();
        }
    }

    save():void {
        this.stack.push(this.getCurrentMatrix());
    }

    getCurrentMatrix():Mat16Holder {
        return this.stack[this.stack.length - 1];
    }

    setCurrentMatrix(m:Mat16Holder) {
        return this.stack[this.stack.length - 1] = m;
    }

    translate(x:number, y:number, z:number = 0):MatrixStack {
        const t:Mat16Holder = mat4.makeTranslation(x, y, z);
        const m:Mat16Holder = this.getCurrentMatrix();
        this.setCurrentMatrix(mat4.matrixMultiply(t, m));
        return this;
    }

    rotateZ(angleInRadians:number):MatrixStack {
        const t = mat4.makeZRotation(angleInRadians);
        const m = this.getCurrentMatrix();
        this.setCurrentMatrix(mat4.matrixMultiply(t, m));
        return this;
    }

    rotateY(angleInRadians:number):MatrixStack {
        const t = mat4.makeYRotation(angleInRadians);
        const m = this.getCurrentMatrix();
        this.setCurrentMatrix(mat4.matrixMultiply(t, m));
        return this;
    }

    scale (x:number, y:number, z:number = 1):MatrixStack {
        const t:Mat16Holder = mat4.makeScale(x, y, z);
        const m:Mat16Holder = this.getCurrentMatrix();
        this.setCurrentMatrix(mat4.matrixMultiply(t, m));
        return this;
    }

    resetTransform():MatrixStack{
        const identity:Mat16Holder = mat4.makeIdentity();
        this.setCurrentMatrix(identity);
        return this;
    }
}