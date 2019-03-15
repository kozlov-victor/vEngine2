

import {mat4} from "@engine/core/geometry/mat4";
import MAT16 = mat4.MAT16;

export class MatrixStack {

    stack:MAT16[] = [];

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

    getCurrentMatrix():MAT16 {
        return this.stack[this.stack.length - 1].slice() as MAT16;
    }

    setCurrentMatrix(m:MAT16) {
        return this.stack[this.stack.length - 1] = m;
    }

    translate(x:number, y:number, z:number = 0):MatrixStack {
        let t = mat4.makeTranslation(x, y, z);
        let m = this.getCurrentMatrix();
        this.setCurrentMatrix(mat4.matrixMultiply(t, m));
        return this;
    }

    rotateZ(angleInRadians:number):MatrixStack {
        let t = mat4.makeZRotation(angleInRadians);
        let m = this.getCurrentMatrix();
        this.setCurrentMatrix(mat4.matrixMultiply(t, m));
        return this;
    }

    rotateY(angleInRadians:number):MatrixStack {
        let t = mat4.makeYRotation(angleInRadians);
        let m = this.getCurrentMatrix();
        this.setCurrentMatrix(mat4.matrixMultiply(t, m));
        return this;
    }

    scale (x:number, y:number, z:number = 0):MatrixStack {
        if (z === undefined) {
            z = 1;
        }
        let t:MAT16 = mat4.makeScale(x, y, z);
        let m:MAT16 = this.getCurrentMatrix();
        this.setCurrentMatrix(mat4.matrixMultiply(t, m));
        return this;
    }

    resetTransform():MatrixStack{
        let identity = mat4.makeIdentity();
        this.setCurrentMatrix(identity);
        return this;
    }
}