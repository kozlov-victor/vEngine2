import {Vec2} from "@engine/renderable/impl/geometry/_internal/polyline-triangulate/vec2";
import {LineSegment} from "@engine/renderable/impl/geometry/_internal/polyline-triangulate/lineSegment";


export class PolySegment {

    public edge1:LineSegment;
    public edge2:LineSegment;

    constructor(public center:LineSegment, thickness:number) {
        this.edge1 = center.add(
            Vec2.multiplyByScalar(center.normal(), thickness)
        );
        this.edge2 = center.substract(
            Vec2.multiplyByScalar(center.normal(), thickness)
        );
    }

}
