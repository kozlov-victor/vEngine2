import {IReleasealable, ObjectPool} from "../misc/objectPool";
import {ObservableEntity} from "@engine/geometry/abstract/observableEntity";

export class Size extends ObservableEntity implements IReleasealable{

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

    public static fromPool():Size {
        return Size.rectPool.getFreeObject();
    }

    private static rectPool:ObjectPool<Size> = new ObjectPool<Size>(Size);

    private _width:number;
    private _height:number;

    private _arr:[number,number] = [this._width,this._height];

    constructor(width:number = 0,height:number = 0){
        super();
        this._width = width;
        this._height = height;
    }


    public setW(width:number):Size{
        this._width = width;
        this.triggerObservable();
        return this;
    }
    public setH(height:number):Size{
        this._height = height;
        this.triggerObservable();
        return this;
    }

    public setWH(width:number,height:number = width):Size{
        this._width = width;
        this._height = height;
        this.triggerObservable();
        return this;
    }

    public addWH(width:number,height:number = width):Size{
        this.setWH(this.width+width,this.height+height);
        return this;
    }

    public set(another:Size):Size{
        this._width = another._width;
        this._height = another._height;
        this.triggerObservable();
        return this;
    }

    public isZero():boolean {
        return this._width===0 && this._height===0;
    }

    public toArray():[number,number]{
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