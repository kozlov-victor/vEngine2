import {IReleasealable, ObjectPool} from "../misc/objectPool";
import {ObservableEntity} from "@engine/geometry/abstract/observableEntity";

export class Size extends ObservableEntity implements IReleasealable{

    set width(val:number) {
        const changed:boolean = this._width!==val;
        this._width = val;
        if (changed) this.triggerObservable();
    }

    get width(): number {
        return this._width;
    }

    set height(val:number) {
        const changed:boolean = this._height!==val;
        this._height = val;
        if (changed) this.triggerObservable();
    }

    get height(): number {
        return this._height;
    }

    public static fromPool():Size|undefined {
        return Size.rectPool.getFreeObject();
    }

    private static rectPool:ObjectPool<Size> = new ObjectPool<Size>(Size);

    private _width:number;
    private _height:number;

    private _arr:[number,number] = [this._width,this._height];

    constructor(width:number = 0,height:number = 0){
        super();
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

    public setWH(width:number,height:number = width):Size{
        const changed:boolean = this._width!==width || this._height!==height;
        if (changed) {
            this._width = width;
            this._height = height;
            this.triggerObservable();
        }
        return this;
    }

    public addWH(width:number,height:number = width):Size{
        this.setWH(this.width+width,this.height+height);
        return this;
    }

    public set(another:Size):Size{
        this.setWH(another._width,another._height);
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