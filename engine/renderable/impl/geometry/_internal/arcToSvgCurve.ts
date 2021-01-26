import {IPoint2d} from "@engine/geometry/point2d";

// https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle

const polarToCartesian=(centerX:number, centerY:number, radius:number, angle:number):IPoint2d=> {

    return {
        x: centerX + (radius * Math.cos(angle)),
        y: centerY + (radius * Math.sin(angle))
    };
};

export const arcToSvgCurve = (x:number, y:number, radius:number, startAngle:number, endAngle:number):string=>{

    const start:IPoint2d = polarToCartesian(x, y, radius, endAngle);
    const end:IPoint2d = polarToCartesian(x, y, radius, startAngle);

    const largeArcFlag = endAngle - startAngle <= Math.PI ? '0' : '1';

    return [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
};
