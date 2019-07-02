export namespace Easing {

    export namespace Quart {

        // quartic easing in - accelerating from zero velocity
        export const In = (t: number, b: number, c: number, d: number): number=> {
            t /= d;
            return c * t * t * t * t + b;
        };

        // quartic easing out - decelerating to zero velocity
        export const Out = (t: number, b: number, c: number, d: number): number=> {
            t /= d;
            t--;
            return -c * (t * t * t * t - 1) + b;
        };

        // quartic easing in/out - acceleration until halfway, then deceleration
        export const InOut = (t: number, b: number, c: number, d: number): number=> {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t * t * t + b;
            t -= 2;
            return -c / 2 * (t * t * t * t - 2) + b;
        };

    }

}