import {Optional} from "@engine/core/declarations";
import {clearString} from "@engine/renderable/impl/geometry/_internal/clearString";
import {DebugError} from "@engine/debug/debugError";

export class BasicStringTokenizer {
    protected _pos:number = 0;
    protected _lastPos:Optional<number>;

    public readonly _CHAR:string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; // to avoid regexps
    public readonly _NUM:string = '01234567890.';

    constructor(private readonly source:string){
        this.source = clearString(source);
    }

    public isEof():boolean{
        return this._pos===this.source.length;
    }

    public getNextNumber(defaultResult?:number):number{
        this.skipWhiteSpaces();
        const lastPos:number = this._lastPos as number;
        let sign:number = 1;
        if (this.source[this._pos]==='-') {
            sign = -1;
            this._pos++;
        }
        let s:string = this.getNextToken(this._NUM);
        if (sign===1 && !s && defaultResult!==undefined) return defaultResult;
        // check for numbers  like 2.52e-4
        if (this.source[this._pos]==='e') {
            this._pos++;
            s+='e'+this.getNextNumber();
        }
        if (DEBUG && s.length===0) {
            console.error(this.source);
            throw new DebugError(`can not read number, wrong next symbol: ${this.source[this._pos]}`);
        }
        let n:number = +s;
        if (DEBUG && isNaN(n)) {
            console.error(this.source);
            throw new DebugError(`can not read number: ${sign===1?'':'-'}${s}`);
        }
        n*=sign;
        this._lastPos = lastPos;
        return n;
    }

    public getRestString():string {
        return this.source.substr(this._pos);
    }

    private skipWhiteSpaces():void{
        while (!this.isEof()){
            if ([',',' '].indexOf(this.source[this._pos])===-1) break;
            this._pos++;
        }
    }

    public getNextToken(allowedSymbols:string, limit:number = 0):string{
        if (DEBUG && this.isEof()) {
            console.error(this.source);
            throw new DebugError(`unexpected end of string`);
        }
        let char:string;
        let res:string = '';
        this.skipWhiteSpaces();
        this._lastPos = this._pos;
        while (!this.isEof()){
            char = this.source[this._pos];
            if (allowedSymbols.indexOf(char)===-1) break;
            if (limit>0 && res.length===limit) break;
            // resolve situation like ,1.88.2, ====>  ,1.88 0.2, for numeric symbols
            if (allowedSymbols===this._NUM && char==='.' && res.indexOf('.')>-1) break;
            res+=char;
            this._pos++;
        }
        return res;
    }

    public skipOptionalToken(tkn:string):boolean {
        return this.getNextToken(tkn,tkn.length)===tkn;
    }

    public skipRequiredToken(tkn:string):void {
        if (!this.skipOptionalToken(tkn)) {
            console.error(this.source);
            throw new Error(`token "${tkn}" is expected`);
        }
    }

    public readUntilSymbol(symbol:string):string{
        if (DEBUG && this.isEof()) {
            console.error(this.source);
            throw new DebugError(`unexpected end of string, expected: ${symbol}`);
        }
        let char:string;
        let res:string = '';
        this.skipWhiteSpaces();
        this._lastPos = this._pos;
        while (!this.isEof()){
            char = this.source[this._pos];
            if (char===symbol) break;
            res+=char;
            this._pos++;
        }
        return res;
    }

}
