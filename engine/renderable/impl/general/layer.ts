import {Game} from "@engine/core/game";
import {RenderableModel} from "../../abstract/renderableModel";
import {DebugError} from "@engine/debug/debugError";

export class Layer {

    public readonly type:string = 'Layer';
    public readonly children:RenderableModel[] = [];

    constructor(protected game:Game) {

    }

    public prependChild(go:RenderableModel):void {
        go.parent = null;
        go.setLayer(this);
        go.revalidate();
        this.children.unshift(go);
    }
    public appendChild(go:RenderableModel):void {
        go.parent = null;
        go.setLayer(this);
        go.revalidate();
        this.children.push(go);
    }

    public appendChildAt(c:RenderableModel,index:number){
        if (DEBUG) {
            if (index>this.children.length-1) throw new DebugError(`can not insert element: index is out of range (${index},${this.children.length-1})`);
        }
        c.parent = null;
        c.revalidate();
        this.children.splice(index,0,c);
    }


    public update():void {
        const all:RenderableModel[] = this.children;
        for (const obj of all) {
            obj.update();
        }
    }

    public findChildById(id:string):RenderableModel|null{
        for (const c of this.children) {
            const possibleObject:RenderableModel|null = c.findChildById(id);
            if (possibleObject) return possibleObject;
        }
        return null;
    }

    public render():void {
        for (const obj of this.children) {
            obj.render();
        }
    }
}