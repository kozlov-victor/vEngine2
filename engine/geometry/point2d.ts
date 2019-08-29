import {ObjectPool} from "../misc/objectPool";
import {ObservableEntity} from "./abstract/observableEntity";
import {ICloneable} from "@engine/core/declarations";


export class Point2d extends ObservableEntity implements ICloneable<Point2d> {

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

    public static fromPool():Point2d|undefined {
        return Point2d.pool.getFreeObject();
    }
    private static pool = new ObjectPool<Point2d>(Point2d,4);

    private _x:number = 0;
    private _y:number = 0;

    private _arr:[number,number];

    constructor(x:number = 0,y:number = 0,onChangedFn?:()=>void){
        super();
        this._x = x;
        this._y = y;
        if (onChangedFn) this.addOnChangeListener(onChangedFn);
    }

    public setXY(x:number,y:number = x):this{
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

    public set(another:Point2d):this{
        this.setXY(another._x,another._y);
        return this;
    }


    public add(another:Point2d):this{
        this.addXY(another._x,another._y);
        return this;
    }

    public substract(another:Point2d):this{
        this.addXY(-another._x,-another._y);
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
        this.addXY(x,this._y);
        return this;
    }

    public addY(y:number):this{
        this.addXY(this._x,y);
        return this;
    }

    public negative(){
        this.setXY(-this._x,-this._y);
        return this;
    }

    public equal(x:number,y:number = x):boolean {
        return this._x===x && this._y===y;
    }

    public equalPoint(point:Point2d):boolean {
        return this.equal(point.x,point.y);
    }

    public clone():Point2d {
        return new Point2d(this._x,this._y);
    }

    public fromJSON(json:{x:number,y:number}):void{
        this.setXY(json.x,json.y);
    }

    public toJSON():{x:number,y:number}{
        return {x:this._x,y:this._y};
    }

    public toArray():[number,number]{
        if (!this._arr) this._arr = new Array(2) as [number,number];
        this._arr[0] = this._x;
        this._arr[1] = this._y;
        return this._arr;
    }



}
