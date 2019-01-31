
import {AbstractRenderer} from "../core/renderer/abstract/abstractRenderer";
import {Resource} from "../core/resources/resource";
import {ArrayEx} from "../declarations";
import {DebugError} from "../debugError";
import {MathEx} from '../core/mathEx'
import {isObjectMatch} from "../core/misc/object";
import {GameObject} from "./impl/gameObject";
import {Point2d} from "../core/geometry/point2d";
import {AbstractFilter} from "../core/renderer/webGl/filters/abstract/abstractFilter";
import {Rect} from "../core/geometry/rect";


export abstract class RenderableModel extends Resource {

    pos:Point2d = new Point2d(0,0,()=>this._dirty=true);
    scale:Point2d = new Point2d(1,1);
    anchor:Point2d = new Point2d(0,0);
    angle:number = 0;
    alpha:number = 1;
    filters: AbstractFilter[] = [];
    blendMode:string;
    parent:RenderableModel;
    children:ArrayEx<RenderableModel> = [] as ArrayEx<RenderableModel>;
    acceptLight:boolean = false;
    fixedToCamera:boolean = false;
    rigid:boolean = false;

    findObject(query:{[key:string]:any}):RenderableModel{
        if (isObjectMatch(this,query)) return this;
        for (let c of this.children) {
            let possibleObject:RenderableModel = c.findObject(query);
            if (possibleObject) return possibleObject;
        }
        return null;
    }

    getRect():Rect{
        this._rect.setXYWH(
            this.pos.x - this.anchor.x,
            this.pos.y - this.anchor.y,
            this.width,
            this.height
        );
        return this._rect;
    }

    setAnchorToCenter(){
        this.revalidate();
        if (DEBUG && !(this.width && this.height))
            throw new DebugError(`can not set anchor to center: width or height of gameObject is not set`);
        this.anchor.setXY(this.width/2,this.height/2);
    }

    onShow(){}

    appendChild(c:RenderableModel){
        c.parent = this;
        this.children.push(c);
        (c as GameObject).onShow();
    }


    prependChild(c:RenderableModel){
        c.parent = this;
        this.children.unshift(c);
        c.onShow();
    }

    _setDirty(){
        this._dirty = true;
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
        if (this['angleY']) this.game.getRenderer()['rotateY'](this['angleY']); // todo!!!
    }

    protected isInViewPort():boolean{
        return MathEx.overlapTest(this.game.camera.getRectScaled(),this.getRect());
    }

    moveToFront(){
        let index = this.parent.children.indexOf(this);
        if (DEBUG && index==-1) throw new DebugError(`can not move to front: gameObject is detached`);
        this.parent.children.splice(index,1);
        this.parent.children.push(this);

    }

    moveToBack(){
        let index = this.parent.children.indexOf(this);
        if (DEBUG && index==-1) throw new DebugError(`can not move to back: gameObject is detached`);
        this.parent.children.splice(index,1);
        this.parent.children.unshift(this);
    }

    kill(){
        this.parent.children.remove(it=>it.id===this.id);
    }

    render(force:boolean = false){
        if (!force && !this.isInViewPort()) return;
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

    update(time:number,delta:number){
        super.update(time,delta);
        for (let c of this.children) {
            if (this._dirty) c._setDirty();
            c.update(time,delta);
        }
    }

}