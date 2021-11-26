import {Game} from "@engine/core/game";
import {Mesh2d} from "@engine/renderable/abstract/mesh2d";
import {AbstractPrimitive, IPrimitive} from "@engine/renderer/webGl/primitives/abstractPrimitive";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {calcNormal} from "@engine/renderable/impl/geometry/_internal/calcNormal";
import {IPoint3d} from "@engine/geometry/point3d";
import {isPolylineCloseWise} from "@engine/renderable/impl/geometry/_internal/isPolylineClockWise";
import {closePolylinePoints} from "@engine/renderable/impl/geometry/_internal/closePolylinePoints";
import {Point2d} from "@engine/geometry/point2d";
import {Mesh3d} from "@engine/renderable/impl/3d/mesh3d";
import {earCut} from "@engine/renderable/impl/geometry/_internal/earCut";

class PolygonPrimitive extends AbstractPrimitive {
    constructor(){
        super();
        this.vertexArr = [];
        this.vertexItemSize = 2;
    }
}

export class Polygon extends Mesh2d {

    public constructor(game:Game,modelPrimitive:IPrimitive){
        super(game,modelPrimitive);
    }

    public override readonly type:string = 'Polygon';

    private _edgeVertices:number[];

    public static fromMultiCurveSvgPath(game:Game,path:string):Polygon[]{
        const polygons:Polygon[] = [];
        const polyLines:PolyLine[] = PolyLine.fromMultiCurveSvgPath(game,path,{},true);
        polyLines.forEach(p=>{
            polygons.push(Polygon.fromPolyline(game,p));
            p.destroy();
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

        const p:PolyLine = PolyLine.fromVertices(game,vertices);
        return Polygon.fromPolyline(game,p);
    }

    public static fromPolyline(game:Game,p:PolyLine):Polygon {
        const vertices:number[] = [];
        for (const l of p.getSegments()) {
            vertices.push(l.pos.x,l.pos.y);
        }
        const triangulatedIndices:number[] = earCut(vertices);
        const triangulatedVertices:number[] = [];
        for (const ind of triangulatedIndices) {
            triangulatedVertices.push(vertices[2*ind],vertices[2*ind+1]);
        }
        const modelPrimitive = new PolygonPrimitive();
        modelPrimitive.vertexArr = triangulatedVertices;
        const pg:Polygon = new Polygon(game,modelPrimitive);
        pg.size.set(p.size);
        pg._edgeVertices = vertices;
        return pg;
    }

    public static fromSvgPath(game:Game,p:string):Polygon {
        const polyline:PolyLine = PolyLine.fromSvgPath(game,p,{},true);
        return Polygon.fromPolyline(game,polyline);
    }

    public static fromVertices(game:Game, vertices:number[]):Polygon {
        const verticesClosed:number[] = closePolylinePoints(vertices);
        return Polygon.fromPolyline(game,PolyLine.fromVertices(game,verticesClosed));
    }

    public static fromPoints(game:Game, points:Point2d[]):Polygon {
        const vertices:number[] = [];
        for (const p of points) vertices.push(p.x,p.y);
        return Polygon.fromPolyline(game,PolyLine.fromVertices(game,vertices));
    }

    public isClockWise():boolean {
        return isPolylineCloseWise(this._edgeVertices);
    }

    public getEdgeVertices():number[] {
        return this._edgeVertices;
    }

    public extrudeToMesh(depth:number):Mesh3d{
        const isClockWise:boolean = this.isClockWise();
        const primitive = new class extends AbstractPrimitive {
            constructor() {
                super();
            }
        }();
        primitive.normalArr = [];
        primitive.vertexArr = [];
        primitive.vertexItemSize = 3;

        const d2:number = depth/2;

        for (let i:number = 0; i < this._modelPrimitive.vertexArr.length; i+=6) {
            const vertexA1:number = this._modelPrimitive.vertexArr[i];
            const vertexA2:number = this._modelPrimitive.vertexArr[i+1];

            const vertexB1:number = this._modelPrimitive.vertexArr[i+2];
            const vertexB2:number = this._modelPrimitive.vertexArr[i+3];

            const vertexC1:number = this._modelPrimitive.vertexArr[i+4];
            const vertexC2:number = this._modelPrimitive.vertexArr[i+5];

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
        for (let i = 0; i < this._edgeVertices.length-2; i+=2) {
            let edgeVertexA1:number = this._edgeVertices[i];
            let edgeVertexA2:number = this._edgeVertices[i+1];
            let edgeVertexB1:number = this._edgeVertices[i+2];
            let edgeVertexB2:number = this._edgeVertices[i+3];

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
        const m:Mesh3d = new class extends Mesh3d {
            constructor() {
                super(game,primitive);
                this.invertY = true;
            }
        }();
        m.depthTest = true;
        m.fillColor = this.fillColor.clone();
        return m;
    }

}
