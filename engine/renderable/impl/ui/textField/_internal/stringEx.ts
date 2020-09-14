

export interface ICharacterInfo {
    rawChar:string;
    isEmoji:boolean;
    bold?:boolean;
    underlined?: boolean;
    linedThrough?: boolean;
    italic?:boolean;
    color?:IColor;
}

export class StringEx {

    public static fromRaw(str:string):StringEx{
        let index:number = 0;
        const length:number = str.length;
        const output:ICharacterInfo[] = [];
        for (; index < length; ++index) {
            let charCode:number = str.charCodeAt(index);
            if (charCode >= 0xD800 && charCode <= 0xDBFF) {
                charCode = str.charCodeAt(index + 1);
                if (charCode >= 0xDC00 && charCode <= 0xDFFF) {
                    output.push({rawChar:str.slice(index, index + 2),isEmoji:true});
                    ++index;
                    continue;
                }
            }
            output.push({rawChar:str.charAt(index),isEmoji:false});
        }
        return new StringEx(output);
    }

    public static empty():StringEx {
        return new StringEx([]);
    }

    constructor(private chars:ICharacterInfo[]) {
    }

    public split(delimiter:string[]):StringEx[]{
        const result:StringEx[] = [];
        let currentChars:ICharacterInfo[] = [];
        this.chars.forEach((c,index)=>{
            if (delimiter.indexOf(c.rawChar)>-1) {
                if (currentChars.length>0) {
                    result.push(new StringEx(currentChars));
                    currentChars = [];
                }
            } else {
                currentChars.push(c);
            }
            if (index===this.chars.length-1 && currentChars.length>0) {
                result.push(new StringEx(currentChars));
            }
        });
        return result;
    }

    public getAllChars():readonly ICharacterInfo[]{
        return this.chars;
    }

    public append(str:StringEx):void {
        this.chars.push(...str.chars);
    }

    public asRaw():string{
        return this.chars.map(it=>it.rawChar).join('');
    }

    public setBold(val:boolean):void{
        this.chars.forEach(c=>c.bold=val);
    }

    public setItalic(val:boolean):void{
        this.chars.forEach(c=>c.italic=val);
    }

    public setColor(col:IColor):void{
        this.chars.forEach(c=>c.color=col);
    }

    public setUnderlined(val:boolean):void {
        this.chars.forEach(c=>c.underlined=val);
    }

    public setLinedThrough(val:boolean):void {
        this.chars.forEach(c=>c.linedThrough=val);
    }

}



