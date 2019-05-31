type num = number;

export type EaseFn = (t:num,b:num,c:num,d:num)=>num;

export class Easing {
    // simple linear tweening - no easing, no acceleration
    public static linear(t: num, b: num, c: num, d: num): num {
        return c * t / d + b;
    }

    // quadratic easing in - accelerating from zero velocity
    public static easeInQuad(t: num, b: num, c: num, d: num): num {
        t /= d;
        return c * t * t + b;
    }

    // quadratic easing out - decelerating to zero velocity
    public static easeOutQuad(t: num, b: num, c: num, d: num): num {
        t /= d;
        return -c * t * (t - 2) + b;
    }

    // quadratic easing in/out - acceleration until halfway, then deceleration
    public static easeInOutQuad(t: num, b: num, c: num, d: num): num {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    // cubic easing in - accelerating from zero velocity
    public static easeInCubic(t: num, b: num, c: num, d: num): num {
        t /= d;
        return c * t * t * t + b;
    }

    // cubic easing out - decelerating to zero velocity
    public static easeOutCubic(t: num, b: num, c: num, d: num): num {
        t /= d;
        t--;
        return c * (t * t * t + 1) + b;
    }

    // cubic easing in/out - acceleration until halfway, then deceleration
    public static easeInOutCubic(t: num, b: num, c: num, d: num): num {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    }

    // quartic easing in - accelerating from zero velocity
    public static easeInQuart(t: num, b: num, c: num, d: num): num {
        t /= d;
        return c * t * t * t * t + b;
    }

    // quartic easing out - decelerating to zero velocity
    public static easeOutQuart(t: num, b: num, c: num, d: num): num {
        t /= d;
        t--;
        return -c * (t * t * t * t - 1) + b;
    }

    // quartic easing in/out - acceleration until halfway, then deceleration
    public static easeInOutQuart(t: num, b: num, c: num, d: num): num {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t * t + b;
        t -= 2;
        return -c / 2 * (t * t * t * t - 2) + b;
    }

    // quintic easing in - accelerating from zero velocity
    public static easeInQuint(t: num, b: num, c: num, d: num): num {
        t /= d;
        return c * t * t * t * t * t + b;
    }

    // quintic easing out - decelerating to zero velocity
    public static easeOutQuint(t: num, b: num, c: num, d: num): num {
        t /= d;
        t--;
        return c * (t * t * t * t * t + 1) + b;
    }

    // quintic easing in/out - acceleration until halfway, then deceleration
    public static easeInOutQuint(t: num, b: num, c: num, d: num): num {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t * t * t + 2) + b;
    }


    // sinusoidal easing in - accelerating from zero velocity
    public static easeInSine(t: num, b: num, c: num, d: num): num {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    }


    // sinusoidal easing out - decelerating to zero velocity
    public static easeOutSine(t: num, b: num, c: num, d: num): num {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    }


    // sinusoidal easing in/out - accelerating until halfway, then decelerating
    public static easeInOutSine(t: num, b: num, c: num, d: num): num {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    }

    // exponential easing in - accelerating from zero velocity
    public static easeInExpo(t: num, b: num, c: num, d: num): num {
        return c * Math.pow(2, 10 * (t / d - 1)) + b;
    }

    // exponential easing out - decelerating to zero velocity
    public static easeOutExpo(t: num, b: num, c: num, d: num): num {
        return c * ( -Math.pow(2, -10 * t / d) + 1 ) + b;
    }

    // exponential easing in/out - accelerating until halfway, then decelerating
    public static easeInOutExpo(t: num, b: num, c: num, d: num): num {
        t /= d / 2;
        if (t < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        t--;
        return c / 2 * ( -Math.pow(2, -10 * t) + 2 ) + b;
    }

    // circular easing in - accelerating from zero velocity
    public static easeInCirc(t: num, b: num, c: num, d: num): num {
        t /= d;
        return -c * (Math.sqrt(1 - t * t) - 1) + b;
    }

    // circular easing out - decelerating to zero velocity
    public static easeOutCirc(t: num, b: num, c: num, d: num): num {
        t /= d;
        t--;
        return c * Math.sqrt(1 - t * t) + b;
    }

    // circular easing in/out - acceleration until halfway, then deceleration
    public static easeInOutCirc(t: num, b: num, c: num, d: num): num {
        t /= d / 2;
        if (t < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        t -= 2;
        return c / 2 * (Math.sqrt(1 - t * t) + 1) + b;
    }

    public static easeInElastic(t: num, b: num, c: num, d: num): num {
        let s: num = 1.70158, p: num = 0, a: num = c;
        if (t === 0) return b;
        if ((t /= d) === 1) return b + c;
        if (!p) p = d * .3;
        if (a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else s = p / (2 * Math.PI) * Math.asin(c / a);
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    }

    public static easeOutElastic(t: num, b: num, c: num, d: num): num {
        let s: num = 1.70158, p: num = 0, a: num = c;
        if (t === 0) return b;
        if ((t /= d) === 1) return b + c;
        if (!p) p = d * .3;
        if (a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else s = p / (2 * Math.PI) * Math.asin(c / a);
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    }

    public static easeInOutElastic(t: num, b: num, c: num, d: num): num {
        let s: num = 1.70158, p: num = 0, a: num = c;
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
    }

    public static easeInBack(t: num, b: num, c: num, d: num): num {
        const s: num = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    }

    public static easeOutBack(t: num, b: num, c: num, d: num): num {
        const s: num = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    }

    public static easeInOutBack(t: num, b: num, c: num, d: num): num {
        let s: num = 1.70158;
        if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    }

    public static easeInBounce(t: num, b: num, c: num, d: num): num {
        return c - Easing.easeOutBounce(d - t, 0, c, d) + b;
    }

    public static easeOutBounce(t: num, b: num, c: num, d: num): num {
        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
        } else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
        } else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
        } else {
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
        }
    }

    public static easeInOutBounce(t: num, b: num, c: num, d: num): num {
        if (t < d / 2) return Easing.easeInBounce(t * 2, 0, c, d) * .5 + b;
        else return Easing.easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
    }
}