import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {Point2d} from "@engine/geometry/point2d";
import {DebugError} from "@engine/debug/debugError";
import {arcToBezier} from "@engine/renderable/impl/geometry/_internal/arcToBezier";
import {Line} from "@engine/renderable/impl/geometry/line";
import {Optional} from "@engine/core/declarations";
import {Game} from "@engine/core/game";
import {BasicStringTokenizer} from "@engine/renderable/impl/geometry/_internal/basicStringTokenizer";

type v2 = [number,number];

// adds 1 or more v2s
const add = (a:Readonly<v2>, ...args:Readonly<v2>[]):v2=> {
    const n:v2 = [...a] as v2;
    args.forEach((p) => {
        n[0] += p[0];
        n[1] += p[1];
    });
    return n;
};

const mult =(a:Readonly<v2>, s:number):v2=> {
    return [a[0] * s, a[1] * s];
};

const length = (a:Readonly<v2>,b:Readonly<v2>):number=>{
    return Math.sqrt(Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1]));
};

const getPointOnBezierCurve =(points:Readonly<v2>[], offset:number, t:number):v2=> {
    const invT:number = 1 - t;
    return add(mult(points[offset + 0], invT * invT * invT),
        mult(points[offset + 1], 3 * t * invT * invT),
        mult(points[offset + 2], 3 * invT * t * t),
        mult(points[offset + 3], t * t  *t));
};

const getPointsOnBezierCurve = (points:Readonly<v2>[], offset:number, numPoints:number):v2[]=> {
    const cPoints:v2[] = [];
    for (let i:number = 0; i < numPoints-1; ++i) {
        const t:number = i / (numPoints - 1);
        cPoints.push(getPointOnBezierCurve(points, offset, t));
    }
    // correct possible deviation of last point
    cPoints[cPoints.length-1] = points[points.length-1] as v2;
    return cPoints;
};

class SvgTokenizer extends BasicStringTokenizer {

    public lastCommand:string;

    public releaseNextToken():void{
        if (DEBUG && this._lastPos===undefined) throw new DebugError(`can not release next token`);
        this._pos = this._lastPos as number;
        this._lastPos = undefined;
    }

    public getNextCommand():string{
        let tkn:string = this.getNextToken(this._CHAR,1);
        if (!tkn) tkn = ''+this.getNextNumber();
        //console.log('next command',tkn);
        return tkn;
    }
}

export class SvgPathCreator {

    private lastPoint:Optional<Point2d>;
    private firstPoint:Optional<Point2d>;
    private lastBezierPoint:v2;

    public lastPenPoint:Point2d = new Point2d();

    private tokenizer:SvgTokenizer;
    private currentPolyline:PolyLine;
    private result:PolyLine[] = [];

    public static passPropertiesToChild(p:PolyLine, l:Line):void{
        l.borderRadius = p.borderRadius;
        l.color = p.color;
        l.lineWidth = p.lineWidth;
        l.pointTo.forceTriggerChange();
    }

    private static calcSize(p:PolyLine):void {
        let maxW:number = p.children[0].pos.x+p.children[0].size.width;
        let maxH:number = p.children[0].pos.y+p.children[0].size.height;
        for (let i:number=1;i<p.children.length;i++){
            if (p.pos.x+p.children[i].size.width>maxW)
                maxW = p.children[i].pos.x + p.children[i].size.width;
            if (p.children[i].pos.y+p.children[i].size.height>maxH)
                maxH = p.children[i].pos.y + p.children[i].size.height;
        }
        p.size.setWH(maxW,maxH);
    }

    constructor(private game:Game) {
        this.createNextPolyline();
    }

    public parsePolylines(path:string,close:boolean):PolyLine[]{
        this.tokenizer = new SvgTokenizer(path);
        let lastCommand:Optional<string>;
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
        if (close) this.close();
        this.result.forEach(p=>{
            SvgPathCreator.calcSize(p);
        });
        return this.result;
    }

    public getLastResult():PolyLine {
        SvgPathCreator.calcSize(this.currentPolyline);
        return this.currentPolyline;
    }

    public moveTo(x:number,y:number):void{
        if (this.currentPolyline.children.length>0) this.complete();
        if (!this.lastPoint) this.lastPoint = new Point2d();
        this.lastPoint.setXY(x,y);
        this.lastPenPoint.setXY(x,y);
        if (!this.firstPoint) this.firstPoint = new Point2d();
        this.firstPoint.setXY(x,y);

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
        this.lastPenPoint.setXY(x,y);
    }


    public lineBy(x:number,y:number):void{
        const lastX:number = this.lastPoint?this.lastPoint.x:0;
        const lastY:number = this.lastPoint?this.lastPoint.y:0;
        this.lineTo(lastX+x,lastY+y);
    }

    public arcTo(rx:number,ry:number,xAxisRotation:number,largeArcFlag:0|1,sweepFlag:0|1,x:number,y:number):void{
        this._arcTo(rx,ry,xAxisRotation,largeArcFlag,sweepFlag,x,y,false);
    }

    public arcBy(rx:number,ry:number,xAxisRotation:number,largeArcFlag:0|1,sweepFlag:0|1,x:number,y:number):void{
        this._arcTo(rx,ry,xAxisRotation,largeArcFlag,sweepFlag,x,y,true);
    }


    public close():void{
        if (!this.firstPoint) return;
        this.lineTo(this!.firstPoint!.x,this!.firstPoint!.y);
        this.complete();
    }

    private createNextPolyline():void {
        this.currentPolyline = new PolyLine(this.game);
        this.currentPolyline.passMouseEventsThrough = true;
        this.result.push(this.currentPolyline);
    }

    private bezierTo(p1:v2,p2:v2,p3:v2,p4:v2):void{
        const l:number = length(p1,p2)+length(p2,p3)+length(p3,p4);
        const bezier:v2[] = getPointsOnBezierCurve([p1,p2,p3,p4],0,l);
        bezier.forEach((v:v2)=>{
            this.lineTo(v[0],v[1]);
        });
    }

    private _arcTo(rx:number,ry:number,xAxisRotation:number,largeArcFlag:0|1,sweepFlag:0|1,x:number,y:number,isRelativeCoordinates:boolean):void{

        if (DEBUG && largeArcFlag!==0 && largeArcFlag!==1) throw new DebugError(`wrong largeArcFlag value: ${largeArcFlag}`);
        if (DEBUG && sweepFlag!==0 && sweepFlag!==1) throw new DebugError(`wrong largeArcFlag value: ${sweepFlag}`);
        if (isRelativeCoordinates) {
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
    }

    private complete():void {
        //this.lastPoint = undefined;
        this.firstPoint = undefined;
        if (this.tokenizer===undefined || !this.tokenizer.isEof()) this.createNextPolyline();
    }

    private addSegment(x:number,y:number,x1:number,y1:number):void{
        const line:Line = new Line(this.game);
        SvgPathCreator.passPropertiesToChild(this.currentPolyline,line);
        line.setXYX1Y1(x,y,x1,y1);
        this.currentPolyline.appendChild(line);
    }

    // https://developer.mozilla.org/ru/docs/Web/SVG/Tutorial/Paths
    // https://developer.mozilla.org/ru/docs/Web/SVG/Attribute/d
    // https://www.w3.org/TR/SVG/paths.html
    private executeCommand(command:string):void{
        const tokenizer = this.tokenizer;
        switch (command) {
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
            case 'M': {
                this.moveTo(tokenizer.getNextNumber(), tokenizer.getNextNumber());
                break;
            }
            case 'm': {
                this.moveBy(tokenizer.getNextNumber(),tokenizer.getNextNumber());
                break;
            }
            case 'C': {
                const p1:v2 = [this.lastPoint!.x,this.lastPoint!.y];
                const p2:v2 = [tokenizer.getNextNumber(),tokenizer.getNextNumber()];
                const p3:v2 = [tokenizer.getNextNumber(),tokenizer.getNextNumber()];
                const p4:v2 = [tokenizer.getNextNumber(),tokenizer.getNextNumber()];
                this.lastBezierPoint = p3;
                this.bezierTo(p1,p2,p3,p4);
                break;
            }
            case 'c': { // cubic Bézier curve
                const p1:v2 = [this.lastPoint!.x,this.lastPoint!.y];
                const p2:v2 = [tokenizer.getNextNumber(),tokenizer.getNextNumber()];
                const p3:v2 = [tokenizer.getNextNumber(),tokenizer.getNextNumber()];
                const p4:v2 = [tokenizer.getNextNumber(),tokenizer.getNextNumber()];
                this.lastBezierPoint = add(p1,p3);
                this.bezierTo(p1,add(p1,p2),add(p1,p3),add(p1,p4));
                break;
            }
            case 'S': { // smooth cubic Bézier curve
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
            case 'Q': { // quadratic Bézier curve
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
                const p2:v2 = add(p1,[tokenizer.getNextNumber(),tokenizer.getNextNumber()]);
                const p3:v2 = [p2[0],p2[1]];
                const p4:v2 = add(p1,[tokenizer.getNextNumber(),tokenizer.getNextNumber()]);
                this.lastBezierPoint = p3;
                this.bezierTo(p1,p2,p3,p4);
                break;
            }
            case 'T': { // smooth quadratic Bézier curve
                // https://www.w3.org/TR/SVG/paths.html
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
                const p3:v2 = [p2[0],p2[1]];
                const p4:v2 = add(p1,[tokenizer.getNextNumber(),tokenizer.getNextNumber()]);
                this.lastBezierPoint = p3;
                this.bezierTo(p1,p2,p3,p4);
                break;
            }
            case 'A':
            case 'a':
                const rx:number = tokenizer.getNextNumber();
                const ry:number = tokenizer.getNextNumber();
                const xAxisRotation:number = tokenizer.getNextNumber();
                const largeArcFlag:0|1 = tokenizer.getNextNumber() as (0|1);
                const sweepFlag:0|1 = tokenizer.getNextNumber() as (0|1);
                const x:number = tokenizer.getNextNumber();
                const y:number = tokenizer.getNextNumber();
                const relative:boolean = command==='a';
                this._arcTo(rx,ry,xAxisRotation,largeArcFlag,sweepFlag,x,y,relative);
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

    // private visualizePoint([x,y]:[number,number]){
    //     const c = new Circle(this.game);
    //     c.center.setXY(x,y);
    //     this.game.getCurrScene().appendChild(c);
    // }

}
