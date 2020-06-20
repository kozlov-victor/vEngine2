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

    public readonly type:'Layer' = 'Layer';
    public transformType:LayerTransformType = LayerTransformType.TRANSFORM;
    public readonly children:RenderableModel[] = [];
    public readonly parent:IParentChild;
    public id:string;

    private _parentChildDelegate:ParentChildDelegate<IParentChild> = new ParentChildDelegate<IParentChild>(this);
    private _scene:Scene;

    constructor(protected game:Game) {
        this._parentChildDelegate.afterChildAppended = (c:IParentChild)=>{
            const m:RenderableModel = c as RenderableModel;
            m.setLayer(this);
            m.setScene(this.game.getCurrScene());
            (c as IParentChild).parent = undefined;
            m.revalidate();
        }
    }

    public appendChild(newChild:RenderableModel):void {
        this._parentChildDelegate.appendChild(newChild);
    }

    public appendChildAt(newChild:RenderableModel,index:number){
        this._parentChildDelegate.appendChildAt(newChild,index);
    }

    public appendChildAfter(modelAfter:RenderableModel,newChild:RenderableModel){
        this._parentChildDelegate.appendChildAfter(modelAfter,newChild);
    }

    public appendChildBefore(modelBefore:RenderableModel,newChild:RenderableModel){
        this._parentChildDelegate.appendChildBefore(modelBefore,newChild);
    }

    public prependChild(newChild:RenderableModel):void {
        this._parentChildDelegate.prependChild(newChild);
    }

    public removeChildAt(i:number){
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

    public removeChildren(){
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

    /*** @internal */
    public setScene(scene:Scene):void{
        this._scene = scene;
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
