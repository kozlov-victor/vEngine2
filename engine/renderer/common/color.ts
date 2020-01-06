import {IReleasealable, ObjectPool} from "../../misc/objectPool";
import {ICloneable} from "../../core/declarations";
import {DebugError} from "../../debug/debugError";


export interface IColorJSON {
    r:byte;
    g:byte;
    b:byte;
    a:byte;
}

export class Color implements ICloneable<Color>, IReleasealable{

    public static WHITE = Color.RGB(255,255,255).freeze();
    public static GREY  = Color.RGB(127,127,127).freeze();
    public static BLACK = Color.RGB(0,0,0).freeze();
    public static NONE  = Color.RGB(0,0,0,0).freeze();

    public static RGB(r:byte,g:byte = r,b:byte = r,a:byte = 255):Color{
        const c:Color = new Color(0,0,0);
        c.setRGBA(r,g,b,a);
        return c;
    }

    public static fromRGBNumeric(col:number):Color {
        const r:byte = (col & 0xFF_00_00)>>(4*4) as byte;
        const g:byte = (col & 0x00_FF_00)>>(4*2) as byte;
        const b:byte = (col & 0x00_00_FF) as byte;
        return new Color(r,g,b);
    }

    public readonly type:string = 'Color';

    private r:byte;
    private g:byte;
    private b:byte;
    private a:byte;

    private rNorm:number;
    private gNorm:number;
    private bNorm:number;
    private aNorm:number;
    private _arr:number[];
    private _friezed:boolean = false;

    private _captured:boolean = false;
    
    constructor(r:byte = 0,g:byte = r,b:byte = g,a:byte = 255){
        this.setRGBA(r,g,b,a);
    }

    public setRGBA(r:byte,g:byte,b:byte,a:byte = 255):void{
        this.checkFriezed();
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        this.normalizeToZeroOne();
    }

    public setRGB(r:byte,g:byte,b:byte):void{
        this.checkFriezed();
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = 255;
        this.normalizeToZeroOne();
    }

    public getR():byte {return this.r;}
    public getG():byte {return this.g;}
    public getB():byte {return this.b;}
    public getA():byte {return this.a;}

    public setR(val:byte):void{
        this.checkFriezed();
        this.r = val;
        this.normalizeToZeroOne();
    }

    public setG(val:byte):void{
        this.checkFriezed();
        this.g = val;
        this.normalizeToZeroOne();
    }

    public setB(val:byte):void{
        this.checkFriezed();
        this.b = val;
        this.normalizeToZeroOne();
    }

    public setA(val:byte):void{
        this.checkFriezed();
        this.a = val;
        this.normalizeToZeroOne();
    }

    public set(another:Color):void{
        this.checkFriezed();
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

    public freeze():this{
        this._friezed = true;
        return this;
    }


    public asGL():[number,number,number,number]{
        if (!this._arr) this._arr = new Array(3);
        this._arr[0] = this.rNorm;
        this._arr[1] = this.gNorm;
        this._arr[2] = this.bNorm;
        this._arr[3] = this.aNorm;
        return this._arr as [number,number,number,number];
    }

    public asCSS():string{
        return `rgba(${this.r},${this.g},${this.b},${this.a/255})`;
    }

    public toJSON():IColorJSON{
        return {r:this.r,g:this.g,b:this.b,a:this.a};
    }

    public fromJSON(json:IColorJSON) {
        this.setRGBA(json.r,json.g,json.b,json.a);
    }

    private checkFriezed(){
        if (this._friezed) {
            if (DEBUG) {
                console.error(this);
                throw new DebugError(`the color is friezed and can no be changed`);
            }
            else throw new Error('friezed');
        }

    }

    private normalizeToZeroOne():void{
        this.rNorm = this.r / 0xff;
        this.gNorm = this.g / 0xff;
        this.bNorm = this.b / 0xff;
        this.aNorm = this.a / 0xff;
    }

}