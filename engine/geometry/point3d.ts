import {IPoint2d, Point2d} from "@engine/geometry/point2d";
import {ICloneable} from "@engine/core/declarations";
import {DebugError} from "@engine/debug/debugError";
import {isNotNumber} from "@engine/misc/object";

export interface IPoint3d extends IPoint2d{
    readonly z: number;
}

export class Point3d extends Point2d implements ICloneable<Point3d>, IPoint3d{

    private _z:number = 0;

    get z(): number {
        return this._z;
    }

    set z(value: number) {
        this.setZ(value);
    }

    // noinspection JSSuspiciousNameCombination
    constructor(x:number = 0,y:number=x,z:number=y,onChangedFn?:()=>void) {
        super(x,y,onChangedFn);
        this.setXYZ(x,y,z);
    }


    // noinspection JSSuspiciousNameCombination
    public setXYZ(x:number,y:number = x,z:number = y):this{
        this.x = x;
        this.y = y;
        if (DEBUG && (isNotNumber(z))) {
            console.trace();
            throw new DebugError(`Point3d: wrong numeric arguments ${x},${y},${z}`);
        }
        const changed:boolean = this._z!==z;
        if (changed) {
            this._z = z;
            this._arr[2] = z;
            this.triggerObservable();
        }
        return this;
    }

    // noinspection JSSuspiciousNameCombination
    public addXYZ(x:number,y:number = x,z:number = y):this {
        this.setXYZ(this.x+x,this.y+y,this.z+z);
        return this;
    }

    public setZ(z:number):this{
        this.setXYZ(this.x,this.y,z);
        return this;
    }

    public override clone(): Point3d {
        return new Point3d(this.x,this.y,this._z);
    }

    public override toJSON():IPoint3d{
        return {x:this.x,y:this.y,z:this._z};
    }

}
