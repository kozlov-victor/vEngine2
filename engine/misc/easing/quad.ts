export namespace Easing {

    export namespace Quad {
        // quadratic easing in - accelerating from zero velocity
        export const In = (t: number, b: number, c: number, d: number): number => {
            t /= d;
            return c * t * t + b;
        };

        // quadratic easing out - decelerating to zero velocity
        export const Out = (t: number, b: number, c: number, d: number): number => {
            t /= d;
            return -c * t * (t - 2) + b;
        };

        // quadratic easing in/out - acceleration until halfway, then deceleration
        export const InOut = (t: number, b: number, c: number, d: number): number => {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        };

    }

}