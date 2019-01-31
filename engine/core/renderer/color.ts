

import {ObjectPool} from "../misc/objectPool";


export interface ColorJSON {
    r:number,
    g:number,
    b:number,
    a:number
}

export class Color {

    private r:number;
    private g:number;
    private b:number;
    private a:number;

    private rNorm:number;
    private gNorm:number;
    private bNorm:number;
    private aNorm:number;

    public static WHITE = Color.RGB(255,255,255);
    public static GREY  = Color.RGB(127,127,127);
    public static BLACK = Color.RGB(0,0,0);
    public static NONE  = Color.RGB(0,0,0,0);

    private static objectPool:ObjectPool<Color>;
    private _arr:number[] = null;

    type:string = 'Color';

    constructor(r:number,g:number,b:number,a?:number){
        this.setRGBA(r,g,b,a);
    }

    private normalizeToZeroOne(){
        this.rNorm = this.r / 0xff;
        this.gNorm = this.g / 0xff;
        this.bNorm = this.b / 0xff;
        this.aNorm = this.a / 0xff;
    }

    setRGBA(r:number,g:number,b:number,a:number = 255){
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        this.normalizeToZeroOne();
    }

    setRGB(r:number,g:number,b:number){
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = 255;
        this.normalizeToZeroOne();
    }

    setR(val:number){
        this.r = val;
        this.normalizeToZeroOne();
    }

    setG(val:number){
        this.g = val;
        this.normalizeToZeroOne();
    }

    setB(val:number){
        this.b = val;
        this.normalizeToZeroOne();
    }

    setA(val:number){
        this.a = val;
        this.normalizeToZeroOne();
    }

    set(another:Color){
        this.setRGBA(another.r,another.g,another.b,another.a);
    }

    clone(){
        return new Color(this.r,this.g,this.b,this.a);
    }

    private static getFromPool():Color{
        if (Color.objectPool===undefined) Color.objectPool = new ObjectPool<Color>(Color);
        return Color.objectPool.getNextObject();
    }

    static RGB(r:number,g:number,b:number,a?:number):Color{
        let c:Color = new Color(0,0,0);
        c.setRGBA(r,g,b,a);
        return c;
    }


    asGL():number[]{
        if (this._arr===null) this._arr = new Array(3);
        this._arr[0] = this.rNorm;
        this._arr[1] = this.gNorm;
        this._arr[2] = this.bNorm;
        this._arr[3] = this.aNorm;
        return this._arr;
    }

    asCSS():string{
        return `rgba(${this.r},${this.g},${this.b},${this.a})`;
    }

    toJSON():ColorJSON{
        return {r:this.r,g:this.g,b:this.b,a:this.a};
    }

    fromJSON(json:ColorJSON) {
        this.setRGBA(json.r,json.g,json.b,json.a);
    }

}
