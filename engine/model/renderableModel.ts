import {AbstractRenderer} from "../core/renderer/abstract/abstractRenderer";
import {Resource} from "../core/resources/resource";
import {IMPORT_DEPENDS, Eventemittable, Revalidatable, Tweenable, Cloneable} from "../declarations";
import {DebugError} from "../debugError";
import {MathEx} from "../core/mathEx";
import {isObjectMatch} from "../core/misc/object";
import {Point2d} from "../core/geometry/point2d";
import {AbstractFilter} from "../core/renderer/webGl/filters/abstract/abstractFilter";
import {Rect} from "../core/geometry/rect";
import {Game} from "@engine/core/game";
import {Tween, TweenDescription} from "@engine/core/tween";
import {TweenMovie} from "@engine/core/tweenMovie";
import {Timer} from "@engine/core/timer";
import {RigidShape} from "@engine/core/physics/rigidShapes";
import {Layer} from "@engine/model/impl/layer";
import {BaseAbstractBehaviour} from "@engine/behaviour/abstract/baseAbstractBehaviour";
import {EventEmitter} from "@engine/core/misc/eventEmitter";
import {MOUSE_EVENTS} from "@engine/core/control/mouse/mouseEvents";


export abstract class RenderableModel extends Resource implements Revalidatable, Tweenable, Eventemittable {

    readonly type:string;
    id:string;
    width:number = 0;
    height:number = 0;
    readonly pos:Point2d = new Point2d(0,0,()=>this._dirty=true);
    readonly scale:Point2d = new Point2d(1,1);
    readonly anchor:Point2d = new Point2d(0,0);
    angle:number = 0;
    alpha:number = 1;
    filters: AbstractFilter[] = [];
    blendMode:string; // todo
    parent:RenderableModel;
    children:RenderableModel[] = [];
    acceptLight:boolean = false;
    rigidBody:RigidShape;
    velocity = new Point2d(0,0);

    protected _tweens:Tween[] = []; // todo repeated with scene
    protected _tweenMovies:TweenMovie[] = [];
    protected _timers:Timer[] = [];

    protected _dirty = true;
    private   _layer:Layer;

    protected _rect:Rect = new Rect();
    protected _screenRect = new Rect();
    protected _behaviours:BaseAbstractBehaviour[] = [];

    protected constructor(protected game:Game){
        super();
        if (DEBUG && !game) throw new DebugError(
            `can not create model '${this.type}': game instance not passed to model constructor`
        );
    }

    protected setClonedProperties(cloned:RenderableModel) {
        cloned.width = this.width;
        cloned.height = this.height;
        cloned.pos.set(this.pos);
        cloned.scale.set(this.scale);
        cloned.anchor.set(this.anchor);
        cloned.angle = this.angle;
        cloned.alpha = this.alpha;
        cloned.filters = [...this.filters];
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
        cloned.acceptLight = this.acceptLight;
        cloned.game = this.game;
        super.setClonedProperties(cloned);
    }

    revalidate(){}

    getLayer(): Layer {
        return this._layer;
    }

    setLayer(value: Layer) {
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


    getScreenRect():Rect{
        if (this._dirty) {
            this.calcScreenRect();
        }
        return this._screenRect;
    }

    protected calcScreenRect(){
        this._screenRect.set(this._rect);
        let parent:RenderableModel = this.parent;
        while (parent) {
            this._screenRect.addXY(parent.getRect().x,parent.getRect().y);
            parent = parent.parent;
        }
    }

    getRect():Rect{
        this._rect.setXYWH(
            this.pos.x - this.anchor.x,
            this.pos.y - this.anchor.y,
            this.width,
            this.height
        );
        if (this._dirty) {
            this.calcScreenRect();
        }
        return this._rect;
    }

    setAnchorToCenter(){
        this.revalidate();
        if (DEBUG && !(this.width && this.height))
            throw new DebugError(`can not set anchor to center: width or height of gameObject is not set`);
        this.anchor.setXY(this.width/2,this.height/2);
    }


    appendChild(c:RenderableModel){
        c.parent = this;
        c.setLayer(this.getLayer());
        c.revalidate();
        this.children.push(c);
    }

    addBehaviour(b:BaseAbstractBehaviour){
        this._behaviours.push(b);
        b.manage(this);
    }


    prependChild(c:RenderableModel){
        c.parent = this;
        c.revalidate();
        this.children.unshift(c);
    }

    setDirty(){
        this._dirty = true; // todo
        //if (this.parent) this.parent._dirty = true;
    }

    abstract draw():boolean;

    protected beforeRender(){
        this.game.getRenderer().translate(this.pos.x,this.pos.y);
    }

    protected isNeedAdditionalTransform():boolean{
        return !(this.angle===0 && this.scale.equal(1));
    }

    protected doAdditionalTransform(){
        this.game.getRenderer().rotateZ(this.angle);
        // todo
        //if (this['angleY']) this.game.getRenderer()['rotateY'](this['angleY']); // todo!!!
    }

    protected isInViewPort():boolean{
        return MathEx.overlapTest(this.game.camera.getRectScaled(),this.getRect());
    }

    private _getParent():RenderableModel|Layer|undefined{
        return this.parent || this._layer || undefined;
    }

    moveToFront(){
        if (DEBUG && !this._getParent()) throw new DebugError(`can not move to front: object is detached`);
        let index:number = (this._getParent()).children.indexOf(this);
        if (DEBUG && index===-1)
            throw new DebugError(`can not move to front: object is not belong to current scene`);
        const parentArray:RenderableModel[] = this._getParent().children;
        parentArray.splice(index,1);
        parentArray.push(this);

    }

    moveToBack(){
        if (DEBUG && !this._getParent()) throw new DebugError(`can not move to back: object is detached`);
        let index:number = this._getParent().children.indexOf(this);
        if (DEBUG && index===-1)
            throw new DebugError(`can not move to front: object is not belong to current scene`);
        const parentArray:RenderableModel[] = this._getParent().children;
        parentArray.splice(index,1);
        parentArray.unshift(this);
    }

    kill() {

        if (DEBUG && !this._getParent()) throw new DebugError(`can not kill object: gameObject is detached`);

        const parentArray:RenderableModel[] = this._getParent().children;
        let index:number = parentArray.indexOf(this);
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

    render(){
        //if (this.isInViewPort()) return;
        let renderer:AbstractRenderer = this.game.getRenderer();

        renderer.save();
        this.beforeRender();

        renderer.translate(-this.anchor.x,-this.anchor.y);

        if (this.isNeedAdditionalTransform()) {
            let dx = this.width/2,dy = this.height/2;
            renderer.translate(dx,dy);
            renderer.scale(this.scale.x,this.scale.y);
            this.doAdditionalTransform();
            renderer.translate(-dx, -dy);
        }

        let drawResult:boolean = this.draw();

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

    update(){
        for (let c of this.children) {
            if (this._dirty) c.setDirty();
            c.update();
        }

        const time:number = this.game.getTime();
        const delta:number = this.game.getDeltaTime();

        this._tweens.forEach((t:Tween, index:number)=>{
            t.update();
            if (t.isCompleted()) this._tweens.splice(index,1);
        });
        this._tweenMovies.forEach((t:TweenMovie,index:number)=>{
            t.update();
            if (t.isCompleted()) this._tweenMovies.splice(index,1);
        });
        this._timers.forEach((t:Timer)=>{
            t.onUpdate();
        });

        for (let i=0,max = this._behaviours.length;i<max;i++) {
            if (this._behaviours[i].onUpdate) this._behaviours[i].onUpdate(time, delta);
        }

        if (this.rigidBody!==undefined) {
            this.rigidBody.update();
            // todo
            // this.pos.x = ~~(this.rigidBody.mCenter.x - this.rigidBody['mWidth']/2); // todo
            // this.pos.y = ~~(this.rigidBody.mCenter.y - this.rigidBody['mHeight']/2);
            this.angle = this.rigidBody.mAngle;
        } else {
            if (this.velocity.x) this.pos.x += this.velocity.x * delta / 1000;
            if (this.velocity.y) this.pos.y += this.velocity.y * delta / 1000;
        }

        if (this.children.length>0) {
            for(let i=0;i<this.children.length;i++) {
                this.children[i].update();
            }
        }

    }


    //#MACROS_BODY_BEGIN = ./engine/macroses/tweenableMacros
    addTween(t: Tween): void {}
    addTweenMovie(tm: TweenMovie) {}
    tween(desc: TweenDescription): Tween {return undefined;}
    //#MACROS_BODY_END

    //#MACROS_BODY_BEGIN = ./engine/macroses/timerMacros
    setTimer(callback:Function,interval:number):Timer{return undefined;}
    //#MACROS_BODY_END


    //#MACROS_BODY_BEGIN = ./engine/macroses/eventEmitterMacros
    off(eventName: string, callBack: Function): void {}
    on(eventName: string, callBack: Function): void {
        IMPORT_DEPENDS(EventEmitter,MOUSE_EVENTS)
    }
    trigger(eventName: string, data?: any): void {}
    //#MACROS_BODY_END

}