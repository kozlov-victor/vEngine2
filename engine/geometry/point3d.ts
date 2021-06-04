import {Point2d} from "@engine/geometry/point2d";
import {ICloneable} from "@engine/core/declarations";
import {DebugError} from "@engine/debug/debugError";

export interface IPoint3d {
    readonly x:number;
    readonly y: number;
    readonly z: number;
}

export class Point3d extends Point2d implements ICloneable<Point3d>, IPoint3d{

    private _arrCache:Float32Array = new Float32Array([0,0,0]);

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
        if (DEBUG && (Number.isNaN(z))) {
            // tslint:disable-next-line:no-console
            console.trace();
            throw new DebugError(`Point3d: wrong numeric arguments ${x},${y},${z}`);
        }
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

    public override clone(): Point3d {
        return new Point3d(this.x,this.y,this._z);
    }

    public override toJSON():IPoint3d{
        return {x:this.x,y:this.y,z:this._z};
    }

    public override toArray():Float32Array{
        this._arrCache[0] = this.x;
        this._arrCache[1] = this.y;
        this._arrCache[2] = this._z;
        return this._arrCache;
    }

}
