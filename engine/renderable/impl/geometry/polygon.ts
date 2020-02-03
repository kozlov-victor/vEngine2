import {Game} from "@engine/core/game";
import {Mesh} from "@engine/renderable/abstract/mesh";
import {AbstractPrimitive} from "@engine/renderer/webGl/primitives/abstractPrimitive";
import {EarClippingTriangulator} from "@engine/renderable/impl/geometry/helpers/earClippingTriangulator";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {DebugError} from "@engine/debug/debugError";

class PolygonPrimitive extends AbstractPrimitive {
    constructor(){
        super();
        this.vertexArr = [];
    }
}

export class Polygon extends Mesh {

    public static fromMultiCurveSvgPath(game:Game,path:string):Polygon[]{
        const polygons:Polygon[] = [];
        path.split('\n').join(' ').split(/(.*?z)/gi).forEach((p:string)=>{
            if (!p.trim()) return;
            const polygon:Polygon = Polygon.fromSvgPath(game,p);
            polygons.push(polygon);
        });
        return polygons;
    }

    public static createStar(game:Game,points:number, radius:number, innerRadius:number = radius / 2, rotation:number = 0):Polygon {
        // according to https://github.com/pixijs/pixi.js/blob/873b65041bd3a5d173b0e0e10fa93be68bc033d9/packages/graphics/src/utils/Star.js
        const startAngle:number = (-1 * Math.PI / 2) + rotation;
        const len:number = points * 2;
        const delta:number = Math.PI * 2 / len;
        const vertices:number[] = [];

        for (let i:number = 0; i < len; i++) {
            const r:number = i % 2 ? innerRadius : radius;
            const angle:number = (i * delta) + startAngle;

            vertices.push(
                (r * Math.cos(angle)),
                (r * Math.sin(angle))
            );
        }

        vertices.push(vertices[0],vertices[1]); // close path

        const p:PolyLine = PolyLine.fromPoints(game,vertices);
        return Polygon.fromPolyline(game,p);
    }

    public static fromPolyline(game:Game,p:PolyLine):Polygon {
        const vertices:number[] = [];
        p.children.forEach((l:RenderableModel)=>{
            vertices.push(l.pos.x,l.pos.y);
        });
        const triangulator:EarClippingTriangulator = new EarClippingTriangulator();
        const triangulatedIndices:number[] = triangulator.computeTriangles(vertices);
        const triangulatedVertices:number[] = [];
        for (const ind of triangulatedIndices) {
            triangulatedVertices.push(vertices[2*ind],vertices[2*ind+1]);
        }
        const pg:Polygon = new Polygon(game);
        pg.setVertices(triangulatedVertices);
        pg.size.set(p.size);
        return pg;
    }

    public static fromSvgPath(game:Game,p:string):Polygon {
        if (DEBUG && p.split(/z/gi).length-1>1) throw new DebugError(`multiple closing operation ('z') in one svg path. Use static method Polygon.fromMultiCurveSvgPath() instead`);
        const polyline:PolyLine = PolyLine.fromSvgPath(game,p);
        if (DEBUG && !polyline.isClosed()) throw new DebugError(`can not create polygon from unclosed path`);
        if (DEBUG && !polyline.isInterrupted()) throw new DebugError(`can not create polygon from interrupted path`);
        return Polygon.fromPolyline(game,polyline);
    }


    public readonly type:string = 'Polygon';

    constructor(protected game:Game){
        super(game,false,false);
        this.vertexItemSize = 2;
    }

    private setVertices(vertices:number[]):void {
        this.modelPrimitive = new PolygonPrimitive();
        this.modelPrimitive.vertexArr = vertices;
    }

}
