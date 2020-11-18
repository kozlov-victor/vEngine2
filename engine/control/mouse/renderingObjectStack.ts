import {RenderableModel} from "@engine/renderable/abstract/renderableModel";

export class RenderingObjectStack {

    private stack:RenderableModel[] = [];

    public clear():void {
        this.stack.length = 0;
    }

    public add(obj:RenderableModel):void {
        this.stack.push(obj);
    }

    public get():RenderableModel[] {
        return this.stack;
    }

}
