
export class Vec2 {

    public constructor(public x:number, public y:number) {
    }

    public static angle(a:Vec2,b:Vec2):number {
        return Math.acos(Vec2.dot(a, b) / (Vec2.magnitude(a) * Vec2.magnitude(b)));
    }

    public static angleTo(a:Vec2,b:Vec2):number{
        return Math.atan2(b.y-a.y,b.x-a.x);
    }

    public static withAngle(vec:Vec2,value:number):Vec2 {
        const len:number = Vec2.magnitude(vec);
        const x = Math.cos(value) * len;
        const y = Math.sin(value) * len;
        return new Vec2(x,y);
    }

    public static normal(v1:Vec2,v2:Vec2):Vec2 {
        const v:Vec2 = Vec2.subtract(v1,v2);
        return Vec2.normalized(v);
    }

    public static distance(a:Vec2,b:Vec2):number {
        return Math.sqrt(Vec2.distanceSquared(a,b));
    }

    public static distanceSquared(a:Vec2, b:Vec2):number {
        const axMinusBx:number = a.x - b.x;
        const ayMinusBy:number = a.y - b.y;
        return axMinusBx*axMinusBx + ayMinusBy*ayMinusBy;
    }

    public static equal(a:Vec2,b:Vec2):boolean {
        return a.x === b.x && a.y === b.y;
    }

    public static multiply(a:Vec2,b:Vec2):Vec2 {
        return new Vec2(a.x * b.x, a.y * b.y);
    }

    public static multiplyByScalar(vec:Vec2,factor:number):Vec2 {
        return new Vec2(vec.x * factor, vec.y * factor);
    }

    public static divide(vec:Vec2,factor:number = 1):Vec2 {
        return new Vec2(vec.x / factor, vec.y / factor);
    }

    public static add(a:Vec2,b:Vec2):Vec2 {
        return new Vec2(a.x + b.x, a.y + b.y);
    }

    public static subtract(a:Vec2,b:Vec2):Vec2 {
        return new Vec2(a.x - b.x, a.y - b.y);
    }

    public static magnitude(vec:Vec2):number {
        return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
    }

    public static withLength(vec:Vec2,len:number):Vec2 {
        const mag = Vec2.magnitude(vec);
        const factor = mag / len;
        return Vec2.divide(vec, factor);
    }

    public static normalized(vec:Vec2):Vec2 {
        return Vec2.withLength(vec, 1);
    }

    public static dot(a:Vec2,b:Vec2):number {
        return a.x * b.x + a.y * b.y;
    }

    public static cross(a:Vec2,b:Vec2):number {
        return a.x * b.y - a.y * b.x;
    }

    public clone():Vec2 {
        return new Vec2(this.x,this.y);
    }

}
