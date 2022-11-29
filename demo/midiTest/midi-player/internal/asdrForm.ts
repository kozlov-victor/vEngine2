import {ADSRPoint, IASDR} from "./types";

export class ASDRForm {

    private readonly attack: ADSRPoint;
    private readonly sustain: ADSRPoint;
    private readonly delay: ADSRPoint;
    private readonly release: ADSRPoint;

    private forceReleaseStartedAt:number;
    public forceRelease:boolean = false; // key is released, so force go to "d" ("delay") segment if ADSR curve
    public pedalOn:boolean = false; // if pedal is on note continue to play event after key release

    constructor(asdr:IASDR) {
        const {a,s,d,r} =  asdr;
        this.attack = {from: {time: 0, val: 0}, to: {time: a, val: 1}};
        this.sustain = {from: {time: a, val: 1}, to: {time: a + s, val: 1}};
        this.delay = {from: {time: a + s, val: 1}, to: {time: a + s + d, val: 0.5}};
        this.release = {from: {time: a + s + d, val: 0.5}, to: {time: a + s + d + r, val: 0}};
    }

    private static _linear(t: number, b: number, c: number, d: number): number {
        return c * t / d + b;
    }

    public calcFactorByTime(t: number): {stopped:boolean,val:number} {
        let closestPrevPoint = this.attack;
        if (this.forceRelease && !this.pedalOn) {
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
            [this.sustain, this.delay, this.release].forEach(point => {
                if (t > point.from.time) {
                    closestPrevPoint = point;
                }
            });
        }
        let val = ASDRForm._linear(
            t,
            closestPrevPoint.from.val, closestPrevPoint.to.val - closestPrevPoint.from.val,
            closestPrevPoint.to.time - closestPrevPoint.from.time
        );
        if (val < 0) val = 0;
        let stopped = false;
        if (closestPrevPoint===this.release && val===0) stopped = true;
        return {
            stopped,
            val
        };
    }

}
