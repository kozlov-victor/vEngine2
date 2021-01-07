import {Point2d} from "@engine/geometry/point2d";
import {DebugError} from "@engine/debug/debugError";
import {Game} from "@engine/core/game";
import {BaseModel} from "@engine/core/baseModel";
import {AbstractRenderer} from "@engine/renderer/abstract/abstractRenderer";
import {mat4} from "@engine/geometry/mat4";
import Mat16Holder = mat4.Mat16Holder;
import {ITransformable} from "@engine/core/declarations";
import {ObservableEntity} from "@engine/geometry/abstract/observableEntity";

class AnglePoint3d extends ObservableEntity{

    private _x:number = 0;
    private _y:number = 0;
    private _z:number = 0;

    constructor(private m:TransformableModel,private zProperty:'angle'|'angleVelocity'){
        super();
    }

    set z(val:number) {
        if (val!==this.m[this.zProperty]) {
            this.m[this.zProperty] = val;
            this.triggerObservable();
        }
    }

    get z():number{
        return this._z;
    }

    get x(): number {
        return this._x;
    }

    set x(value: number) {
        if (this._x!==value) {
            this._x = value;
            this.triggerObservable();
        }

    }

    get y(): number {
        return this._y;
    }

    set y(value: number) {
        if (this._y!==value) {
            this._y = value;
            this.triggerObservable();
        }

    }

    public _setZSilently(val:number):void{
        this._z = val;
    }

    public clone(m:TransformableModel):AnglePoint3d{
        const a:AnglePoint3d = new AnglePoint3d(m,this.zProperty);
        a._x = this._x;
        a._y = this._y;
        a.z = this.z;
        return a;
    }

}

class ModelPoint2d extends Point2d {

    constructor(private model:TransformableModel){
        super();
    }

    public setToCenter():void {
        this.model.revalidate();
        if (DEBUG && !(this.model.size.width && this.model.size.height))
            throw new DebugError(`can not set anchor to center: width or height of transformable object is not set`);
        this.setXY(this.model.size.width/2,this.model.size.height/2);
    }

}

export abstract class TransformableModel extends BaseModel implements ITransformable, ITransformableProps, IPositionableProps {

    public readonly worldTransformMatrix:Mat16Holder = new Mat16Holder();
    public readonly modelViewProjectionMatrix:Mat16Holder = new Mat16Holder();
    public worldTransformDirty:boolean = true;

    public readonly children:readonly TransformableModel[] = [];

    get angle():number{
        return this._angle;
    }

    set angle(val:number){
        if (this._angle===val) return;
        this.worldTransformDirty = true;
        this._angle = val;
        this.angle3d._setZSilently(val);
    }

    get angleVelocity():number{
        return this._angleVelocity3d.z;
    }

    set angleVelocity(val:number){
        this._angleVelocity3d._setZSilently(val);
    }

    public readonly scale:Point2d = new Point2d(1,1);
    public readonly skew:Point2d = new Point2d(0,0);
    public readonly anchorPoint:ModelPoint2d = new ModelPoint2d(this);
    public readonly transformPoint:ModelPoint2d = new ModelPoint2d(this);
    public readonly angle3d:AnglePoint3d = new AnglePoint3d(this,'angle');
    public billBoard:boolean = false;

    protected _angleVelocity3d:AnglePoint3d = new AnglePoint3d(this,'angleVelocity');

    private _angle:number = 0;

    protected constructor(protected game:Game){
        super(game);
        const observer = ()=>this.worldTransformDirty = true;
        this.pos.observe(observer);
        this.size.observe(observer);
        this.scale.observe(observer);
        this.skew.observe(observer);
        this.transformPoint.observe(observer);
        this.anchorPoint.observe(observer);
        this.angle3d.observe(observer);
    }

    public abstract revalidate():void;

    public translate():void{
        const renderer:AbstractRenderer = this.game.getRenderer();
        renderer.transformTranslate(this.pos.x,this.pos.y,this.pos.z);
    }

    public transform():void{
        const renderer:AbstractRenderer = this.game.getRenderer();
        renderer.transformTranslate(-this.anchorPoint.x,-this.anchorPoint.y);
        renderer.transformTranslate(this.transformPoint.x,this.transformPoint.y);
        renderer.transformRotateZ(this.angle3d.z);
        renderer.transformRotateX(this.angle3d.x);
        renderer.transformRotateY(this.angle3d.y);
        const [x,y,z] = this.scale.toArray();
        renderer.transformScale(x,y,z);
        renderer.transformSkewX(this.skew.x);
        renderer.transformSkewY(this.skew.y);
        renderer.transformTranslate(-this.transformPoint.x,-this.transformPoint.y);
        if (this.billBoard) renderer.transformRotationReset();
    }

    public setProps(props:ITransformableProps&IPositionableProps):void{
        if (props.pos!==undefined) this.pos.set(props.pos);
        if (props.size!==undefined) this.size.set(props.size);
        if (props.scale!==undefined) this.scale.set(props.scale);
    }

    protected setClonedProperties(cloned:TransformableModel):void{
        cloned.angle = this.angle;
        cloned.angleVelocity = this.angleVelocity;
        cloned.pos.set(this.pos);
        cloned.scale.set(this.scale);
        cloned.anchorPoint.set(this.anchorPoint);
        cloned.skew.set(this.skew);
        cloned.transformPoint.set(this.transformPoint);
        const angle3dCloned:AnglePoint3d = this.angle3d.clone(this);
        cloned.angle3d.x = angle3dCloned.x;
        cloned.angle3d.y = angle3dCloned.y;
        cloned.angle3d.z = angle3dCloned.z;
    }

}
