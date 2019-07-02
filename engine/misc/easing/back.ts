export namespace Easing {

    export namespace Back {

        export const In=(t: number, b: number, c: number, d: number): number=> {
            const s: number = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        };

        export const Out=(t: number, b: number, c: number, d: number): number=> {
            const s: number = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        };

        export const InOut=(t: number, b: number, c: number, d: number): number=> {
            let s: number = 1.70158;
            if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            return c / 2 *((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        };

    }



}