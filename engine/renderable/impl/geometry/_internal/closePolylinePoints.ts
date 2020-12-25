export const closePolylinePoints = (vertices:number[]):number[]=>{

    const prev:number = vertices[vertices.length-2];
    const last:number = vertices[vertices.length-1];

    const first:number = vertices[0];
    const next:number = vertices[1];

    if (last!==next || prev!==first) vertices = [...vertices,first,next];
    return vertices;
};
