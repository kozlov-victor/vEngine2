
import {Shape} from "@engine/model/impl/ui/generic/shape";
import {Line} from "@engine/model/impl/ui/drawable/line";
import {Point2d} from "@engine/geometry/point2d";
import {DebugError} from "@engine/debug/debugError";


const clearString = (s:string):string=>{
    return s.replace(/\s\s+/g, ' ').trim();
};

class SvgTokenizer {

    private pos:number = 0;

    constructor(private path:string){
        this.path = clearString(path);
    }

    private readonly CHAR:RegExp = /[a-zA-Z]/i;
    private readonly NUM:RegExp = /[-0-9.]/i;

    isEof():boolean{
        return this.pos===this.path.length;
    }

    private skipWhiteSpaces():void{
        while (!this.isEof()){
            if (this.path[this.pos]!==' ') break;
            this.pos++;
        }
    }

    private getNextToken(regexp:RegExp){
        if (DEBUG && this.isEof()) throw new DebugError(`unexpected end of string`);
        let char:string;
        let res:string = '';
        this.skipWhiteSpaces();
        while (!this.isEof()){
            char = this.path[this.pos];
            if (!char.match(regexp)) break;
            res+=char;
            this.pos++;
        }
        return res.trim();
    }

    getNextCommand():string{
        return this.getNextToken(this.CHAR);
    }

    getNextNumber():number{
        const s:string = this.getNextToken(this.NUM);
        const n:number = parseFloat(s);
        if (DEBUG && isNaN(n)) throw new DebugError(`can not read number: ${s}`);
        return n;
    }

}

export class PolyLine extends Shape {

    private lastPoint:Point2d;
    private firstPoint:Point2d;
    vectorScaleFactor:number = 1;
    borderRadius:number = 1;

    protected setClonedProperties(cloned:PolyLine):void{
        cloned.vectorScaleFactor = this.vectorScaleFactor;
        super.setClonedProperties(cloned);
    }


    private passProperties(l:Line){
        l.vectorScaleFactor = this.vectorScaleFactor;
        l.borderRadius = this.borderRadius;
        l.color = this.color;
        l.fillColor = this.fillColor;
        l.lineWidth = this.lineWidth;
    }


    private addSegment(x:number,y:number,x1:number,y1:number){
        const line:Line = new Line(this.game);
        this.passProperties(line);
        line.setXYX1Y1(x,y,x1,y1);
        this.appendChild(line);
        let maxW:number = this.children[0].pos.x+this.children[0].size.width;
        let maxH:number = this.children[0].pos.y+this.children[0].size.height;
        for (let i:number=1;i<this.children.length;i++){
            if (this.children[i].pos.x+this.children[i].size.width>maxW)
                maxW = this.children[i].pos.x + this.children[i].size.width;
            if (this.children[i].pos.y+this.children[i].size.height>maxH)
                maxH = this.children[i].pos.y + this.children[i].size.height;
        }
        this.size.setWH(maxW,maxH);
    }

    moveTo(x:number,y:number):void{
        if (DEBUG && this.lastPoint) throw new DebugError(`can not invoke moveTo: lineTo or moveTo already invoked`);
        this.lastPoint = new Point2d(x,y);
        if (!this.firstPoint) this.firstPoint = new Point2d(x,y);

    }

    lineTo(x:number,y:number):void{
        if (!this.lastPoint) this.lastPoint = new Point2d();
        if (!this.firstPoint) this.firstPoint = new Point2d(x,y);
        this.addSegment(this.lastPoint.x,this.lastPoint.y,x,y);
        this.lastPoint.setXY(x,y);
    }

    complete():void {
        this.lastPoint = null;
        this.firstPoint = null;
    }

    close(){
        if (DEBUG && !this.firstPoint) throw new DebugError(`can not close polyline: no first point defined`);
        this.lineTo(this.firstPoint.x,this.firstPoint.y);
        this.complete();
    }


    setPoints(points:number[]|string){
        if (typeof points === 'string') {
            points = clearString(points).split(/[ |,]/).map(it=>parseFloat(it));
        }
        this.moveTo(points[0],points[1]);
        for (let i:number=2;i<points.length;i+=2) {
            this.lineTo(points[i],points[i+1]);
        }
    }


    setSvgPath(path:string){
        const tokenizer:SvgTokenizer = new SvgTokenizer(path);
        while (!tokenizer.isEof()) {
            const command:string = tokenizer.getNextCommand();
            switch (command) {
                case 'M': {
                    const x:number = tokenizer.getNextNumber();
                    const y:number = tokenizer.getNextNumber();
                    this.moveTo(x,y);
                    break;
                }
                case 'L': {
                    const x:number = tokenizer.getNextNumber();
                    const y:number = tokenizer.getNextNumber();
                    this.lineTo(x,y);
                    break;
                }
                case 'z':
                    this.close();
                    break;
                default:
                    if (DEBUG) throw new DebugError(`unexpected command: '${command}'`);
                    break;
            }
        }
    }

    clone(): PolyLine {
        const l:PolyLine = new PolyLine(this.game);
        this.setClonedProperties(l);
        return l;
    }

    draw():boolean{
        return true;
    }

}