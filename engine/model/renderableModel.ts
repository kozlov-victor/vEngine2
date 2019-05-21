import {AbstractRenderer} from "../renderer/abstract/abstractRenderer";
import {Resource} from "../resources/resource";
import {Cloneable, Eventemittable, Revalidatable, Tweenable} from "../declarations";
import {DebugError} from "../debug/debugError";
import {MathEx} from "../misc/mathEx";
import {Point2d} from "../geometry/point2d";
import {AbstractFilter} from "../renderer/webGl/filters/abstract/abstractFilter";
import {Rect} from "../geometry/rect";
import {Game} from "@engine/game";
import {Tween, TweenDescription} from "@engine/misc/tween";
import {TweenMovie} from "@engine/misc/tweenMovie";
import {Timer} from "@engine/misc/timer";
import {Layer} from "@engine/model/impl/layer";
import {BaseAbstractBehaviour} from "@engine/behaviour/abstract/baseAbstractBehaviour";
import {Size} from "@engine/geometry/size";
import {TweenableDelegate} from "@engine/delegates/tweenableDelegate";
import {TimerDelegate} from "@engine/delegates/timerDelegate";
import {EventEmitterDelegate} from "@engine/delegates/eventEmitterDelegate";
import {Texture} from "@engine/renderer/webGl/base/texture";

export enum BLEND_MODE {
    NORMAL,
    ADDITIVE,
    SUBSTRACTIVE,
    REVERSE_SUBSTRACTIVE
}

export abstract class RenderableModel extends Resource<Texture> implements Revalidatable, Tweenable, Eventemittable {

    readonly type:string;
    id:string;
    readonly size:Size = new Size();
    readonly pos:Point2d = new Point2d(0,0,()=>this._dirty=true);
    readonly scale:Point2d = new Point2d(1,1);
    readonly anchor:Point2d = new Point2d(0,0);
    readonly rotationPoint:Point2d = new Point2d(0,0);
    angle:number = 0;
    angle3d:{x:number,y:number,z:number} = {x:0,y:0,z:0};
    alpha:number = 1;
    filters: AbstractFilter[] = [];
    blendMode:BLEND_MODE = BLEND_MODE.NORMAL;
    parent:RenderableModel;
    readonly children:RenderableModel[] = [];
    readonly velocity = new Point2d(0,0);


    protected _dirty:boolean = true;
    private   _layer:Layer;

    protected _srcRect:Rect = new Rect();
    protected _screenRect = new Rect();
    protected _behaviours:BaseAbstractBehaviour[] = [];

    protected constructor(protected game:Game){
        super();
        if (DEBUG && !game) throw new DebugError(
            `can not create model '${this.type}': game instance not passed to model constructor`
        );
    }

    protected setClonedProperties(cloned:RenderableModel):void {
        cloned.size.set(cloned.size);
        cloned.pos.set(this.pos);
        cloned.scale.set(this.scale);
        cloned.anchor.set(this.anchor);
        cloned.rotationPoint.set(this.rotationPoint);
        cloned.angle = this.angle;
        cloned.alpha = this.alpha;
        if (this.filters.length) cloned.filters = [...this.filters];
        cloned.blendMode = this.blendMode;
        cloned.parent = null;
        this.children.forEach((c:RenderableModel)=>{
            if (DEBUG && !('clone' in c)) {
                console.error(c);
                throw new DebugError(`can not clone object: cloneable interface is not implemented`);
            }
            const clonedChildren:RenderableModel = (c as any as Cloneable<RenderableModel>).clone();
            if (DEBUG && ! (clonedChildren instanceof RenderableModel )) {
                console.error(c);
                throw new DebugError(`can not clone object: "clone"  method must return Cloneable object`);
            }
            cloned.appendChild(clonedChildren);
        });
        cloned.game = this.game;
        super.setClonedProperties(cloned);
    }

    revalidate():void{
        for (const b of this._behaviours) b.revalidate();
    }

    getLayer(): Layer {
        return this._layer;
    }

    setLayer(value: Layer):void {
        this._layer = value;
    }

    findChildrenById(id:string):RenderableModel|null{
        if (id===this.id) return this;
        for (let c of this.children) {
            let possibleObject:RenderableModel = c.findChildrenById(id);
            if (possibleObject) return possibleObject;
        }
        return null;
    }


    getWorldRect():Rect{
        if (this._dirty) {
            this.calcWorldRect();
        }
        return this._screenRect;
    }

    protected calcWorldRect():void {
        this._screenRect.set(this.getSrcRect());
        let parent:RenderableModel = this.parent;
        while (parent) {
            this._screenRect.addXY(parent.getSrcRect().point.x,parent.getSrcRect().point.y);
            parent = parent.parent;
        }
    }

    getSrcRect():Rect{
        this._srcRect.setXYWH(
            this.pos.x - this.anchor.x,
            this.pos.y - this.anchor.y,
            this.size.width,
            this.size.height
        );
        return this._srcRect;
    }

    setAnchorToCenter():void {
        this.revalidate();
        if (DEBUG && !(this.size.width && this.size.height))
            throw new DebugError(`can not set anchor to center: width or height of gameObject is not set`);
        this.anchor.setXY(this.size.width/2,this.size.height/2);
    }


    appendChild(c:RenderableModel):void {
        c.parent = this;
        c.setLayer(this.getLayer());
        c.revalidate();
        this.children.push(c);
    }

    addBehaviour(b:BaseAbstractBehaviour):void {
        this._behaviours.push(b);
        b.manage(this);
    }


    prependChild(c:RenderableModel):void {
        c.parent = this;
        c.revalidate();
        this.children.unshift(c);
    }

    setDirty():void {
        this._dirty = true; // todo
        //if (this.parent) this.parent._dirty = true;
    }

    abstract draw():boolean;

    protected beforeRender():void {
        this.game.getRenderer().translate(this.pos.x,this.pos.y);
    }

    protected isNeedAdditionalTransform():boolean{
        return !(this.angle===0 && this.scale.equal(1) && this.angle3d.x===0 && this.angle3d.y===0 && this.angle3d.z===0);
    }

    protected doAdditionalTransform():void {
        const renderer:AbstractRenderer = this.game.getRenderer();
        if (this.angle!==0) renderer.rotateZ(this.angle);
        if (this.angle3d.x!==0) renderer.rotateX(this.angle3d.x);
        if (this.angle3d.y!==0) renderer.rotateY(this.angle3d.y);
        if (this.angle3d.z!==0) renderer.rotateY(this.angle3d.z);
    }

    protected isInViewPort():boolean{
        return MathEx.overlapTest(this.game.camera.getRectScaled(),this.getSrcRect());
    }

    private _getParent():RenderableModel|Layer|undefined{
        return this.parent || this._layer || undefined;
    }

    moveToFront():void {
        if (DEBUG && !this._getParent()) throw new DebugError(`can not move to front: object is detached`);
        let index:number = (this._getParent()).children.indexOf(this);
        if (DEBUG && index===-1)
            throw new DebugError(`can not move to front: object is not belong to current scene`);
        const parentArray:RenderableModel[] = this._getParent().children;
        parentArray.splice(index,1);
        parentArray.push(this);

    }

    moveToBack():void {
        if (DEBUG && !this._getParent()) throw new DebugError(`can not move to back: object is detached`);
        let index:number = this._getParent().children.indexOf(this);
        if (DEBUG && index===-1)
            throw new DebugError(`can not move to front: object is not belong to current scene`);
        const parentArray:RenderableModel[] = this._getParent().children;
        parentArray.splice(index,1);
        parentArray.unshift(this);
    }

    kill():void {

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

        for (let b of this._behaviours) {
            b.destroy();
        }
    }

    render():void {
        //if (this.isInViewPort()) return;
        const renderer:AbstractRenderer = this.game.getRenderer();

        renderer.save();
        this.beforeRender();

        renderer.translate(-this.anchor.x,-this.anchor.y);

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

    update():void {
        for (let c of this.children) {
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


    // tween
    private _tweenDelegate: TweenableDelegate = new TweenableDelegate();

    addTween(t: Tween): void {
        this._tweenDelegate.addTween(t);
    }
    addTweenMovie(tm: TweenMovie):void {
        this._tweenDelegate.addTweenMovie(tm);
    }
    tween(desc: TweenDescription): Tween {
        return this._tweenDelegate.tween(desc);
    }

    // timer
    private _timerDelegate:TimerDelegate = new TimerDelegate();

    setTimeout(callback:Function,interval:number):Timer{
        return this._timerDelegate.setTimeout(callback,interval);
    }

    setInterval(callback:Function,interval:number):Timer{
        return this._timerDelegate.setInterval(callback,interval);
    }

    //eventEmitter
    private _eventEmitterDelegate:EventEmitterDelegate = new EventEmitterDelegate();

    off(eventName: string, callBack: Function): void {
        this._eventEmitterDelegate.off(eventName,callBack);
    }
    on(eventName: string, callBack: Function): Function {
        return this._eventEmitterDelegate.on(eventName,callBack);
    }
    trigger(eventName: string, data?: any): void {
        this._eventEmitterDelegate.trigger(eventName,data);
    }

}