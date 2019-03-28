import {Point2d} from "./point2d";

export class Vec2 extends Point2d {

    constructor(x?:number,y?:number){
        // xyzw stpq rgba
        super(x,y);
    }

    // скалярное произведение
    dotProduct(another:Vec2):number{
        return this.x*another.x + this.y*another.y;
    }

    crossProduct(another:Vec2):number {
        return this.x * another.y - this.y * another.x;
    }

    setXY(x:number,y?:number):Vec2{
        if (y===undefined) { // noinspection JSSuspiciousNameCombination
            y = x;
        }
        this.x = x;
        this.y = y;
        return this;
    }

    addXY(x:number,y:number):Vec2{
        this.x += x;
        this.y += y;
        return this;
    }

    multByScalar(scalar:number,mutateOrigin:boolean = true):Vec2{
        if (mutateOrigin) return new Vec2(this.x*scalar,this.y*scalar);
        this.x*=scalar;
        this.y*=scalar;
        return this;
    }

    divByScalar(scalar:number,mutateOrigin:boolean = true):Vec2{ // todo
        return this.multByScalar(1/scalar,mutateOrigin);
    }

    plus(another:Vec2,mutateOrigin:boolean = false):Vec2{
        if (!mutateOrigin) return new Vec2(this.x+another.x,this.y+another.y);
        this.x+=another.x;
        this.y+=another.y;
        return this;
    }

    minus(another:Vec2,mutateOrigin:boolean = false):Vec2{
        if (!mutateOrigin) return new Vec2(this.x-another.x,this.y-another.y);
        this.x-=another.x;
        this.y-=another.y;
        return this;
    }

    getLength():number {
        return Math.sqrt(this.lengthSquared());
    }

    lengthSquared():number {
        return (this.x * this.x) + (this.y * this.y);
    }

    normalize():Vec2 {
        let length = this.getLength();
        this.x = this.x / length;
        this.y = this.y / length;
        return this;
    }

    setLength(value:number) {
        let _angle = this.getAngle();
        this.x = Math.cos(_angle) * value;
        this.y = Math.sin(_angle) * value;
    };

    getAngle():number {
        return Math.atan2(this.y, this.x);
    };

    getAngleBetween(that:Vec2){
        return Math.acos(
            (this.x*that.x + this.y*that.y)/
            this.getLength()*that.getLength()
        )
    }

    setAngle(value:number) {
        let len = this.getLength();
        this.x = Math.cos(value) * len;
        this.y = Math.sin(value) * len;
    };

    clone() {
        return new Vec2(this.x, this.y);
    }

    static angleBetween(v1:Vec2, v2:Vec2) {
        v1 = v1.clone().normalize();
        v2 = v2.clone().normalize();
        return Math.acos(v1.dotProduct(v2));
    };

    static normalBetween(v1:Vec2,v2:Vec2){
        let v = v1.minus(v2);
        return v.normalize();
    }

    static distance(a:Vec2,b:Vec2) {
        return Math.sqrt(Vec2.distanceSquared(a,b));
    }

    static distanceSquared(a:Vec2, b:Vec2) {
        return (a.x - b.x)*(a.x - b.x) + (a.y - b.y)*((a.y - b.y));
    }

}