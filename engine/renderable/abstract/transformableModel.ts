import {Point2d} from "@engine/geometry/point2d";
import {DebugError} from "@engine/debug/debugError";
import {Game} from "@engine/core/game";
import {BaseModel} from "@engine/renderable/abstract/baseModel";
import {AbstractRenderer} from "@engine/renderer/abstract/abstractRenderer";

class AnglePoint3d {
    public x:number = 0;
    public y:number = 0;

    private _z:number = 0;

    constructor(private m:TransformableModel,private zProperty:'angle'|'angleVelocity'){}

    set z(val:number) {
        this.m[this.zProperty] = val;
    }

    get z():number{
        return this._z;
    }

    public _setZSilently(val:number){
        this._z = val;
    }

    public clone(m:TransformableModel):AnglePoint3d{
        const a:AnglePoint3d = new AnglePoint3d(m,this.zProperty);
        a.x = this.x;
        a.y = this.y;
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

export abstract class TransformableModel extends BaseModel {

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
    }



    public abstract revalidate():void;

    public translate():void{
        const renderer:AbstractRenderer = this.game.getRenderer();
        renderer.transformTranslate(this.pos.x,this.pos.y);
    }

    public transform():void{
        const renderer:AbstractRenderer = this.game.getRenderer();
        renderer.transformTranslate(-this.anchorPoint.x,-this.anchorPoint.y,this.posZ);
        renderer.transformTranslate(this.transformPoint.x,this.transformPoint.y);
        const [x,y,z] = this.scale.toArray();
        renderer.transformScale(x,y,z);
        renderer.transformSkewX(this.skew.x);
        renderer.transformSkewY(this.skew.y);
        renderer.transformRotateZ(this.angle3d.z);
        renderer.transformRotateX(this.angle3d.x);
        renderer.transformRotateY(this.angle3d.y);
        renderer.transformTranslate(-this.transformPoint.x,-this.transformPoint.y);
        if (this.billBoard) renderer.transformRotationReset();
    }

    protected setClonedProperties(cloned:TransformableModel){
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
