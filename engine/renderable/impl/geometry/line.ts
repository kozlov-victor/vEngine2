import {Shape} from "@engine/renderable/abstract/shape";
import {ICloneable} from "@engine/core/declarations";
import {Point2d} from "@engine/geometry/point2d";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Game} from "@engine/core/game";


export class Line extends Shape implements ICloneable<Line>, ILineProps {

    public borderRadius:number = 0;
    declare public fillColor:never;
    public readonly pointTo:Point2d = new Point2d(0,0,()=>this.onPointChanged());

    private readonly _rectangleRepresentation:Rectangle = new Rectangle(this.game);

    constructor(game:Game){
        super(game);
        this.lineWidth = 1;
        this._rectangleRepresentation.lineWidth = 0;
    }

    public setXYX1Y1(x:number,y:number,x1:number,y1:number):void{
        this.pos.setXY(x,y);
        const dx:number = x1 - this.pos.x;
        const dy:number = y1 - this.pos.y;
        this.pointTo.setXY(dx,dy);
    }

    public override set lineWidth(value: number) {
        this._lineWidth = value;
        this.onPointChanged();
    }

    public override get lineWidth(): number {
        return this._lineWidth;
    }

    public clone(): Line {
        const l:Line = new Line(this.game);
        this.setClonedProperties(l);
        return l;
    }

    public draw():void{
        this.game.getRenderer().drawLine(this);
    }

    public override translate():void{
        super.translate();
        this.game.getRenderer().transformTranslate(0,-this.lineWidth/2);
    }

    public getRectangleRepresentation():Rectangle{
        this._rectangleRepresentation.borderRadius = this.borderRadius;
        this._rectangleRepresentation.fillColor = this.color;
        return this._rectangleRepresentation;
    }

    public override setProps(props:ILineProps):void {
        super.setProps(props);
        this.setXYX1Y1(props.pos?.x??0,props.pos?.y??0,props.pointTo.x,props.pointTo.y);
        if (props.borderRadius) this.borderRadius = props.borderRadius;
    }

    protected override setClonedProperties(cloned:Line):void{
        cloned.borderRadius = this.borderRadius;
        cloned.pointTo.set(this.pointTo);
        super.setClonedProperties(cloned);
    }


    private onPointChanged():void{
        const w:number = Math.abs(this.pointTo.x);
        const h:number = Math.abs(this.pointTo.y);
        const l:number = Math.sqrt(w*w+h*h) + this.lineWidth/2;
        this.size.setWH(w,h+this.lineWidth);
        // noinspection JSSuspiciousNameCombination
        this._rectangleRepresentation.size.setWH(l,this.lineWidth);
        this.angle = Math.atan2(this.pointTo.y,this.pointTo.x);
        this.transformPoint.setXY(0,this.lineWidth/2);
    }

}
