
// webglfundamentals.org/webgl/lessons/resources/bezier-curve-diagram.html?maxDepth=0&showCurve=true&showTolerance=true

export type v2 = [number,number];

// adds 1 or more v2s
export const add = (a:Readonly<v2>, ...args:Readonly<v2>[]):v2=> {
    const n:v2 = [...a] as v2;
    args.forEach((p) => {
        n[0] += p[0];
        n[1] += p[1];
    });
    return n;
};

export const sub = (a:Readonly<v2>, ...args:Readonly<v2>[]):v2=> {
    const n:v2 = [...a] as v2;
    args.forEach((p) => {
        n[0] -= p[0];
        n[1] -= p[1];
    });
    return n;
};

export const mult = (a:Readonly<v2>, scalar:number):v2=> {
    return [a[0] * scalar, a[1] * scalar];
};

export const lerp = (a:v2, b:v2, t:number):v2=> {
    return [
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t,
    ];
}

// compute the distance squared between a and b
const distanceSq = (a:v2, b:v2):number=> {
    const dx = a[0] - b[0];
    const dy = a[1] - b[1];
    return dx * dx + dy * dy;
}

// compute the distance between a and b
const distance = (a:v2, b:v2):number=> {
    return Math.sqrt(distanceSq(a, b));
}

// compute the distance squared from p to the line segment
// formed by v and w
export const distanceToSegmentSq = (p:v2, v:v2, w:v2):number=> {
    const l2 = distanceSq(v, w);
    if (l2 == 0) {
        return distanceSq(p, v);
    }
    let t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
    t = Math.max(0, Math.min(1, t));
    return distanceSq(p, lerp(v, w, t));
}

// compute the distance from p to the line segment
// formed by v and w
const distanceToSegment = (p:v2, v:v2, w:v2):number=> {
    return Math.sqrt(distanceToSegmentSq(p, v, w));
}
