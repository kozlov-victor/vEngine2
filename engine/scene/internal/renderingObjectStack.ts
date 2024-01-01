import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ObjectPool} from "@engine/misc/objectPool";

export class RenderingObjectStackItem {
    public obj:RenderableModel;
    public constrainObjects:RenderableModel[] = [];
}

const pool = new ObjectPool(RenderingObjectStackItem);

export class RenderingObjectStack {

    private stack:RenderingObjectStackItem[] = [];

    public clear():void {
        for (const item of this.stack) {
            item.constrainObjects.length = 0;
            pool.recycle(item);
        }
        this.stack.length = 0;
    }

    public add(obj:RenderableModel,constrainObjects:readonly RenderableModel[]):void {
        const stackItem = pool.get();
        stackItem.obj = obj;
        if (constrainObjects.length>0) stackItem.constrainObjects.push(...constrainObjects);
        this.stack.push(stackItem);
    }

    public get():RenderingObjectStackItem[] {
        return this.stack;
    }

}
