import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ObjectPool} from "@engine/misc/objectPool";
import {ReleaseableEntity} from "@engine/misc/releaseableEntity";

export class RenderingObjectStackItem extends ReleaseableEntity {
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
        stackItem.obj = obj;
        if (constrainObjects.length>0) stackItem.constrainObjects.push(...constrainObjects);
        this.stack.push(stackItem);
    }

    public get():RenderingObjectStackItem[] {
        return this.stack;
    }

}
