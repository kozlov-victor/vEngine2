
import {ObjectPool, Releasealable} from "../misc/objectPool";
import {ObservableEntity} from "./abstract/observableEntity";


export class Point2d extends ObservableEntity {

    private _x:number = 0;
    private _y:number = 0;

    private static pool = new ObjectPool<Point2d>(Point2d,4);
    private _arr:number[];

    static fromPool():Point2d{
        return Point2d.pool.getFreeObject();
    }


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
        this.setY(value)
    }

    constructor(x:number = 0,y:number = 0,onChangedFn?:()=>void){
        super();
        this._x = x;
        this._y = y;
        if (onChangedFn) this.addListener(onChangedFn);
    }

    protected checkObservableChanged():boolean{
        return this._state.setState(this._x,this._y);
    }

    setXY(x:number,y?:number):Point2d{
        if (y===undefined) { //noinspection JSSuspiciousNameCombination
            y = x;
        }
        this._x = x;
        this._y = y;
        this.triggerObservable();
        return this;
    }

    setX(x:number):Point2d{
        this._x = x;
        this.triggerObservable();
        return this;
    }

    setY(y:number):Point2d{
        this._y = y;
        this.triggerObservable();
        return this;
    }

    set(another:Point2d):Point2d{
        this.setXY(another._x,another._y);
        this.triggerObservable();
        return this;
    }


    add(another:Point2d):Point2d{
        this.addXY(another._x,another._y);
        this.triggerObservable();
        return this;
    }

    substract(another:Point2d):Point2d{
        this.addXY(-another._x,-another._y);
        this.triggerObservable();
        return this;
    }

    multiply(n:number):Point2d {
        this._x*=n;
        this._y*=n;
        this.triggerObservable();
        return this;
    }

    addXY(x:number,y:number):Point2d{
        this._x+=x;
        this._y+=y;
        this.triggerObservable();
        return this;
    }

    addX(x:number):Point2d{
        this._x+=x;
        this.triggerObservable();
        return this;
    }

    addY(y:number):Point2d{
        this._y+=y;
        this.triggerObservable();
        return this;
    }

    negative(){
        this._x = - this._x;
        this._y = -this._y;
        this.triggerObservable();
        return this;
    }

    equal(val:number) {
        return this._x===val && this._y===val;
    }

    equalXY(x:number,y:number) {
        return this._x===x && this._y===y;
    }

    equalPoint(point:Point2d) {
        return this._x===point._x && this._y===point._y;
    }

    clone():Point2d {
        return new Point2d(this._x,this._y);
    }

    fromJSON(json:{x:number,y:number}){
        this.setXY(json.x,json.y);
    }

    toJSON():{x:number,y:number}{
        return {x:this._x,y:this._y}
    }

    toArray():number[]{
        if (!this._arr) this._arr = new Array(2);
        this._arr[0] = this._x;
        this._arr[1] = this._y;
        return this._arr;
    }



}
