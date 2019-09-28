
// simple linear tweening - no easing, no acceleration
import {EaseFn} from "@engine/misc/easing/type";

export const EasingLinear:EaseFn = (t: number, b: number, c: number, d: number): number =>  c * t / d + b;