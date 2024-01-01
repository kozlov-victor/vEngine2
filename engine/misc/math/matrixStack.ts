import Mat16Holder = Mat4.Mat16Holder;
import {IPropertyStack} from "@engine/renderer/common/propertyStack";
import {Stack} from "@engine/misc/collection/stack";
import {Mat4} from "@engine/misc/math/mat4";
import {Mat4Special} from "@engine/misc/math/mat4Special";

export interface IMatrixTransformable {
    transformSave():void;
    transformReset():void;
    transformRestore():void;
    transformSet(val:Readonly<Mat16Holder>):void;
    transformScale(x:number, y:number, z?:number):void;
    transformTranslate(x:number, y:number, z?:number):void;
    transformSkewX(angle:number):void;
    transformSkewY(angle:number):void;
    transformRotateX(angleInRadians:number):void;
    transformRotateY(angleInRadians:number):void;
    transformRotateZ(angleInRadians:number):void;
}


export class MatrixStack implements IPropertyStack<Mat16Holder>{

    private readonly _stack:Stack<Mat16Holder> = new Stack();

    constructor(){
       this.restore();
    }

    public restore():void {
       if (this._stack.isEmpty()) this.setIdentity();
       else {
           const last:Mat16Holder = this._stack.pop()!;
           Mat16Holder.pool.recycle(last);
       }
    }

    public save():void {
        const copy = Mat16Holder.pool.get();
        const curVal = this.getCurrentValue();
        copy.fromMat16(curVal);
        this._stack.push(copy);
    }

    public getCurrentValue():Mat16Holder {
        return this._stack.getLast()!;
    }

    public setCurrentValue(m:Mat16Holder):void {
        return this._stack.replaceLast(m);
    }

    public translate(x:number, y:number, z:number = 0):this {
        const t = Mat16Holder.pool.get()
        Mat4.makeTranslation(t, x, y, z);
        const m = this.getCurrentValue();
        Mat4Special.multiplyTranslationByAny(m,t,m);
        Mat16Holder.pool.recycle(t);
        return this;
    }


    public setMatrix(val:Readonly<Mat16Holder>):this {
        this.getCurrentValue().fromMat16(val);
        return this;
    }

    public transform(val:Mat16Holder):void {
        const m = this.getCurrentValue();
        const result = Mat16Holder.pool.get();
        Mat4Special.matrixMultiplyOptimized(result,val,m);
        this.setCurrentValue(result);
        Mat16Holder.pool.recycle(m);
    }

    public skewX(angle:number):this {
        const t = Mat16Holder.pool.get();
        Mat4.makeXSkew(t,angle);
        const m = this.getCurrentValue();
        Mat4Special.multiplySkewXByAny(m,t,m);
        Mat16Holder.pool.recycle(t);
        return this;
    }

    public skewY(angle:number):this {
        const t = Mat16Holder.pool.get();
        Mat4.makeYSkew(t,angle);
        const m = this.getCurrentValue();
        Mat4Special.multiplySkewYByAny(m,t,m);
        Mat16Holder.pool.recycle(t);
        return this;
    }

    public rotateX(angleInRadians:number):this {
        const t = Mat16Holder.pool.get();
        Mat4.makeXRotation(t,angleInRadians);
        const m = this.getCurrentValue();
        Mat4Special.multiplyRotationXByAny(m,t,m);
        Mat16Holder.pool.recycle(t);
        return this;
    }

    public rotateY(angleInRadians:number):this {
        const t = Mat16Holder.pool.get();
        Mat4.makeYRotation(t,angleInRadians);
        const m = this.getCurrentValue();
        Mat4Special.multiplyRotationYByAny(m,t, m);
        Mat16Holder.pool.recycle(t);
        return this;
    }

    public rotateZ(angleInRadians:number):this {
        const t = Mat16Holder.pool.get();
        Mat4.makeZRotation(t,angleInRadians);
        const m = this.getCurrentValue();
        Mat4Special.multiplyRotationZByAny(m,t,m);
        Mat16Holder.pool.recycle(t);
        return this;
    }

    public scale(x:number, y:number, z:number = 1):this {
        const t =  Mat16Holder.pool.get();
        Mat4.makeScale(t, x, y, z);
        const m = this.getCurrentValue();
        Mat4Special.multiplyScaleByAny(m,t,m);
        Mat16Holder.pool.recycle(t);
        return this;
    }

    public resetTransform():this{
        Mat16Holder.pool.recycle(this.getCurrentValue());
        const identity = Mat16Holder.pool.get();
        Mat4.makeIdentity(identity);
        this.setCurrentValue(identity);
        return this;
    }

    public rotationReset():void{
        const m = this.getCurrentValue();
        Mat4.makeRotationReset(m);
    }

    private setIdentity():void{
        const ident = Mat16Holder.pool.get();
        Mat4.makeIdentity(ident);
        this._stack.push(ident);
    }


}
