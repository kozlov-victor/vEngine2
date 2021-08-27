
// https://github.com/CrushedPixel/Polyline2D/blob/master/include/Polyline2D.h

import {Vec2} from "@engine/geometry/vec2";
import {LineSegment} from "@engine/renderable/impl/geometry/_internal/polyline-triangulate/lineSegment";
import {PolySegment} from "@engine/renderable/impl/geometry/_internal/polyline-triangulate/polySegment";
import {EndCapStyle, JointStyle} from "@engine/renderable/impl/geometry/_internal/triangulatedPathFromPolyline";



export class PolylineTriangulator {

    /**
     * The threshold for mitered joints.
     * If the joint's angle is smaller than this angle,
     * the joint will be drawn beveled instead.
     */
    private static readonly miterMinAngle = 0.349066; // ~20 degrees

    /**
     * The minimum angle of a round joint's triangles.
     */
    private static readonly roundMinAngle = 0.174533; // ~10 degrees

    public static create(
        points:Vec2[],
        thickness: number,
        jointStyle:JointStyle = JointStyle.MITER,
        endCapStyle:EndCapStyle = EndCapStyle.BUTT,
        allowOverlap: boolean = false
    ):Vec2[] {
        const vertices:Vec2[] = [];
        this._create(vertices, points, thickness, jointStyle, endCapStyle, allowOverlap);
        return vertices;
    }

    private static _create(
        vertices:Vec2[],
        points:Vec2[],
        thickness: number,
        jointStyle:JointStyle,
        endCapStyle:EndCapStyle,
        allowOverlap: boolean
    ):number {
        const numVerticesBefore = vertices.length;

        this.__create(vertices, points, thickness, jointStyle, endCapStyle, allowOverlap);

        return vertices.length - numVerticesBefore;
    }

    private static __create(
        vertices:Vec2[],
        points:Vec2[],
        thickness: number,
        jointStyle:JointStyle,
        endCapStyle:EndCapStyle,
        allowOverlap: boolean
    ):Vec2[] {

        // operate on half the thickness to make our lives easier
        thickness /= 2;

        // create poly segments from the points
        const segments:PolySegment[] = [];
        for (let i = 0; i + 1 < points.length; i++) {
            const point1 = points[i];
            const point2 = points[i + 1];

            // to avoid division-by-zero errors,
            // only create a line segment for non-identical points
            if (!Vec2.equal(point1, point2)) {
                segments.push(
                    new PolySegment(
                        new LineSegment(point1,point2),
                        thickness
                    )
                );
            }
        }

        if (endCapStyle === EndCapStyle.JOINT) {
            // create a connecting segment from the last to the first point

            const point1 = points[points.length - 1];
            const point2 = points[0];

            // to avoid division-by-zero errors,
            // only create a line segment for non-identical points
            if (!Vec2.equal(point1, point2)) {
                segments.push(
                    new PolySegment(
                        new LineSegment(point1,point2),
                        thickness
                    )
                );
            }
        }

        if (segments.length===0) {
            // handle the case of insufficient input points
            return vertices;
        }

        let nextStart1 = new Vec2(0, 0);
        let nextStart2  = new Vec2(0, 0);
        let start1 = new Vec2(0, 0);
        let start2 = new Vec2(0, 0);
        let end1 = new Vec2(0, 0);
        let end2 = new Vec2(0, 0);

        // calculate the path's global start and end points
        const firstSegment = segments[0];
        const lastSegment = segments[segments.length - 1];

        let pathStart1 = firstSegment.edge1.a;
        let pathStart2 = firstSegment.edge2.a;
        let pathEnd1 = lastSegment.edge1.b;
        let pathEnd2 = lastSegment.edge2.b;

        // handle different end cap styles
        if (endCapStyle === EndCapStyle.SQUARE) {
            // extend the start/end points by half the thickness
            pathStart1 = Vec2.subtract(pathStart1, Vec2.multiplyByScalar(firstSegment.edge1.direction(), thickness));
            pathStart2 = Vec2.subtract(pathStart2, Vec2.multiplyByScalar(firstSegment.edge2.direction(), thickness));
            pathEnd1 = Vec2.add(pathEnd1, Vec2.multiplyByScalar(lastSegment.edge1.direction(), thickness));
            pathEnd2 = Vec2.add(pathEnd2, Vec2.multiplyByScalar(lastSegment.edge2.direction(), thickness));

        } else if (endCapStyle === EndCapStyle.ROUND) {
            // draw half circle end caps
            this.createTriangleFan(vertices, firstSegment.center.a, firstSegment.center.a,
                firstSegment.edge1.a, firstSegment.edge2.a, false);
            this.createTriangleFan(vertices, lastSegment.center.b, lastSegment.center.b,
                lastSegment.edge1.b, lastSegment.edge2.b, true);

        } else if (endCapStyle === EndCapStyle.JOINT) {
            // join the last (connecting) segment and the first segment
            const byRef = {
                segment1:lastSegment, segment2: firstSegment,
                end1:pathEnd1, end2:pathEnd2,
                nextStart1:pathStart1, nextStart2: pathStart2
            };
            this.createJoint(vertices, jointStyle, allowOverlap, byRef);
            pathEnd1 = byRef.end1;
            pathEnd2 = byRef.end2;
            pathStart1 = byRef.nextStart1;
            pathStart2 = byRef.nextStart2;
        }

        // generate mesh data for path segments
        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i];

            // calculate start
            if (i === 0) {
                // this is the first segment
                start1 = pathStart1;
                start2 = pathStart2;
            }

            if (i + 1 === segments.length) {
                // this is the last segment
                end1 = pathEnd1;
                end2 = pathEnd2;

            } else {
                const byRef = {
                    segment1:segment, segment2: segments[i + 1],
                    end1, end2:end1,
                    nextStart1, nextStart2
                };
                this.createJoint(vertices, jointStyle, allowOverlap, byRef);
                end1 = byRef.end1;
                end2 = byRef.end2;
                nextStart1 = byRef.nextStart1;
                nextStart2 = byRef.nextStart2;
            }

            // emit vertices
            vertices.push(start1);
            vertices.push(start2);
            vertices.push(end1);

            vertices.push(end1);
            vertices.push(start2);
            vertices.push(end2);

            start1 = nextStart1;
            start2 = nextStart2;
        }

        return vertices;

    }


    private static createJoint(
        vertices:Vec2[],
        jointStyle:JointStyle,
        allowOverlap: boolean,
        byRef:{
            segment1:PolySegment, segment2: PolySegment,
            end1:Vec2, end2:Vec2,
            nextStart1:Vec2, nextStart2: Vec2,
        }
    ):Vec2[] {
        // calculate the angle between the two line segments
        const dir1 = byRef.segment1.center.direction();
        const dir2 = byRef.segment2.center.direction();

        const angle = Vec2.angle(dir1, dir2);

        // wrap the angle around the 180° mark if it exceeds 90°
        // for minimum angle detection
        let wrappedAngle = angle;
        if (wrappedAngle > Math.PI / 2) {
            wrappedAngle = Math.PI - wrappedAngle;
        }

        if (jointStyle === JointStyle.MITER && wrappedAngle < this.miterMinAngle) {
            // the minimum angle for mitered joints wasn't exceeded.
            // to avoid the intersection point being extremely far out,
            // thus producing an enormous joint like a rasta on 4/20,
            // we render the joint beveled instead.
            jointStyle = JointStyle.BEVEL;
        }

        if (jointStyle === JointStyle.MITER) {
            // calculate each edge's intersection point
            // with the next segment's central line
            const sec1 = LineSegment.intersection(byRef.segment1.edge1, byRef.segment2.edge1, true);
            const sec2 = LineSegment.intersection(byRef.segment1.edge2, byRef.segment2.edge2, true);

            byRef.end1 = sec1 ? sec1 : byRef.segment1.edge1.b;
            byRef.end2 = sec2 ? sec2 : byRef.segment1.edge2.b;

            byRef.nextStart1 = byRef.end1;
            byRef.nextStart2 = byRef.end2;

        } else {
            // joint style is either BEVEL or ROUND

            // find out which are the inner edges for this joint
            const x1 = dir1.x;
            const x2 = dir2.x;
            const y1 = dir1.y;
            const y2 = dir2.y;

            const clockwise = x1 * y2 - x2 * y1 < 0;

            let inner1: LineSegment, inner2: LineSegment, outer1: LineSegment, outer2: LineSegment;

            // as the normal vector is rotated counter-clockwise,
            // the first edge lies to the left
            // from the central line's perspective,
            // and the second one to the right.
            if (clockwise) {
                outer1 = byRef.segment1.edge1;
                outer2 = byRef.segment2.edge1;
                inner1 = byRef.segment1.edge2;
                inner2 = byRef.segment2.edge2;
            } else {
                outer1 = byRef.segment1.edge2;
                outer2 = byRef.segment2.edge2;
                inner1 = byRef.segment1.edge1;
                inner2 = byRef.segment2.edge1;
            }

            // calculate the intersection point of the inner edges
            const innerSecOpt = LineSegment.intersection(inner1, inner2, allowOverlap);

            const innerSec = innerSecOpt
                ? innerSecOpt
                // for parallel lines, simply connect them directly
                : inner1.b;

            // if there's no inner intersection, flip
            // the next start position for near-180° turns
            let innerStart: Vec2;
            if (innerSecOpt) {
                innerStart = innerSec;
            } else if (angle > Math.PI / 2) {
                innerStart = outer1.b;
            } else {
                innerStart = inner1.b;
            }

            if (clockwise) {
                byRef.end1 = outer1.b;
                byRef.end2 = innerSec;

                byRef.nextStart1 = outer2.a;
                byRef.nextStart2 = innerStart;

            } else {
                byRef.end1 = innerSec;
                byRef.end2 = outer1.b;

                byRef.nextStart1 = innerStart;
                byRef.nextStart2 = outer2.a;
            }

            // connect the intersection points according to the joint style

            if (jointStyle === JointStyle.BEVEL) {
                // simply connect the intersection points
            vertices.push(outer1.b);
            vertices.push(outer2.a);
            vertices.push(innerSec);

            } else if (jointStyle === JointStyle.ROUND) {
                // draw a circle between the ends of the outer edges,
                // centered at the actual point
                // with half the line thickness as the radius
                this.createTriangleFan(vertices, innerSec, byRef.segment1.center.b, outer1.b, outer2.a, clockwise);
            } else {
                throw new Error(`unexpected state`);
            }
        }
        return vertices;
    }

    private static createTriangleFan(
        vertices: Vec2[], connectTo:Vec2, origin:Vec2,
        start: Vec2, end:Vec2, clockwise: boolean
    ):Vec2[] {

        const point1 = Vec2.subtract(start, origin);
        const point2 = Vec2.subtract(end, origin);

        // calculate the angle between the two points
        let angle1 = Math.atan2(point1.y, point1.x);
        let angle2 = Math.atan2(point2.y, point2.x);

        // ensure the outer angle is calculated
        if (clockwise) {
            if (angle2 > angle1) {
                angle2 = angle2 - 2 * Math.PI;
            }
        } else {
            if (angle1 > angle2) {
                angle1 = angle1 - 2 * Math.PI;
            }
        }

        const jointAngle = angle2 - angle1;

        // calculate the amount of triangles to use for the joint
        const numTriangles = ~~(Math.max(1, Math.floor(Math.abs(jointAngle) / this.roundMinAngle)));

        // calculate the angle of each triangle
        const triAngle = jointAngle / numTriangles;

        let startPoint:Vec2 = new Vec2(start.x,start.y);
        let endPoint: Vec2 = new Vec2(0,0);
        for (let t = 0; t < numTriangles; t++) {
            if (t + 1 === numTriangles) {
                // it's the last triangle - ensure it perfectly
                // connects to the next line
                endPoint = new Vec2(end.x,end.y);
            } else {
                const rot = (t + 1) * triAngle;

                // rotate the original point around the origin
                endPoint.x = Math.cos(rot) * point1.x - Math.sin(rot) * point1.y;
                endPoint.y = Math.sin(rot) * point1.x + Math.cos(rot) * point1.y;

                // re-add the rotation origin to the target point
                endPoint = Vec2.add(endPoint, origin);
            }

            // emit the triangle
            vertices.push(startPoint.clone());
            vertices.push(endPoint.clone());
            vertices.push(connectTo.clone());

            startPoint = new Vec2(endPoint.x,endPoint.y);
        }

        return vertices;
    }



}

