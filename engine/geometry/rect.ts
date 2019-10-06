import {Size} from "./size";
import {IPoint2d, Point2d} from "./point2d";
import {ObjectPool} from "../misc/objectPool";
import {ObservableEntity} from "./abstract/observableEntity";
import {ICloneable} from "@engine/core/declarations";
import {MathEx} from "@engine/misc/mathEx";

export interface IRectJSON {
    x:number;
    y:number;
    width:number;
    height:number;
}

export interface IRect {
    x: number;
    y: number;
    width: number;
    height: number;
    right: number;
    bottom: number;
}

export class Rect extends ObservableEntity implements ICloneable<Rect>, IRect{

    get right(): number {
        return this._right;
    }

    get bottom(): number {
        return this._bottom;
    }

    public static fromPool():Rect {
        return Rect.rectPool.getFreeObject()!;
    }

    private static rectPool:ObjectPool<Rect> = new ObjectPool<Rect>(Rect);

    private _x:number = 0;
    private _y: number = 0;
    private _width:number = 0;
    private _height:number = 0;

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
        const oldX:number = this._x;
        const oldY:number = this._y;
        const oldW:number = this._width;
        const oldH:number = this._height;
        const changed:boolean = oldX!==x || oldY!==y || oldW!==width || oldH!==height;
        if (changed) {
            this._x      = x;
            this._y      = y;
            this._width  = width;
            this._height = height;
            this._right = this._x+this._width;
            this._bottom = this._y+this._height;
            this.triggerObservable();
        }
        return this;
    }

    public clamp(x:number,y:number,width:number,height:number) {

        const clampX1 = x,clampY1 = y;
        const clampX2 = x+width, clampY2 = y+height;

        const realX1 = MathEx.clamp(this._x,clampX1,clampX2);
        const realY1 = MathEx.clamp(this._y,clampY1,clampY2);
        const realX2 = MathEx.clamp(realX1 + this._width,clampX1,clampX2);
        const realY2 = MathEx.clamp(realY1 + this._height,clampY1,clampY2);

        const realWidth  = Math.max(0,realX2 - realX1);
        const realHeight = Math.max(0,realY2 - realY1);

        this.setXYWH(realX1,realY1,realWidth,realHeight);
    }


    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    public setXY(x:number,y:number):Rect{
        this.setXYWH(x,y,this._width,this._height);
        return this;
    }

    public setWH(width:number,height:number):Rect{
        this.setXYWH(this._x,this._y,width,height);
        return this;
    }

    public set(another:Rect):Rect {
        this.setXYWH(another._x,another._y,another._width,another._height);
        return this;
    }

    public setSize(s:Size):Rect{
        this.setWH(s.width,s.height);
        return this;
    }

    public setPoint(p:IPoint2d):Rect{
        this.setXY(p.x,p.y);
        return this;
    }

    public setPointAndSize(p:IPoint2d,size:Size):Rect{
        this.setPoint(p);
        this.setSize(size);
        return this;
    }

    public addXY(x:number,y:number):Rect{
        this.setXY(this._x+x,this._y+y);
        return this;
    }

    public addWH(width:number,height:number):Rect{
        this.setWH(this._width + width,this._height + height);
        return this;
    }

    public addPoint(another:Point2d):Rect{
        this.addXY(another.x,another.y);
        return this;
    }

    public isZeroSize():boolean{
        return this._width===0 || this._height===0;
    }

    public clone():Rect{
        return new Rect(this._x,this._y,this._width,this._height);
    }


    public toJSON():IRectJSON{
        return {
            x:this._x,
            y:this._y,
            width:this._width,
            height:this._height
        };
    }

    public toArray():[number,number,number,number]{
        this._arr[0] = this._x;
        this._arr[1] = this._y;
        this._arr[2] = this._width;
        this._arr[3] = this._height;
        return this._arr;
    }

    public fromJSON(jsonObj:IRectJSON):void{
        this.setXYWH(jsonObj.x,jsonObj.y,jsonObj.width,jsonObj.height);
    }



}
