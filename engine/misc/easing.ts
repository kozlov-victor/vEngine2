

export namespace Easing {


    // cubic easing in - accelerating from zero velocity
    export const easeInCubic=(t: number, b: number, c: number, d: number): number=> {
        t /= d;
        return c * t * t * t + b;
    };

    // cubic easing out - decelerating to zero velocity
    export const easeOutCubic=(t: number, b: number, c: number, d: number): number =>{
        t /= d;
        t--;
        return c * (t * t * t + 1) + b;
    };

    // cubic easing in/out - acceleration until halfway, then deceleration
    export const easeInOutCubic=(t: number, b: number, c: number, d: number): number=> {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    };

    // quartic easing in - accelerating from zero velocity
    export const easeInQuart=(t: number, b: number, c: number, d: number): number=> {
        t /= d;
        return c * t * t * t * t + b;
    };

    // quartic easing out - decelerating to zero velocity
    export const easeOutQuart=(t: number, b: number, c: number, d: number): number=> {
        t /= d;
        t--;
        return -c * (t * t * t * t - 1) + b;
    };

    // quartic easing in/out - acceleration until halfway, then deceleration
    export const easeInOutQuart=(t: number, b: number, c: number, d: number): number=> {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t * t + b;
        t -= 2;
        return -c / 2 * (t * t * t * t - 2) + b;
    };

    // quintic easing in - accelerating from zero velocity
    export const easeInQuint=(t: number, b: number, c: number, d: number): number=> {
        t /= d;
        return c * t * t * t * t * t + b;
    };

    // quintic easing out - decelerating to zero velocity
    export const easeOutQuint=(t: number, b: number, c: number, d: number): number=> {
        t /= d;
        t--;
        return c * (t * t * t * t * t + 1) + b;
    };

    // quintic easing in/out - acceleration until halfway, then deceleration
    export const easeInOutQuint=(t: number, b: number, c: number, d: number): number=> {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t * t * t + 2) + b;
    };


    // sinusoidal easing in - accelerating from zero velocity
    export const easeInSine=(t: number, b: number, c: number, d: number): number=> {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    };


    // sinusoidal easing out - decelerating to zero velocity
    export const easeOutSine=(t: number, b: number, c: number, d: number): number=> {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    };


    // sinusoidal easing in/out - accelerating until halfway, then decelerating
    export const easeInOutSine=(t: number, b: number, c: number, d: number): number=> {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    };

    // exponential easing in - accelerating from zero velocity
    export const easeInExpo=(t: number, b: number, c: number, d: number): number=> {
        return c * Math.pow(2, 10 * (t / d - 1)) + b;
    };

    // exponential easing out - decelerating to zero velocity
    export const easeOutExpo=(t: number, b: number, c: number, d: number): number=> {
        return c * ( -Math.pow(2, -10 * t / d) + 1 ) + b;
    };

    // exponential easing in/out - accelerating until halfway, then decelerating
    export const easeInOutExpo=(t: number, b: number, c: number, d: number): number=> {
        t /= d / 2;
        if (t < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        t--;
        return c / 2 * ( -Math.pow(2, -10 * t) + 2 ) + b;
    };

    // circular easing in - accelerating from zero velocity
    export const easeInCirc=(t: number, b: number, c: number, d: number): number=> {
        t /= d;
        return -c *(Math.sqrt(1 - t * t) - 1) + b;
    };

    // circular easing out - decelerating to zero velocity
    export const easeOutCirc=(t: number, b: number, c: number, d: number): number=> {
        t /= d;
        t--;
        return c * Math.sqrt(1 - t * t) + b;
    };

    // circular easing in/out - acceleration until halfway, then deceleration
    export const easeInOutCirc=(t: number, b: number, c: number, d: number): number=> {
        t /= d / 2;
        if (t < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        t -= 2;
        return c / 2 * (Math.sqrt(1 - t * t) + 1) + b;
    };

    export const easeInElastic=(t: number, b: number, c: number, d: number): number=> {
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

    export const easeOutElastic=(t: number, b: number, c: number, d: number): number=> {
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

    export const easeInOutElastic=(t: number, b: number, c: number, d: number): number=> {
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

    export const easeInBack=(t: number, b: number, c: number, d: number): number=> {
        const s: number = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    };

    export const easeOutBack=(t: number, b: number, c: number, d: number): number=> {
        const s: number = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    };

    export const easeInOutBack=(t: number, b: number, c: number, d: number): number=> {
        let s: number = 1.70158;
        if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        return c / 2 *((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    };

    export const easeInBounce=(t: number, b: number, c: number, d: number): number=> {
        return c - Easing.easeOutBounce(d - t, 0, c, d) + b;
    };

    export const easeOutBounce=(t: number, b: number, c: number, d: number): number=> {
        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
        } else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
        } else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
        } else {
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
        }
    };

    export const easeInOutBounce=(t: number, b: number, c: number, d: number): number=> {
        if (t < d / 2) return Easing.easeInBounce(t * 2, 0, c, d) * .5 + b;
        else return Easing.easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
    };
}