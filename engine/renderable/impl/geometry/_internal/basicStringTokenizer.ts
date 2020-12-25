import {Optional} from "@engine/core/declarations";
import {clearSvgString} from "@engine/renderable/impl/geometry/_internal/clearSvgString";
import {DebugError} from "@engine/debug/debugError";

export class BasicStringTokenizer {
    protected _pos:number = 0;
    protected _lastPos:Optional<number>;

    public readonly _CHAR:string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; // to avoid regexps
    public readonly _NUM:string = '01234567890.';

    constructor(private readonly path:string){
        this.path = clearSvgString(path);
    }

    public isEof():boolean{
        return this._pos===this.path.length;
    }

    public getNextNumber(defaultResult?:number):number{
        this.skipWhiteSpaces();
        const lastPos:number = this._lastPos as number;
        let sign:number = 1;
        if (this.path[this._pos]==='-') {
            sign = -1;
            this._pos++;
        }
        let s:string = this.getNextToken(this._NUM);
        if (sign===1 && !s && defaultResult!==undefined) return defaultResult;
        // check for numbers  like 2.52e-4
        if (this.path[this._pos]==='e') {
            this._pos++;
            s+='e'+this.getNextNumber();
        }
        if (DEBUG && s.length===0) {
            throw new DebugError(`can not read number, wrong next symbol: ${this.path[this._pos]}`);
        }
        let n:number = +s;
        if (DEBUG && isNaN(n)) throw new DebugError(`can not read number: ${sign===1?'':'-'}${s}`);
        n*=sign;
        this._lastPos = lastPos;
        return n;
    }

    public getRestString():string {
        return this.path.substr(this._pos);
    }

    private skipWhiteSpaces():void{
        while (!this.isEof()){
            if ([',',' '].indexOf(this.path[this._pos])===-1) break;
            this._pos++;
        }
    }

    public getNextToken(allowedSymbols:string, limit:number = 0):string{
        if (DEBUG && this.isEof()) throw new DebugError(`unexpected end of string`);
        let char:string;
        let res:string = '';
        this.skipWhiteSpaces();
        this._lastPos = this._pos;
        while (!this.isEof()){
            char = this.path[this._pos];
            if (allowedSymbols.indexOf(char)===-1) break;
            if (limit>0 && res.length===limit) break;
            // resolve situation like ,1.88.2, ====>  ,1.88 0.2, for numeric symbols
            if (allowedSymbols===this._NUM && char==='.' && res.indexOf('.')>-1) break;
            res+=char;
            this._pos++;
        }
        return res;
    }

    public skipToken(tkn:string):boolean {
        return this.getNextToken(tkn,tkn.length)===tkn;
    }

    public skipRequiredToken(tkn:string):void {
        if (!this.skipToken(tkn)) throw new Error(`token "${tkn}" is expected`);
    }

}
