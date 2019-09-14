import {Game} from "@engine/core/game";
import {RenderableModel} from "../../abstract/renderableModel";
import {IParentChild, Optional} from "@engine/core/declarations";
import {ParentChildDelegate} from "@engine/delegates/parentChildDelegate";

export class Layer implements IParentChild {

    public readonly type:string = 'Layer';
    public readonly children:RenderableModel[] = [];
    public readonly parent:IParentChild;
    public id:string;

    private _parentChildDelegate:ParentChildDelegate<RenderableModel> = new ParentChildDelegate(this);

    constructor(protected game:Game) {

    }

    public appendChild(c:RenderableModel):void {
        this._parentChildDelegate.appendChild(c);
        c.setLayer(this);
        (c as IParentChild).parent = undefined;
        c.revalidate();
    }

    public appendChildAt(c:RenderableModel,index:number){
        this._parentChildDelegate.appendChildAt(c,index);
        c.setLayer(this);
        (c as IParentChild).parent = undefined;
        c.revalidate();
    }

    public appendChildAfter(modelAfter:RenderableModel,newChild:RenderableModel){
        this._parentChildDelegate.appendChildAfter(modelAfter,newChild);
        newChild.setLayer(this);
        (newChild as IParentChild).parent = undefined;
        newChild.revalidate();
    }

    public appendChildBefore(modelBefore:RenderableModel,newChild:RenderableModel){
        this._parentChildDelegate.appendChildBefore(modelBefore,newChild);
        newChild.setLayer(this);
        (newChild as IParentChild).parent = undefined;
        newChild.revalidate();
    }

    public prependChild(c:RenderableModel):void {
        this._parentChildDelegate.prependChild(c);
        c.setLayer(this);
        (c as IParentChild).parent = undefined;
        c.revalidate();
    }

    public removeChildAt(i:number){
        this._parentChildDelegate.removeChildAt(i);
    }

    public removeChildren(){
        this._parentChildDelegate.removeChildren();
    }

    public moveToFront():void {
        this._parentChildDelegate.moveToFront();
    }

    public moveToBack():void {
        this._parentChildDelegate.moveToBack();
    }

    public findChildById(id:string):Optional<RenderableModel>{
        return this._parentChildDelegate.findChildById(id);
    }

    public getParent():Optional<RenderableModel>{
        return this._parentChildDelegate.getParent();
    }

    public update():void {
        const all:RenderableModel[] = this.children;
        for (const obj of all) {
            obj.update();
        }
    }

    public render():void {
        for (const obj of this.children) {
            obj.render();
        }
    }
}