import {Game} from "@engine/core/game";
import {RenderableModel} from "../renderable/abstract/renderableModel";
import {IAlphaBlendable, IFilterable, IParentChild, IWithId, Optional} from "@engine/core/declarations";
import {ParentChildDelegate} from "@engine/delegates/parentChildDelegate";
import {Scene} from "@engine/scene/scene";
import {Incrementer} from "@engine/resources/incrementer";
import {IStateStackPointer} from "@engine/renderer/webGl/base/buffer/frameBufferStack";

export const enum LayerTransformType {
    TRANSFORM,
    STICK_TO_CAMERA,
}

export class Layer implements IParentChild, IFilterable,IAlphaBlendable, IWithId {

    public readonly type = 'Layer';
    public transformType = LayerTransformType.TRANSFORM;
    public readonly parent:IParentChild;
    public filters:IFilter[] = [];
    public alpha = 1;
    public id = `object_${Incrementer.getValue()}`;

    public readonly _children:RenderableModel[] = [];

    protected _parentChildDelegate = new ParentChildDelegate<IParentChild>(this);
    private _scene:Scene;

    constructor(protected game:Game) {
        this._parentChildDelegate.afterChildAppended = (c:IParentChild)=>{
            const m = c as RenderableModel;
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

    public appendTo(parent:Scene):void {
        parent.appendChild(this);
    }

    public prependTo(parent:Scene):void {
        parent.prependChild(this);
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
        for (const c of this._children) {
            c.update();
        }
    }

    public render():void {
        const renderer = this.game.getRenderer();
        const layerStatePointer = renderer.beforeItemStackDraw(this.filters,this.alpha,false);
        for (const c of this._children) {
            c.render();
        }
        renderer.afterItemStackDraw(layerStatePointer);
    }

}
