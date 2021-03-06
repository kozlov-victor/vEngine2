import {EaseFn} from "@engine/misc/easing/type";

export namespace EasingSine {

    // sinusoidal easing in - accelerating from zero velocity
    export const In:EaseFn = (t: number, b: number, c: number, d: number): number=> {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    };


    // sinusoidal easing out - decelerating to zero velocity
    export const Out:EaseFn = (t: number, b: number, c: number, d: number): number=> {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    };

    // sinusoidal easing in/out - accelerating until halfway, then decelerating
    export const InOut:EaseFn = (t: number, b: number, c: number, d: number): number=> {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    };

}