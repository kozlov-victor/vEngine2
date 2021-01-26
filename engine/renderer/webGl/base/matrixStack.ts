import {mat4} from "@engine/geometry/mat4";
import Mat16Holder = mat4.Mat16Holder;
import {Optional} from "@engine/core/declarations";
import {IPropertyStack} from "@engine/renderer/common/propertyStack";
import {Stack} from "@engine/misc/collection/stack";
import {mat4Special} from "@engine/geometry/mat4Special";
import MAT16 = mat4.MAT16;

export interface IMatrixTransformable {
    transformSave():void;
    transformReset():void;
    transformRestore():void;
    transformSet(val:Readonly<MAT16>):void;
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
           const last:Optional<Mat16Holder> = this._stack.pop()!;
           last.release();
       }
    }

    public save():void {
        const copy:Mat16Holder = Mat16Holder.fromPool();
        copy.fromMat16(this.getCurrentValue().mat16);
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
        mat4.makeTranslation(t, x, y, z);
        const m:Mat16Holder = this.getCurrentValue();
        const result:Mat16Holder = Mat16Holder.fromPool();
        mat4Special.multiplyTranslationByAny(result,t, m);
        this.setCurrentValue(result);
        t.release();
        m.release();
        return this;
    }


    public setMatrix(val:Readonly<MAT16>):this {
        this.getCurrentValue().fromMat16(val);
        return this;
    }

    public transform(val:Mat16Holder):void {
        const m:Mat16Holder = this.getCurrentValue();
        const result:Mat16Holder = Mat16Holder.fromPool();
        mat4.matrixMultiply(result,val, m);
        this.setCurrentValue(result);
        m.release();
    }

    public skewX(angle:number):this {
        const t:Mat16Holder = Mat16Holder.fromPool()!;
        mat4.makeXSkew(t,angle);
        const m:Mat16Holder = this.getCurrentValue();
        const result:Mat16Holder = Mat16Holder.fromPool();
        mat4Special.multiplySkewXByAny(result,t, m);
        this.setCurrentValue(result);
        t.release();
        m.release();
        return this;
    }

    public skewY(angle:number):this {
        const t:Mat16Holder = Mat16Holder.fromPool();
        mat4.makeYSkew(t,angle);
        const m:Mat16Holder = this.getCurrentValue();
        const result:Mat16Holder = Mat16Holder.fromPool();
        mat4Special.multiplySkewYByAny(result,t, m);
        this.setCurrentValue(result);
        t.release();
        m.release();
        return this;
    }

    public rotateX(angleInRadians:number):this {
        const t:Mat16Holder = Mat16Holder.fromPool();
        mat4.makeXRotation(t,angleInRadians);

        const m:Mat16Holder = this.getCurrentValue();
        const result:Mat16Holder = Mat16Holder.fromPool();
        mat4Special.multiplyRotationXByAny(result,t, m);
        this.setCurrentValue(result);
        m.release();

        t.release();
        return this;
    }

    public rotateY(angleInRadians:number):this {
        const t:Mat16Holder = Mat16Holder.fromPool();
        mat4.makeYRotation(t,angleInRadians);

        const m:Mat16Holder = this.getCurrentValue();
        const result:Mat16Holder = Mat16Holder.fromPool();
        mat4Special.multiplyRotationYByAny(result,t, m);
        this.setCurrentValue(result);
        m.release();

        t.release();
        return this;
    }

    public rotateZ(angleInRadians:number):this {
        const t:Mat16Holder = Mat16Holder.fromPool();
        mat4.makeZRotation(t,angleInRadians);

        const m:Mat16Holder = this.getCurrentValue();
        const result:Mat16Holder = Mat16Holder.fromPool();
        mat4Special.multiplyRotationZByAny(result,t, m);
        this.setCurrentValue(result);
        m.release();

        t.release();
        return this;
    }

    public scale(x:number, y:number, z:number = 1):this {
        const t:Mat16Holder =  Mat16Holder.fromPool();
        mat4.makeScale(t,x, y, z);
        const m:Mat16Holder = this.getCurrentValue();
        const result:Mat16Holder = Mat16Holder.fromPool();
        mat4Special.multiplyScaleByAny(result,t, m);
        this.setCurrentValue(result);
        t.release();
        m.release();
        return this;
    }

    public resetTransform():this{
        this.getCurrentValue().release();
        const identity:Mat16Holder = Mat16Holder.fromPool();
        mat4.makeIdentity(identity);
        this.setCurrentValue(identity);
        return this;
    }

    public rotationReset():void{
        const m:Mat16Holder = this.getCurrentValue();
        mat4.makeRotationReset(m);
    }

    public release():this{
        for (let i:number=0,max:number = this._stack.size();i<max;i++) {
            this._stack.getAt(i)!.release();
        }
        return this;
    }

    private setIdentity():void{
        const ident:Mat16Holder = Mat16Holder.fromPool();
        mat4.makeIdentity(ident);
        this._stack.push(ident);
    }


}
