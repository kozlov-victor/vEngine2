import {EaseFn} from "@engine/misc/easing/type";

export const EasingStep = (stepValue:number):EaseFn=>{
    return (t: number, b: number, c: number, d: number): number =>  {
        return (~~((c * t / d)/stepValue))*stepValue + b;
    }
}
