import {ISize} from "./size";
import {IPoint2d} from "./point2d";
import {ObjectPool} from "../misc/objectPool";
import {ObservableEntity} from "./abstract/observableEntity";
import {ICloneable} from "@engine/core/declarations";
import {DebugError} from "@engine/debug/debugError";
import {isNotNumber} from "@engine/misc/object";

export interface IRectJSON extends IPoint2d, ISize{
    x:number;
    y:number;
    width:number;
    height:number;
}

export interface IRect {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly right: number;
    readonly bottom: number;
}

export class Rect extends ObservableEntity implements ICloneable<Rect>, IRect{

    constructor(x:number = 0,y:number = 0,width:number = 0,height:number = 0,onChangedFn?:()=>void){
        super();
        if (onChangedFn) this.addOnChangeListener(onChangedFn);
        this.setXYWH(x,y,width,height);
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

    get right(): number {
        return this._right;
    }

    get bottom(): number {
        return this._bottom;
    }

    set x(x: number) {
        this.setXY(x,this.y);
    }

    set y(y: number) {
        this.setXY(this.x,y);
    }

    set width(width: number) {
        this.setWH(width,this.height);
    }

    set height(height: number) {
        this.setWH(this.width,height);
    }

    public static pool = new ObjectPool(Rect);

    private _x:number = 0;
    private _y: number = 0;
    private _width:number = 0;
    private _height:number = 0;

    private _right:number;
    private _bottom:number;

    private _arr = new Float32Array([0,0,0,0]);

    public setXYWH(x:number,y:number,width:number,height:number):Rect{
        if (
            DEBUG &&
            (
                isNotNumber(x) ||
                isNotNumber(y) ||
                isNotNumber(width) ||
                isNotNumber(height)
            )
        ) {
            throw new DebugError(`Rect: wrong numeric arguments ${x},${y},${width},${height}`);
        }
        const changed:boolean = this._x!==x || this._y!==y || this._width!==width || this._height!==height;
        if (changed) {
            this._x      = x;
            this._y      = y;
            this._width  = width;
            this._height = height;
            this._right  = x+width;
            this._bottom = y+height;
            this._arr[0] = x;
            this._arr[1] = y;
            this._arr[2] = width;
            this._arr[3] = height;
            this.triggerObservable();
        }
        return this;
    }

    public setXY(x:number,y:number):Rect{
        this.setXYWH(x,y,this._width,this._height);
        return this;
    }

    public setWH(width:number,height:number):Rect{
        this.setXYWH(this._x,this._y,width,height);
        return this;
    }

    public setFrom(another:IRectJSON):Rect {
        this.setXYWH(another.x,another.y,another.width,another.height);
        return this;
    }

    public setSize(s:ISize):Rect{
        this.setWH(s.width,s.height);
        return this;
    }

    public setPoint(p:IPoint2d):Rect{
        this.setXY(p.x,p.y);
        return this;
    }

    public setPointAndSize(p:IPoint2d,size:ISize):Rect{
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

    public addPoint(another:IPoint2d):Rect{
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

    public toArray():Float32Array & [number,number,number,number]{
        return this._arr as Float32Array & [number,number,number,number];
    }



}
