import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ObjectPool} from "@engine/misc/objectPool";
import {ReleaseableEntity} from "@engine/misc/releaseableEntity";
import {mat4} from "@engine/geometry/mat4";
import Mat16Holder = mat4.Mat16Holder;

export class RenderingObjectStackItem extends ReleaseableEntity {
    public readonly mat4:Mat16Holder = new Mat16Holder();
    public obj:RenderableModel;
    public constrainObjects:RenderableModel[] = [];
}

const pool:ObjectPool<RenderingObjectStackItem> = new ObjectPool(RenderingObjectStackItem,Infinity);

export class RenderingObjectStack {

    private stack:RenderingObjectStackItem[] = [];

    public clear():void {
        for (const item of this.stack) {
            item.constrainObjects.length = 0;
            item.release();
        }
        this.stack.length = 0;
    }

    public add(obj:RenderableModel,constrainObjects:readonly RenderableModel[]):void {
        const stackItem:RenderingObjectStackItem = pool.getFreeObject()!;
        stackItem.mat4.fromMat16(obj.worldTransformMatrix.mat16);
        stackItem.obj = obj;
        stackItem.constrainObjects.push(...constrainObjects);
        this.stack.push(stackItem);
    }

    public get():RenderingObjectStackItem[] {
        return this.stack;
    }

}
