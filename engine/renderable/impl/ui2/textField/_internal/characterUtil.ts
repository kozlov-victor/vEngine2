

export interface ICharacterInfo {
    rawChar:string;
    isEmoji:boolean;
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
