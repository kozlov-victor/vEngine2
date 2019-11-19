import {DebugError} from "@engine/debug/debugError";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Layer} from "@engine/scene/layer";
import {IParentChild, Optional} from "@engine/core/declarations";
import {removeFromArray} from "@engine/misc/object";

export class ParentChildDelegate<T extends IParentChild> {

    constructor(private model:IParentChild) {}

    public appendChild(c:IParentChild):void {
        if (DEBUG) {
            if (c===this.model) throw new DebugError(`parent and child objects are the same`);
            if (this.model.children.find((it:IParentChild)=>it===c)) {
                console.error(c);
                throw new DebugError(`this children already added`);
            }
        }
        c.parent = this.model;
        this.model.children.push(c);
    }

    public appendChildAt(c:IParentChild,index:number){
        if (DEBUG) {
            if (index>this.model.children.length-1) throw new DebugError(`can not insert element: index is out of range (${index},${this.model.children.length-1})`);
        }
        c.parent = this.model;
        this.model.children.splice(index,0,c);
    }

    public appendChildAfter(modelAfter:IParentChild,newChild:IParentChild){
        const afterIndex:number = this.model.children.indexOf(modelAfter);
        if (DEBUG) {
            if (afterIndex===-1) throw new DebugError(`can not insert element: object is detached`);
        }
        if (afterIndex===this.model.children.length-1) this.appendChild(newChild);
        else this.appendChildAt(newChild,afterIndex+1);
    }

    public appendChildBefore(modelBefore:IParentChild,newChild:IParentChild){
        const beforeIndex:number = this.model.children.indexOf(modelBefore);
        if (DEBUG) {
            if (beforeIndex===-1) throw new DebugError(`can not insert element: object is detached`);
        }
        if (beforeIndex===0) this.prependChild(newChild);
        else this.appendChildAt(newChild,beforeIndex-1);
    }


    public prependChild(c:IParentChild):void {
        c.parent = this.model;
        this.model.children.unshift(c);
    }

    public removeChildAt(i:number){
        const c:IParentChild = this.model.children[i];
        if (DEBUG && !c) throw new DebugError(`can not remove children with index ${i}`);
        if (DEBUG && c.parent===undefined) throw new DebugError(`can not remove children with index ${i}: parent is undefined`);
        c.parent!.children.splice(i,1);
        c.parent = undefined;
    }

    public removeChild(children:IParentChild[],c:IParentChild):boolean{
        const parent:IParentChild = c.getParent() as IParentChild;
        const i:number = parent.children.indexOf(c);
        if (i===-1) return this.removeChild(c.children,c);
        else return removeFromArray(children,it=>it===c)>0;
    }

    public removeChildren(){
        for (let i:number = this.model.children.length-1; i >= 0; i--) {
            const c:IParentChild = this.model.children[i];
            this.removeChildAt(i);
        }
    }

    public moveToFront():void {
        const parent:IParentChild = this.model.getParent() as IParentChild;
        if (DEBUG && !parent) throw new DebugError(`can not move to front: object is detached`);
        const parentArray:IParentChild[] = parent.children;
        const index:number = parentArray.indexOf(this.model);
        if (DEBUG && index===-1)
            throw new DebugError(`can not move to front: object is not belong to current scene`);

        parentArray.splice(index,1);
        parentArray.push(this.model);

    }

    public moveToBack():void {
        const parent:IParentChild = this.model.getParent() as IParentChild;
        if (DEBUG && !parent) throw new DebugError(`can not move to back: object is detached`);
        const parentArray:IParentChild[] = parent.children;
        const index:number = parentArray.indexOf(this.model);
        if (DEBUG && index===-1)
            throw new DebugError(`can not move to front: object is not belong to current scene`);
        parentArray.splice(index,1);
        parentArray.unshift(this.model);
    }

    public getParent():Optional<T>{
        return this.model.parent as T;
    }

    public findChildById(id:string):Optional<T>{
        if (id===this.model.id) return this.model as T;
        for (const c of this.model.children) {
            const possibleObject:Optional<IParentChild> = c.findChildById(id);
            if (possibleObject) return possibleObject as T;
        }
        return undefined;
    }

}