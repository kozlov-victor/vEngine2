import {MathEx} from "@engine/misc/math/mathEx";
import {WAVE_FORM} from "./types";

export namespace WaveForms {

    export const sin: WAVE_FORM = (fr: number, t: number): number => {
        return Math.sin( 2*Math.PI * t * fr);
    }

    export const sin2: WAVE_FORM = (fr: number, t: number): number => {
        return (
            0.7 * sin(fr, t) +
            0.2 * sin(2/1 * fr, t) +
            0.1 * sin(3/2 * fr, t)
        );
    }

    export const noise: WAVE_FORM = (fr: number, t: number): number => {
        const r = Math.random();
        return r * 2 - 1;
    }

    export const beat: WAVE_FORM = (fr: number, t: number): number => {
        return (
            sin2(fr, t)
        );
    }

    export const square: WAVE_FORM = (fr: number, t: number): number => {
        const sample = sin(fr, t);
        return sample < 0 ? -1 : 1;
    }

    export const triangle: WAVE_FORM = (fr: number, t: number): number => {
        return (
            0.54 * sin2(        fr,   t)    +
            0.1  * sin2(2/1 * fr,   t)    +
            0.1  * sin2(4/1 * fr,   t)    +
            0.1  * sin2(8/1 * fr,   t)    +
            0.1  * sin2(3/2 * fr,   t)    +
            0.01 * sin (4/3 * fr,   t)    +
            0.01 * sin (5/4 * fr,   t)    +
            0.01 * sin (6/5 * fr,   t)    +
            0.01 * sin (7/6 * fr,   t)
        );
    }

    export const tremolo: WAVE_FORM = (fr: number, t: number): number => {
        const semiPeriod = ~~(t * 100) % 6;
        if (semiPeriod > 3) fr *= 2;
        return sin(fr, t);
    }

    export const tremolo2: WAVE_FORM = (fr: number, t: number): number => {
        const semiPeriod = ~~(t * 100) % 6;
        if (semiPeriod > 4) fr *= 3;
        else if (semiPeriod > 2) fr *= 2;
        return sin(fr, t);
    }

    export const distortion: WAVE_FORM = (fr: number, t: number): number => {
        const x = triangle(fr, t);
        const base = 0.5;
        return MathEx.clamp(x/(1 - Math.abs(x)),-base,base);
    }

}
