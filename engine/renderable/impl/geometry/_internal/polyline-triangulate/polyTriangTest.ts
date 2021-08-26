import {Vec2} from "@engine/renderable/impl/geometry/_internal/polyline-triangulate/vec2";
import {PolylineTriangulator} from "@engine/renderable/impl/geometry/_internal/polyline-triangulate/polylineTriangulator";
import {AbstractPrimitive} from "@engine/renderer/webGl/primitives/abstractPrimitive";
import {Polygon} from "@engine/renderable/impl/geometry/polygon";
import {Game} from "@engine/core/game";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {Line} from "@engine/renderable/impl/geometry/line";
import {DRAW_METHOD} from "@engine/renderer/webGl/base/bufferInfo";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {Color} from "@engine/renderer/common/color";

export class PolylinePrimitive extends AbstractPrimitive {

    constructor(){
        super();
        this.vertexArr = [];
        this.normalArr = undefined;
        this.texCoordArr = undefined;
        this.indexArr = undefined;
    }

}

export class PolyTriangTest {

    public static fromPolyline(game:Game,p:PolyLine):Polygon {
        const vertices:Vec2[] = [];
        p.children.forEach((l:Line)=>{
            vertices.push(new Vec2(l.pos.x,l.pos.y));
        });
        const triangleVertices:Vec2[] = PolylineTriangulator.create(vertices,10);
        const modelPrimitive = new PolylinePrimitive();
        console.log(triangleVertices);
        triangleVertices.forEach(t=>{
            modelPrimitive.vertexArr.push(t.x,t.y);
            const c = new Circle(game);
            c.center.setXY(t.x+100,t.y+100);
            c.radius = 5;
            c.fillColor = Color.fromCssLiteral(`#0be33c`);
            game.getCurrentScene().appendChild(c);
        });
        modelPrimitive.drawMethod = DRAW_METHOD.TRIANGLES;
        modelPrimitive.vertexItemSize = 2;
        return new Polygon(game,modelPrimitive);
    }

}
