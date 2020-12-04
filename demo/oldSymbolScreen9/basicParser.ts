// https://www.youtube.com/watch?v=zPxSvMIsmJU&ab_channel=JohnMetcalf
class Tokenizer {

    private sourcePointer:number;

    constructor(private source:string, private line:number) {
        this.sourcePointer = 0;
    }

    public getNextNumber():number {
        let src:string = '';
        while (this.sourcePointer<this.source.length) {
            const token:string = this.source[this.sourcePointer];
            if ('0123456789'.indexOf(token)>-1) {
                src+=token;
                this.sourcePointer++;
            } else break;
        }
        const numeric:number = Number.parseInt(src);
        if (!Number.isFinite(numeric)) throw new Error(`wrong numeric token ${src}, line: ${this.line}, col: ${this.sourcePointer-1}`);
        return numeric;
    }

}

export class BasicParser {

    public parse(source:string){
        source.split('\n').forEach((it,index)=>this.parseLine(it.trim(),index));
    }

    private parseLine(line:string,index:number) {
        if (line.length===0) return;
        const tokenizer = new Tokenizer(line,index);
        const number:number = tokenizer.getNextNumber();
        console.log(number);
    }

}
