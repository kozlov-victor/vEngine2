import {ICloneable} from "../../core/declarations";
import {DebugError} from "../../debug/debugError";
import {ObservableEntity} from "@engine/geometry/abstract/observableEntity";
import {MathEx} from "@engine/misc/mathEx";


export interface IColorJSON {
    r:byte;
    g:byte;
    b:byte;
    a:byte;
}

export class Color extends ObservableEntity implements ICloneable<Color>{

    public static WHITE = Color.RGB(255,255,255).freeze();
    public static GREY  = Color.RGB(127,127,127).freeze();
    public static BLACK = Color.RGB(0,0,0).freeze();
    public static NONE  = Color.RGBA(0,0,0,0).freeze();

    public static RGB(r:byte,g:byte = r,b:byte = r):Color{
        return Color.RGBA(r,g,b,255);
    }

    public static HSLA(h:number,s:number,l:number,a:byte):Color{
        const c:Color = new Color();
        c.setHSLA(h,s,l,a);
        return c;
    }

    public static HSL(h:number,s:number,l:number):Color{
        return Color.HSLA(h,s,l,255);
    }

    public static RGBA(r:byte,g:byte = r,b:byte = r, a:byte = b):Color{
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


    constructor(r:byte = 0,g:byte = r,b:byte = g,a:byte = 255){
        super();
        this.setRGBA(r,g,b,a);
    }

    public setRGBA(r:byte,g:byte,b:byte,a:byte = 255):void{
        this.checkFriezed();
        const changed:boolean = this.r!==r || this.g!==g || this.b!==b || this.a!==a;
        if (!changed) return;
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        this.triggerObservable();
        this.normalizeToZeroOne();
    }

    public setRGB(r:byte,g:byte,b:byte):void{
        this.setRGBA(r,g,b,255);
    }

    /**
     * @param h angle in degrees
     * @param s saturation 0-100%
     * @param l light 0-100%
     * @param a alpha 0-255
     */
    public setHSLA(h:number,s:number,l:number,a:byte):void{

        h = (h%360)/360;
        s/=100;
        l/=100;

        let r, g, b:number;

        if(s === 0){
            r = g = b = l; // achromatic
        }else{
            const hue2rgb = (pCol:number, qCol:number, t:number)=>{
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return pCol + (qCol - pCol) * 6 * t;
                if(t < 1/2) return qCol;
                if(t < 2/3) return pCol + (qCol - pCol) * (2/3 - t) * 6;
                return pCol;
            };

            const q:number = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p:number = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        const rResult:byte = Math.round(r * 255) as byte;
        const gResult:byte = Math.round(g * 255) as byte;
        const bResult:byte = Math.round(b * 255) as byte;
        this.setRGBA(rResult,gResult,bResult,a);
    }

    public setHSL(h:number,s:number,l:number):void{
        this.setHSLA(h,s,l,255);
    }

    public getR():byte {return this.r;}
    public getG():byte {return this.g;}
    public getB():byte {return this.b;}
    public getA():byte {return this.a;}

    public setR(val:byte):void{
        this.setRGBA(val,this.g,this.b,this.a);
    }

    public setG(val:byte):void{
        this.setRGBA(this.r,val,this.b,this.a);
    }

    public setB(val:byte):void{
        this.setRGBA(this.r,this.g,val,this.a);
    }

    public setA(val:byte):void{
        this.setRGBA(this.r,this.g,this.b,val);
    }

    public set(another:Color):void{
        this.setRGBA(another.r,another.g,another.b,another.a);
    }

    public clone():Color{
        return new Color(this.r,this.g,this.b,this.a);
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

    public asRGBNumeric():number {
        return (this.r<<16)|(this.g<<8)|this.b;
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
