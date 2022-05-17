import {distanceToSegmentSq, lerp, v2} from "@engine/renderable/impl/geometry/_internal/v2";

// webglfundamentals.org/webgl/lessons/resources/bezier-curve-diagram.html?maxDepth=0&showCurve=true&showTolerance=true


const flatness = (points:v2[], offset:number):number=> {
    const p1 = points[offset    ];
    const p2 = points[offset + 1];
    const p3 = points[offset + 2];
    const p4 = points[offset + 3];

    let ux = 3 * p2[0] - 2 * p1[0] - p4[0]; ux *= ux;
    let uy = 3 * p2[1] - 2 * p1[1] - p4[1]; uy *= uy;
    let vx = 3 * p3[0] - 2 * p4[0] - p1[0]; vx *= vx;
    let vy = 3 * p3[1] - 2 * p4[1] - p1[1]; vy *= vy;

    if (ux < vx) {
        ux = vx;
    }

    if (uy < vy) {
        uy = vy;
    }

    return ux + uy;
}

export const getPointsOnBezierCurveWithSplitting = (points:v2[], offset:number, tolerance:number,newPoints:v2[] = []):v2[]=> {

    const outPoints:v2[] = newPoints;

    if (flatness(points, offset) < tolerance) {

        // just add the end points of this curve
        outPoints.push(points[offset    ]);
        outPoints.push(points[offset + 3]);

    } else {

        // subdivide
        const t = .5;
        const p1 = points[offset    ];
        const p2 = points[offset + 1];
        const p3 = points[offset + 2];
        const p4 = points[offset + 3];

        const q1 = lerp(p1, p2, t);
        const q2 = lerp(p2, p3, t);
        const q3 = lerp(p3, p4, t);

        const r1 = lerp(q1, q2, t);
        const r2 = lerp(q2, q3, t);

        const red = lerp(r1, r2, t);

        // do 1st half
        getPointsOnBezierCurveWithSplitting([p1, q1, r1, red], 0, tolerance, outPoints);
        // do 2nd half
        getPointsOnBezierCurveWithSplitting([red, r2, q3, p4], 0, tolerance, outPoints);

    }
    return outPoints;
}

const simplifyPoints = (points:v2[], start:number, end:number, epsilon:number, newPoints:v2[]):v2[]=> {
    const outPoints:v2[] = newPoints || [];

    // find the most distance point from the endpoints
    const s = points[start];
    const e = points[end - 1];
    let maxDistSq = 0;
    let maxNdx = 1;
    for (let i = start + 1; i < end - 1; ++i) {
        const distSq = distanceToSegmentSq(points[i], s, e);
        if (distSq > maxDistSq) {
            maxDistSq = distSq;
            maxNdx = i;
        }
    }

    // if that point is too far
    if (Math.sqrt(maxDistSq) > epsilon) {

        // split
        simplifyPoints(points, start, maxNdx + 1, epsilon, outPoints);
        simplifyPoints(points, maxNdx, end, epsilon, outPoints);

    } else {

        // add the 2 end points
        outPoints.push(s, e);
    }

    return outPoints;
}
