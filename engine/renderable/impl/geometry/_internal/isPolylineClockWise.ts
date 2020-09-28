// solution is based on https://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-points-are-in-clockwise-order/1165943#1165943

export const isPolylineCloseWise = (vertices:number[]): boolean=> {
    let sum:number = 0.0;
    const l = vertices.length;
    for (let i:number = 0; i < l; i+=2) {
        const v1x:number = vertices[i];
        const v1y:number = vertices[(i+1)%l];
        const v2x:number = vertices[(i+2)%l];
        const v2y:number = vertices[(i+3)%l];
        sum += (v2x - v1x) * (v2y + v1y);
    }
    return sum > 0.0;
};
