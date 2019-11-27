import {mat4} from "@engine/geometry/mat4";
import Mat16Holder = mat4.Mat16Holder;
import {Optional} from "@engine/core/declarations";
import {IPropertyStack} from "@engine/renderer/common/propertyStack";
import {Stack} from "@engine/misc/collection/stack";

export interface IMatrixTransformable {
    transformSave():void;
    transformReset():void;
    transformRestore():void;
    transformPush(m:Mat16Holder):void;
    transformScale(x:number, y:number, z?:number):void;
    transformTranslate(x:number, y:number, z?:number):void;
    transformSkewX(angle:number):void;
    transformSkewY(angle:number):void;
    transformRotateX(angleInRadians:number):void;
    transformRotateY(angleInRadians:number):void;
    transformRotateZ(angleInRadians:number):void;
}


export class MatrixStack implements IPropertyStack<Mat16Holder>{

    private readonly stack:Stack<Mat16Holder> = new Stack();

    constructor(){
       this.setIdentity();
    }

    public restore():void {
       if (this.stack.isEmpty()) this.setIdentity();
       else {
           const last:Optional<Mat16Holder> = this.stack.pop()!;
           last.release();
       }
    }

    public save():void {
        const copy:Mat16Holder = Mat16Holder.fromPool();
        copy.fromMat16(this.getCurrentValue().mat16);
        this.stack.push(copy);
    }

    public getCurrentValue():Mat16Holder {
        return this.stack.getLast()!;
    }

    public setCurrentValue(m:Mat16Holder) {
        return this.stack.replaceLast(m);
    }

    public translate(x:number, y:number, z:number = 0):MatrixStack {
        const t:Mat16Holder = Mat16Holder.fromPool();
        mat4.makeTranslation(t,x, y, z);
        const m:Mat16Holder = this.getCurrentValue();
        const result:Mat16Holder = Mat16Holder.fromPool();
        mat4.matrixMultiply(result,t, m);
        this.setCurrentValue(result);
        t.release();
        m.release();
        return this;
    }

    public pushMatrix(t:Mat16Holder):MatrixStack {
        this.getCurrentValue().release();
        this.setCurrentValue(t);
        return this;
    }

    public skewX(angle:number):MatrixStack {
        const t:Mat16Holder = Mat16Holder.fromPool()!;
        mat4.makeXSkew(t,angle);
        const m:Mat16Holder = this.getCurrentValue();
        const result:Mat16Holder = Mat16Holder.fromPool();
        mat4.matrixMultiply(result,t, m);
        this.setCurrentValue(result);
        t.release();
        m.release();
        return this;
    }

    public skewY(angle:number):MatrixStack {
        const t:Mat16Holder = Mat16Holder.fromPool();
        mat4.makeYSkew(t,angle);
        const m:Mat16Holder = this.getCurrentValue();
        const result:Mat16Holder = Mat16Holder.fromPool();
        mat4.matrixMultiply(result,t, m);
        this.setCurrentValue(result);
        t.release();
        m.release();
        return this;
    }

    public rotateX(angleInRadians:number):MatrixStack {
        const t:Mat16Holder = Mat16Holder.fromPool();
        mat4.makeXRotation(t,angleInRadians);
        this._rotate(t);
        t.release();
        return this;
    }

    public rotateY(angleInRadians:number):MatrixStack {
        const t:Mat16Holder = Mat16Holder.fromPool();
        mat4.makeYRotation(t,angleInRadians);
        this._rotate(t);
        t.release();
        return this;
    }

    public rotateZ(angleInRadians:number):MatrixStack {
        const t:Mat16Holder = Mat16Holder.fromPool();
        mat4.makeZRotation(t,angleInRadians);
        this._rotate(t);
        t.release();
        return this;
    }

    public scale(x:number, y:number, z:number = 1):MatrixStack {
        const t:Mat16Holder =  Mat16Holder.fromPool();
        mat4.makeScale(t,x, y, z);
        const m:Mat16Holder = this.getCurrentValue();
        const result:Mat16Holder = Mat16Holder.fromPool();
        mat4.matrixMultiply(result,t, m);
        this.setCurrentValue(result);
        t.release();
        m.release();
        return this;
    }

    public resetTransform():MatrixStack{
        this.getCurrentValue().release();
        const identity:Mat16Holder = Mat16Holder.fromPool();
        mat4.makeIdentity(identity);
        this.setCurrentValue(identity);
        return this;
    }

    public release():MatrixStack{
        for (let i:number=0,max:number = this.stack.size();i<max;i++) {
            this.stack.getAt(i)!.release();
        }
        return this;
    }

    private setIdentity(){
        const ident = Mat16Holder.fromPool();
        mat4.makeIdentity(ident);
        this.stack.push(ident);
    }

    private _rotate(rotMat:Mat16Holder){
        const m:Mat16Holder = this.getCurrentValue();
        const result:Mat16Holder = Mat16Holder.fromPool();
        mat4.matrixMultiply(result,rotMat, m);
        this.setCurrentValue(result);
        m.release();
    }

}