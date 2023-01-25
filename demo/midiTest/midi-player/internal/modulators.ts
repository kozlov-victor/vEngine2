import {WaveForms} from "./waveForms";

export abstract class AbstractModulator {

    protected constructor() {
    }

    public abstract getModulatedValue(base:number, t: number): number;

}

export class ConstantDecayFrequencyModulator extends AbstractModulator {

    public constructor(private readonly baseFrequency:number, private readonly decayHzPerSecond: number) {
        super();
    }

    public override getModulatedValue(base:number, t: number): number {
        let fr = this.baseFrequency - t * this.decayHzPerSecond;
        if (fr<0) fr = 0;
        return fr;
    }

}

export class DynamicDecayFrequencyModulator extends AbstractModulator {

    public constructor(private readonly decayHzPerSecond: number) {
        super();
    }

    public override getModulatedValue(base:number, t: number): number {
        let fr = base - t * this.decayHzPerSecond;
        if (fr<0) fr = 0;
        return fr;
    }

}

export class WaveMultiplicativeModulator extends AbstractModulator {

    public constructor(public frequency:number) {
        super();
    }

    public override getModulatedValue(base:number, t: number): number {
        return (
            base * WaveForms.sin(this.frequency, t)
        );
    }

}

export class WaveAdditiveModulator extends AbstractModulator {

    public constructor(public frequency:number, public amplitude: number,) {
        super();
    }

    public override getModulatedValue(base:number, t: number): number {
        return (
            base + this.amplitude * WaveForms.sin(this.frequency, t)
        );
    }

}

export class WaveAdditiveModulator2 extends AbstractModulator {

    public constructor(public frequency:number, public amplitude: number,) {
        super();
    }

    public override getModulatedValue(base:number, t: number): number {
        return (
            base + (base*this.amplitude) * WaveForms.sin(this.frequency, t)
        );
    }

}

export class SimpleWheelChannelModulator extends WaveMultiplicativeModulator {

    public override getModulatedValue(base:number, t: number): number {
        if (this.frequency===0) return base;
        else return 0.8*base + 0.2*super.getModulatedValue(base, t);
    }

}
