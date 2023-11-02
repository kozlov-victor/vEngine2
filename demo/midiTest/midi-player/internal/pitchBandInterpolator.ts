import {EasingLinear} from "@engine/misc/easing/functions/linear";

export class PitchBandInterpolator {

    private readonly INTERPOLATION_TIME = 800;
    private startedAtTime = 0;
    private currentTime = 0;
    private valueFrom = 0;
    private valueTo = 0;

    public update(time:number) {
        if (!this.startedAtTime) this.startedAtTime = time;
        this.currentTime = time;
    }

    public setValue(val:number) {
        this.valueFrom = this.getValue();
        this.valueTo = val;
        this.startedAtTime = 0;
    }

    public getValue() {
        const dt = this.currentTime - this.startedAtTime;
        if (dt>this.INTERPOLATION_TIME) return this.valueTo;
        return EasingLinear(dt,this.valueFrom,this.valueTo - this.valueFrom,this.INTERPOLATION_TIME);
    }

}
