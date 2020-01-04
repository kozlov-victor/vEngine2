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
    public readonly children:RenderableModel[] = [];
    public readonly parent:IParentChild;
    public id:string;

    private _parentChildDelegate:ParentChildDelegate<RenderableModel> = new ParentChildDelegate(this);
    private _scene:Scene;

    constructor(protected game:Game) {

    }

    public appendChild(newChild:RenderableModel):void {
        this._parentChildDelegate.appendChild(newChild);
        this._afterChildAppended(newChild);
    }

    public appendChildAt(newChild:RenderableModel,index:number){
        this._parentChildDelegate.appendChildAt(newChild,index);
        this._afterChildAppended(newChild);
    }

    public appendChildAfter(modelAfter:RenderableModel,newChild:RenderableModel){
        this._parentChildDelegate.appendChildAfter(modelAfter,newChild);
        this._afterChildAppended(newChild);
    }

    public appendChildBefore(modelBefore:RenderableModel,newChild:RenderableModel){
        this._parentChildDelegate.appendChildBefore(modelBefore,newChild);
        this._afterChildAppended(newChild);
    }

    public prependChild(newChild:RenderableModel):void {
        this._parentChildDelegate.prependChild(newChild);
        this._afterChildAppended(newChild);
    }

    public removeChildAt(i:number){
        this._parentChildDelegate.removeChildAt(i);
    }

    public removeChild(c:RenderableModel){
        return this._parentChildDelegate.removeChild(this.children,c);
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

    private _afterChildAppended(newChild:RenderableModel):void{
        newChild.setLayer(this);
        newChild.setScene(this.game.getCurrScene());
        (newChild as IParentChild).parent = undefined;
        newChild.revalidate();
    }

}