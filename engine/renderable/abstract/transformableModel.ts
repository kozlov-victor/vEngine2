import {Point2d} from "@engine/geometry/point2d";
import {DebugError} from "@engine/debug/debugError";
import {Game} from "@engine/core/game";
import {BaseModel} from "@engine/core/baseModel";
import {Mat4} from "@engine/misc/math/mat4";
import {ITransformable} from "@engine/core/declarations";
import {ObservableEntity} from "@engine/geometry/abstract/observableEntity";
import {IPoint3d, Point3d} from "@engine/geometry/point3d";
import {Vec4} from "@engine/geometry/vec4";
import {getScreenCoords} from "@engine/renderable/_helper/getScreenCoords";
import {IRealNode} from "@engine/renderable/tsx/_genetic/realNode";
import Mat16Holder = Mat4.Mat16Holder;

class AnglePoint3d extends ObservableEntity implements IPoint3d {

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

    public setXYZ(x:number,y:number,z:number):void {
        this.x = x;
        this.y = y;
        this.z = z;
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

    public readonly worldTransformMatrix = new Mat16Holder();
    public readonly modelViewMatrix = new Mat16Holder();
    public worldTransformDirty = true;

    public readonly _children:TransformableModel[] = [];

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

    public readonly scale = new Point3d(1,1,1);
    public readonly skew = new Point2d(0,0);
    public readonly anchorPoint = new ModelPoint2d(this);
    public readonly transformPoint = new ModelPoint2d(this);
    public readonly angle3d = new AnglePoint3d(this,'angle');
    public billBoard = false;

    protected _angleVelocity3d = new AnglePoint3d(this,'angleVelocity');

    private _angle = 0;

    protected constructor(game:Game){
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

    public _translate():void{
        const renderer = this.game.getRenderer();
        renderer.transformTranslate(
            this.pos.x-this.anchorPoint.x+this.transformPoint.x,
            this.pos.y-this.anchorPoint.y+this.transformPoint.y,
            this.pos.z
        );
    }

    public _transform():void{
        const renderer = this.game.getRenderer();
        renderer.transformRotateX(this.angle3d.x);
        renderer.transformRotateY(this.angle3d.y);
        renderer.transformRotateZ(this.angle3d.z);
        const scaleArr = this.scale.toArray();
        renderer.transformScale(scaleArr[0],scaleArr[1],scaleArr[2]);
        renderer.transformSkewX(this.skew.x);
        renderer.transformSkewY(this.skew.y);
        renderer.transformTranslate(-this.transformPoint.x,-this.transformPoint.y,0);
        if (this.billBoard) renderer.transformRotationReset();
    }

    public setProps(props:ITransformableProps&IPositionableProps,parent:IRealNode):void{
        if (props.scale!==undefined) this.scale.setFrom(props.scale);
        if (props.anchorPoint!==undefined) this.anchorPoint.setFrom(props.anchorPoint);
        if (props.transformPoint!==undefined) {
            if (props.transformPoint==='center') {
                this.transformPoint.setToCenter();
            } else {
                this.transformPoint.setFrom(props.transformPoint);
            }
        }
    }

    public getScreenCoords():[Vec4.VEC4,Vec4.VEC4,Vec4.VEC4,Vec4.VEC4] {
        return getScreenCoords(this);
    }

    protected setClonedProperties(cloned:TransformableModel):void{
        cloned.angle = this.angle;
        cloned.angleVelocity = this.angleVelocity;
        cloned.pos.setFrom(this.pos);
        cloned.scale.setFrom(this.scale);
        cloned.anchorPoint.setFrom(this.anchorPoint);
        cloned.skew.setFrom(this.skew);
        cloned.transformPoint.setFrom(this.transformPoint);
        const angle3dCloned = this.angle3d.clone(this);
        cloned.angle3d.x = angle3dCloned.x;
        cloned.angle3d.y = angle3dCloned.y;
        cloned.angle3d.z = angle3dCloned.z;
    }

}
