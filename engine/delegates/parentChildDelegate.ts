import {DebugError} from "@engine/debug/debugError";
import {IParentChild, Optional} from "@engine/core/declarations";

type OnTreeModifiedCallback<T> = (c:T)=>void;


export class ParentChildDelegate<T extends IParentChild> {

    constructor(private model:T) {}

    public afterChildAppended?:OnTreeModifiedCallback<T>;
    public afterChildRemoved?:OnTreeModifiedCallback<T>;

    public appendChild(c:T):void {
        if (DEBUG) {
            if (c===this.model) throw new DebugError(`parent and child objects are the same`);
            if (this.model.children.find((it:IParentChild)=>it===c)) {
                console.error(c);
                throw new DebugError(`this children is already added`);
            }
        }
        c.parent = this.model;
        (this.model.children as T[]).push(c);
        if (this.afterChildAppended!==undefined) this.afterChildAppended(c);
    }

    public appendChildAt(c:T,index:number):void{
        if (DEBUG) {
            if (index>this.model.children.length-1) throw new DebugError(`can not insert element: index is out of range (${index},${this.model.children.length-1})`);
        }
        c.parent = this.model;
        (this.model.children as T[]).splice(index,0,c);
        if (this.afterChildAppended!==undefined) this.afterChildAppended(c);
    }

    public appendChildAfter(modelAfter:T,newChild:T):void{
        const afterIndex:number = this.model.children.indexOf(modelAfter);
        if (DEBUG) {
            if (afterIndex===-1) throw new DebugError(`can not insert element: object is detached`);
        }
        if (afterIndex===this.model.children.length-1) this.appendChild(newChild);
        else this.appendChildAt(newChild,afterIndex+1);
    }

    public appendChildBefore(modelBefore:T,newChild:T):void{
        const beforeIndex:number = this.model.children.indexOf(modelBefore);
        if (DEBUG) {
            if (beforeIndex===-1) throw new DebugError(`can not insert element: object is detached`);
        }
        if (beforeIndex===0) this.prependChild(newChild);
        else this.appendChildAt(newChild,beforeIndex-1);
    }


    public prependChild(c:T):void {
        c.parent = this.model;
        (this.model.children as T[]).unshift(c);
        if (this.afterChildAppended!==undefined) this.afterChildAppended(c);
    }

    public removeChildAt(i:number):void{
        const c:IParentChild = this.model.children[i];
        if (DEBUG && !c) throw new DebugError(`can not remove children with index ${i}`);
        if (DEBUG && c.parent===undefined) throw new DebugError(`can not remove children with index ${i}: it is already detached`);
        (c.parent!.children as T[]).splice(i,1);
        c.parent = undefined;
        if (this.afterChildRemoved!==undefined) this.afterChildRemoved(c as T);
    }

    public removeChild(child:T):void{
        const parent:IParentChild = child.getParent() as IParentChild;
        const i:number = parent.children.indexOf(child);
        if (DEBUG && i===-1) throw new DebugError(`can not remove child: it doesn't belong to parent`);
        (parent.children as T[]).splice(i,1);
        child.parent = undefined;
        if (this.afterChildRemoved!==undefined) this.afterChildRemoved(child);
    }

    public removeSelf():void {
        const parent:IParentChild = this.model.getParent() as IParentChild;
        if (DEBUG && parent===undefined) throw new DebugError(`can not remove child: it is already detached`);
        const i:number = parent.children.indexOf(this.model);
        if (DEBUG && i===-1) throw new DebugError(`can not remove child: it doesn't belong to parent`);
        (parent.children as T[]).splice(i,1);
        this.model.parent = undefined;
        if (this.afterChildRemoved!==undefined) this.afterChildRemoved(this.model);
    }

    public removeChildren():void{
        for (let i:number = this.model.children.length-1; i >= 0; i--) {
            this.removeChildAt(i);
        }
    }

    public replaceChild(c:T,newChild:T):void{
        const indexOf:number = this.model.children.indexOf(c);
        if (DEBUG && indexOf===-1) throw new DebugError(`can not replace child: destination node doesn't belong to element`);
        (this.model.children as T[])[indexOf] = newChild;
        c.parent = undefined;
        newChild.parent = this.model;
        if (this.afterChildRemoved!==undefined) this.afterChildRemoved(c);
        if (this.afterChildAppended!==undefined) this.afterChildAppended(newChild);
    }

    public moveToFront():void {
        const parent:IParentChild = this.model.getParent() as IParentChild;
        if (DEBUG && !parent) throw new DebugError(`can not move to front: object is detached`);
        const parentArray:IParentChild[] = parent.children as T[];
        const index:number = parentArray.indexOf(this.model);
        if (DEBUG && index===-1)
            throw new DebugError(`can not move to front: object is not belong to current scene`);

        parentArray.splice(index,1);
        parentArray.push(this.model);

    }

    public moveToBack():void {
        const parent:IParentChild = this.model.getParent() as IParentChild;
        if (DEBUG && !parent) throw new DebugError(`can not move to back: object is detached`);
        const parentArray:IParentChild[] = parent.children as T[];
        const index:number = parentArray.indexOf(this.model);
        if (DEBUG && index===-1)
            throw new DebugError(`can not move to front: object is not belong to current scene`);
        parentArray.splice(index,1);
        parentArray.unshift(this.model);
    }

    public findChildById<U extends T>(id:string):Optional<U>{
        if (id===this.model.id) return this.model as U;
        for (const c of this.model.children) {
            const possibleObject:Optional<IParentChild> = c.findChildById(id);
            if (possibleObject) return possibleObject as U;
        }
        return undefined;
    }

}
