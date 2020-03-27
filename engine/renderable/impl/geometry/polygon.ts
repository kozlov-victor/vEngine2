import {Game} from "@engine/core/game";
import {Mesh} from "@engine/renderable/abstract/mesh";
import {AbstractPrimitive} from "@engine/renderer/webGl/primitives/abstractPrimitive";
import {EarClippingTriangulator} from "@engine/renderable/impl/geometry/helpers/earClippingTriangulator";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {DebugError} from "@engine/debug/debugError";
import {calcNormal} from "@engine/renderable/impl/geometry/helpers/calcNormal";
import {IPoint3d} from "@engine/geometry/point3d";
import {isPolylineCloseWise} from "@engine/renderable/impl/geometry/helpers/isPolylineClockWise";

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

        //if (DEBUG && vertices.length<=2) throw new DebugError(`can not create polygon from polyline with vertices [${vertices}]`);

        const triangulator:EarClippingTriangulator = new EarClippingTriangulator();
        const triangulatedIndices:number[] = triangulator.computeTriangles(vertices);
        const triangulatedVertices:number[] = [];
        for (const ind of triangulatedIndices) {
            triangulatedVertices.push(vertices[2*ind],vertices[2*ind+1]);
        }
        const pg:Polygon = new Polygon(game);
        pg.setVertices(triangulatedVertices);
        pg.size.set(p.size);
        pg.edgeVertices = vertices;
        return pg;
    }

    public static fromSvgPath(game:Game,p:string):Polygon {
        if (DEBUG && p.split(/z/gi).length-1>1) throw new DebugError(`multiple closing operation ('z') in one svg path. Use static method Polygon.fromMultiCurveSvgPath() instead`);
        const polyline:PolyLine = PolyLine.fromSvgPath(game,p);
        if (DEBUG && !polyline.isClosed()) throw new DebugError(`can not create polygon from unclosed path`);
        if (DEBUG && !polyline.isInterrupted()) throw new DebugError(`can not create polygon from interrupted path`);
        return Polygon.fromPolyline(game,polyline);
    }

    public static fromPoints(game:Game,points:number[]):Polygon {
        return Polygon.fromPolyline(game,PolyLine.fromPoints(game,points));
    }


    public readonly type:string = 'Polygon';

    private edgeVertices:number[];

    constructor(protected game:Game){
        super(game);
        this.invertY = false;
        this.vertexItemSize = 2;
    }

    public extrudeToMesh(depth:number):Mesh{
        const isClockWise:boolean = isPolylineCloseWise(this.edgeVertices);
        const primitive = new class extends AbstractPrimitive {

            public normalArr:number[] = [];

            constructor() {
                super();
                this.vertexArr = [];
                this.normalArr = [];
            }
        }();
        const d2:number = depth/2;

        for (let i:number = 0; i < this.modelPrimitive.vertexArr.length; i+=6) {
            const vertexA1:number = this.modelPrimitive.vertexArr[i];
            const vertexA2:number = this.modelPrimitive.vertexArr[i+1];

            const vertexB1:number = this.modelPrimitive.vertexArr[i+2];
            const vertexB2:number = this.modelPrimitive.vertexArr[i+3];

            const vertexC1:number = this.modelPrimitive.vertexArr[i+4];
            const vertexC2:number = this.modelPrimitive.vertexArr[i+5];

            // side a
            primitive.vertexArr.push(
                vertexA1,vertexA2,d2,
                vertexB1,vertexB2,d2,
                vertexC1,vertexC2,d2
            );
            primitive.normalArr.push(
                0,0,1,
                0,0,1,
                0,0,1
            );

            // side b
            primitive.vertexArr.push(
                vertexA1,vertexA2,-d2,
                vertexB1,vertexB2,-d2,
                vertexC1,vertexC2,-d2
            );
            primitive.normalArr.push(
                0,0,-1,
                0,0,-1,
                0,0,-1
            );
        }
        for (let i = 0; i < this.edgeVertices.length-2; i+=2) {
            let edgeVertexA1:number = this.edgeVertices[i];
            let edgeVertexA2:number = this.edgeVertices[i+1];
            let edgeVertexB1:number = this.edgeVertices[i+2];
            let edgeVertexB2:number = this.edgeVertices[i+3];

            if (!isClockWise) {
                [edgeVertexA1,edgeVertexA2,edgeVertexB1,edgeVertexB2] =
                    [edgeVertexB1,edgeVertexB2,edgeVertexA1,edgeVertexA2];
            }

            // side c
            primitive.vertexArr.push(
                edgeVertexA1,edgeVertexA2,d2,
                edgeVertexB1,edgeVertexB2,d2,
                edgeVertexA1,edgeVertexA2,-d2,

                edgeVertexA1,edgeVertexA2,-d2,
                edgeVertexB1,edgeVertexB2,d2,
                edgeVertexB1,edgeVertexB2,-d2,
            );

            const normal:IPoint3d = calcNormal(
                {x:edgeVertexA1,y:edgeVertexA2,z:d2},
                {x:edgeVertexB1,y:edgeVertexB2,z:d2},
                {x:edgeVertexA1,y:edgeVertexA2,z:-d2}
            );

            primitive.normalArr.push(
                normal.x,normal.y,normal.z,
                normal.x,normal.y,normal.z,
                normal.x,normal.y,normal.z,

                normal.x,normal.y,normal.z,
                normal.x,normal.y,normal.z,
                normal.x,normal.y,normal.z,
            );

        }

        const game:Game = this.game;
        const m:Mesh = new class extends Mesh {
            constructor() {
                super(game);
                this.invertY = true;
                this.modelPrimitive = primitive;
                this.vertexItemSize = 3;
            }
        }();
        this.setClonedProperties(m);
        m.depthTest = true;
        return m;
    }

    private setVertices(vertices:number[]):void {
        this.modelPrimitive = new PolygonPrimitive();
        this.modelPrimitive.vertexArr = vertices;
    }

}
