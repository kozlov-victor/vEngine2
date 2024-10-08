import {IPoint2d, Point2d} from "../../geometry/point2d";
import {IRect, IRectJSON} from "../../geometry/rect";


export namespace MathEx {

    export const isPointInRect = (point: IPoint2d, rect: IRectJSON): boolean => {
        return point.x > rect.x &&
        point.x < (rect.x + rect.width) &&
        point.y > rect.y &&
        point.y < (rect.y + rect.height);
    };

    export const clamp = (val:number,min:number,max:number):number=> {
        if (val<min) val = min;
        else if (val>max) val = max;
        return val;
    };

    export const overlapTest = (a: IRect, b: IRect): boolean => {
        return  (a.x < b.right)   &&
                (a.right > b.x)   &&
                (a.y < b.bottom)  &&
                (a.bottom > b.y);
    };

    export const radToDeg = (rad: number): number => {
        return rad * 180 / Math.PI;
    };

    export const degToRad = (deg: number): number => {
        return deg * Math.PI / 180;
    };

    export const rectToPolar = (point: IPoint2d, center: IPoint2d): { radius: number, angle: number } => {
        const radius = Math.sqrt(point.x * point.x + center.y * center.y);
        const angle = Math.atan2(center.y - point.y, center.x - point.x);
        return {radius, angle};
    };

    export const polarToRect = (radius: number, angle: number, center: IPoint2d): Point2d => {
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        return new Point2d(center.x - x, center.y - y);
    };

    export const getDistanceSquared = (p1: IPoint2d, p2: IPoint2d): number => {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    };

    export const closeTo = (a: number, b: number, epsilon: number = 0.01): boolean => {
        return Math.abs(a - b) <= epsilon;
    };

    export const getDistance = (p1: IPoint2d, p2: IPoint2d): number => {
        return Math.sqrt(getDistanceSquared(p1, p2));
    };

    export const getAngle = (p1: IPoint2d, p2: IPoint2d): number => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        return Math.atan2(dy, dx);
    };

    // max is not inclusive
    export const random = (min: number, max: number): number => {
        if (min > max) {
            const tmp:number = min;
            min = max;
            max = tmp;
        }
        return Math.random() * (max - min) + min;
    };

    // max is inclusive
    export const randomInt = (min: number, max: number): number => {
        return ~~random(min,max+1);
    };

    // max is inclusive
    export const randomUint8 = (min: Uint8 = 0, max: Uint8= 255): Uint8 => {
        return randomInt(min,max) as Uint8;
    };
}
