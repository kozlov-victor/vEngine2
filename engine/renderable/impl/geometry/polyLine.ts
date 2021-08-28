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
import {Image} from "@engine/renderable/impl/general/image";


export class PolyLine extends RenderableModel {

    public readonly color:Color = Color.BLACK.clone();

    private constructor(game:Game){
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

        if (DEBUG && vertices.length===0) return new PolyLine(game);

        if (close) vertices = closePolylinePoints(vertices);

        const p:PolyLine = new PolyLine(game);
        for (let i:number=0;i<vertices.length-2;i+=2) {
            const line:Line = new Line(game);
            line.setXYX1Y1(vertices[i],vertices[i+1],vertices[i+2],vertices[i+3]);
            p._segments.push(line);
        }
        p.calcSize();
        const mesh = triangulatedPathFromPolyline(game,p,params);
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
        const arr:number[][] = new SvgPathToVertexArrayBuilder(game).parsePolylines(path, close);
        const result:PolyLine[] = [];
        for (const vertices of arr) result.push(this.fromVertices(game,vertices,params));
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
        const l:PolyLine = new PolyLine(this.game);
        this.setClonedProperties(l);
        return l;
    }

    public cacheAsBitmap():Image {
        const sizeInt:Size = new Size().setWH(~~this.size.width,~~this.size.height);
        const renderTarget:IRenderTarget =
            this.game.getRenderer().getHelper().
            createRenderTarget(this.game,sizeInt);

        const image:Image = new Image(this.game,renderTarget.getTexture());
        image.size.set(sizeInt);
        this.renderToTexture(renderTarget,Color.NONE);
        renderTarget.destroy();
        return image;
    }

    public draw():void{}

    private calcSize():void {
        let maxW:number = this._segments[0].pos.x+this._segments[0].size.width;
        let maxH:number = this._segments[0].pos.y+this._segments[0].size.height;
        for (let i:number=1;i<this._segments.length;i++){
            if (this._segments[i].pos.x+this._segments[i].size.width>maxW)
                maxW = this._segments[i].pos.x + this._segments[i].size.width;
            if (this._segments[i].pos.y+this._segments[i].size.height>maxH)
                maxH = this._segments[i].pos.y + this._segments[i].size.height;
        }
        this.size.setWH(maxW,maxH);
    }

}
