import {AbstractRenderer} from "../../renderer/abstract/abstractRenderer";
import {ICloneable, IEventemittable, IParentChild, IRevalidatable, ITweenable, Optional} from "../../core/declarations";
import {DebugError} from "../../debug/debugError";
import {IPoint2d, Point2d} from "../../geometry/point2d";
import {IRect, Rect} from "../../geometry/rect";
import {Game} from "@engine/core/game";
import {ITweenDescription, Tween} from "@engine/animation/tween";
import {TweenMovie} from "@engine/animation/tweenMovie";
import {Timer} from "@engine/misc/timer";
import {Layer} from "@engine/renderable/impl/general/layer";
import {BaseAbstractBehaviour} from "@engine/behaviour/abstract/baseAbstractBehaviour";
import {Size} from "@engine/geometry/size";
import {TweenableDelegate} from "@engine/delegates/tweenableDelegate";
import {TimerDelegate} from "@engine/delegates/timerDelegate";
import {EventEmitterDelegate} from "@engine/delegates/eventEmitterDelegate";
import {Incrementer} from "@engine/resources/incrementer";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {IMousePoint} from "@engine/control/mouse/mousePoint";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";
import {ParentChildDelegate} from "@engine/delegates/parentChildDelegate";

export const enum BLEND_MODE {
    NORMAL,
    ADDITIVE,
    SUBSTRACTIVE,
    REVERSE_SUBSTRACTIVE
}

class AnglePoint3d {
    public x:number = 0;
    public y:number = 0;

    private _z:number = 0;

    constructor(private m:RenderableModel,private zProperty:'angle'|'angleVelocity'){}

    set z(val:number) {
        this.m[this.zProperty] = val;
    }

    get z():number{
        return this._z;
    }

    public _setZSilently(val:number){
        this._z = val;
    }

    public clone(m:RenderableModel):AnglePoint3d{
        const a:AnglePoint3d = new AnglePoint3d(m,this.zProperty);
        a.x = this.x;
        a.y = this.y;
        a.z = this.z;
        return a;
    }

}

class ModelPoint2d extends Point2d {

    constructor(private model:RenderableModel){
        super();
    }

    public setToCenter():void {
        this.model.revalidate();
        if (DEBUG && !(this.model.size.width && this.model.size.height))
            throw new DebugError(`can not set anchor to center: width or height of gameObject is not set`);
        this.setXY(this.model.size.width/2,this.model.size.height/2);
    }

}

export abstract class RenderableModel implements IRevalidatable, ITweenable, IEventemittable, IParentChild  {

    get angle():number{
        return this._angle;
    }

    set angle(val:number){
        this._angle = val;
        this.angle3d._setZSilently(val);
    }

    get angleVelocity():number{
        return this._angle;
    }

    set angleVelocity(val:number){
        this._angle = val;
        this._angleVelocity3d._setZSilently(val);
    }

    public readonly type:string;
    public id:string;
    public readonly size:Size = new Size();
    public readonly pos:Point2d = new Point2d(0,0,()=>this._worldPositionIsDirty=true);
    public readonly posZ:number = 0;
    public readonly scale:Point2d = new Point2d(1,1);
    public readonly skew:Point2d = new Point2d(0,0);
    public readonly anchor:ModelPoint2d = new ModelPoint2d(this);
    public readonly rotationPoint:ModelPoint2d = new ModelPoint2d(this);
    public angle3d:AnglePoint3d = new AnglePoint3d(this,'angle');
    public alpha:number = 1;
    public blendMode:BLEND_MODE = BLEND_MODE.NORMAL;
    public readonly parent:RenderableModel;
    public readonly children:RenderableModel[] = [];
    public readonly velocity = new Point2d(0,0);
    public visible:boolean = true;
    public passMouseEventsThrough:boolean = false;
    private _angleVelocity3d:AnglePoint3d = new AnglePoint3d(this,'angleVelocity');


    private _worldPositionIsDirty:boolean = true;
    private _worldPosition = new Point2d();

    private _destRect:Rect = new Rect();
    private _behaviours:BaseAbstractBehaviour[] = [];
    private _layer:Optional<Layer>;
    private _angle:number = 0;

    // tween
    private _tweenDelegate: TweenableDelegate = new TweenableDelegate();

    // timer
    private _timerDelegate:TimerDelegate = new TimerDelegate();

    // eventEmitter
    private _eventEmitterDelegate:EventEmitterDelegate = new EventEmitterDelegate();

    // parent-child
    private _parentChildDelegate:ParentChildDelegate<RenderableModel> = new ParentChildDelegate(this);

    protected constructor(protected game:Game){
        if (DEBUG && !game) throw new DebugError(
            `can not create model '${this.type}': game instance not passed to model constructor`
        );
        this.id = `object_${Incrementer.getValue()}`;
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

    public getWorldPosition():Readonly<IPoint2d> {
        if (this._worldPositionIsDirty) {
            this.calcWorldPosition();
        }
        return this._worldPosition;
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


    public abstract draw():boolean;

    public kill():void { // todo is this method need

        for (const c of this.children) c.kill();

        if (DEBUG && !this.getParent()) throw new DebugError(`can not kill object: gameObject is detached`);

        const parentArray:RenderableModel[] = this.getParent()!.children;
        const index:number = parentArray.indexOf(this);
        if (DEBUG && index===-1) {
            console.error(this);
            throw new DebugError('can not kill: object is not belong to current scene');
        }
        this._layer = undefined;
        parentArray.splice(index,1);

        for (const b of this._behaviours) {
            b.destroy();
        }
        this.game.getRenderer().killObject(this);
    }

    public render():void {
        //if (this.isInViewPort()) return;
        if (!this.visible) return;
        const renderer:AbstractRenderer = this.game.getRenderer();

        renderer.save();
        this.beforeRender();

        if (!this.anchor.equal(0,0)) renderer.translate(-this.anchor.x,-this.anchor.y,this.posZ);

        if (this.isNeedAdditionalTransform()) {
            renderer.translate(this.rotationPoint.x,this.rotationPoint.y);
            if (!this.scale.equal(1)) renderer.scale(this.scale.x,this.scale.y);
            if (this.skew.x!==0) renderer.skewX(this.skew.x);
            if (this.skew.y!==0) renderer.skewY(this.skew.y);
            this.doAdditionalTransform();
            renderer.translate(-this.rotationPoint.x,-this.rotationPoint.y);
        }

        const drawResult:boolean = this.draw();

        if (drawResult && this.children.length>0) {
            renderer.save();
            renderer.translate(this.anchor.x,this.anchor.y);
            for(let i=0,max=this.children.length;i<max;i++) {
                //renderer.save();
                this.children[i].render();
                //renderer.restore();
            }
            renderer.restore();
        }

        renderer.restore();
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


    public addTween(t: Tween): void {
        this._tweenDelegate.addTween(t);
    }
    public addTweenMovie(tm: TweenMovie):void {
        this._tweenDelegate.addTweenMovie(tm);
    }
    public tween(desc: ITweenDescription): Tween {
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

    public appendChild(c:RenderableModel):void {
        this._parentChildDelegate.appendChild(c);
        c.setLayer(this._layer!);
        c.revalidate();
    }

    public appendChildAt(c:RenderableModel,index:number):void{
        this._parentChildDelegate.appendChildAt(c,index);
        c.setLayer(this._layer!);
        c.revalidate();
    }

    public appendChildAfter(modelAfter:RenderableModel,newChild:RenderableModel):void{
        this._parentChildDelegate.appendChildAfter(modelAfter,newChild);
        newChild.setLayer(this._layer!);
        newChild.revalidate();
    }

    public appendChildBefore(modelBefore:RenderableModel,newChild:RenderableModel):void{
        this._parentChildDelegate.appendChildBefore(modelBefore,newChild);
        newChild.setLayer(this._layer!);
        newChild.revalidate();
    }

    public prependChild(c:RenderableModel):void {
        this._parentChildDelegate.prependChild(c);
        c.setLayer(this._layer!);
        c.revalidate();
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

    public getParent():Optional<RenderableModel>{
        return this._parentChildDelegate.getParent();
    }

    protected setClonedProperties(cloned:RenderableModel):void {
        cloned.size.set(cloned.size);
        cloned.pos.set(this.pos);
        cloned.scale.set(this.scale);
        cloned.anchor.set(this.anchor);
        cloned.rotationPoint.set(this.rotationPoint);
        cloned.angle3d = this.angle3d.clone(this);
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

    protected beforeRender():void {
        this.game.getRenderer().translate(this.pos.x,this.pos.y);
    }

    protected isNeedAdditionalTransform():boolean{
        return !(this.skew.equal(0) && this.scale.equal(1) && this.angle3d.x===0 && this.angle3d.y===0 && this.angle3d.z===0);
    }

    protected doAdditionalTransform():void {
        const renderer:AbstractRenderer = this.game.getRenderer();

        if (this.angle3d.z!==0) renderer.rotateZ(this.angle3d.z);
        if (this.angle3d.x!==0) renderer.rotateX(this.angle3d.x);
        if (this.angle3d.y!==0) renderer.rotateY(this.angle3d.y);
    }

    /**
     * @deprecated
     */
    protected isInViewPort():boolean{
        return true; // now works incorrect - dont take transformations
        //return MathEx.overlapTest(this.game.camera.getRectScaled(),this.getSrcRect());
    }

    private calcWorldPosition():void {
        this._worldPosition.set(this.pos);
        let parent:Optional<RenderableModel> = this.parent;
        while (parent!==undefined) {
            this._worldPosition.add(parent.pos);
            parent = parent.parent;
        }
    }

}