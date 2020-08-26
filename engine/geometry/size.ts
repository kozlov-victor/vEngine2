import {ObjectPool} from "../misc/objectPool";
import {ObservableEntity} from "@engine/geometry/abstract/observableEntity";
import {DebugError} from "@engine/debug/debugError";
import {ICloneable} from "@engine/core/declarations";

export interface ISize {
    width: number;
    height: number;
}

export class Size extends ObservableEntity implements ICloneable<ISize>{

    set width(val:number) {
        if (DEBUG && Number.isNaN(val)) {
            console.trace();
            throw new DebugError(`Size: wrong numeric argument  ${val}`);
        }
        const changed:boolean = this._width!==val;
        if (changed) {
            this._width = val;
            this.triggerObservable();
        }
    }

    get width(): number {
        return this._width;
    }

    set height(val:number) {
        const changed:boolean = this._height!==val;
        if (changed) {
            this._height = val;
            this.triggerObservable();
        }
    }

    get height(): number {
        return this._height;
    }

    public static fromPool():Size {
        return Size.rectPool.getFreeObject()!;
    }

    private static rectPool:ObjectPool<Size> = new ObjectPool<Size>(Size);

    private _width:number;
    private _height:number;

    private _arr:[number,number] = [0,0];

    constructor(width:number = 0,height:number = 0,onChangedFn?:()=>void){
        super();
        if (onChangedFn) this.addOnChangeListener(onChangedFn);
        this.setWH(width,height);
    }


    public setW(width:number):Size{
        this.setWH(width,this._height);
        return this;
    }
    public setH(height:number):Size{
        this.setWH(this._width,height);
        return this;
    }

    // noinspection JSSuspiciousNameCombination
    public setWH(width:number,height:number = width):Size{
        const changed:boolean = this._width!==width || this._height!==height;
        if (changed) {
            this._width = width;
            this._height = height;
            this.triggerObservable();
        }
        return this;
    }

    // noinspection JSSuspiciousNameCombination
    public addWH(width:number,height:number = width):Size{
        this.setWH(this.width+width,this.height+height);
        return this;
    }

    public set(another:ISize):Size{
        this.setWH(another.width,another.height);
        return this;
    }

    public equal(w:number,h:number = w):boolean {
        return this._width===w && this._height===h;
    }

    public clone():Size {
        return  new Size(this.width,this.height);
    }

    public isZero():boolean {
        return this.equal(0,0);
    }

    public toArray():Readonly<[number,number]>{
        this._arr[0] = this._width;
        this._arr[1] = this._height;
        return this._arr;
    }

    public toJSON():{width:number,height:number}{
        return {
            width: this.width,
            height: this.height
        };
    }


}
