import {Game} from "@engine/core/game";
import {RenderableModel} from "../renderable/abstract/renderableModel";
import {IParentChild, Optional} from "@engine/core/declarations";
import {ParentChildDelegate} from "@engine/delegates/parentChildDelegate";
import {Scene} from "@engine/scene/scene";

export const enum LayerTransformType {
    TRANSFORM,
    STICK_TO_CAMERA,
}

export class Layer implements IParentChild {

    public readonly type:string = 'Layer';
    public transformType:LayerTransformType = LayerTransformType.TRANSFORM;
    public readonly parent:IParentChild;
    public id:string;
    public readonly _children:RenderableModel[] = [];

    protected _parentChildDelegate:ParentChildDelegate<IParentChild> = new ParentChildDelegate<IParentChild>(this);
    private _scene:Scene;

    constructor(protected game:Game) {
        this._parentChildDelegate.afterChildAppended = (c:IParentChild)=>{
            const m:RenderableModel = c as RenderableModel;
            m._setLayer(this);
            m._setScene(this._scene);
            (c as IParentChild).parent = undefined;
            m.revalidate();
        };
    }

    public appendChild(newChild:RenderableModel):void {
        this._parentChildDelegate.appendChild(newChild);
    }

    public appendChildAt(newChild:RenderableModel,index:number):void{
        this._parentChildDelegate.appendChildAt(newChild,index);
    }

    public appendChildAfter(modelAfter:RenderableModel,newChild:RenderableModel):void{
        this._parentChildDelegate.appendChildAfter(modelAfter,newChild);
    }

    public appendChildBefore(modelBefore:RenderableModel,newChild:RenderableModel):void{
        this._parentChildDelegate.appendChildBefore(modelBefore,newChild);
    }

    public prependChild(newChild:RenderableModel):void {
        this._parentChildDelegate.prependChild(newChild);
    }

    public removeChildAt(i:number):void{
        this._parentChildDelegate.removeChildAt(i);
    }

    public removeChild(c:RenderableModel):void{
        this._parentChildDelegate.removeChild(c);
    }

    public replaceChild(c:RenderableModel,newChild:RenderableModel):void{
        this._parentChildDelegate.replaceChild(c,newChild);
    }

    public removeSelf(): void {
        this._parentChildDelegate.removeSelf();
    }

    public removeChildren():void{
        this._parentChildDelegate.removeChildren();
    }

    public moveToFront():void {
        this._parentChildDelegate.moveToFront();
    }

    public moveToBack():void {
        this._parentChildDelegate.moveToBack();
    }

    public findChildById<T extends RenderableModel>(id:string):Optional<T>{
        return this._parentChildDelegate.findChildById<T>(id);
    }

    public getParent():Scene{
        return this._scene;
    }

    public getParentNode(): IParentChild {
        return this.parent;
    }

    public getChildrenCount(): number {
        return this._children.length;
    }

    public getChildAt(index: number): RenderableModel {
        return this._children[index];
    }


    public _setScene(scene:Scene):void{
        this._scene = scene;
    }

    public update():void {
        const all:RenderableModel[] = this._children;
        for (const obj of all) {
            obj.update();
        }
    }

    public render():void {
        for (const obj of this._children) {
            obj.render();
        }
    }

}
