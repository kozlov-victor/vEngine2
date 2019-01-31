
import * as mat4 from '../../../geometry/mat4'

export class MatrixStack {

    stack = [];

    constructor(){
       this.restore();
    }

    restore () {
        this.stack.pop();
        // Never let the stack be totally empty
        if (this.stack.length < 1) {
            this.stack[0] = mat4.makeIdentity();
        }
    }

    save() {
        this.stack.push(this.getCurrentMatrix());
    }

    getCurrentMatrix() {
        return this.stack[this.stack.length - 1].slice();
    }

    setCurrentMatrix(m) {
        return this.stack[this.stack.length - 1] = m;
    }

    translate(x, y, z?):MatrixStack {
        if (z === undefined) {
            z = 0;
        }
        let t = mat4.makeTranslation(x, y, z);
        let m = this.getCurrentMatrix();
        this.setCurrentMatrix(mat4.matrixMultiply(t, m));
        return this;
    }

    rotateZ(angleInRadians):MatrixStack {
        let t = mat4.makeZRotation(angleInRadians);
        let m = this.getCurrentMatrix();
        this.setCurrentMatrix(mat4.matrixMultiply(t, m));
        return this;
    }

    rotateY(angleInRadians):MatrixStack {
        let t = mat4.makeYRotation(angleInRadians);
        let m = this.getCurrentMatrix();
        this.setCurrentMatrix(mat4.matrixMultiply(t, m));
        return this;
    }

    scale (x, y, z?):MatrixStack {
        if (z === undefined) {
            z = 1;
        }
        let t = mat4.makeScale(x, y, z);
        let m = this.getCurrentMatrix();
        this.setCurrentMatrix(mat4.matrixMultiply(t, m));
        return this;
    }

    resetTransform():MatrixStack{
        let identity = mat4.makeIdentity();
        this.setCurrentMatrix(identity);
        return this;
    }
}