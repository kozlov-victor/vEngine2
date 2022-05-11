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
           Mat16Holder.toPool(last);
       }
    }

    public save():void {
        const copy = Mat16Holder.fromPool();
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
        const t:Mat16Holder = Mat16Holder.fromPool();
        Mat4.makeTranslation(t, x, y, z);
        const m:Mat16Holder = this.getCurrentValue();
        Mat4Special.multiplyTranslationByAny(t,t, m);
        this.setCurrentValue(t);
        Mat16Holder.toPool(m);
        return this;
    }


    public setMatrix(val:Readonly<Mat16Holder>):this {
        this.getCurrentValue().fromMat16(val);
        return this;
    }

    public transform(val:Mat16Holder):void {
        const m:Mat16Holder = this.getCurrentValue();
        const result:Mat16Holder = Mat16Holder.fromPool();
        Mat4.matrixMultiply(result,val, m);
        this.setCurrentValue(result);
        Mat16Holder.toPool(m);
    }

    public skewX(angle:number):this {
        const t:Mat16Holder = Mat16Holder.fromPool()!;
        Mat4.makeXSkew(t,angle);
        const m:Mat16Holder = this.getCurrentValue();
        Mat4Special.multiplySkewXByAny(t,t, m);
        this.setCurrentValue(t);
        Mat16Holder.toPool(m);
        return this;
    }

    public skewY(angle:number):this {
        const res:Mat16Holder = Mat16Holder.fromPool();
        Mat4.makeYSkew(res,angle);
        const m:Mat16Holder = this.getCurrentValue();
        Mat4Special.multiplySkewYByAny(res,res, m);
        this.setCurrentValue(res);
        Mat16Holder.toPool(m);
        return this;
    }

    public rotateX(angleInRadians:number):this {
        const t:Mat16Holder = Mat16Holder.fromPool();
        Mat4.makeXRotation(t,angleInRadians);
        const m:Mat16Holder = this.getCurrentValue();
        Mat4Special.multiplyRotationXByAny(t,t, m);
        this.setCurrentValue(t);
        Mat16Holder.toPool(m);
        return this;
    }

    public rotateY(angleInRadians:number):this {
        const t:Mat16Holder = Mat16Holder.fromPool();
        Mat4.makeYRotation(t,angleInRadians);
        const m:Mat16Holder = this.getCurrentValue();
        Mat4Special.multiplyRotationYByAny(t,t, m);
        this.setCurrentValue(t);
        Mat16Holder.toPool(m);
        return this;
    }

    public rotateZ(angleInRadians:number):this {
        const t:Mat16Holder = Mat16Holder.fromPool();
        Mat4.makeZRotation(t,angleInRadians);
        const m:Mat16Holder = this.getCurrentValue();
        Mat4Special.multiplyRotationZByAny(t,t, m);
        this.setCurrentValue(t);
        Mat16Holder.toPool(m);
        return this;
    }

    public scale(x:number, y:number, z:number = 1):this {
        const t:Mat16Holder =  Mat16Holder.fromPool();
        Mat4.makeScale(t, x, y, z);
        const m:Mat16Holder = this.getCurrentValue();
        Mat4Special.multiplyScaleByAny(t,t, m);
        this.setCurrentValue(t);
        Mat16Holder.toPool(m);
        return this;
    }

    public resetTransform():this{
        this.getCurrentValue().release();
        const identity:Mat16Holder = Mat16Holder.fromPool();
        Mat4.makeIdentity(identity);
        this.setCurrentValue(identity);
        return this;
    }

    public rotationReset():void{
        const m:Mat16Holder = this.getCurrentValue();
        Mat4.makeRotationReset(m);
    }

    public release():this{
        for (let i:number=0,max:number = this._stack.size();i<max;i++) {
            this._stack.getAt(i)!.release();
        }
        return this;
    }

    private setIdentity():void{
        const ident:Mat16Holder = Mat16Holder.fromPool();
        Mat4.makeIdentity(ident);
        this._stack.push(ident);
    }


}
