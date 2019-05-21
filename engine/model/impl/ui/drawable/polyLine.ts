
import {Shape} from "@engine/model/impl/ui/generic/shape";
import {Line} from "@engine/model/impl/ui/drawable/line";
import {Point2d} from "@engine/geometry/point2d";
import {DebugError} from "@engine/debug/debugError";
import {Game} from "@engine/game";


const clearString = (s:string):string=>{
    return s.replace(/\s\s+/g, ' ').trim();
};

type v2 = [number,number];

// adds 1 or more v2s
const add = (a:v2, ...args:v2[]):v2=> {
    const n:[number,number] = [...a] as [number,number];
    args.forEach(p => {
        n[0] += p[0];
        n[1] += p[1];
    });
    return n;
};

const mult =(a:v2, s:number):v2=> {
    return [a[0] * s, a[1] * s];
};

const length = (a:v2,b:v2):number=>{
   return Math.sqrt(Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1]));
};

const getPointOnBezierCurve =(points:v2[], offset:number, t:number):v2=> {
    const invT:number = 1 - t;
    return add(mult(points[offset + 0], invT * invT * invT),
        mult(points[offset + 1], 3 * t * invT * invT),
        mult(points[offset + 2], 3 * invT * t * t),
        mult(points[offset + 3], t * t  *t));
};

const getPointsOnBezierCurve = (points:v2[], offset:number, numPoints:number):v2[]=> {
    const cpoints:v2[] = [];
    for (let i:number = 0; i < numPoints; ++i) {
        const t:number = i / (numPoints - 1);
        cpoints.push(getPointOnBezierCurve(points, offset, t));
    }
    return cpoints;
};


class SvgTokenizer {

    private pos:number = 0;
    private lastPos:number;
    public lastCommand:string;

    constructor(private path:string){
        this.path = clearString(path);
    }

    private readonly CHAR:RegExp = /[a-zA-Z]/i;
    private readonly NUM:RegExp = /[0-9.]/i;

    isEof():boolean{
        return this.pos===this.path.length;
    }

    private skipWhiteSpaces():void{
        while (!this.isEof()){
            if ([',',' '].indexOf(this.path[this.pos])==-1) break;
            this.pos++;
        }
    }

    private getNextToken(regexp:RegExp){
        if (DEBUG && this.isEof()) throw new DebugError(`unexpected end of string`);
        let char:string;
        let res:string = '';
        this.skipWhiteSpaces();
        this.lastPos = this.pos;
        while (!this.isEof()){
            char = this.path[this.pos];
            if (!char.match(regexp)) break;
            res+=char;
            this.pos++;
        }
        return res.trim();
    }

    releaseNextToken(){
        if (DEBUG && this.lastPos===undefined) throw new DebugError(`can not release next token`);
        this.pos = this.lastPos;
        this.lastPos = undefined;
    }

    getNextCommand():string{
        let tkn:string = this.getNextToken(this.CHAR);
        if (!tkn) tkn = ''+this.getNextNumber();
        return tkn;
    }

    getNextNumber():number{
        this.skipWhiteSpaces();
        let lastPos:number = this.lastPos;
        let sign:number = 1;
        if (this.path[this.pos]=='-') {
            sign = -1;
            this.pos++;
        }
        let s:string = this.getNextToken(this.NUM);
        // check for numbers  like 2.52e-4
        if (this.path[this.pos]==='e') {
            this.pos++;
            s+='e'+this.getNextNumber();
        }
        let n:number = +s;
        if (DEBUG && isNaN(n)) throw new DebugError(`can not read number: ${sign==1?'':'-'}${s}`);
        n*=sign;
        //console.log({number:n});
        this.lastPos = lastPos;
        return n;
    }

}

export class PolyLine extends Shape {

    private lastPoint:Point2d;
    private firstPoint:Point2d;
    vectorScaleFactor:number = 1;
    borderRadius:number = 1;

    private tokenizer:SvgTokenizer;

    constructor(protected game:Game){
        super(game);
        this.lineWidth = 1;
    }

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

    moveBy(x:number,y:number):void{
        const lastX:number = this.lastPoint?this.lastPoint.x:0;
        const lastY:number = this.lastPoint?this.lastPoint.y:0;
        this.moveTo(lastX+x,lastY+y);
    }

    lineTo(x:number,y:number):void{
        if (!this.lastPoint) this.lastPoint = new Point2d();
        if (!this.firstPoint) this.firstPoint = new Point2d(x,y);
        this.addSegment(this.lastPoint.x,this.lastPoint.y,x,y);
        this.lastPoint.setXY(x,y);
    }


    lineBy(x:number,y:number):void{
        const lastX:number = this.lastPoint?this.lastPoint.x:0;
        const lastY:number = this.lastPoint?this.lastPoint.y:0;
        this.lineTo(lastX+x,lastY+y);
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
            points = clearString(points).split(/[ |,]/).map((it:string)=>{
                const n:number = parseFloat(it);
                if (DEBUG && isNaN(n)) throw new DebugError(`can not parse vertex array ${points}: unexpected value ${it}`);
                return n;
            });
        }
        this.moveTo(points[0],points[1]);
        for (let i:number=2;i<points.length;i+=2) {
            this.lineTo(points[i],points[i+1]);
        }
    }


    bezierTo(p1:v2,p2:v2,p3:v2,p4:v2){
        const l:number = length(p1,p2)+length(p2,p3)+length(p3,p4);
        const bezier:v2[] = getPointsOnBezierCurve([p1,p2,p3,p4],0,l);
        bezier.forEach((v:v2)=>{
            this.lineTo(v[0],v[1]);
        });
    }


    private lastBezierPoint:v2;

    private executeCommand(command:string):void{
        const tokenizer:SvgTokenizer = this.tokenizer;
        switch (command) {
            case 'M': {
                const x:number = tokenizer.getNextNumber();
                const y:number = tokenizer.getNextNumber();
                this.moveTo(x,y);
                break;
            }
            case 'm': {
                const x:number = tokenizer.getNextNumber();
                const y:number = tokenizer.getNextNumber();
                this.moveBy(x,y);
                break;
            }
            case 'L': {
                const x:number = tokenizer.getNextNumber();
                const y:number = tokenizer.getNextNumber();
                this.lineTo(x,y);
                break;
            }
            case 'l': {
                const x:number = tokenizer.getNextNumber();
                const y:number = tokenizer.getNextNumber();
                this.lineBy(x,y);
                break;
            }
            case 'H': {
                const x:number = tokenizer.getNextNumber();
                const y:number = this.lastPoint.y;
                this.lineTo(x,y);
                break;
            }
            case 'h': {
                const x:number = tokenizer.getNextNumber();
                this.lineBy(x,0);
                break;
            }
            case 'V': {
                const x:number = this.lastPoint.x;
                const y:number = tokenizer.getNextNumber();
                this.lineTo(x,y);
                break;
            }
            case 'v': {
                const y:number = tokenizer.getNextNumber();
                this.lineBy(0,y);
                break;
            }
            case 'C': {
                const p1:v2 = [this.lastPoint.x,this.lastPoint.y];
                const p2:v2 = [tokenizer.getNextNumber(),tokenizer.getNextNumber()];
                const p3:v2 = [tokenizer.getNextNumber(),tokenizer.getNextNumber()];
                const p4:v2 = [tokenizer.getNextNumber(),tokenizer.getNextNumber()];
                this.lastBezierPoint = p3;
                this.bezierTo(p1,p2,p3,p4);
                break;
            }
            case 'c': {
                const p1:v2 = [this.lastPoint.x,this.lastPoint.y];
                const p2:v2 = [tokenizer.getNextNumber(),tokenizer.getNextNumber()];
                const p3:v2 = [tokenizer.getNextNumber(),tokenizer.getNextNumber()];
                const p4:v2 = [tokenizer.getNextNumber(),tokenizer.getNextNumber()];
                this.lastBezierPoint = add(p1,p3);
                this.bezierTo(p1,add(p1,p2),add(p1,p3),add(p1,p4));
                break;
            }
            case 'S': { // bad tested
                const p1:v2 = [this.lastPoint.x,this.lastPoint.y];
                if (!this.lastBezierPoint || ['c','C','S','s'].indexOf(tokenizer.lastCommand)==-1) {
                    this.lastBezierPoint = p1;
                }
                const p2:v2 = [2*p1[0] - this.lastBezierPoint[0], 2*p1[1] - this.lastBezierPoint[1]];
                const p3:v2 = [tokenizer.getNextNumber(),tokenizer.getNextNumber()];
                const p4:v2 = [tokenizer.getNextNumber(),tokenizer.getNextNumber()];
                this.lastBezierPoint = p3;
                this.bezierTo(p1,p2,p3,p4);
                break;
            }
            case 's': { // todo only stub, bad tested
                const p1:v2 = [this.lastPoint.x,this.lastPoint.y];
                if (!this.lastBezierPoint || ['c','C','S','s'].indexOf(tokenizer.lastCommand)==-1) this.lastBezierPoint = p1;
                const p2:v2 = [2*p1[0] - this.lastBezierPoint[0], 2*p1[1] - this.lastBezierPoint[1]];
                const p3:v2 = add(p1,[tokenizer.getNextNumber(),tokenizer.getNextNumber()]);
                const p4:v2 = add(p1,[tokenizer.getNextNumber(),tokenizer.getNextNumber()]);
                this.lastBezierPoint = p3;
                this.bezierTo(p1,p2,p3,p4);
                break;
            }
            case 'Q': {
                const p1:v2 = [this.lastPoint.x,this.lastPoint.y];
                const p2:v2 = [tokenizer.getNextNumber(),tokenizer.getNextNumber()];
                const p3:v2 = [p2[0],p2[1]];
                const p4:v2 = [tokenizer.getNextNumber(),tokenizer.getNextNumber()];
                this.bezierTo(p1,p2,p3,p4);
                break;
            }
            // https://developer.mozilla.org/ru/docs/Web/SVG/Tutorial/Paths
            // https://developer.mozilla.org/ru/docs/Web/SVG/Attribute/d
            // https://www.w3.org/TR/SVG/paths.html
            // T, A, q,  -unimplemented
            case 'Z':
            case 'z':
                this.close();
                break;
            default:
                if (DEBUG) throw new DebugError(`unexpected command: '${command}'`);
                break;
        }
        tokenizer.lastCommand = command;
    }

    // https://developer.mozilla.org/ru/docs/Web/SVG/Tutorial/Paths
    setSvgPath(path:string){
        this.tokenizer = new SvgTokenizer(path);
        let lastCommand:string;
        while (!this.tokenizer.isEof()) {
            const command:string = this.tokenizer.getNextCommand();
            //console.log({command});
            if (isFinite(+command) && lastCommand) {
                this.tokenizer.releaseNextToken();
                this.executeCommand(lastCommand);
            }
            else {
                this.executeCommand(command);
                lastCommand = command;
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