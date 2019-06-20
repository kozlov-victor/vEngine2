import {IReleasealable, ObjectPool} from "../misc/objectPool";
import {ICloneable} from "@engine/declarations";


export interface IColorJSON {
    r:number;
    g:number;
    b:number;
    a:number;
}

export class Color implements ICloneable<Color>, IReleasealable{

    public static WHITE = Color.RGB(255,255,255);
    public static GREY  = Color.RGB(127,127,127);
    public static BLACK = Color.RGB(0,0,0);
    public static NONE  = Color.RGB(0,0,0,0);

    public static RGB(r:number,g:number = r,b:number = r,a:number = 255):Color{
        const c:Color = new Color(0,0,0);
        c.setRGBA(r,g,b,a);
        return c;
    }

    private static objectPool:ObjectPool<Color>;

    private static getFromPool():Color{
        if (Color.objectPool===undefined) Color.objectPool = new ObjectPool<Color>(Color);
        return Color.objectPool.getFreeObject();
    }

    public readonly type:string = 'Color';

    private r:number;
    private g:number;
    private b:number;
    private a:number;

    private rNorm:number;
    private gNorm:number;
    private bNorm:number;
    private aNorm:number;
    private _arr:number[] = null;

    private _captured:boolean = false;

    constructor(r:number,g:number,b:number,a?:number){
        this.setRGBA(r,g,b,a);
    }

    public setRGBA(r:number,g:number,b:number,a:number = 255):void{
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        this.normalizeToZeroOne();
    }

    public setRGB(r:number,g:number,b:number):void{
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = 255;
        this.normalizeToZeroOne();
    }

    public setR(val:number):void{
        this.r = val;
        this.normalizeToZeroOne();
    }

    public setG(val:number):void{
        this.g = val;
        this.normalizeToZeroOne();
    }

    public setB(val:number):void{
        this.b = val;
        this.normalizeToZeroOne();
    }

    public setA(val:number):void{
        this.a = val;
        this.normalizeToZeroOne();
    }

    public set(another:Color):void{
        this.setRGBA(another.r,another.g,another.b,another.a);
    }

    public clone():Color{
        return new Color(this.r,this.g,this.b,this.a);
    }

    public capture(): this {
        this._captured = true;
        return this;
    }

    public isCaptured(): boolean {
        return this._captured;
    }

    public release(): this {
        this._captured = false;
        return this;
    }


    public asGL():[number,number,number,number]{
        if (this._arr===null) this._arr = new Array(3);
        this._arr[0] = this.rNorm;
        this._arr[1] = this.gNorm;
        this._arr[2] = this.bNorm;
        this._arr[3] = this.aNorm;
        return this._arr as [number,number,number,number];
    }

    public asCSS():string{
        return `rgba(${this.r},${this.g},${this.b},${this.a})`;
    }

    public toJSON():IColorJSON{
        return {r:this.r,g:this.g,b:this.b,a:this.a};
    }

    public fromJSON(json:IColorJSON) {
        this.setRGBA(json.r,json.g,json.b,json.a);
    }

    private normalizeToZeroOne():void{
        this.rNorm = this.r / 0xff;
        this.gNorm = this.g / 0xff;
        this.bNorm = this.b / 0xff;
        this.aNorm = this.a / 0xff;
    }

}