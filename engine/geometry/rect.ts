import {Size} from "./size";
import {Point2d} from "./point2d";
import {ObjectPool} from "../misc/objectPool";
import {ObservableEntity} from "./abstract/observableEntity";
import {Cloneable} from "@engine/declarations";

export class Rect extends ObservableEntity implements Cloneable<Rect>{

    readonly point:Point2d = new Point2d();
    readonly size:Size = new Size();
    private _right:number;
    private _bottom:number;

    private static rectPool:ObjectPool<Rect> = new ObjectPool<Rect>(Rect);

    static fromPool():Rect {
        return Rect.rectPool.getFreeObject();
    }

    constructor(x:number = 0,y:number = 0,width:number = 0,height:number = 0,onChangedFn?:()=>void){
        super();
        if (onChangedFn) this.addListener(onChangedFn);
        this.setXYWH(x,y,width,height);
    }

    observe(onChangedFn:()=>void):void{
        this.addListener(onChangedFn);
    }

    revalidate():void{
        this._right = this.point.x+this.size.width;
        this._bottom = this.point.y+this.size.height;
        this.triggerObservable();
    }

    setXYWH(x:number,y:number,width:number,height:number):Rect{
        this.point.setXY(x,y);
        this.size.setWH(width,height);
        this.revalidate();
        return this;
    }

    setXY(x:number,y:number):Rect{
        this.point.setXY(x,y);
        this.revalidate();
        return this;
    }

    setWH(width:number,height:number):Rect{
        this.size.setWH(width,height);
        this.revalidate();
        return this;
    }

    set(another:Rect):Rect {
        this.setPoint(another.point);
        this.setSize(another.size);
        this.revalidate();
        return this;
    }

    setSize(s:Size):Rect{
        this.size.setWH(s.width,s.height);
        this.revalidate();
        return this;
    }

    setPoint(p:Point2d):Rect{
        this.point.setXY(p.x,p.y);
        this.revalidate();
        return this;
    }

    addXY(x:number,y:number):Rect{
        this.point.addXY(x,y);
        this.revalidate();
        return this;
    }

    addPoint(another:Point2d):Rect{
        this.addXY(another.x,another.y);
        this.revalidate();
        return this;
    }

    clone():Rect{
        return new Rect(this.point.x,this.point.y,this.size.width,this.size.height);
    }


    toJSON():{x:number,y:number,width:number,height:number}{
        return {
            x:this.point.x,
            y:this.point.y,
            width:this.size.width,
            height:this.size.height
        };
    }

    get right(): number {
        return this._right;
    }

    get bottom(): number {
        return this._bottom;
    }

    fromJSON(jsonObj:{x:number,y:number,width:number,height:number}):void{
        this.setXYWH(jsonObj.x,jsonObj.y,jsonObj.width,jsonObj.height);
    }


}
