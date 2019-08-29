import {Size} from "./size";
import {Point2d} from "./point2d";
import {ObjectPool} from "../misc/objectPool";
import {ObservableEntity} from "./abstract/observableEntity";
import {ICloneable} from "@engine/core/declarations";

export interface IRectJSON {
    x:number;
    y:number;
    width:number;
    height:number;
}

export class Rect extends ObservableEntity implements ICloneable<Rect>{

    get right(): number {
        return this._right;
    }

    get bottom(): number {
        return this._bottom;
    }


    get point(): Point2d { // todo remove direct access
        return this._point;
    }

    get size(): Size { // todo remove direct access
        return this._size;
    }

    public static fromPool():Rect|undefined {
        return Rect.rectPool.getFreeObject();
    }

    private static rectPool:ObjectPool<Rect> = new ObjectPool<Rect>(Rect);

    private readonly _point:Point2d = new Point2d();
    private readonly _size:Size = new Size();
    private _right:number;
    private _bottom:number;

    private _arr:[number,number,number,number] = [0,0,0,0];

    constructor(x:number = 0,y:number = 0,width:number = 0,height:number = 0,onChangedFn?:()=>void){
        super();
        if (onChangedFn) this.addOnChangeListener(onChangedFn);
        this.setXYWH(x,y,width,height);
    }

    public observe(onChangedFn:()=>void):void{
        this.addOnChangeListener(onChangedFn);
    }

    public setXYWH(x:number,y:number,width:number,height:number):Rect{
        const oldX:number = this._point.x;
        const oldY:number = this._point.y;
        const oldW:number = this._size.width;
        const oldH:number = this._size.height;
        this._point.setXY(x,y);
        this._size.setWH(width,height);
        const changed:boolean = oldX!==x || oldY!==y || oldW!==width || oldH!==height;
        if (changed) this.revalidate();
        return this;
    }

    public setXY(x:number,y:number):Rect{
        this.setXYWH(x,y,this._size.width,this._size.height);
        return this;
    }

    public setWH(width:number,height:number):Rect{
        this.setXYWH(this._point.x,this._point.y,width,height);
        return this;
    }

    public set(another:Rect):Rect {
        this.setPoint(another._point);
        this.setSize(another._size);
        this.setXYWH(another._point.x,another._point.y,another._size.width,another._size.height);
        return this;
    }

    public setSize(s:Size):Rect{
        this.setWH(s.width,s.height);
        return this;
    }

    public setPoint(p:Point2d):Rect{
        this.setXY(p.x,p.y);
        return this;
    }

    public addXY(x:number,y:number):Rect{
        this.setXY(this._point.x+x,this._point.y+y);
        return this;
    }

    public addPoint(another:Point2d):Rect{
        this.addXY(another.x,another.y);
        return this;
    }

    public clone():Rect{
        return new Rect(this._point.x,this._point.y,this._size.width,this._size.height);
    }


    public toJSON():IRectJSON{
        return {
            x:this._point.x,
            y:this._point.y,
            width:this._size.width,
            height:this._size.height
        };
    }

    public toArray():[number,number,number,number]{
        this._arr[0] = this._point.x;
        this._arr[1] = this._point.y;
        this._arr[2] = this._size.width;
        this._arr[3] = this._size.height;
        return this._arr;
    }

    public fromJSON(jsonObj:IRectJSON):void{
        this.setXYWH(jsonObj.x,jsonObj.y,jsonObj.width,jsonObj.height);
    }

    private revalidate():void{
        this._right = this._point.x+this._size.width;
        this._bottom = this._point.y+this._size.height;
        this.triggerObservable();
    }


}
