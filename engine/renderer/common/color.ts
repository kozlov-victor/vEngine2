import {ICloneable} from "../../core/declarations";
import {DebugError} from "../../debug/debugError";
import {ObservableEntity} from "@engine/geometry/abstract/observableEntity";


export interface IColorJSON {
    r:byte;
    g:byte;
    b:byte;
    a:byte;
}

export interface IColorFrozen extends Color{
    readonly r:byte;
    readonly g:byte;
    readonly b:byte;
    readonly a:byte;
}

export class Color extends ObservableEntity implements ICloneable<Color>, IColorJSON{


    constructor(r:byte = 0,g:byte = r,b:byte = g,a:byte = 255){
        super();
        this.setRGBA(r,g,b,a);
    }

    get r(): byte {
        return this._r;
    }

    set r(value: byte) {
        this.setRGBA(value,this._g,this._b,this._a);
    }

    get g(): byte {
        return this._g;
    }

    set g(value: byte) {
        this.setRGBA(this._r,value,this._b,this._a);
    }

    get b(): byte {
        return this._b;
    }

    set b(value: byte) {
        this.setRGBA(this._r,this._g,value,this._a);
    }

    get a(): byte {
        return this._a;
    }

    set a(value: byte) {
        this.setRGBA(this._r,this._g,this._b,value);
    }

    public static WHITE = Color.RGB(255,255,255).freeze();
    public static GREY  = Color.RGB(127,127,127).freeze();
    public static BLACK = Color.RGB(0,0,0).freeze();
    public static NONE  = Color.RGBA(0,0,0,0).freeze();

    public readonly type:'Color' = 'Color';

    private _r:byte;
    private _g:byte;
    private _b:byte;
    private _a:byte;

    private rNorm:number;
    private gNorm:number;
    private bNorm:number;
    private aNorm:number;
    private _arr:[r:number,g:number,b:number,a:number];
    private _friezed:boolean = false;

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

    public static HSV(h:number,s:number,v:number):Color{
        const c:Color = new Color();
        c.setHSV(h,s,v);
        return c;
    }

    public static RGBA(r:byte,g:byte = r,b:byte = g, a:byte = 255):Color{
        return new Color(r,g,b,a);
    }

    public static from(col:IColor):Color {
        return new Color(col.r,col.g,col.b,col.a);
    }

    public static fromRGBNumeric(col:number):Color {
        const r:byte = (col & 0xFF_00_00)>>(4*4) as byte;
        const g:byte = (col & 0x00_FF_00)>>(4*2) as byte;
        const b:byte = (col & 0x00_00_FF) as byte;
        return new Color(r,g,b);
    }

    // https://stackoverflow.com/questions/11068240/what-is-the-most-efficient-way-to-parse-a-css-color-in-javascript
    public static fromCssLiteral(literal:string):Color{
        const color:Color = new Color();
        color.fromCSS(literal);
        return color;
    }

    private static _calculateColorComponentsFromCss(literal:string):IColorJSON {
        let r:byte = 0,g:byte = 0,b:byte = 0,a:byte = 0;
        if (literal.substr(0,1)==="#") {
            const numericPart:string = literal.substr(1);
            if (numericPart.length===3) { // string like fff
                r = ~~(parseInt(numericPart.substr(0,1),16) * 0xFF / 0xF) as byte;
                g = ~~(parseInt(numericPart.substr(1,1),16) * 0xFF / 0xF) as byte;
                b = ~~(parseInt(numericPart.substr(2,1),16) * 0xFF / 0xF) as byte;
                a = 255;
            } else if (numericPart.length===6) { // string like rrggbb
                r = ~~(parseInt(numericPart.substr(0,2),16)) as byte;
                g = ~~(parseInt(numericPart.substr(2,2),16)) as byte;
                b = ~~(parseInt(numericPart.substr(4,2),16)) as byte;
                a = 255;
            } else if (numericPart.length===8) { // string like rrggbbaa
                r = ~~(parseInt(numericPart.substr(0,2),16)) as byte;
                g = ~~(parseInt(numericPart.substr(2,2),16)) as byte;
                b = ~~(parseInt(numericPart.substr(4,2),16)) as byte;
                a = ~~(parseInt(numericPart.substr(6,2),16)) as byte;
            } else {
                if (DEBUG) throw new DebugError(`unsupported or wrong color literal: ${literal}`);
            }
        }
        else {
            if (literal.indexOf('rgb')===0) {
                [r,g,b,a] = literal.split("(")[1].split(")")[0].split(",").map(x=>+x) as [byte,byte,byte,byte];
                if (a===undefined) a = 255 as byte;
                else a=~~(a * 255) as byte;
            }
            else if (literal.indexOf('hsl')===0) {
                let h: number, s: number, l: number, alfa: byte;
                [h, s, l, alfa] = literal.split("(")[1].split(")")[0].split(",").map(x => parseInt(x)) as [number, number, number, byte];
                if (alfa === undefined) alfa = 255 as byte;
                else alfa = ~~(alfa * 255) as byte;
                return Color.HSLA(h, s, l, alfa);
            } else {
                if (DEBUG) throw new DebugError(`unsupported or wrong color literal: ${literal}`);
            }
        }
        return {r,g,b,a};
    }

    public setRGBA(r:byte,g:byte,b:byte,a:byte = 255):void{
        this.checkFriezed();
        const changed:boolean = this._r!==r || this._g!==g || this._b!==b || this._a!==a;
        if (!changed) return;
        this._r = r;
        this._g = g;
        this._b = b;
        this._a = a;
        this.triggerObservable();
        this.normalizeToZeroOne();
    }

    public setRGB(r:byte,g:byte = r,b:byte = g):void{
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

    /**
     * @param h hue 0-100%
     * @param s saturation 0-100%
     * @param v value 0-100%
     */
    public setHSV(h:number,s:number,v:number):void{
        h/=100;
        s/=100;
        v/=100;
        let r:number = 0, g:number = 0, b:number = 0;

        const i:number = Math.floor(h * 6);
        const f:number = h * 6 - i;
        const p:number = v * (1 - s);
        const q:number = v * (1 - f * s);
        const t:number = v * (1 - (1 - f) * s);

        switch (i % 6) {
            case 0: {
                r = v; g = t;
                b = p; break;
            }
            case 1: {
                r = q; g = v;
                b = p;
                break;
            }
            case 2: {
                r = p; g = v;
                b = t;
                break;
            }
            case 3: {
                r = p; g = q;
                b = v;
                break;
            }
            case 4: {
                r = t; g = p;
                b = v;
                break;
            }
            case 5: {
                r = v; g = p;
                b = q;
                break;
            }
        }
        this.setRGB(
            ~~(r*255) as byte,
            ~~(b*255) as byte,
            ~~(b*255) as byte,
        );
    }

    public setHSL(h:number,s:number,l:number):void{
        this.setHSLA(h,s,l,255);
    }

    public set(another:IColor):void{
        this.setRGBA(another.r,another.g,another.b,another.a);
    }

    public clone():Color{
        return new Color(this._r,this._g,this._b,this._a);
    }

    public freeze():IColorFrozen{
        this._friezed = true;
        return this as IColorFrozen;
    }


    public asGL():[r:number,g:number,b:number,a:number]{
        if (!this._arr) this._arr = [0,0,0,0];
        this._arr[0] = this.rNorm;
        this._arr[1] = this.gNorm;
        this._arr[2] = this.bNorm;
        this._arr[3] = this.aNorm;
        return this._arr;
    }

    public asCSS():string{
        return `rgba(${this._r},${this._g},${this._b},${this._a/255})`;
    }

    public asRGBNumeric():number {
        return (this._r<<16)|(this._g<<8)|this._b;
    }

    public toJSON():IColorJSON{
        return {r:this._r,g:this._g,b:this._b,a:this._a};
    }

    public fromJSON(json:IColorJSON):void {
        this.setRGBA(json.r,json.g,json.b,json.a);
    }

    public fromCSS(val:string):void {
        const json:IColorJSON = Color._calculateColorComponentsFromCss(val);
        this.fromJSON(json);
    }

    private checkFriezed():void{
        if (this._friezed) {
            if (DEBUG) {
                console.error(this);
                throw new DebugError(`the color is friezed and can no be changed`);
            }
            else throw new Error('friezed');
        }

    }

    private normalizeToZeroOne():void{
        this.rNorm = this._r / 0xff;
        this.gNorm = this._g / 0xff;
        this.bNorm = this._b / 0xff;
        this.aNorm = this._a / 0xff;
    }

}
