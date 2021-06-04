import {Shape} from "../../abstract/shape";
import {ICloneable} from "@engine/core/declarations";
import {Point2d} from "@engine/geometry/point2d";
import {Game} from "@engine/core/game";

export class Ellipse extends Shape implements ICloneable<Ellipse>, IEllipseProps{

    public override readonly type:string = 'Ellipse';

    get radiusX(): number {
        return this._radiusX;
    }

    set radiusX(value: number) {
        if (this._radiusX===value) return;
        this._radiusX = value;
        this.size.setWH(this._radiusX*2,this._radiusY*2);
        this.center.forceTriggerChange();
    }

    get radiusY(): number {
        return this._radiusY;
    }

    set radiusY(value: number) {
        if (this._radiusY===value) return;
        this._radiusY = value;
        this.size.setWH(this._radiusX*2,this._radiusY*2);
        this.center.forceTriggerChange();
    }

    public readonly center:Point2d = new Point2d();

    public arcAngleFrom:number = 0;
    public arcAngleTo:number = 0;
    public anticlockwise:boolean = false;

    private _radiusX: number;
    private _radiusY: number;

    constructor(game:Game) {
        super(game);
        this.radiusX = 10;
        this.radiusY = 20;
        this.center.observe(()=>{
            this.pos.setXY(this.center.x - this.radiusX,this.center.y - this.radiusY);
        });
        this.pos.observe(()=>{
            this.center.setXY(this.pos.x + this.radiusX,this.pos.y + this.radiusY);
        });
    }

    public draw():void{
        this.game.getRenderer().drawEllipse(this);
    }

    public override update():void {
        super.update();
    }

    public clone():Ellipse {
        const cloned:Ellipse = new Ellipse(this.game);
        this.setClonedProperties(cloned);
        return cloned;
    }

    public override setProps(props:IEllipseProps):void {
        super.setProps(props);
        if (props.center!==undefined) this.center.setXY(props.center.x,props.center.y);
        if (props.arcAngleFrom!==undefined) this.arcAngleFrom=props.arcAngleFrom;
        if (props.arcAngleTo!==undefined) this.arcAngleTo=props.arcAngleTo;
        if (props.anticlockwise!==undefined) this.anticlockwise=props.anticlockwise;
        if (props.radiusX!==undefined) this.radiusX = props.radiusX;
        if (props.radiusY!==undefined) this.radiusY = props.radiusY;
    }

    protected override setClonedProperties(cloned:Ellipse):void {
        cloned.radiusX = this.radiusX;
        cloned.radiusY = this.radiusY;
        cloned.arcAngleFrom = this.arcAngleFrom;
        cloned.arcAngleTo = this.arcAngleTo;
        cloned.anticlockwise = this.anticlockwise;
        super.setClonedProperties(cloned);
    }

    private _getMaxRadius():number{
        return this._radiusX>this._radiusY?this._radiusX:this._radiusY;
    }

}
