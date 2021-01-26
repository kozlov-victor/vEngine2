import {IPoint2d, Point2d} from "../geometry/point2d";
import {IRect, Rect} from "../geometry/rect";


export namespace MathEx {

    export const isPointInRect = (point: IPoint2d, rect: IRect): boolean => {
        return point.x > rect.x &&
        point.x < (rect.x + rect.width) &&
        point.y > rect.y &&
        point.y < (rect.y + rect.height);
    };

    export const clamp = (val:number,min:number,max:number):number=> {
        if (val<min) val = min;
        if (val>max) val = max;
        return val;
    };

    export const overlapTest = (a: IRect, b: IRect): boolean => {
        return (a.x < b.x + b.width) &&
            (a.x + a.width > b.x) &&
            (a.y < b.y + b.height) &&
            (a.y + a.height > b.y);
    };

    export const radToDeg = (rad: number): number => {
        return rad * 180 / Math.PI;
    };

    export const degToRad = (deg: number): number => {
        return deg * Math.PI / 180;
    };

    export const rectToPolar = (point: IPoint2d, center: IPoint2d): { radius: number, angle: number } => {
        const radius:number = Math.sqrt(point.x * point.x + center.y * center.y);
        const angle:number = Math.atan2(center.y - point.y, center.x - point.x);
        return {radius, angle};
    };

    export const polarToRect = (radius: number, angle: number, center: IPoint2d): Point2d => {
        const x:number = radius * Math.cos(angle);
        const y:number = radius * Math.sin(angle);
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
        const dx: number = p1.x - p2.x;
        const dy: number = p1.y - p2.y;
        return Math.atan2(dy, dx);
    };

    export const random = (min: number, max: number): number => {
        if (min > max) {
            const tmp:number = min;
            min = max;
            max = tmp;
        }
        return Math.random() * (max - min) + min;
    };

    export const randomInt = (min: number, max: number): number => {
        return ~~random(min,max);
    };

    export const randomByte = (min: byte, max: byte): byte => {
        return randomInt(min,max) as byte;
    };
}
