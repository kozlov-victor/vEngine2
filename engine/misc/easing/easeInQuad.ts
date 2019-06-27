
export namespace Easing {
    // quadratic easing in - accelerating from zero velocity
    export const easeInQuad = (t: number, b: number, c: number, d: number): number=> {
        t /= d;
        return c * t * t + b;
    };
}