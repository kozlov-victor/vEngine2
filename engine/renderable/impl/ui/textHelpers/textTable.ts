import {AlignTextContentHorizontal} from "@engine/renderable/impl/ui/textField/textAlign";

export interface ITextTableParams {
    border?: boolean;
    align?: AlignTextContentHorizontal;
    pad?:boolean;
}

export class TextTable {

    private readonly result:string;

    private static rightPad(str:string,toLength:number):string{
        let pad:string = "";
        for (let i:number=str.length;i<toLength;i++) pad+=" ";
        return str + pad;
    }

    private static centerPad(str:string,toLength:number):string{
        const padded:string = TextTable.leftPad(str,~~(toLength/2+str.length/2));
        return this.rightPad(padded,toLength);
    }

    private static leftPad(str:string,toLength:number):string{
        let pad = "";
        for (let i=str.length;i<toLength;i++) pad+=" ";
        return pad + str;
    }

    private static pad(str:string,toLength:number,align:AlignTextContentHorizontal):string {
        switch (align) {
            case AlignTextContentHorizontal.RIGHT: return this.leftPad(str,toLength);
            case AlignTextContentHorizontal.LEFT: return this.rightPad(str,toLength);
            default: return this.centerPad(str,toLength);
        }
    }

    private static createArray(l:number,filler:string):string[] {
        const arr:string[] = [];
        for (let i = 0; i < l; i++) {
            arr.push(filler);
        }
        return arr;
    }

    private static getLine(symbol:string,length:number):string{
        return this.createArray(length,symbol).join('');
    }

    private static normalize(arr:string[][],numOfColumns:number):void{
        arr.forEach(it=>{
            if (it.length<numOfColumns) {
                const diff:number = numOfColumns - it.length;
                it.push(...TextTable.createArray(diff,''));
            }
        });
    }

    private static createFramedText(strings:string[]):string{
        let maxLength:number = Math.max(...strings.map(it=>it.length));
        if (maxLength<3) maxLength = 3;
        let res:string = '';
        res+=(`+${this.getLine('-',maxLength)}+\n`);
        for (const s of strings) {
            res+=`|${this.centerPad(s,maxLength)}|\n`;
        }
        res+=`+${this.getLine('-',maxLength)}+`;
        return res;
    }

    public static fromArrays(arr:string[][],params?:ITextTableParams):TextTable {
        return new TextTable(arr,params);
    }

    public static fromTabbedString(s:string,params?:ITextTableParams):TextTable {
        const arr:string[][] = [];
        s.split('\n').forEach(line=>{
            arr.push(line.split('\t'));
        });
        return new TextTable(arr,params);
    }

    public static fromCSV(s:string,params?:ITextTableParams):TextTable {
        const arr:string[][] = [];
        s.split('\n').forEach(line=>{
            arr.push(line.split(','));
        });
        return new TextTable(arr,params);
    }

    private constructor(arr:string[][],params?:ITextTableParams) {
        const align:AlignTextContentHorizontal = params?.align ?? AlignTextContentHorizontal.LEFT;

        const res:string[] = [];
        const alignedCols:string[][] = [];
        const numOfRows:number = arr.length;
        const numOfColumns:number = Math.max(...arr.map(it=>it.length));
        TextTable.normalize(arr,numOfColumns);

        const padSymbol = params?.pad?' ':'';
        for (let j:number = 0; j < numOfColumns; j++) {
            const cols:string[] = [];
            for (let i:number = 0; i < numOfRows; i++) {
                const col = `${padSymbol}${arr[i][j]}${padSymbol}`;
                cols.push(col);
            }
            const maxColLength:number = Math.max(...cols.map(it=>it.length));
            alignedCols.push(cols.map(it=>TextTable.pad(it,maxColLength,align)));
        }

        const numOfCellsToIterate:number = alignedCols[0].length;
        for (let j:number = 0; j < numOfCellsToIterate; j++) {
            const row:string[] = [];
            for (let i:number = 0; i < alignedCols.length; i++) {
                row.push(alignedCols[i][j]);
            }
            res.push(row.join(params?.border?'|':' '));
        }
        if (params?.border) this.result = TextTable.createFramedText(res);
        else this.result = res.join('\n');

    }

    public toString():string{
        return this.result;
    }

}

if (typeof exports!=='undefined') {
    exports.TextTable = TextTable;
}
