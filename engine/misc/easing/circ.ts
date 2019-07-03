export namespace Easing {

    export namespace Circ {

        // circular easing in - accelerating from zero velocity
        export const In=(t: number, b: number, c: number, d: number): number=> {
            t /= d;
            return -c *(Math.sqrt(1 - t * t) - 1) + b;
        };

        // circular easing out - decelerating to zero velocity
        export const Out=(t: number, b: number, c: number, d: number): number=> {
            t /= d;
            t--;
            return c * Math.sqrt(1 - t * t) + b;
        };

        // circular easing in/out - acceleration until halfway, then deceleration
        export const InOut=(t: number, b: number, c: number, d: number): number=> {
            t /= d / 2;
            if (t < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            t -= 2;
            return c / 2 * (Math.sqrt(1 - t * t) + 1) + b;
        };

    }



}