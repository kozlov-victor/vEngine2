import {Point2d} from "../geometry/point2d";
import {IRect, Rect} from "../geometry/rect";
import {mat4} from "@engine/geometry/mat4";


export namespace MathEx {

    import Mat16Holder = mat4.Mat16Holder;

    export const isPointInRect = (point: Point2d, rect: Rect, angle?: number): boolean => {
        // if  = (angle) {
        //     const vec2 = new Vec2 = (point.x - rect.x - rect.width/2,point.y - rect.y - rect.height/2);
        //     vec2.setAngle = (vec2.getAngle = () - angle);
        //     point = {x:vec2.getX = () + point.x,y:vec2.getY = () + point.y};
        //
        // }
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

    export const rectToPolar = (point: Point2d, center: Point2d): { radius: number, angle: number } => {
        const radius:number = Math.sqrt(point.x * point.x + center.y * center.y);
        const angle:number = Math.atan2(center.y - point.y, center.x - point.x);
        return {radius, angle};
    };

    export const polarToRect = (radius: number, angle: number, center: Point2d): Point2d => {
        const x:number = radius * Math.cos(angle);
        const y:number = radius * Math.sin(angle);
        return new Point2d(center.x - x, center.y - y);
    };

    export const getDistanceSquared = (p1: Point2d, p2: Point2d): number => {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    };

    export const closeTo = (a: number, b: number, epsilon: number = 0.01): boolean => {
        return Math.abs(a - b) <= epsilon;
    };

    export const getDistance = (p1: Point2d, p2: Point2d): number => {
        return Math.sqrt(getDistanceSquared(p1, p2));
    };

    export const getAngle = (p1: Point2d, p2: Point2d): number => {
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

    /**
     * analog of glu unproject function
     * https://github.com/bringhurst/webgl-unproject/blob/master/GLU.js
     */
    export const unProject = (winPoint: Point2d, width: number, height: number, viewProjectionMatrix: Mat16Holder): Point2d => {
        const x: number = 2.0 * winPoint.x / width - 1;
        const y: number = 2.0 * winPoint.y / height - 1;
        const viewProjectionInverse: Mat16Holder = Mat16Holder.fromPool()!;
        mat4.inverse(viewProjectionInverse,viewProjectionMatrix);

        const point3D: [number,number,number,number] = [x, y, 0, 1];
        const res: Mat16Holder = Mat16Holder.fromPool();
        mat4.multMatrixVec(res,viewProjectionInverse, point3D);
        res.mat16[0] = (res.mat16[0] / 2 + 0.5) * width;
        res.mat16[1] = (res.mat16[1] / 2 + 0.5) * height;
        const result:Point2d = new Point2d(res.mat16[0], res.mat16[1]); // todo: new Point ---> point pool

        viewProjectionInverse.release();
        res.release();

        return result;
    };

}
