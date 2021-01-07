import {Shape} from "@engine/renderable/abstract/shape";
import {Line} from "@engine/renderable/impl/geometry/line";
import {DebugError} from "@engine/debug/debugError";
import {Game} from "@engine/core/game";
import {createSplinePathFromPoints} from "@engine/renderable/impl/geometry/_internal/splineFromPoints";
import {clearString} from "@engine/renderable/impl/geometry/_internal/clearString";
import {SvgPathToVertexArray} from "@engine/renderable/impl/geometry/_internal/svgPathToVertexArray";
import {closePolylinePoints} from "@engine/renderable/impl/geometry/_internal/closePolylinePoints";
import {Point2d} from "@engine/geometry/point2d";


export class PolyLine extends Shape {

    public get lineWidth():number{
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

    public get borderRadius():number{
        return this._borderRadius;
    }

    private constructor(protected game:Game){
        super(game);
        this._lineWidth = 1;
        this.color.addOnChangeListener(()=>this.passPropertiesChildren());
    }

    declare public children:Line[];

    private _borderRadius:number = 1;


    public static fromVertices(game:Game, vertices:number[]|string, close:boolean = false):PolyLine{
        if (typeof vertices === 'string') {
            vertices = clearString(vertices).split(/[ |,]/).map((it:string)=>{
                const n:number = parseFloat(it);
                if (DEBUG && isNaN(n)) throw new DebugError(`can not parse vertex array ${vertices}: unexpected value ${it}`);
                return n;
            });
        }

        if (DEBUG && vertices.length===0) return new PolyLine(game);

        if (close) vertices = closePolylinePoints(vertices);

        const p:PolyLine = new PolyLine(game);
        for (let i:number=0;i<vertices.length-2;i+=2) {
            const line:Line = new Line(game);
            line.setXYX1Y1(vertices[i],vertices[i+1],vertices[i+2],vertices[i+3]);
            p.appendChild(line);
        }
        p.calcSize();
        return p;
    }

    public static fromPoints(game:Game,poins:Point2d[],close:boolean = false):PolyLine{
        const vertices:number[] = [];
        for (const p of poins) vertices.push(p.x,p.y);
        return this.fromVertices(game,vertices,close);
    }


    public static fromMultiCurveSvgPath(game:Game,path:string, close:boolean = false):PolyLine[]{
        const arr:number[][] = new SvgPathToVertexArray(game).parsePolylines(path, close);
        const result:PolyLine[] = [];
        for (const vertices of arr) result.push(this.fromVertices(game,vertices));
        return result;
    }

    // https://developer.mozilla.org/ru/docs/Web/SVG/Tutorial/Paths
    public static fromSvgPath(game:Game,path:string, close:boolean = false):PolyLine {
        const p:PolyLine[] = this.fromMultiCurveSvgPath(game,path,close);
        if (DEBUG && p.length>1) throw new DebugError(`path is multi curve, use fromMultiCurveSvgPath instead`);
        return p[0];
    }

    public static splineFromPoints(game:Game,points:number[],close:boolean = false):PolyLine{
        return PolyLine.fromSvgPath(game,createSplinePathFromPoints(points),close);
    }

    public clone(): PolyLine {
        const l:PolyLine = new PolyLine(this.game);
        this.setClonedProperties(l);
        return l;
    }

    public draw():void{}

    protected setClonedProperties(cloned:PolyLine):void{
        cloned.lineWidth = this.lineWidth;
        cloned.borderRadius = this.borderRadius;
        super.setClonedProperties(cloned);
    }

    private passPropertiesToChild(l:Line):void{
        l.borderRadius = this.borderRadius;
        l.color = this.color;
        l.lineWidth = this.lineWidth;
        l.pointTo.forceTriggerChange();
    }

    private passPropertiesChildren():void{
        for (const p of this.children) this.passPropertiesToChild(p);
    }

    private calcSize():void {
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

    private calcLength():void{

    }

}
