


import {Size} from "./size";
import {Point2d} from "./point2d";
import {ObjectPool} from "../misc/objectPool";
import {ObservableEntity} from "./abstract/observableEntity";

export class Rect extends ObservableEntity {

    x:number;
    y:number;
    width:number;
    height:number;
    right:number;
    bottom:number;

    private static rectPool:ObjectPool<Rect> = new ObjectPool<Rect>(Rect);
    private p:Point2d;
    private size:Size;

    constructor(x:number = 0,y:number = 0,width:number = 0,height:number = 0,onChangedFn?:()=>void){
        super();
        if (onChangedFn) this.addListener(onChangedFn);
        this.setXYWH(x,y,width,height);
    }

    protected checkObservableChanged():boolean{
        return this._state.setState(this.x,this.y,this.width,this.height);
    }

    observe(onChangedFn:()=>void){
        this.addListener(onChangedFn);
    }

    revalidate(){
        this.right = this.x+this.width;
        this.bottom = this.y+this.height;
        this.triggerObservable();
    }

    setXYWH(x:number,y:number,width:number,height:number){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.revalidate();
        return this;
    }

    setXY(x:number,y:number){
        this.x = x;
        this.y = y;
        this.revalidate();
        return this;
    }

    setWH(width:number,height:number){
        this.width = width;
        this.height = height;
        this.revalidate();
        return this;
    }

    set(another:Rect):Rect {
        this.setXYWH(another.x,another.y,another.width,another.height);
        return this;
    }

    setSize(s:Size):Rect{
        this.width = s.width;
        this.height = s.height;
        this.revalidate();
        return this;
    }

    setPoint(p:Point2d):Rect{
        p.setXY(p.x,p.y);
        return this;
    }

    addXY(x:number,y:number):Rect{
        this.x+=x;
        this.y+=y;
        this.revalidate();
        return this;
    }

    addPoint(another:Point2d){
        this.addXY(another.x,another.y);
        return this;
    }

    getPoint():Point2d{
        if (this.p===undefined) this.p = new Point2d(0,0);
        this.p.setXY(this.x,this.y);
        this.p.addListener(()=>this.setXY(this.p.x,this.p.y));
        return this.p;
    }

    getSize():Size{
        if (this.size===undefined) this.size = new Size();
        this.size.setWH(this.width,this.height);
        return this.size;
    }

    clone():Rect{
        return new Rect(this.x,this.y,this.width,this.height);
    }


    toJSON():{x:number,y:number,width:number,height:number}{
        return {x:this.x,y:this.y,width:this.width,height:this.height};
    }

    fromJSON(jsonObj:{x:number,y:number,width:number,height:number}){
        this.setXYWH(jsonObj.x,jsonObj.y,jsonObj.width,jsonObj.height);
    }

    static fromPool():Rect {
        return Rect.rectPool.getFreeObject();
    }

}
