import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {Point2d} from "@engine/geometry/point2d";

// solution is based on https://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-points-are-in-clockwise-order/1165943#1165943

export const isPolylineCloseWise = (vertices:number[]):boolean=> {
    let sum:number = 0.0;
    for (let i:number = 0; i < vertices.length-4; i+=4) {
        const v1x:number = vertices[i];
        const v1y:number = vertices[i+1];
        const v2x:number = vertices[i+2];
        const v2y:number = vertices[i+3];
        sum += (v2x - v1x) * (v2y + v1y);
    }
    return sum > 0.0;
};
