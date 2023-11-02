import {MathEx} from "@engine/misc/math/mathEx";
import {WAVE_FORM} from "./types";
import {NoiseGenerator} from "./noiseGenerator";

export namespace WaveForms {

    export const sin = (fr: number, t: number): number => {
        return Math.sin( 2*Math.PI * t * fr);
    }

    export const sin2 = (fr: number, t: number): number => {
        return (
            0.6 * sin(fr, t) +
            0.2 * sin(2/1 * fr, t) +
            0.2 * sin(3/2 * fr, t)
        );
    }

    export const chorus = (fr: number, t: number): number => {
        const numOfVoices = 4;
        const harmonics = [1,2,3/2,3];
        let offset = 0;
        const offsetDelta = 1/(fr*2*Math.PI)*0.21; //  of period
        let result = 0;
        for (let i=0;i<numOfVoices;i++) {
            const mod = i%3;
            let fn:WAVE_FORM;
            if (mod===0) fn = sinHarmonics;
            else if (mod===1) fn = triangle;
            else fn = square;

            result+=fn(fr*harmonics[(i%harmonics.length)],t+offset);
            offset+=offsetDelta;
        }
        return result / numOfVoices;
    }

    export const sinHarmonics = (fr: number, t: number): number => {
        return (
            1/3 * sin(fr, t) +
            1/3 * sin(2 * fr, t) +
            1/3 * sin(4 * fr, t)
        );
    }

    export const triangle = (fr: number, t: number): number => {
        return Math.asin(sin(fr, t));
    }

    export const sawTooth = (fr: number, t: number): number => {
        return (
            sin(       fr,   t)   -
            1/2  * sin(2 * fr,   t)   +
            1/3  * sin(3 * fr,   t)   -
            1/4  * sin(4 * fr,   t)   +
            1/5  * sin(5 * fr,   t)   -
            1/6  * sin(6 * fr,   t)
        );
    }

    export const whiteNoise = (fr: number, t: number): number => {
        return NoiseGenerator.getNextWhiteNoiseSample();
    }

    export const pinkNoise = (fr: number, t: number): number => {
        return NoiseGenerator.getNextPinkNoiseSample();
    }

    export const brownNoise = (fr: number, t: number): number => {
        return NoiseGenerator.getNextBrownNoiseSample();
    }

    export const square = (fr: number, t: number): number => {
        const sample = sin(fr, t);
        return sample < 0 ? -1 : 1;
    }

    export const trapezia = (fr: number, t: number): number => {
        return MathEx.clamp(2*triangle(fr, t),-1,1);
    }

    export const harmonic = (fr: number, t: number): number => {
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

    export const noop = (fr: number, t: number): number => {
        return 0;
    }

    export const tremolo = (fr: number, t: number): number => {
        const semiPeriod = ~~(t * 100) % 6;
        if (semiPeriod > 3) fr *= 3/2;
        return sin(fr, t);
    }

    export const tremolo2 = (fr: number, t: number): number => {
        const semiPeriod = ~~(t * 100) % 6;
        if (semiPeriod > 4) fr *= 3;
        else if (semiPeriod > 2) fr *= 2;
        return sin(fr, t);
    }


    export const dirtyWave = (deviation:number, step:number, wave:WAVE_FORM)=>{
        return (fr:number,t:number):number=>{
            let out = 0;
            let from = fr - deviation;
            if (from<0) from = 0;
            const to = fr + deviation;
            let cnt = 0;
            for (let i=from;i<to;i+=step) {
                out+=wave(i,t);
                cnt++;
            }
            out*=5; // compensation
            out/=cnt;
            return out;
        }
    }

    export const dirtyWaveNoise = (deviation:number, step:number, wave:WAVE_FORM, noise:WAVE_FORM, noiseAmplitude: number):WAVE_FORM=>{
        const waveFn = dirtyWave(deviation, step, wave);
        return (fr:number,t:number):number=>{
            return (
                (1 - noiseAmplitude) * MathEx.clamp(waveFn(fr,t),-1,1) +
                (noiseAmplitude) * noise(fr, t)
            );
        }
    }

}
