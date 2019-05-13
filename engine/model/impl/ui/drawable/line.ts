
import {Shape} from "@engine/model/impl/ui/generic/shape";
import {Cloneable} from "@engine/declarations";
import {Point2d} from "@engine/geometry/point2d";
import {Rectangle} from "@engine/model/impl/ui/drawable/rectangle";
import {Game} from "@engine/game";
import {PolyLine} from "@engine/model/impl/ui/drawable/polyLine";


export class Line extends Shape implements Cloneable<Line> {

    private readonly rectangleRepresentation:Rectangle = new Rectangle(this.game);

    public borderRadius:number = 0;
    public readonly pointTo:Point2d = new Point2d(0,0,()=>this.onPointChanged());
    vectorScaleFactor:number = 1;

    constructor(game:Game){
        super(game);
        this.lineWidth = 1;
    }

    setXYX1Y1(x:number,y:number,x1:number,y1:number){
        this.pos.setXY(x*this.vectorScaleFactor,y*this.vectorScaleFactor);
        this.pointTo.setXY(x1*this.vectorScaleFactor,y1*this.vectorScaleFactor);
        const dx:number = this.pointTo.x - this.pos.x;
        const dy:number = this.pointTo.y - this.pos.y;
        this.pointTo.setXY(dx,dy);
    }


    private onPointChanged(){

        const x:number = this.pos.x;
        const y:number = this.pos.y;
        const x1:number = this.pointTo.x;
        const y1:number = this.pointTo.y;

        const abs:(x:number)=>number = Math.abs;
        // if (x1<x) {
        //     this.pointTo.silent(true);
        //     this.pos.x = x1;
        //     this.pointTo.x = abs(abs(x)-abs(x1));
        //     this.pointTo.silent(false);
        // }
        // if (y1<y) {
        //     this.pointTo.silent(true);
        //     this.pos.y = y1;
        //     this.pointTo.y = abs(abs(y)-abs(y1));
        //     this.pointTo.silent(false);
        // }

        const w:number = Math.abs(this.pointTo.x);
        const h:number = Math.abs(this.pointTo.y);
        const l:number = Math.sqrt(w*w+h*h) + this.lineWidth/2;
        this.size.setWH(w,h+this.lineWidth);
        this.rectangleRepresentation.size.setWH(l,this.lineWidth);
        this.angle = Math.atan2(this.pointTo.y,this.pointTo.x);
        this.rotationPoint.setXY(0,this.lineWidth/2);
    }

    protected setClonedProperties(cloned:Line):void{
        cloned.borderRadius = this.borderRadius;
        cloned.pointTo.set(this.pointTo);
        super.setClonedProperties(cloned);
    }

    clone(): Line {
        const l:Line = new Line(this.game);
        this.setClonedProperties(l);
        return l;
    }

    draw():boolean{
        this.game.getRenderer().drawLine(this);
        return true;
    }

    beforeRender(){
        super.beforeRender();
        this.game.getRenderer().translate(0,-this.lineWidth/2);
    }

    getRectangleRepresentation():Rectangle{
        this.rectangleRepresentation.borderRadius = this.borderRadius;
        super.setClonedProperties(this.rectangleRepresentation);
        return this.rectangleRepresentation;
    }

}