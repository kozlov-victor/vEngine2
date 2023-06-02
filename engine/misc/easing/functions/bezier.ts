

export const EasingBezier = (t: number , initial: number, p1: number, p2: number, final: number):number=> {
    return (
        (1 - t) * (1 - t) * (1 - t) * initial
        +
        3 * (1 - t) * (1 - t) * t * p1
        +
        3 * (1 - t) * t * t * p2
        +
        t * t * t * final
    )

}
