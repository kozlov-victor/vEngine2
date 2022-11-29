import {WaveForms} from "./waveForms";

export abstract class AbstractModulator {

    protected constructor() {
    }

    public abstract getModulatedValue(baseValue:number, t: number): number;

}

export class DecayFrequencyModulator extends AbstractModulator {


    public constructor(private readonly baseFrequency:number, private readonly decayHzPerSecond: number) {
        super();
    }

    public override getModulatedValue(baseFrequency:number, t: number): number {
        let fr = this.baseFrequency - t * this.decayHzPerSecond;
        if (fr<0) fr = 0;
        return fr;
    }

}

export class WaveMultiplicativeModulator extends AbstractModulator {

    public constructor(private readonly frequency:number) {
        super();
    }

    public override getModulatedValue(baseAmplitude:number, t: number): number {
        return (
            baseAmplitude * WaveForms.sin(this.frequency, t)
        );
    }

}

export class WaveAdditiveModulator extends AbstractModulator {

    public constructor(private readonly frequency:number, private amplitude: number,) {
        super();
    }

    public override getModulatedValue(baseAmplitude:number, t: number): number {
        return (
            baseAmplitude + this.amplitude * WaveForms.sin(this.frequency, t)
        );
    }

}
