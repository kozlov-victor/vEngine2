import {ADSRPoint, IASDR} from "./types";

export class AdsrForm {

    private readonly attack: ADSRPoint;
    private readonly decay: ADSRPoint;
    private readonly sustain: ADSRPoint;
    private readonly release: ADSRPoint;

    private forceReleaseStartedAt:number;
    public forceRelease:boolean = false; // key is released, so force go to "d" ("delay") segment if ADSR curve

    constructor(asdr:IASDR) {
        const {a,d,s,r, base} =  asdr;
        this.attack = {from: {time: 0, val: 0}, to: {time: a, val: 1}};
        this.decay = {from: {time: a, val: 1}, to: {time: a + d, val: 1}};
        this.sustain = {from: {time: a + d, val: 1}, to: {time: a + d + s, val: base}};
        this.release = {from: {time: a + d + s, val: base}, to: {time: a + d + s + r, val: 0}};
    }

    private static _linear(t: number, b: number, c: number, d: number): number {
        return c * t / d + b;
    }

    public calcFactorByTime(t: number,pedalOn:boolean): {stopped:boolean,val:number} {
        let closestPrevPoint = this.attack;
        if (this.forceRelease && !pedalOn) {
            if (this.forceReleaseStartedAt===undefined) this.forceReleaseStartedAt = t;
            const d = t - this.forceReleaseStartedAt;
            if (d>this.release.to.time - this.release.from.time) {
                return {
                    stopped: true,
                    val: 0,
                }
            }
            closestPrevPoint = this.release;
        } else {
            [this.decay, this.sustain, this.release].forEach(point => {
                if (t > point.from.time) {
                    closestPrevPoint = point;
                }
            });
        }
        let val = AdsrForm._linear(
            t,
            closestPrevPoint.from.val, closestPrevPoint.to.val - closestPrevPoint.from.val,
            closestPrevPoint.to.time - closestPrevPoint.from.time
        );
        if (val < 0) val = 0;
        return {
            stopped:false,
            val
        };
    }

}
