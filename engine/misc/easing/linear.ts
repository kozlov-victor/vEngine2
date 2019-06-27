
export namespace Easing {
    // simple linear tweening - no easing, no acceleration
    export const linear = (t: number, b: number, c: number, d: number): number =>  c * t / d + b;
}