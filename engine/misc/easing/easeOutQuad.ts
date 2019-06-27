
export namespace Easing {
    // quadratic easing out - decelerating to zero velocity
    export const easeOutQuad= (t: number, b: number, c: number, d: number): number =>{
        t /= d;
        return -c * t * (t - 2) + b;
    };
}