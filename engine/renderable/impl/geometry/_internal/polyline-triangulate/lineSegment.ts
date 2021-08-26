// https://github.com/CrushedPixel/Polyline2D

import {Vec2} from "@engine/renderable/impl/geometry/_internal/polyline-triangulate/vec2";
import {Optional} from "@engine/core/declarations";

export class LineSegment {

    public constructor(public a:Vec2, public b:Vec2) {
    }

    public static intersection(a:LineSegment,b:LineSegment, infiniteLines:boolean):Optional<Vec2> {
        // calculate un-normalized direction vectors
        const r = a.direction(false);
        const s = b.direction(false);

        const originDist = Vec2.subtract(b.a, a.a);

        const uNumerator = Vec2.cross(originDist, r);
        const denominator = Vec2.cross(r, s);

        if (Math.abs(denominator) < 0.0001) {
            // The lines are parallel
            return undefined;
        }

        // solve the intersection positions
        const u = uNumerator / denominator;
        const t = Vec2.cross(originDist, s) / denominator;

        if (!infiniteLines && (t < 0 || t > 1 || u < 0 || u > 1)) {
            // the intersection lies outside of the line segments
            return undefined;
        }

        // calculate the intersection point
        // a.a + r * t;
        return Vec2.add(a.a, Vec2.multiplyByScalar(r, t));
    }

    public add(toAdd:Vec2):LineSegment {
        return new LineSegment(Vec2.add(this.a, toAdd), Vec2.add(this.b, toAdd));
    }

    public substract(toSubstract:Vec2):LineSegment {
        return new LineSegment(Vec2.subtract(this.a, toSubstract), Vec2.subtract(this.b, toSubstract));
    }

    public normal():Vec2 {
        const dir = this.direction();

        // return the direction vector
        // rotated by 90 degrees counter-clockwise
        return new Vec2(-dir.y, dir.x);
    }

    public direction(normalized:boolean = true):Vec2 {
        const vec = Vec2.subtract(this.b, this.a);

        return normalized
            ? Vec2.normalized(vec)
            : vec;
    }

}
