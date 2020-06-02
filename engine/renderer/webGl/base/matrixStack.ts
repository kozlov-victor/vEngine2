import {mat4} from "@engine/geometry/mat4";
import Mat16Holder = mat4.Mat16Holder;
import {Optional} from "@engine/core/declarations";
import {IPropertyStack} from "@engine/renderer/common/propertyStack";
import {Stack} from "@engine/misc/collection/stack";

export interface IMatrixTransformable {
    transformSave():void;
    transformReset():void;
    transformRestore():void;
    transformSet(v0:number, v1:number, v2:number, v3:number, v4:number, v5:number, v6:number, v7:number,
                 v8:number, v9:number, v10:number,v11:number, v12:number,v13:number,v14:number,v15:number):void;
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

    public setCurrentValue(m:Mat16Holder) {
        return this._stack.replaceLast(m);
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


    public setMatrixValues(
        v0:number, v1:number, v2:number, v3:number,
        v4:number, v5:number, v6:number, v7:number,
        v8:number, v9:number, v10:number,v11:number,
        v12:number,v13:number,v14:number,v15:number
    ):MatrixStack {
        this.getCurrentValue().set(v0,v1,v2,v3,v4,v5,v6,v7,v8,v9,v10,v11,v12,v13,v14,v15);
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

    public rotationReset():void{
        const m:Mat16Holder = this.getCurrentValue();
        mat4.makeRotationReset(m);
    }

    public release():MatrixStack{
        for (let i:number=0,max:number = this._stack.size();i<max;i++) {
            this._stack.getAt(i)!.release();
        }
        return this;
    }

    private setIdentity(){
        const ident:Mat16Holder = Mat16Holder.fromPool();
        mat4.makeIdentity(ident);
        this._stack.push(ident);
    }

    private _rotate(rotMat:Mat16Holder){
        const m:Mat16Holder = this.getCurrentValue();
        const result:Mat16Holder = Mat16Holder.fromPool();
        mat4.matrixMultiply(result,rotMat, m);
        this.setCurrentValue(result);
        m.release();
    }

}
