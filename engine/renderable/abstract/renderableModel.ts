import {AbstractRenderer} from "../../renderer/abstract/abstractRenderer";
import {
    IAlphaBlendable,
    ICloneable,
    IEventemittable,
    IParentChild,
    IRevalidatable,
    ITweenable,
    Optional
} from "../../core/declarations";
import {DebugError} from "../../debug/debugError";
import {IPoint2d, Point2d} from "../../geometry/point2d";
import {IRect, Rect} from "../../geometry/rect";
import {Game} from "@engine/core/game";
import {ITweenDescription, Tween} from "@engine/animation/tween";
import {TweenMovie} from "@engine/animation/tweenMovie";
import {Timer} from "@engine/misc/timer";
import {Layer} from "@engine/scene/layer";
import {BaseAbstractBehaviour} from "@engine/behaviour/abstract/baseAbstractBehaviour";
import {TweenableDelegate} from "@engine/delegates/tweenableDelegate";
import {TimerDelegate} from "@engine/delegates/timerDelegate";
import {EventEmitterDelegate} from "@engine/delegates/eventEmitterDelegate";
import {Incrementer} from "@engine/resources/incrementer";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {IMousePoint} from "@engine/control/mouse/mousePoint";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";
import {ParentChildDelegate} from "@engine/delegates/parentChildDelegate";
import {TransformableModel} from "@engine/renderable/abstract/transformableModel";
import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";

export const enum BLEND_MODE {
    NORMAL,
    ADDITIVE,
    SUBSTRACTIVE,
    REVERSE_SUBSTRACTIVE
}


export abstract class RenderableModel extends TransformableModel implements IRevalidatable, ITweenable, IEventemittable, IParentChild, IAlphaBlendable  {

    public id:string;

    public alpha:number = 1;
    public visible:boolean = true;
    public blendMode:BLEND_MODE = BLEND_MODE.NORMAL;

    public readonly parent:RenderableModel;
    public readonly children:RenderableModel[] = [];
    public readonly velocity = new Point2d(0,0);
    public passMouseEventsThrough:boolean = false;


    private _destRect:Rect = new Rect();
    private _behaviours:BaseAbstractBehaviour[] = [];
    private _layer:Optional<Layer>;
    private _scene:Scene;


    // tween
    private _tweenDelegate: TweenableDelegate = new TweenableDelegate();

    // timer
    private _timerDelegate:TimerDelegate = new TimerDelegate();

    // eventEmitter
    private _eventEmitterDelegate:EventEmitterDelegate = new EventEmitterDelegate();

    // parent-child
    private _parentChildDelegate:ParentChildDelegate<RenderableModel> = new ParentChildDelegate(this);

    private _worldPositionIsDirty:boolean = true;
    private _worldPosition = new Point2d();

    protected constructor(protected game:Game){
        super(game);
        this.id = `object_${Incrementer.getValue()}`;
        this.pos.addOnChangeListener(()=>this._worldPositionIsDirty = true);
    }

    public revalidate():void{
        for (const b of this._behaviours) b.revalidate();
    }

    public getLayer(): Layer {
        return this._layer!;
    }

    public setLayer(value: Layer):void {
        this._layer = value;
    }

    public getScene(): Scene {
        return this._scene!;
    }

    public setScene(value: Scene):void {
        this._scene = value;
    }

    public getDestRect():Readonly<IRect>{
        this._destRect.setPoint(this.pos);
        this._destRect.setSize(this.size);
        return this._destRect;
    }

    public addBehaviour(b:BaseAbstractBehaviour):void {
        this._behaviours.push(b);
        b.manage(this);
    }

    public setWH(w:number,h:number = w):void{
        this.setXYWH(this.pos.x,this.pos.y,w,h);
    }

    public setXYWH(x:number,y:number,w:number,h:number):void{
        this.pos.setXY(x,y);
        this.size.setWH(w,h);
    }


    public abstract draw():void;

    public kill():void {

        for (const c of this.children) c.kill();

        if (DEBUG && !this.getParent()) throw new DebugError(`can not kill object: gameObject is detached`);

        const parentArray:RenderableModel[] = this.getParent()!.children;
        const index:number = parentArray.indexOf(this);
        if (DEBUG && index===-1) {
            console.error(this);
            throw new DebugError('can not kill: object is not belong to current scene');
        }
        parentArray.splice(index,1);

        for (const b of this._behaviours) {
            b.destroy();
        }
        this.game.getRenderer().killObject(this);
    }

    public render():void {
        //if (this.isInViewPort()) return;
        if (!this.visible) return;
        // todo global alpha composition
        if (this.alpha===0) return;
        const renderer:AbstractRenderer = this.game.getRenderer();

        renderer.saveTransform();
        renderer.saveAlphaBlend();

        this.translate();
        this.transform();
        renderer.setAlphaBlend(this.alpha);


        this.draw();

        if (this.children.length>0) {
            renderer.saveTransform();
            renderer.saveAlphaBlend();
            renderer.translate(this.anchor.x,this.anchor.y);
            for(let i=0,max=this.children.length;i<max;i++) {
                this.children[i].render();
            }
            renderer.restoreTransform();
            renderer.restoreAlphaBlend();
        }

        renderer.restoreTransform();
        renderer.restoreAlphaBlend();
    }

    public update():void {
        const delta:number = this.game.getDeltaTime();

        this._tweenDelegate.update();
        this._timerDelegate.update();

        for (const bh of this._behaviours) {
            bh.onUpdate();
        }

        // if (this.rigidBody!==undefined) {
        //     this.rigidBody.update();
        //     // todo
        //     // this.pos.x = ~~(this.rigidBody.mCenter.x - this.rigidBody['mWidth']/2); // todo
        //     // this.pos.y = ~~(this.rigidBody.mCenter.y - this.rigidBody['mHeight']/2);
        //     this.angle = this.rigidBody.mAngle;
        // } else {
        if (this.velocity.x) this.pos.x += this.velocity.x * delta / 1000;
        if (this.velocity.y) this.pos.y += this.velocity.y * delta / 1000;
        if (this._angleVelocity3d.x) this.angle3d.x+=this._angleVelocity3d.x * delta / 1000;
        if (this._angleVelocity3d.y) this.angle3d.y+=this._angleVelocity3d.y * delta / 1000;
        if (this._angleVelocity3d.z) this.angle3d.z+=this._angleVelocity3d.z * delta / 1000;
        // }

        for (const c of this.children) {
            c.update();
        }

    }


    public addTween<T>(t: Tween<T>): void {
        this._tweenDelegate.addTween(t);
    }
    public addTweenMovie(tm: TweenMovie):void {
        this._tweenDelegate.addTweenMovie(tm);
    }
    public tween<T>(desc: ITweenDescription<T>): Tween<T> {
        return this._tweenDelegate.tween(desc);
    }

    public setTimeout(callback:()=>void,interval:number):Timer{
        return this._timerDelegate.setTimeout(callback,interval);
    }

    public setInterval(callback:()=>void,interval:number):Timer{
        return this._timerDelegate.setInterval(callback,interval);
    }

    public off(eventName: string, callBack: (arg?:any)=>void): void {
        this._eventEmitterDelegate.off(eventName,callBack);
    }
    public on(eventName:MOUSE_EVENTS,callBack:(e:IMousePoint)=>void):()=>void;
    public on(eventName:KEYBOARD_EVENTS,callBack:(e:number)=>void):()=>void;
    public on(eventName: string, callBack: (arg?:any)=>void): ()=>void {
        return this._eventEmitterDelegate.on(eventName,callBack);
    }
    public trigger(eventName: string, data?: any): void {
        this._eventEmitterDelegate.trigger(eventName,data);
    }

    public appendChild(newChild:RenderableModel):void {
        this._parentChildDelegate.appendChild(newChild);
        this._afterChildAppended(newChild);
    }

    public appendChildAt(newChild:RenderableModel,index:number):void{
        this._parentChildDelegate.appendChildAt(newChild,index);
        this._afterChildAppended(newChild);
    }

    public appendChildAfter(modelAfter:RenderableModel,newChild:RenderableModel):void{
        this._parentChildDelegate.appendChildAfter(modelAfter,newChild);
        this._afterChildAppended(newChild);
    }

    public appendChildBefore(modelBefore:RenderableModel,newChild:RenderableModel):void{
        this._parentChildDelegate.appendChildBefore(modelBefore,newChild);
        this._afterChildAppended(newChild);
    }

    public prependChild(newChild:RenderableModel):void {
        this._parentChildDelegate.prependChild(newChild);
        this._afterChildAppended(newChild);
    }

    public removeChild(c:RenderableModel):void {
        this._parentChildDelegate.removeChild(c.parent.children,c);
    }

    public removeChildAt(i:number):void{
        this._parentChildDelegate.removeChildAt(i);
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

    public findChildById(id:string):Optional<RenderableModel>{
        return this._parentChildDelegate.findChildById(id);
    }

    public getParent():Optional<RenderableModel|Layer>{
        return this._parentChildDelegate.getParent()||this._layer;
    }

    public getWorldPosition():Readonly<IPoint2d> { // todo move to transformable
        if (this._worldPositionIsDirty) {
            this._worldPosition.set(this.pos);
            let parent:Optional<RenderableModel> = this.parent;
            while (parent!==undefined) {
                this._worldPosition.add(parent.pos);
                parent = parent.parent;
            }
            this._worldPosition.add(this.getScene().pos);
        }
        return this._worldPosition;
    }

    public renderToTexture():ResourceLink<ITexture>{
        return this.game.getRenderer().getHelper().renderRenderableModelToTexture(this);
    }

    protected setClonedProperties(cloned:RenderableModel):void {
        cloned.size.set(cloned.size);
        cloned.alpha = this.alpha;
        cloned.blendMode = this.blendMode;

        this.children.forEach((c:RenderableModel)=>{
            if (DEBUG && !('clone' in c)) {
                console.error(c);
                throw new DebugError(`can not clone object: cloneable interface is not implemented`);
            }
            const clonedChildren:RenderableModel = (c as any as ICloneable<RenderableModel>).clone();
            if (DEBUG && ! (clonedChildren instanceof RenderableModel )) {
                console.error(c);
                throw new DebugError(`can not clone object: "clone"  method must return Cloneable object`);
            }
            cloned.appendChild(clonedChildren);
        });
        cloned.game = this.game;
    }

    /**
     * @deprecated
     */
    protected isInViewPort():boolean{
        return true; // now works incorrect - dont take transformations
        //return MathEx.overlapTest(this.game.camera.getRectScaled(),this.getSrcRect());
    }

    private _afterChildAppended(newChild:RenderableModel):void{
        newChild.setLayer(this._layer!);
        newChild.setScene(this.game.getCurrScene());
        newChild.revalidate();
    }

}