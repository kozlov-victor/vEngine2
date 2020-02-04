
import {Shape} from "@engine/renderable/abstract/shape";
import {Line} from "@engine/renderable/impl/geometry/line";
import {Point2d} from "@engine/geometry/point2d";
import {DebugError} from "@engine/debug/debugError";
import {Game} from "@engine/core/game";
import {arcToBezier} from "@engine/renderable/impl/geometry/helpers/arcToBezier";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {Optional} from "@engine/core/declarations";
import {createSplinePathFromPoints} from "@engine/renderable/impl/geometry/helpers/splineFromPoints";


const clearString = (s:string):string=>{
    return s.replace(/\s\s+/g, ' ').trim();
};

type v2 = [number,number];

// adds 1 or more v2s
const add = (a:v2, ...args:v2[]):v2=> {
    const n:[number,number] = [...a] as [number,number];
    args.forEach((p) => {
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
    const cPoints:v2[] = [];
    for (let i:number = 0; i < numPoints-1; ++i) {
        const t:number = i / (numPoints - 1);
        cPoints.push(getPointOnBezierCurve(points, offset, t));
    }
    // correct possible deviation of last point
    cPoints[cPoints.length-1] = points[points.length-1];
    return cPoints;
};

class SvgTokenizer {
    public lastCommand:string;

    private pos:number = 0;
    private lastPos:Optional<number>;

    private readonly CHAR:string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; // to avoid regexps
    private readonly NUM:string = '01234567890.';

    constructor(private readonly path:string){
        this.path = clearString(path);
    }

    public isEof():boolean{
        return this.pos===this.path.length;
    }

    public releaseNextToken(){
        if (DEBUG && this.lastPos===undefined) throw new DebugError(`can not release next token`);
        this.pos = this.lastPos as number;
        this.lastPos = undefined;
    }

    public getNextCommand():string{
        let tkn:string = this.getNextToken(this.CHAR);
        if (!tkn) tkn = ''+this.getNextNumber();
        //console.log('next command',tkn);
        return tkn;
    }

    public getNextNumber():number{
        this.skipWhiteSpaces();
        const lastPos:number = this.lastPos as number;
        let sign:number = 1;
        if (this.path[this.pos]==='-') {
            sign = -1;
            this.pos++;
        }
        let s:string = this.getNextToken(this.NUM);
        // check for numbers  like 2.52e-4
        if (this.path[this.pos]==='e') {
            this.pos++;
            s+='e'+this.getNextNumber();
        }
        if (DEBUG && s.length===0) {
            throw new DebugError(`can not read number, wrong next symbol: ${this.path[this.pos]}`);
        }
        let n:number = +s;
        if (DEBUG && isNaN(n)) throw new DebugError(`can not read number: ${sign===1?'':'-'}${s}`);
        n*=sign;
        this.lastPos = lastPos;
        //console.log('next number',n);
        return n;
    }

    private skipWhiteSpaces():void{
        while (!this.isEof()){
            if ([',',' '].indexOf(this.path[this.pos])===-1) break;
            this.pos++;
        }
    }

    private getNextToken(allowedSymbols:string){
        if (DEBUG && this.isEof()) throw new DebugError(`unexpected end of string`);
        let char:string;
        let res:string = '';
        this.skipWhiteSpaces();
        this.lastPos = this.pos;
        while (!this.isEof()){
            char = this.path[this.pos];
            if (allowedSymbols.indexOf(char)===-1) break;
            res+=char;
            this.pos++;
        }
        return res.trim();
    }

}

export class PolyLine extends Shape {

    public get lineWidth(){
        return this._lineWidth;
    }

    public set lineWidth(val:number){
        this._lineWidth = val;
        this.passPropertiesChildren();
    }

    public set borderRadius(val:number){
        this._borderRadius = val;
        this.passPropertiesChildren();
    }

    public get borderRadius(){
        return this._borderRadius;
    }

    public static fromMultiCurveSvgPath(game:Game,path:string):PolyLine[]{
        const polyLines:PolyLine[] = [];
        path.split('\n').join(' ').split(/(.*?z)/gi).forEach((p:string)=>{ // todo z and m
            if (!p.trim()) return;
            const polyLine:PolyLine = PolyLine.fromSvgPath(game,p);
            polyLines.push(polyLine);
        });
        return polyLines;
    }

    public static fromPoints(game:Game,points:number[]|string):PolyLine{
        if (typeof points === 'string') {
            points = clearString(points).split(/[ |,]/).map((it:string)=>{
                const n:number = parseFloat(it);
                if (DEBUG && isNaN(n)) throw new DebugError(`can not parse vertex array ${points}: unexpected value ${it}`);
                return n;
            });
        }
        const pl:PolyLine = new PolyLine(game);
        pl.moveTo(points[0],points[1]);
        for (let i:number=2;i<points.length;i+=2) {
            pl.lineTo(points[i],points[i+1]);
        }
        return pl;
    }

    // https://developer.mozilla.org/ru/docs/Web/SVG/Tutorial/Paths
    public static fromSvgPath(game:Game,path:string):PolyLine {
        const pl:PolyLine = new PolyLine(game);
        pl.tokenizer = new SvgTokenizer(path);
        let lastCommand:Optional<string>;
        while (!pl.tokenizer.isEof()) {
            const command:string = pl.tokenizer.getNextCommand();
            //console.log({command});
            if (isFinite(+command) && lastCommand) {
                pl.tokenizer.releaseNextToken();
                pl.executeCommand(lastCommand);
            }
            else {
                pl.executeCommand(command);
                lastCommand = command;
            }
        }
        return pl;
    }

    public static splineFromPoints(game:Game,points:number[]):PolyLine{
        return PolyLine.fromSvgPath(game,createSplinePathFromPoints(points));
    }

    public children:Line[];

    private lastPoint:Optional<Point2d>;
    private firstPoint:Optional<Point2d>;

    private tokenizer:SvgTokenizer;
    private _lineWidth:number = 1;
    private _borderRadius:number = 1;

    private lastBezierPoint:v2;

    private closed:boolean = false;
    private interrupted:boolean = false;

    constructor(protected game:Game){
        super(game);
        this.color.addOnChangeListener(()=>this.passPropertiesChildren());
    }

    public moveTo(x:number,y:number):void{
        if (this.children.length>0) this.complete();
        this.lastPoint = new Point2d(x,y);
        if (!this.firstPoint) this.firstPoint = new Point2d(x,y);

    }

    public moveBy(x:number,y:number):void{
        const lastX:number = this.lastPoint?this.lastPoint.x:0;
        const lastY:number = this.lastPoint?this.lastPoint.y:0;
        this.moveTo(lastX+x,lastY+y);
    }

    public lineTo(x:number,y:number):void{
        if (!this.lastPoint) this.lastPoint = new Point2d();
        if (!this.firstPoint) this.firstPoint = new Point2d(x,y);
        this.addSegment(this.lastPoint.x,this.lastPoint.y,x,y);
        this.lastPoint.setXY(x,y);
    }


    public lineBy(x:number,y:number):void{
        const lastX:number = this.lastPoint?this.lastPoint.x:0;
        const lastY:number = this.lastPoint?this.lastPoint.y:0;
        this.lineTo(lastX+x,lastY+y);
    }

    public isClosed():boolean {
        return this.closed;
    }

    public isInterrupted():boolean {
        return this.interrupted;
    }

    public bezierTo(p1:v2,p2:v2,p3:v2,p4:v2){
        const l:number = length(p1,p2)+length(p2,p3)+length(p3,p4);
        const bezier:v2[] = getPointsOnBezierCurve([p1,p2,p3,p4],0,l);
        bezier.forEach((v:v2)=>{
            this.lineTo(v[0],v[1]);
        });
    }

    public clone(): PolyLine {
        const l:PolyLine = new PolyLine(this.game);
        this.setClonedProperties(l);
        return l;
    }

    public draw():void{}

    public close(){
        if (DEBUG && !this.firstPoint) throw new DebugError(`can not close polyline: no first point defined`);
        this.lineTo(this!.firstPoint!.x,this!.firstPoint!.y);
        this.closed = true;
        this.complete();
    }

    protected setClonedProperties(cloned:PolyLine):void{
        super.setClonedProperties(cloned);
    }

    private complete():void {
        this.lastPoint = undefined;
        this.firstPoint = undefined;
        this.interrupted = true;
    }

    private passPropertiesToChild(l:Line){
        l.borderRadius = this.borderRadius;
        l.color = this.color;
        l.fillColor = this.fillColor;
        l.lineWidth = this.lineWidth;
        l.pointTo.forceTriggerChange();
    }

    private passPropertiesChildren(){
        this.children.forEach(l=>this.passPropertiesToChild(l));
    }


    private addSegment(x:number,y:number,x1:number,y1:number){
        const line:Line = new Line(this.game);
        this.passPropertiesToChild(line);
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

    // https://developer.mozilla.org/ru/docs/Web/SVG/Tutorial/Paths
    // https://developer.mozilla.org/ru/docs/Web/SVG/Attribute/d
    // https://www.w3.org/TR/SVG/paths.html
    private executeCommand(command:string):void{
        const tokenizer:SvgTokenizer = this.tokenizer;
        switch (command) {
            case 'C': {
                const p1:v2 = [this.lastPoint!.x,this.lastPoint!.y];
                const p2:v2 = [tokenizer.getNextNumber(),tokenizer.getNextNumber()];
                const p3:v2 = [tokenizer.getNextNumber(),tokenizer.getNextNumber()];
                const p4:v2 = [tokenizer.getNextNumber(),tokenizer.getNextNumber()];
                this.lastBezierPoint = p3;
                this.bezierTo(p1,p2,p3,p4);
                break;
            }
            case 'c': {
                const p1:v2 = [this.lastPoint!.x,this.lastPoint!.y];
                const p2:v2 = [tokenizer.getNextNumber(),tokenizer.getNextNumber()];
                const p3:v2 = [tokenizer.getNextNumber(),tokenizer.getNextNumber()];
                const p4:v2 = [tokenizer.getNextNumber(),tokenizer.getNextNumber()];
                this.lastBezierPoint = add(p1,p3);
                this.bezierTo(p1,add(p1,p2),add(p1,p3),add(p1,p4));
                break;
            }
            case 'S': {
                const p1:v2 = [this.lastPoint!.x,this.lastPoint!.y];
                if (!this.lastBezierPoint || ['c','C','S','s'].indexOf(tokenizer.lastCommand)===-1) {
                    this.lastBezierPoint = p1;
                }
                const p2:v2 = [2*p1[0] - this.lastBezierPoint[0], 2*p1[1] - this.lastBezierPoint[1]];
                const p3:v2 = [tokenizer.getNextNumber(),tokenizer.getNextNumber()];
                const p4:v2 = [tokenizer.getNextNumber(),tokenizer.getNextNumber()];
                this.lastBezierPoint = p3;
                this.bezierTo(p1,p2,p3,p4);
                break;
            }
            case 's': {
                const p1:v2 = [this.lastPoint!.x,this.lastPoint!.y];
                if (!this.lastBezierPoint || ['c','C','S','s'].indexOf(tokenizer.lastCommand)===-1) this.lastBezierPoint = p1;
                const p2:v2 = [2*p1[0] - this.lastBezierPoint[0], 2*p1[1] - this.lastBezierPoint[1]];
                const p3:v2 = add(p1,[tokenizer.getNextNumber(),tokenizer.getNextNumber()]);
                const p4:v2 = add(p1,[tokenizer.getNextNumber(),tokenizer.getNextNumber()]);
                this.lastBezierPoint = p3;
                this.bezierTo(p1,p2,p3,p4);
                break;
            }
            case 'Q': {
                const p1:v2 = [this.lastPoint!.x,this.lastPoint!.y];
                const p2:v2 = [tokenizer.getNextNumber(),tokenizer.getNextNumber()];
                const p3:v2 = [p2[0],p2[1]];
                const p4:v2 = [tokenizer.getNextNumber(),tokenizer.getNextNumber()];
                this.lastBezierPoint = p3;
                this.bezierTo(p1,p2,p3,p4);
                break;
            }
            case 'q': {
                const p1:v2 = [this.lastPoint!.x,this.lastPoint!.y];
                const p2:v2 = [tokenizer.getNextNumber(),tokenizer.getNextNumber()];
                const p3:v2 = [p2[0],p2[1]];
                const p4:v2 = [tokenizer.getNextNumber(),tokenizer.getNextNumber()];
                this.lastBezierPoint = p3;
                this.bezierTo(p1,add(p1,p2),add(p1,p3),add(p1,p4));
                break;
            }
            case 'T': {
                const p1:v2 = [this.lastPoint!.x,this.lastPoint!.y];
                if (!this.lastBezierPoint || ['q','Q','T','t'].indexOf(tokenizer.lastCommand)===-1) this.lastBezierPoint = p1;
                const p2:v2 = [2*p1[0] - this.lastBezierPoint[0], 2*p1[1] - this.lastBezierPoint[1]];
                const p3:v2 = [p2[0],p2[1]];
                const p4:v2 = [tokenizer.getNextNumber(),tokenizer.getNextNumber()];
                this.lastBezierPoint = p3;
                this.bezierTo(p1,p2,p3,p4);
                break;
            }
            case 't': {
                const p1:v2 = [this.lastPoint!.x,this.lastPoint!.y];
                if (!this.lastBezierPoint || ['q','Q','T','t'].indexOf(tokenizer.lastCommand)===-1) this.lastBezierPoint = p1;
                const p2:v2 = [2*p1[0] - this.lastBezierPoint[0], 2*p1[1] - this.lastBezierPoint[1]];
                const p3:v2 = add(p1,[p2[0],p2[1]]);
                const p4:v2 = [tokenizer.getNextNumber(),tokenizer.getNextNumber()];
                this.lastBezierPoint = p3;
                this.bezierTo(p1,add(p1,p2),p3,add(p1,p4));
                break;
            }
            case 'M': {
                this.moveTo(tokenizer.getNextNumber(), tokenizer.getNextNumber());
                break;
            }
            case 'm': {
                this.moveBy(tokenizer.getNextNumber(),tokenizer.getNextNumber());
                break;
            }
            case 'L': {
                this.lineTo(tokenizer.getNextNumber(),tokenizer.getNextNumber());
                break;
            }
            case 'l': {
                this.lineBy(tokenizer.getNextNumber(),tokenizer.getNextNumber());
                break;
            }
            case 'H': {
                this.lineTo( tokenizer.getNextNumber(),this!.lastPoint!.y);
                break;
            }
            case 'h': {
                this.lineBy( tokenizer.getNextNumber(),0);
                break;
            }
            case 'V': {
                this.lineTo(this!.lastPoint!.x,tokenizer.getNextNumber());
                break;
            }
            case 'v': {
                this.lineBy(0,tokenizer.getNextNumber());
                break;
            }
            case 'A':
            case 'a':
                // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
                // a rx ry x-axis-rotation large-arc-flag sweep-flag dx dy
                const rx:number = tokenizer.getNextNumber();
                const ry:number = tokenizer.getNextNumber();
                const xAxisRotation:number = tokenizer.getNextNumber();
                const largeArcFlag:0|1 = tokenizer.getNextNumber() as (0|1);
                if (DEBUG && largeArcFlag!==0 && largeArcFlag!==1) throw new DebugError(`wrong largeArcFlag value: ${largeArcFlag}`);
                const sweepFlag:0|1 = tokenizer.getNextNumber() as (0|1);
                if (DEBUG && sweepFlag!==0 && sweepFlag!==1) throw new DebugError(`wrong largeArcFlag value: ${sweepFlag}`);
                let x:number = tokenizer.getNextNumber();
                let y:number = tokenizer.getNextNumber();
                if (command==='a') {
                    x+=this.lastPoint!.x;
                    y+=this.lastPoint!.y;
                }

                const arcs:{x:number,y:number,x1:number,y1:number,x2:number,y2:number}[]|undefined = arcToBezier(
                    this.lastPoint!.x,this.lastPoint!.y,
                    x,y,
                    rx,ry,
                    xAxisRotation,
                    largeArcFlag ,sweepFlag
                );
                if (arcs!==undefined) arcs.forEach((arc:{x:number,y:number,x1:number,y1:number,x2:number,y2:number},i:number)=>{
                    let xTo:number = arc.x;
                    let yTo:number = arc.y;
                    if (i===arcs.length-1) {
                        xTo = x;
                        yTo = y;
                    }
                    this.bezierTo([this.lastPoint!.x,this.lastPoint!.y],[arc.x1,arc.y1],[arc.x2,arc.y2],[xTo,yTo]);
                });

                break;
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

}
