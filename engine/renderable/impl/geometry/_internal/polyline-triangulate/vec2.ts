
export class Vec2 {

    public constructor(public x:number, public y:number) {
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

    public static angle(a:Vec2,b:Vec2):number {
        return Math.acos(Vec2.dot(a, b) / (Vec2.magnitude(a) * Vec2.magnitude(b)));
    }

    public static clone(vec:Vec2):Vec2 {
        return new Vec2(vec.x,vec.y);
    }

}
