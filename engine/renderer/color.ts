import {ObjectPool, Releasealable} from "../misc/objectPool";
import {Cloneable} from "@engine/declarations";


export interface ColorJSON {
    r:number,
    g:number,
    b:number,
    a:number
}

export class Color implements Cloneable<Color>, Releasealable{

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

    readonly type:string = 'Color';

    constructor(r:number,g:number,b:number,a?:number){
        this.setRGBA(r,g,b,a);
    }

    private normalizeToZeroOne():void{
        this.rNorm = this.r / 0xff;
        this.gNorm = this.g / 0xff;
        this.bNorm = this.b / 0xff;
        this.aNorm = this.a / 0xff;
    }

    setRGBA(r:number,g:number,b:number,a:number = 255):void{
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        this.normalizeToZeroOne();
    }

    setRGB(r:number,g:number,b:number):void{
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = 255;
        this.normalizeToZeroOne();
    }

    setR(val:number):void{
        this.r = val;
        this.normalizeToZeroOne();
    }

    setG(val:number):void{
        this.g = val;
        this.normalizeToZeroOne();
    }

    setB(val:number):void{
        this.b = val;
        this.normalizeToZeroOne();
    }

    setA(val:number):void{
        this.a = val;
        this.normalizeToZeroOne();
    }

    set(another:Color):void{
        this.setRGBA(another.r,another.g,another.b,another.a);
    }

    clone():Color{
        return new Color(this.r,this.g,this.b,this.a);
    }

    private _captured:boolean = false;

    capture(): this {
        this._captured = true;
        return this;
    }

    isCaptured(): boolean {
        return this._captured;
    }

    release(): this {
        this._captured = false;
        return this;
    }

    private static getFromPool():Color{
        if (Color.objectPool===undefined) Color.objectPool = new ObjectPool<Color>(Color);
        return Color.objectPool.getFreeObject();
    }

    static RGB(r:number,g:number,b:number,a?:number):Color{
        let c:Color = new Color(0,0,0);
        c.setRGBA(r,g,b,a);
        return c;
    }


    asGL():[number,number,number,number]{
        if (this._arr===null) this._arr = new Array(3);
        this._arr[0] = this.rNorm;
        this._arr[1] = this.gNorm;
        this._arr[2] = this.bNorm;
        this._arr[3] = this.aNorm;
        return this._arr as [number,number,number,number];
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
