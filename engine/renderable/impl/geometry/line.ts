
import {Shape} from "@engine/renderable/abstract/shape";
import {ICloneable} from "@engine/core/declarations";
import {Point2d} from "@engine/geometry/point2d";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Game} from "@engine/core/game";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";


export class Line extends Shape implements ICloneable<Line> {

    public borderRadius:number = 0;
    public readonly pointTo:Point2d = new Point2d(0,0,()=>this.onPointChanged());
    public vectorScaleFactor:number = 1;

    private readonly rectangleRepresentation:Rectangle = new Rectangle(this.game);

    constructor(game:Game){
        super(game);
        this.lineWidth = 1;
    }

    public setXYX1Y1(x:number,y:number,x1:number,y1:number){
        this.pos.setXY(x*this.vectorScaleFactor,y*this.vectorScaleFactor);
        this.pointTo.setXY(x1*this.vectorScaleFactor,y1*this.vectorScaleFactor);
        const dx:number = this.pointTo.x - this.pos.x;
        const dy:number = this.pointTo.y - this.pos.y;
        this.pointTo.setXY(dx,dy);
    }

    public clone(): Line {
        const l:Line = new Line(this.game);
        this.setClonedProperties(l);
        return l;
    }

    public draw():void{
        this.game.getRenderer().drawLine(this);
    }

    public translate(){
        super.translate();
        this.game.getRenderer().transformTranslate(0,-this.lineWidth/2);
    }

    public getRectangleRepresentation():Rectangle{
        this.rectangleRepresentation.borderRadius = this.borderRadius;
        super.setClonedProperties(this.rectangleRepresentation);
        return this.rectangleRepresentation;
    }

    protected setClonedProperties(cloned:Line):void{
        cloned.borderRadius = this.borderRadius;
        cloned.pointTo.set(this.pointTo);
        super.setClonedProperties(cloned);
    }


    private onPointChanged(){

        const w:number = Math.abs(this.pointTo.x);
        const h:number = Math.abs(this.pointTo.y);
        const l:number = Math.sqrt(w*w+h*h) + this.lineWidth/2;
        this.size.setWH(w,h+this.lineWidth);
        this.rectangleRepresentation.size.setWH(l,this.lineWidth);
        this.angle = Math.atan2(this.pointTo.y,this.pointTo.x);
        this.transformPoint.setXY(0,this.lineWidth/2);
    }

}