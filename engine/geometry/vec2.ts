import {Point2d} from "./point2d";

export class Vec2 extends Point2d {




    public static angleBetween(v1:Vec2, v2:Vec2):number {
        v1 = v1.clone().normalize();
        v2 = v2.clone().normalize();
        return Math.acos(v1.dotProduct(v2));
    }

    public static normalBetween(v1:Vec2,v2:Vec2):Vec2 {
        const v:Vec2 = v1.minus(v2);
        return v.normalize();
    }

    public static distance(a:Vec2,b:Vec2):number {
        return Math.sqrt(Vec2.distanceSquared(a,b));
    }

    public static distanceSquared(a:Vec2, b:Vec2):number {
        const axMinusBx:number = a.x - b.x;
        const ayMinusBy:number = a.y - b.y;
        return axMinusBx*axMinusBx + ayMinusBy*ayMinusBy;
    }

    constructor(x:number = 0,y:number = 0){
        // xyzw stpq rgba
        super(x,y);
    }


    // скалярное произведение
    public dotProduct(another:Vec2):number{
        return this.x*another.x + this.y*another.y;
    }

    public crossProduct(another:Vec2):number {
        return this.x * another.y - this.y * another.x;
    }

    public multByScalar(scalar:number,mutateOrigin:boolean = true):Vec2{
        if (mutateOrigin) return new Vec2(this.x*scalar,this.y*scalar);
        this.x*=scalar;
        this.y*=scalar;
        return this;
    }

    public divByScalar(scalar:number,mutateOrigin:boolean = true):Vec2{
        return this.multByScalar(1/scalar,mutateOrigin);
    }

    public plus(another:Vec2,mutateOrigin:boolean = false):Vec2{
        if (!mutateOrigin) return new Vec2(this.x+another.x,this.y+another.y);
        this.x+=another.x;
        this.y+=another.y;
        return this;
    }

    public minus(another:Vec2,mutateOrigin:boolean = false):Vec2{
        if (!mutateOrigin) return new Vec2(this.x-another.x,this.y-another.y);
        this.x-=another.x;
        this.y-=another.y;
        return this;
    }

    public getLength():number {
        return Math.sqrt(this.getLengthSquared());
    }

    public getLengthSquared():number {
        return (this.x * this.x) + (this.y * this.y);
    }

    public normalize():Vec2 {
        const length:number = this.getLength();
        this.x = this.x / length;
        this.y = this.y / length;
        return this;
    }

    public setLength(value:number) {
        const angle:number = this.getAngle();
        this.x = Math.cos(angle) * value;
        this.y = Math.sin(angle) * value;
    }
    public getAngle():number {
        return Math.atan2(this.y, this.x);
    }
    public getAngleBetween(that:Vec2):number{
        return Math.acos(
            (this.x*that.x + this.y*that.y)/
            this.getLength()*that.getLength()
        );
    }

    public getAngleTo(that:Vec2):number{
        return Math.atan2(that.y-this.y,that.x-this.x);
    }

    public setAngle(value:number):void {
        const len:number = this.getLength();
        this.x = Math.cos(value) * len;
        this.y = Math.sin(value) * len;
    }
    public clone():Vec2 {
        return new Vec2(this.x, this.y);
    }

}