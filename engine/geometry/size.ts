import {ObjectPool, Releasealable} from "../misc/objectPool";
import {ObservableEntity} from "@engine/geometry/abstract/observableEntity";

export class Size extends ObservableEntity implements Releasealable{

    private _width:number;
    private _height:number;

    private static rectPool:ObjectPool<Size> = new ObjectPool<Size>(Size);

    static fromPool():Size {
        return Size.rectPool.getFreeObject();
    }

    constructor(width:number = 0,height:number = 0){
        super();
        this._width = width;
        this._height = height;
    }

    setW(width:number):Size{
        this._width = width;
        this.triggerObservable();
        return this;
    }
    setH(height:number):Size{
        this._height = height;
        this.triggerObservable();
        return this;
    }

    setWH(width:number,height:number = width):Size{
        this._width = width;
        this._height = height;
        this.triggerObservable();
        return this;
    }

    set(another:Size):Size{
        this._width = another._width;
        this._height = another._height;
        this.triggerObservable();
        return this;
    }

    set width(val:number) {
        this._width = val;
        this.triggerObservable();
    }

    set height(val:number) {
        this._height = val;
        this.triggerObservable();
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    isZero():boolean {
        return this._width===0 && this._height===0;
    }


}