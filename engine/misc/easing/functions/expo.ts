import {EaseFn} from "@engine/misc/easing/type";

export namespace EasingExpo {
    // exponential easing in - accelerating from zero velocity
    export const In:EaseFn = (t: number, b: number, c: number, d: number): number=> {
        return c * Math.pow(2, 10 * (t / d - 1)) + b;
    };

    // exponential easing out - decelerating to zero velocity
    export const Out:EaseFn = (t: number, b: number, c: number, d: number): number=> {
        return c * ( -Math.pow(2, -10 * t / d) + 1 ) + b;
    };

    // exponential easing in/out - accelerating until halfway, then decelerating
    export const InOut:EaseFn = (t: number, b: number, c: number, d: number): number=> {
        t /= d / 2;
        if (t < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        t--;
        return c / 2 * ( -Math.pow(2, -10 * t) + 2 ) + b;
    };

}