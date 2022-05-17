import {Point2d} from "@engine/geometry/point2d";
import {DebugError} from "@engine/debug/debugError";
import {arcToBezier} from "@engine/renderable/impl/geometry/_internal/arcToBezier";
import {Optional} from "@engine/core/declarations";
import {Game} from "@engine/core/game";
import {BasicStringTokenizer} from "@engine/renderable/impl/geometry/_internal/basicStringTokenizer";
import {add, v2} from "@engine/renderable/impl/geometry/_internal/v2";
import {getPointsOnBezierCurveWithSplitting} from "@engine/renderable/impl/geometry/_internal/getPointsOnBezierCurve";

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

interface IVertexGroup {
    vertexArray: number[],
    closed: boolean;
}

export class SvgPathToVertexArrayBuilder {

    private lastPoint:Optional<Point2d>;
    private firstPoint:Optional<Point2d>;
    private lastBezierPoint:v2;

    public lastPenPoint:Point2d = new Point2d();

    private tokenizer:SvgTokenizer;
    private currentVertexGroup:IVertexGroup = {vertexArray:[],closed:false};
    private result:IVertexGroup[] = [];

    constructor(private game:Game) {
        this.result.push(this.currentVertexGroup);
    }

    public parsePolylines(path:string,close:boolean):IVertexGroup[]{
        this.tokenizer = new SvgTokenizer(path);
        let lastCommand:Optional<string>;
        while (!this.tokenizer.isEof()) {
            const command:string = this.tokenizer.getNextCommand();
            //console.log({command});
            if (isFinite(+command) && lastCommand) {
                this.tokenizer.releaseNextToken();
                if (lastCommand==='M') lastCommand = 'L';
                else if (lastCommand==='m') lastCommand = 'l'; // to solve situation like "M25,225 25,25 225,25 225,225z" (implicit L command)
                this.executeCommand(lastCommand);
            }
            else {
                this.executeCommand(command);
                lastCommand = command;
            }
        }
        if (close) this.close();
        if (this.result.indexOf(this.currentVertexGroup)===-1) this.result.push(this.currentVertexGroup);
        return this.result;
    }

    public getLastResult():IVertexGroup {
        return this.currentVertexGroup;
    }

    public getResult():IVertexGroup[] {
        return this.result;
    }

    public moveTo(x:number,y:number):void{
        if (this.currentVertexGroup.vertexArray.length>0) this.complete();
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

    public bezierCurveTo(x1:number,y1:number,x2:number,y2:number,x3:number,y3:number):void{
        this._bezierTo([this.lastPoint?.x??0,this.lastPoint?.y??0],[x1,y1],[x2,y2],[x3,y3]);
    }

    public quadraticCurveTo(x1:number,y1:number,x2:number,y2:number):void {
        const QP0:v2 = [this.lastPoint!.x,this.lastPoint!.y];
        const QP1:v2 = [x1,y1];
        const QP2:v2 = [x2,y2];
        const p1:v2 = [...QP0];
        const p2:v2 = [
            QP0[0] + 2/3*(QP1[0]-QP0[0])
            ,
            QP0[1] + 2/3*(QP1[1]-QP0[1])
        ];
        const p3:v2 = [
            QP2[0] + 2/3*(QP1[0]-QP2[0])
            ,
            QP2[1] + 2/3*(QP1[1]-QP2[1])
        ];
        const p4:v2 = [...QP2];
        this._bezierTo(p1,p2,p3,p4);
    }

    public close():void{
        if (!this.firstPoint) return;
        this.lineTo(this!.firstPoint!.x,this!.firstPoint!.y);
        this.currentVertexGroup.closed = true;
        this.complete();
    }

    private createNextVertexArray():void {
        if (this.result.indexOf(this.currentVertexGroup)===-1) this.result.push(this.currentVertexGroup);
        this.currentVertexGroup = {vertexArray:[],closed:false};
    }

    private _bezierTo(p1:v2,p2:v2,p3:v2,p4:v2):void{
        const bezier:v2[] = getPointsOnBezierCurveWithSplitting([p1,p2,p3,p4], 0, 0.5);
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
            this._bezierTo([this.lastPoint!.x,this.lastPoint!.y],[arc.x1,arc.y1],[arc.x2,arc.y2],[xTo,yTo]);
        });
    }

    private complete():void {
        this.firstPoint = undefined;
        if (this.tokenizer===undefined || !this.tokenizer.isEof()) this.createNextVertexArray();
    }

    private addSegment(x:number,y:number,x1:number,y1:number):void{
        // const line:Line = new Line(this.game);
        // line.setXYX1Y1(x,y,x1,y1);
        if (this.currentVertexGroup.vertexArray.length===0) {
            this.currentVertexGroup.vertexArray.push(x,y);
        }
        this.currentVertexGroup.vertexArray.push(x1,y1);
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
                this.lineTo(tokenizer.getNextNumber(),this!.lastPoint!.y);
                break;
            }
            case 'h': {
                this.lineBy(tokenizer.getNextNumber(),0);
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
                this._bezierTo(p1,p2,p3,p4);
                break;
            }
            case 'c': { // cubic Bézier curve
                const p1:v2 = [this.lastPoint!.x,this.lastPoint!.y];
                const p2:v2 = [tokenizer.getNextNumber(),tokenizer.getNextNumber()];
                const p3:v2 = [tokenizer.getNextNumber(),tokenizer.getNextNumber()];
                const p4:v2 = [tokenizer.getNextNumber(),tokenizer.getNextNumber()];
                this.lastBezierPoint = add(p1,p3);
                this._bezierTo(p1,add(p1,p2),add(p1,p3),add(p1,p4));
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
                this._bezierTo(p1,p2,p3,p4);
                break;
            }
            case 's': {
                const p1:v2 = [this.lastPoint!.x,this.lastPoint!.y];
                if (!this.lastBezierPoint || ['c','C','S','s'].indexOf(tokenizer.lastCommand)===-1) this.lastBezierPoint = p1;
                const p2:v2 = [2*p1[0] - this.lastBezierPoint[0], 2*p1[1] - this.lastBezierPoint[1]];
                const p3:v2 = add(p1,[tokenizer.getNextNumber(),tokenizer.getNextNumber()]);
                const p4:v2 = add(p1,[tokenizer.getNextNumber(),tokenizer.getNextNumber()]);
                this.lastBezierPoint = p3;
                this._bezierTo(p1,p2,p3,p4);
                break;
            }
            case 'q':
            case 'Q': {
                // quadratic Bézier curve
                // https://stackoverflow.com/questions/3162645/convert-a-quadratic-bezier-to-a-cubic-one
                //CP1 = QP0 + 2/3 *(QP1-QP0)
                //CP2 = QP2 + 2/3 *(QP1-QP2)

                const isRelative:boolean = command==='q';

                const QP0:v2 = [this.lastPoint!.x,this.lastPoint!.y];
                let QP1:v2 = [tokenizer.getNextNumber(),tokenizer.getNextNumber()];
                let QP2:v2 = [tokenizer.getNextNumber(),tokenizer.getNextNumber()];

                if (isRelative) {
                    QP1 = add(QP1,QP0);
                    QP2 = add(QP2,QP0);
                }

                const p1:v2 = [...QP0];
                const p2:v2 = [
                    QP0[0] + 2/3*(QP1[0]-QP0[0])
                    ,
                    QP0[1] + 2/3*(QP1[1]-QP0[1])
                ];
                const p3:v2 = [
                    QP2[0] + 2/3*(QP1[0]-QP2[0])
                    ,
                    QP2[1] + 2/3*(QP1[1]-QP2[1])
                ];
                const p4:v2 = [...QP2];

                this.lastBezierPoint = QP1;
                this._bezierTo(p1,p2,p3,p4);
                break;
            }
            case 't':
            case 'T': { // smooth quadratic Bézier curve
                // https://www.w3.org/TR/SVG/paths.html

                const isRelative:boolean = command==='t';

                const QP0:v2 = [this.lastPoint!.x,this.lastPoint!.y];
                if (!this.lastBezierPoint || ['q','Q','T','t'].indexOf(tokenizer.lastCommand)===-1) this.lastBezierPoint = QP0;
                const QP1:v2 = [2*QP0[0] - this.lastBezierPoint[0], 2*QP0[1] - this.lastBezierPoint[1]];
                let QP2:v2 = [tokenizer.getNextNumber(),tokenizer.getNextNumber()];

                if (isRelative) {
                    QP2 = add(QP2,QP0);
                }

                const p1:v2 = [...QP0];
                const p2:v2 = [
                    QP0[0] + 2/3*(QP1[0]-QP0[0])
                    ,
                    QP0[1] + 2/3*(QP1[1]-QP0[1])
                ];
                const p3:v2 = [
                    QP2[0] + 2/3*(QP1[0]-QP2[0])
                    ,
                    QP2[1] + 2/3*(QP1[1]-QP2[1])
                ];
                const p4:v2 = [...QP2];

                this.lastBezierPoint = QP1;
                this._bezierTo(p1,p2,p3,p4);
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

    // private visualizePoint([x,y]:[number,number]):void{
    //     const c = new Circle(this.game);
    //     c.center.setXY(x,y);
    //     this.game.getCurrScene().appendChild(c);
    // }

}
