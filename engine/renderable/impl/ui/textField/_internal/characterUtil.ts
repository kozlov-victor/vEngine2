

export interface ICharacterInfo {
    rawChar:string;
    isEmoji:boolean;
    bold?:boolean;
    italic?:boolean;
    color?:IColor;
}

export class StringEx {

    public static fromRaw(s:string):StringEx{
        return new StringEx(stringToCharacters(s));
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

    public concat(str:StringEx):this {
        this.chars.push(...str.chars);
        return this;
    }

    public asRaw():string{
        return this.chars.map(it=>it.rawChar).join('');
    }

    public setBold(val:boolean){
        this.chars.forEach(c=>c.bold=val);
    }

    public setItalic(val:boolean){
        this.chars.forEach(c=>c.italic=val);
    }

    public setColor(col:IColor){
        this.chars.forEach(c=>c.color=col);
    }

}

export const stringToCharacters = (str:string):ICharacterInfo[]=> {
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
    return output;
}


