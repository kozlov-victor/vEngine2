export namespace Easing {

    export namespace Bounce {

        export const In=(t: number, b: number, c: number, d: number): number=> {
            return c - Out(d - t, 0, c, d) + b;
        };

        export const Out=(t: number, b: number, c: number, d: number): number=> {
            const A:number = 7.5625;
            const B:number = 2.75;
            if ((t /= d) < (1 / B)) {
                return c * (A * t * t) + b;
            } else if (t < (2 / B)) {
                return c * (A * (t -= (1.5 / B)) * t + .75) + b;
            } else if (t < (2.5 / B)) {
                return c * (A * (t -= (2.25 / B)) * t + .9375) + b;
            } else {
                return c * (A * (t -= (2.625 / B)) * t + .984375) + b;
            }
        };

        export const InOut=(t: number, b: number, c: number, d: number): number=> {
            if (t < d / 2) return In(t * 2, 0, c, d) * .5 + b;
            else return Out(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
        };

    }



}