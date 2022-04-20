import {ICloneable} from "../../core/declarations";
import {DebugError} from "../../debug/debugError";
import {ObservableEntity} from "@engine/geometry/abstract/observableEntity";


export interface IColorJSON {
    r:Uint8;
    g:Uint8;
    b:Uint8;
    a:Uint8;
}

export interface IColorFrozen extends Color{
    readonly r:Uint8;
    readonly g:Uint8;
    readonly b:Uint8;
    readonly a:Uint8;
}

const alignTo2Symbols = (val:string):string=>{
    if (val.length===1) return `0`+val;
    return val;
};


export class Color extends ObservableEntity implements ICloneable<Color>, IColorJSON{


    constructor(r:Uint8 = 0, g:Uint8 = r, b:Uint8 = g, a:Uint8 = 255){
        super();
        this.setRGBA(r,g,b,a);
    }

    get r(): Uint8 {
        return this._r;
    }

    set r(value: Uint8) {
        this.setRGBA(value,this._g,this._b,this._a);
    }

    get g(): Uint8 {
        return this._g;
    }

    set g(value: Uint8) {
        this.setRGBA(this._r,value,this._b,this._a);
    }

    get b(): Uint8 {
        return this._b;
    }

    set b(value: Uint8) {
        this.setRGBA(this._r,this._g,value,this._a);
    }

    get a(): Uint8 {
        return this._a;
    }

    set a(value: Uint8) {
        this.setRGBA(this._r,this._g,this._b,value);
    }

    public static WHITE = Color.RGB(255,255,255).freeze();
    public static GREY  = Color.RGB(127,127,127).freeze();
    public static BLACK = Color.RGB(0,0,0).freeze();
    public static NONE  = Color.RGBA(0,0,0,0).freeze();

    public readonly type:'Color' = 'Color';

    private _r:Uint8;
    private _g:Uint8;
    private _b:Uint8;
    private _a:Uint8;

    private rNorm:number;
    private gNorm:number;
    private bNorm:number;
    private aNorm:number;
    private _arr:Float32Array;
    private _friezed:boolean = false;

    public static RGB(r:Uint8, g:Uint8 = r, b:Uint8 = r):Color{
        return Color.RGBA(r,g,b,255);
    }


    public static RGBA(r:Uint8, g:Uint8 = r, b:Uint8 = g, a:Uint8 = 255):Color{
        return new Color(r,g,b,a);
    }

    public static from(col:IColor):Color {
        return new Color(col.r,col.g,col.b,col.a);
    }

    public static fromRGBNumeric(col:number):Color {
        const r:Uint8 = (col & 0xFF_00_00)>>(4*4) as Uint8;
        const g:Uint8 = (col & 0x00_FF_00)>>(4*2) as Uint8;
        const b:Uint8 = (col & 0x00_00_FF) as Uint8;
        return new Color(r,g,b);
    }

    public setRGBA(r:Uint8, g:Uint8, b:Uint8, a:Uint8 = 255):void{

        if (DEBUG) {
            if (r===undefined || g===undefined || b===undefined) {
                throw new DebugError(`wrong rgb color values: ${r},${g},${b}`);
            }
        }

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

    public setRGB(r:Uint8, g:Uint8 = r, b:Uint8 = g):void{
        this.setRGBA(r,g,b,255);
    }

    public setFrom(another:IColor):void{
        this.setRGBA(another.r,another.g,another.b,another.a);
    }

    public clone():Color{
        return new Color(this._r,this._g,this._b,this._a);
    }

    public freeze():IColorFrozen{
        this._friezed = true;
        return this as IColorFrozen;
    }


    public asGL():Float32Array{
        if (!this._arr) this._arr = new Float32Array([0,0,0,0]);
        this._arr[0] = this.rNorm;
        this._arr[1] = this.gNorm;
        this._arr[2] = this.bNorm;
        this._arr[3] = this.aNorm;
        return this._arr;
    }

    public asCssRgba():string{
        return `rgba(${this._r},${this._g},${this._b},${this._a/255})`;
    }

    public asCssHex():string{
        return (
            '#'+([
                alignTo2Symbols(this._r.toString(16)),
                alignTo2Symbols(this._g.toString(16)),
                alignTo2Symbols(this._b.toString(16)),
                alignTo2Symbols(this._a.toString(16))
            ].join(''))
        );
    }

    public asRGBNumeric():number {
        return (this._r<<16)|(this._g<<8)|this._b;
    }

    public asRGBANumeric():number {
        return (this._r<<24)|(this._g<<16)|(this._b<<8)|(this._a);
    }

    public toJSON():IColorJSON{
        return {r:this._r,g:this._g,b:this._b,a:this._a};
    }

    public fromJSON(json:IColorJSON):void {
        this.setRGBA(json.r,json.g,json.b,json.a);
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
