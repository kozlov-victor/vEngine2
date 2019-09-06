import {DebugError} from "@engine/debug/debugError";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Layer} from "@engine/renderable/impl/general/layer";

export class ParentChildDelegate {

    constructor(private model:RenderableModel) {}

    public appendChild(c:RenderableModel):void {
        if (DEBUG) {
            if (c===this.model) throw new DebugError(`parent and child objects are the same`);
            if (this.model.children.find((it:RenderableModel)=>it===c)) {
                console.error(c);
                throw new DebugError(`this children already added`);
            }
        }
        c.parent = this.model;
        c.setLayer(this.model.getLayer());
        c.revalidate();
        this.model.children.push(c);
    }

    public appendChildAt(c:RenderableModel,index:number){
        if (DEBUG) {
            if (index>this.model.children.length-1) throw new DebugError(`can not insert element: index is out of range (${index},${this.model.children.length-1})`);
        }
        c.parent = this.model;
        c.setLayer(this.model.getLayer());
        c.revalidate();
        this.model.children.splice(index,0,c);
    }

    public appendChildAfter(modelAfter:RenderableModel,newChild:RenderableModel){
        const afterIndex:number = this.model.children.indexOf(modelAfter);
        if (DEBUG) {
            if (afterIndex===-1) throw new DebugError(`can not insert element: object is detached`);
        }
        if (afterIndex===this.model.children.length-1) this.appendChild(newChild);
        else this.appendChildAt(newChild,afterIndex+1);
    }

    public appendChildBefore(modelBefore:RenderableModel,newChild:RenderableModel){
        const beforeIndex:number = this.model.children.indexOf(modelBefore);
        if (DEBUG) {
            if (beforeIndex===-1) throw new DebugError(`can not insert element: object is detached`);
        }
        if (beforeIndex===0) this.prependChild(newChild);
        else this.appendChildAt(newChild,beforeIndex-1);
    }


    public prependChild(c:RenderableModel):void {
        c.parent = this.model;
        c.setLayer(this.model.getLayer());
        c.revalidate();
        this.model.children.unshift(c);
    }

    public removeChildAt(i:number){
        const c:RenderableModel = this.model.children[i];
        if (DEBUG && !c) throw new DebugError(`can not remove children with index ${i}`);
        c.kill();
    }

    public removeChildren(){
        for (let i:number = this.model.children.length-1; i >= 0; i--) {
            const c:RenderableModel = this.model.children[i];
            this.removeChildAt(i);
        }
    }

    public moveToFront():void {
        if (DEBUG && !this.getParent()) throw new DebugError(`can not move to front: object is detached`);
        const index:number = (this.getParent()!).children.indexOf(this.model);
        if (DEBUG && index===-1)
            throw new DebugError(`can not move to front: object is not belong to current scene`);
        const parentArray:RenderableModel[] = this.getParent()!.children;
        parentArray.splice(index,1);
        parentArray.push(this.model);

    }

    public moveToBack():void {
        if (DEBUG && !this.getParent()) throw new DebugError(`can not move to back: object is detached`);
        const index:number = this.getParent()!.children.indexOf(this.model);
        if (DEBUG && index===-1)
            throw new DebugError(`can not move to front: object is not belong to current scene`);
        const parentArray:RenderableModel[] = this.getParent()!.children;
        parentArray.splice(index,1);
        parentArray.unshift(this.model);
    }

    public getParent():Optional<RenderableModel|Layer>{
        return this.model.parent || this.model.getLayer() || undefined;
    }

    public findChildById(id:string):RenderableModel|null{
        if (id===this.model.id) return this.model;
        for (const c of this.model.children) {
            const possibleObject:RenderableModel|null = c.findChildById(id);
            if (possibleObject) return possibleObject;
        }
        return null;
    }

}