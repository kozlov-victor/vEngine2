import {Point2d} from "@engine/geometry/point2d";
import {ICloneable} from "@engine/core/declarations";

export interface IPoint3d {
    readonly x:number;
    readonly y: number;
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
    constructor(x:number,y:number=x,z:number=y,onChangedFn?:()=>void) {
        super(x,y,onChangedFn);
        this.setXYZ(x,y,z);
    }


    // noinspection JSSuspiciousNameCombination
    public setXYZ(x:number,y:number = x,z:number = y):this{
        this.x = x;
        this.y = y;
        const changed:boolean = this._z!==z;
        if (changed) {
            this._z = z;
            this.triggerObservable();
        }
        return this;
    }

    public setZ(z:number):this{
        this.setXYZ(this.x,this.y,z);
        return this;
    }

    public clone(): Point3d {
        return new Point3d(this.x,this.y,this._z);
    }

    public toArray():number[]{
        const arr:number[] = super.toArray();
        arr[2] = this._z;
        return arr;
    }

}
