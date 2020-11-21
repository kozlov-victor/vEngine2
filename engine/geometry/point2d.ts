import {ObjectPool} from "../misc/objectPool";
import {ObservableEntity} from "./abstract/observableEntity";
import {ICloneable} from "@engine/core/declarations";
import {DebugError} from "@engine/debug/debugError";

export interface IPoint2d {
    x:number;
    y: number;
}

export class Point2d extends ObservableEntity implements ICloneable<Point2d>, IPoint2d {

    get x(): number {
        return this._x;
    }

    set x(value: number) {
        this.setX(value);
    }

    get y(): number {
        return this._y;
    }

    set y(value: number) {
        this.setY(value);
    }

    public static fromPool():Point2d {
        return Point2d.pool.getFreeObject()!;
    }
    private static pool = new ObjectPool<Point2d>(Point2d,4);

    private _x:number = 0;
    private _y:number = 0;

    private _arr:[number,number];

    // noinspection JSSuspiciousNameCombination
    constructor(x:number = 0,y:number = x,onChangedFn?:()=>void){
        super();
        if (onChangedFn) this.addOnChangeListener(onChangedFn);
        this.setXY(x,y);
    }

    // noinspection JSSuspiciousNameCombination
    public setXY(x:number = 0,y:number = x):this{
        if (DEBUG && (Number.isNaN(x) || Number.isNaN(y))) {
            console.trace();
            throw new DebugError(`Point2d: wrong numeric arguments ${x},${y}`);
        }
        const changed:boolean = this._x!==x || this._y!==y;
        if (changed) {
            this._x = x;
            this._y = y;
            this.triggerObservable();
        }
        return this;
    }

    public setX(x:number):this{
        this.setXY(x,this._y);
        return this;
    }

    public setY(y:number):this{
        this.setXY(this._x,y);
        return this;
    }

    public set(another:IPoint2d):this{
        this.setXY(another.x,another.y);
        return this;
    }


    public add(another:IPoint2d):this{
        this.addXY(another.x,another.y);
        return this;
    }

    public substract(another:IPoint2d):this{
        this.addXY(-another.x,-another.y);
        return this;
    }

    public multiply(n:number):this {
        this.setXY(this._x*n,this._y*n);
        return this;
    }

    public addXY(x:number,y:number):this{
        this.setXY(this._x+x,this._y+y);
        return this;
    }

    public addX(x:number):this{
        this.addXY(x,0);
        return this;
    }

    public addY(y:number):this{
        this.addXY(0,y);
        return this;
    }

    public negative(){
        this.setXY(-this._x,-this._y);
        return this;
    }

    // noinspection JSSuspiciousNameCombination
    public equal(x:number,y:number = x):boolean {
        return this._x===x && this._y===y;
    }

    public equalPoint(point:IPoint2d):boolean {
        return this.equal(point.x,point.y);
    }

    public clone():Point2d {
        return new Point2d(this._x,this._y);
    }

    public fromJSON(json:IPoint2d):void{
        this.setXY(json.x,json.y);
    }

    public toJSON():IPoint2d{
        return {x:this._x,y:this._y};
    }

    public toArray():number[]{
        if (this._arr===undefined) this._arr = [this._x,this._y];
        else {
            this._arr[0] = this._x;
            this._arr[1] = this._y;
        }
        return this._arr;
    }



}
