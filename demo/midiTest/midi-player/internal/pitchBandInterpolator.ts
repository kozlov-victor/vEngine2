export class PitchBandInterpolator {

    private valueTo = 0;
    private value = 0;

    public update() {
        const lerp = 0.0005;
        this.value+=(this.valueTo - this.value) * lerp;
    }

    public setValue(val:number) {
        this.valueTo = val;
    }

    public getValue() {
        return this.valueTo;
    }

}
