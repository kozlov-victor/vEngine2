import {Game} from "@engine/core/game";
import {Mesh} from "@engine/renderable/abstract/mesh";
import {AbstractPrimitive} from "@engine/renderer/webGl/primitives/abstractPrimitive";
import {EarClippingTriangulator} from "@engine/renderable/impl/geometry/helpers/earClippingTriangulator";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";

class PolygonPrimitive extends AbstractPrimitive {
    constructor(){
        super();
        this.vertexArr = [];
    }
}

export class Polygon extends Mesh {

    public readonly type:string = 'Polygon';

    constructor(protected game:Game){
        super(game,false,false);
        this.vertexItemSize = 2;
    }

    public setVertices(vertices:number[]):void {
        this.modelPrimitive = new PolygonPrimitive();
        this.modelPrimitive.vertexArr = vertices;
    }

    public fromPolyline(p:PolyLine):void {
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
        this.setVertices(triangulatedVertices);
        this.size.set(p.size);
    }

    public fromSvgPath(p:string):void {
        const polyline:PolyLine = new PolyLine(this.game);
        polyline.setSvgPath(p);
        this.fromPolyline(polyline);
    }

}