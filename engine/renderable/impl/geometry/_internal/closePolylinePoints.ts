import {clearSvgString} from "@engine/renderable/impl/geometry/_internal/clearSvgString";

export const closePolylinePoints = (points:number[]|string):number[]=>{
    let vertices:number[];

    if ((points as string).split!==undefined) {
        vertices = clearSvgString(points as string).
        split(',').join(' ').
        split(' ').filter(it=>it.trim().length).
        map(it=>parseFloat(it));
    } else {
        vertices = points as number[];
    }

    const prev:number = vertices[vertices.length-2];
    const last:number = vertices[vertices.length-1];

    const first:number = vertices[0];
    const next:number = vertices[1];

    if (last!==next && prev!==first) vertices = [...vertices,first,next];
    return vertices;
};
