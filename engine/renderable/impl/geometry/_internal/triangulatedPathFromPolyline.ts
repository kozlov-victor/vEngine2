import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {Polygon} from "@engine/renderable/impl/geometry/polygon";
import {Vec2} from "@engine/geometry/vec2";
import {Line} from "@engine/renderable/impl/geometry/line";
import {PolylineTriangulator} from "@engine/renderable/impl/geometry/_internal/polyline-triangulate/polylineTriangulator";
import {DRAW_METHOD} from "@engine/renderer/webGl/base/bufferInfo";
import {Game} from "@engine/core/game";
import {AbstractPrimitive} from "@engine/renderer/webGl/primitives/abstractPrimitive";

export interface ITriangulatedPathParams {
    thickness?: number;
    jointStyle?:JointStyle;
    endCapStyle?:EndCapStyle;
}

export const enum JointStyle {
    /**
     * Corners are drawn with sharp joints.
     * If the joint's outer angle is too large,
     * the joint is drawn as beveled instead,
     * to avoid the miter extending too far out.
     */
    MITER,
    /**
     * Corners are flattened.
     */
    BEVEL,
    /**
     * Corners are rounded off.
     */
    ROUND
}

class PolylinePrimitive extends AbstractPrimitive {

    constructor(){
        super();
        this.vertexArr = [];
        this.normalArr = undefined;
        this.texCoordArr = undefined;
        this.indexArr = undefined;
    }

}

export const enum EndCapStyle {
    /**
     * Path ends are drawn flat,
     * and don't exceed the actual end point.
     */
    BUTT,
    /**
     * Path ends are drawn flat,
     * but extended beyond the end point
     * by half the line thickness.
     */
    SQUARE,
    /**
     * Path ends are rounded off.
     */
    ROUND,
    /**
     * Path ends are connected according to the JointStyle.
     * When using this EndCapStyle, don't specify the common start/end point twice,
     * as Polyline2D connects the first and last input point itself.
     */
    JOINT
}

export const triangulatedPathFromPolyline = (game:Game,p:PolyLine, params:ITriangulatedPathParams):Polygon=>{
    params.thickness??=1;
    params.jointStyle??=JointStyle.MITER;
    params.endCapStyle??=EndCapStyle.BUTT;
    const vertices:Vec2[] = [];
    p.children.forEach((l:Line)=>{
        vertices.push(new Vec2(l.pos.x,l.pos.y));
    });
    const lastLine:Line = p.children[p.children.length-1];
    vertices.push(new Vec2(lastLine.pos.x+lastLine.pointTo.x,lastLine.pos.y+lastLine.pointTo.y));
    const triangleVertices:Vec2[] = PolylineTriangulator.create(vertices,params.thickness,params.jointStyle,params.endCapStyle);
    const modelPrimitive = new PolylinePrimitive();
    triangleVertices.forEach(t=>{
        modelPrimitive.vertexArr.push(t.x,t.y);
    });
    modelPrimitive.drawMethod = DRAW_METHOD.TRIANGLES;
    modelPrimitive.vertexItemSize = 2;
    return new Polygon(game,modelPrimitive);
};
