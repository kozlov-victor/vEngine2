import {EaseFn} from "@engine/misc/easing/type";

export namespace EasingElastic {

    export const In:EaseFn = (t: number, b: number, c: number, d: number): number=> {
        let s: number = 1.70158, p: number = 0, a: number = c;
        if (t === 0) return b;
        if ((t /= d) === 1) return b + c;
        if (!p) p = d * .3;
        if (a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else s = p / (2 * Math.PI) * Math.asin(c / a);
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    };

    export const Out:EaseFn = (t: number, b: number, c: number, d: number): number=> {
        let s: number = 1.70158, p: number = 0, a: number = c;
        if (t === 0) return b;
        if ((t /= d) === 1) return b + c;
        if (!p) p = d * .3;
        if (a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else s = p / (2 * Math.PI) * Math.asin(c / a);
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    };

    export const InOut:EaseFn = (t: number, b: number, c: number, d: number): number=> {
        let s: number = 1.70158, p: number = 0, a: number = c;
        if (t === 0) return b;
        if ((t /= d / 2) === 2) return b + c;
        if (!p) p = d * (.3 * 1.5);
        if (a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else s = p / (2 * Math.PI) * Math.asin(c / a);
        if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
    };

}