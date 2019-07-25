import {Game} from "@engine/game";
import {Mesh} from "@engine/model/abstract/mesh";
import {AbstractPrimitive} from "@engine/renderer/webGl/primitives/abstractPrimitive";
import {EarClippingTriangulator} from "@engine/model/impl/geometry/helpers/earClippingTriangulator";
import {PolyLine} from "@engine/model/impl/geometry/polyLine";
import {Line} from "@engine/model/impl/geometry/line";

class PolygonPrimitive extends AbstractPrimitive {
    constructor(){
        super();
        this.vertexArr = [];
    }
}

export class Polygon extends Mesh {

    public readonly type:string = 'Polygon';
    public readonly vertexItemSize:2|3 = 2;

    constructor(protected game:Game){
        super(game,false,false);
    }

    public setVertices(vertices:number[]):void {
        this.modelPrimitive = new PolygonPrimitive();
        this.modelPrimitive.vertexArr = vertices;
    }

    public fromPolyline(p:PolyLine) {
        const vertices:number[] = [];
        p.children.forEach((l:Line)=>{
            vertices.push(l.pos.x,l.pos.y);
        });
        const triangulator:EarClippingTriangulator = new EarClippingTriangulator();
        const triangulatedIndices:number[] = triangulator.computeTriangles(vertices);
        const triangulatedVertices:number[] = [];
        for (const ind of triangulatedIndices) {
            triangulatedVertices.push(vertices[2*ind],vertices[2*ind+1]);
        }
        this.setVertices(triangulatedVertices);
        this.size.set(p.size);
    }

    public fromSvgPath(p:string){
        const polyline:PolyLine = new PolyLine(this.game);
        polyline.setSvgPath(p);
        this.fromPolyline(polyline);
    }

}