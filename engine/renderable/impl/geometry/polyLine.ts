import {Line} from "@engine/renderable/impl/geometry/line";
import {DebugError} from "@engine/debug/debugError";
import {Game} from "@engine/core/game";
import {createSplinePathFromPoints} from "@engine/renderable/impl/geometry/_internal/splineFromPoints";
import {clearString} from "@engine/renderable/impl/geometry/_internal/clearString";
import {SvgPathToVertexArrayBuilder} from "@engine/renderable/impl/geometry/_internal/svgPathToVertexArrayBuilder";
import {closePolylinePoints} from "@engine/renderable/impl/geometry/_internal/closePolylinePoints";
import {Point2d} from "@engine/geometry/point2d";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Color} from "@engine/renderer/common/color";
import {
    ITriangulatedPathParams,
    triangulatedPathFromPolyline
} from "@engine/renderable/impl/geometry/_internal/triangulatedPathFromPolyline";
import {Size} from "@engine/geometry/size";
import {IRenderTarget} from "@engine/renderer/abstract/abstractRenderer";
import {Image} from "@engine/renderable/impl/general/image/image";
import {Polygon} from "@engine/renderable/impl/geometry/polygon";


export class PolyLine extends RenderableModel {

    public readonly color:Color = Color.BLACK.clone();

    private constructor(game:Game,public readonly closed:boolean){
        super(game);
    }

    private _segments:Line[] = [];


    public static fromVertices(game:Game, vertices:number[]|string, params:ITriangulatedPathParams = {},close:boolean = false):PolyLine{
        if (typeof vertices === 'string') {
            vertices = clearString(vertices).split(/[ |,]/).map((it:string)=>{
                const n:number = parseFloat(it);
                if (DEBUG && isNaN(n)) throw new DebugError(`can not parse vertex array ${vertices}: unexpected value ${it}`);
                return n;
            });
        }

        if (DEBUG && vertices.length===0) return new PolyLine(game,close);

        if (close) vertices = closePolylinePoints(vertices);

        const p:PolyLine = new PolyLine(game,close);
        for (let i:number=0;i<vertices.length-2;i+=2) {
            const line:Line = new Line(game);
            const x1 = vertices[i], y1 = vertices[i+1];
            const x2 = vertices[i+2], y2 = vertices[i+3];
            line.setXYX1Y1(x1,y1,x2,y2);
            p._segments.push(line);
            p.updateSizeIfRequired(x1,y1);
            p.updateSizeIfRequired(x2,y2);
        }
        const mesh:Polygon = triangulatedPathFromPolyline(game,p,params);
        mesh.fillColor = p.color;
        p.appendChild(mesh);
        return p;
    }

    public static fromPoints(game:Game,poins:Point2d[],params:ITriangulatedPathParams = {},close:boolean = false):PolyLine{
        const vertices:number[] = [];
        for (const p of poins) vertices.push(p.x,p.y);
        return this.fromVertices(game,vertices,params,close);
    }

    public static fromMultiCurveSvgPath(game:Game,path:string, params:ITriangulatedPathParams = {},close:boolean = false):PolyLine[]{
        const arr = new SvgPathToVertexArrayBuilder(game).parsePolylines(path, close);
        const result:PolyLine[] = [];
        for (const group of arr) {
            result.push(
                this.fromVertices(game,group.vertexArray,params,group.closed)
            );
        }
        return result;
    }

    // https://developer.mozilla.org/ru/docs/Web/SVG/Tutorial/Paths
    public static fromSvgPath(game:Game,path:string, params:ITriangulatedPathParams = {},close:boolean = false):PolyLine {
        const p:PolyLine[] = this.fromMultiCurveSvgPath(game,path,params,close);
        if (DEBUG && p.length>1) throw new DebugError(`path is multi curve, use fromMultiCurveSvgPath instead`);
        return p[0];
    }

    public static splineFromPoints(game:Game,points:number[],params:ITriangulatedPathParams= {},close:boolean = false):PolyLine{
        return PolyLine.fromSvgPath(game,createSplinePathFromPoints(points),params,close);
    }

    public getSegments():Readonly<Readonly<Line>[]>{
        return this._segments;
    }

    public clone(): PolyLine {
        const l:PolyLine = new PolyLine(this.game,this.closed);
        this.setClonedProperties(l);
        return l;
    }

    public draw():void{}


    private updateSizeIfRequired(x:number,y:number):void {
        if (this.size.width<x) this.size.width = x;
        if (this.size.height<y) this.size.height = y;
    }


}
