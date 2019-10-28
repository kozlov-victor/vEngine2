import {IPoint2d, Point2d} from "@engine/geometry/point2d";
import {DebugError} from "@engine/debug/debugError";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Game} from "@engine/core/game";
import {Optional} from "@engine/core/declarations";
import {BaseModel} from "@engine/renderable/abstract/baseModel";

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
    public readonly anchor:ModelPoint2d = new ModelPoint2d(this);
    public readonly rotationPoint:ModelPoint2d = new ModelPoint2d(this);
    public angle3d:AnglePoint3d = new AnglePoint3d(this,'angle');

    protected _angleVelocity3d:AnglePoint3d = new AnglePoint3d(this,'angleVelocity');
    private _angle:number = 0;

    protected constructor(protected game:Game){
        super(game);
    }



    public abstract revalidate():void;

    public translate():void{
        const renderer = this.game.getRenderer();
        renderer.translate(this.pos.x,this.pos.y);
    }

    public transform():void{
        const renderer = this.game.getRenderer();
        renderer.translate(-this.anchor.x,-this.anchor.y,this.posZ);
        renderer.translate(this.rotationPoint.x,this.rotationPoint.y);
        renderer.scale(this.scale.x,this.scale.y);
        renderer.skewX(this.skew.x);
        renderer.skewY(this.skew.y);
        renderer.rotateZ(this.angle3d.z);
        renderer.rotateX(this.angle3d.x);
        renderer.rotateY(this.angle3d.y);
        renderer.translate(-this.rotationPoint.x,-this.rotationPoint.y);
    }

    protected setClonedProperties(cloned:TransformableModel){
        cloned.pos.set(this.pos);
        cloned.scale.set(this.scale);
        cloned.anchor.set(this.anchor);
        cloned.rotationPoint.set(this.rotationPoint);
        cloned.angle3d = this.angle3d.clone(this);
    }

}