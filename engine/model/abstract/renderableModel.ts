import {AbstractRenderer} from "../../renderer/abstract/abstractRenderer";
import {ICloneable, IEventemittable, IRevalidatable, ITweenable} from "../../declarations";
import {DebugError} from "../../debug/debugError";
import {MathEx} from "../../misc/mathEx";
import {Point2d} from "../../geometry/point2d";
import {Rect} from "../../geometry/rect";
import {Game} from "@engine/game";
import {Tween, ITweenDescription} from "@engine/misc/tween";
import {TweenMovie} from "@engine/misc/tweenMovie";
import {Timer} from "@engine/misc/timer";
import {Layer} from "@engine/model/impl/general/layer";
import {BaseAbstractBehaviour} from "@engine/behaviour/abstract/baseAbstractBehaviour";
import {Size} from "@engine/geometry/size";
import {TweenableDelegate} from "@engine/delegates/tweenableDelegate";
import {TimerDelegate} from "@engine/delegates/timerDelegate";
import {EventEmitterDelegate} from "@engine/delegates/eventEmitterDelegate";
import {Incrementer} from "@engine/resources/incrementer";

export enum BLEND_MODE {
    NORMAL,
    ADDITIVE,
    SUBSTRACTIVE,
    REVERSE_SUBSTRACTIVE
}

class Angle3d {
    public x:number = 0;
    public y:number = 0;

    private _z:number = 0;

    constructor(private m:RenderableModel){}

    set z(val:number) {
        this.m.angle = val;
    }

    get z():number{
        return this._z;
    }

    _setZSilently(val:number){
        this._z = val;
    }

}

export abstract class RenderableModel  implements IRevalidatable, ITweenable, IEventemittable {

    public readonly type:string;
    public id:string;
    public readonly size:Size = new Size();
    public readonly pos:Point2d = new Point2d(0,0,()=>this._dirty=true);
    public readonly posZ:number = 0;
    public readonly scale:Point2d = new Point2d(1,1);
    public readonly anchor:Point2d = new Point2d(0,0);
    public readonly rotationPoint:Point2d = new Point2d(0,0);
    public angle3d:Angle3d = new Angle3d(this);
    public alpha:number = 1;
    public blendMode:BLEND_MODE = BLEND_MODE.NORMAL;
    public parent:RenderableModel;
    public readonly children:RenderableModel[] = [];
    public readonly velocity = new Point2d(0,0);


    protected _dirty:boolean = true;

    protected _srcRect:Rect = new Rect();
    protected _screenRect = new Rect();
    protected _behaviours:BaseAbstractBehaviour[] = [];
    private   _layer:Layer;
    private   _angle:number = 0;


    // tween
    private _tweenDelegate: TweenableDelegate = new TweenableDelegate();

    // timer
    private _timerDelegate:TimerDelegate = new TimerDelegate();

    //eventEmitter
    private _eventEmitterDelegate:EventEmitterDelegate = new EventEmitterDelegate();

    protected constructor(protected game:Game){
        if (DEBUG && !game) throw new DebugError(
            `can not create model '${this.type}': game instance not passed to model constructor`
        );
        this.id = `object_${Incrementer.getValue()}`;
    }

    get angle():number{
        return this._angle;
    }

    set angle(val:number){
        this._angle = val;
        this.angle3d._setZSilently(val);
    }

    public revalidate():void{
        for (const b of this._behaviours) b.revalidate();
    }

    public getLayer(): Layer {
        return this._layer;
    }

    public setLayer(value: Layer):void {
        this._layer = value;
    }

    public findChildById(id:string):RenderableModel|null{
        if (id===this.id) return this;
        for (const c of this.children) {
            const possibleObject:RenderableModel = c.findChildById(id);
            if (possibleObject) return possibleObject;
        }
        return null;
    }


    public getWorldRect():Rect{
        if (this._dirty) {
            this.calcWorldRect();
        }
        return this._screenRect;
    }

    public getSrcRect():Rect{
        this._srcRect.setXYWH(
            this.pos.x - this.anchor.x,
            this.pos.y - this.anchor.y,
            this.size.width,
            this.size.height
        );
        return this._srcRect;
    }

    public setAnchorToCenter():void {
        this.revalidate();
        if (DEBUG && !(this.size.width && this.size.height))
            throw new DebugError(`can not set anchor to center: width or height of gameObject is not set`);
        this.anchor.setXY(this.size.width/2,this.size.height/2);
    }


    public appendChild(c:RenderableModel):void {
        c.parent = this;
        c.setLayer(this.getLayer());
        c.revalidate();
        this.children.push(c);
    }

    public removeChildAt(i:number){
        const c:RenderableModel = this.children[i];
        if (DEBUG && !c) throw new DebugError(`can not remove children with index ${i}`);
        c.kill();
    }

    public removeChildren(){
        for (let i:number = this.children.length-1; i >= 0; i--) {
            const c:RenderableModel = this.children[i];
            this.removeChildAt(i);
        }
    }

    public addBehaviour(b:BaseAbstractBehaviour):void {
        this._behaviours.push(b);
        b.manage(this);
    }


    public prependChild(c:RenderableModel):void {
        c.parent = this;
        c.revalidate();
        this.children.unshift(c);
    }

    public setDirty():void {
        this._dirty = true; // todo
        //if (this.parent) this.parent._dirty = true;
    }

    public abstract draw():boolean;

    public moveToFront():void {
        if (DEBUG && !this._getParent()) throw new DebugError(`can not move to front: object is detached`);
        const index:number = (this._getParent()).children.indexOf(this);
        if (DEBUG && index===-1)
            throw new DebugError(`can not move to front: object is not belong to current scene`);
        const parentArray:RenderableModel[] = this._getParent().children;
        parentArray.splice(index,1);
        parentArray.push(this);

    }

    public moveToBack():void {
        if (DEBUG && !this._getParent()) throw new DebugError(`can not move to back: object is detached`);
        const index:number = this._getParent().children.indexOf(this);
        if (DEBUG && index===-1)
            throw new DebugError(`can not move to front: object is not belong to current scene`);
        const parentArray:RenderableModel[] = this._getParent().children;
        parentArray.splice(index,1);
        parentArray.unshift(this);
    }

    public kill():void {

        for (const c of this.children) c.kill();

        if (DEBUG && !this._getParent()) throw new DebugError(`can not kill object: gameObject is detached`);

        const parentArray:RenderableModel[] = this._getParent().children;
        const index:number = parentArray.indexOf(this);
        if (DEBUG && index===-1) {
            console.error(this);
            throw new DebugError('can not kill: object is not belong to current scene');
        }
        this.parent = null;
        this._layer = null;
        parentArray.splice(index,1);

        for (const b of this._behaviours) {
            b.destroy();
        }
        this.game.getRenderer().killObject(this);
    }

    public render():void {
        //if (this.isInViewPort()) return;
        const renderer:AbstractRenderer = this.game.getRenderer();

        renderer.save();
        this.beforeRender();

        renderer.translate(-this.anchor.x,-this.anchor.y,this.posZ);

        if (this.isNeedAdditionalTransform()) {
            renderer.translate(this.rotationPoint.x,this.rotationPoint.y);
            if (!this.scale.equal(1)) renderer.scale(this.scale.x,this.scale.y);
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
        for (const c of this.children) {
            if (this._dirty) c.setDirty();
            c.update();
        }

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
    public on(eventName: string, callBack: (arg?:any)=>void): ()=>void {
        return this._eventEmitterDelegate.on(eventName,callBack);
    }
    public trigger(eventName: string, data?: any): void {
        this._eventEmitterDelegate.trigger(eventName,data);
    }

    protected setClonedProperties(cloned:RenderableModel):void {
        cloned.size.set(cloned.size);
        cloned.pos.set(this.pos);
        cloned.scale.set(this.scale);
        cloned.anchor.set(this.anchor);
        cloned.rotationPoint.set(this.rotationPoint);
        cloned.angle = this.angle;
        // todo angle 3d
        cloned.alpha = this.alpha;
        cloned.blendMode = this.blendMode;
        cloned.parent = null;
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

    protected calcWorldRect():void {
        this._screenRect.set(this.getSrcRect());
        let parent:RenderableModel = this.parent;
        while (parent) {
            this._screenRect.addXY(parent.getSrcRect().point.x,parent.getSrcRect().point.y);
            parent = parent.parent;
        }
    }

    protected beforeRender():void {
        this.game.getRenderer().translate(this.pos.x,this.pos.y);
    }

    protected isNeedAdditionalTransform():boolean{
        return !(this.scale.equal(1) && this.angle3d.x===0 && this.angle3d.y===0 && this.angle3d.z===0);
    }

    protected doAdditionalTransform():void {
        const renderer:AbstractRenderer = this.game.getRenderer();

        if (this.angle3d.z!==0) renderer.rotateZ(this.angle3d.z);
        if (this.angle3d.x!==0) renderer.rotateX(this.angle3d.x);
        if (this.angle3d.y!==0) renderer.rotateY(this.angle3d.y);
    }

    protected isInViewPort():boolean{
        return MathEx.overlapTest(this.game.camera.getRectScaled(),this.getSrcRect());
    }

    private _getParent():RenderableModel|Layer|undefined{
        return this.parent || this._layer || undefined;
    }

}