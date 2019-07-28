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

    public static fromPool():Rect {
        return Rect.rectPool.getFreeObject();
    }

    private static rectPool:ObjectPool<Rect> = new ObjectPool<Rect>(Rect);

    public readonly point:Point2d = new Point2d();
    public readonly size:Size = new Size();
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

    public revalidate():void{
        this._right = this.point.x+this.size.width;
        this._bottom = this.point.y+this.size.height;
        this.triggerObservable();
    }

    public setXYWH(x:number,y:number,width:number,height:number):Rect{
        this.point.setXY(x,y);
        this.size.setWH(width,height);
        this.revalidate();
        return this;
    }

    public setXY(x:number,y:number):Rect{
        this.point.setXY(x,y);
        this.revalidate();
        return this;
    }

    public setWH(width:number,height:number):Rect{
        this.size.setWH(width,height);
        this.revalidate();
        return this;
    }

    public set(another:Rect):Rect {
        this.setPoint(another.point);
        this.setSize(another.size);
        this.revalidate();
        return this;
    }

    public setSize(s:Size):Rect{
        this.size.setWH(s.width,s.height);
        this.revalidate();
        return this;
    }

    public setPoint(p:Point2d):Rect{
        this.point.setXY(p.x,p.y);
        this.revalidate();
        return this;
    }

    public addXY(x:number,y:number):Rect{
        this.point.addXY(x,y);
        this.revalidate();
        return this;
    }

    public addPoint(another:Point2d):Rect{
        this.addXY(another.x,another.y);
        this.revalidate();
        return this;
    }

    public clone():Rect{
        return new Rect(this.point.x,this.point.y,this.size.width,this.size.height);
    }


    public toJSON():IRectJSON{
        return {
            x:this.point.x,
            y:this.point.y,
            width:this.size.width,
            height:this.size.height
        };
    }

    public toArray():[number,number,number,number]{
        this._arr[0] = this.point.x;
        this._arr[1] = this.point.y;
        this._arr[2] = this.size.width;
        this._arr[3] = this.size.height;
        return this._arr;
    }

    public fromJSON(jsonObj:IRectJSON):void{
        this.setXYWH(jsonObj.x,jsonObj.y,jsonObj.width,jsonObj.height);
    }


}
