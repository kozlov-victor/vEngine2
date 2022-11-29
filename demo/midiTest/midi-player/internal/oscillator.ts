import {SAMPLE, WAVE_FORM} from "./types";
import {ASDRForm} from "./asdrForm";
import {AbstractModulator} from "./modulators";
import type {MidiTracker} from "../midiTracker";


export class Oscillator {

    public velocity: number = 1;
    public waveForm: WAVE_FORM;
    public balance: number = 0.5;
    public adsrForm: ASDRForm;
    public frequency: number;
    public frequencyModulator:AbstractModulator|undefined;
    public amplitudeModulator:AbstractModulator|undefined;
    public lastTriggeredCommandIndex:number;
    public currentNoteId:number;
    public channel = {
        channelNumber: 0,
        pitchBend:0,
        velocity : 1,
    }

    private startedAt:number;

    constructor(private tracker:MidiTracker) {}

    private static _generateWaveForm(
        velocity: number,
        waveForm: WAVE_FORM,
        frequency: number,
        t: number): number {
        if (velocity == 0 || frequency == 0) return 0;
        return velocity * waveForm(frequency, t);
    }

    public generateSample(currentSampleNum: number): SAMPLE {
        const t = currentSampleNum / this.tracker.sampleRate;
        if (this.startedAt === undefined) this.startedAt = t;
        const dTime = t - this.startedAt;
        let frequency = this.frequency + this.channel.pitchBend;
        if (this.frequencyModulator!==undefined) frequency = this.frequencyModulator.getModulatedValue(frequency,dTime);
        let currSample = Oscillator._generateWaveForm(this.velocity * this.channel.velocity, this.waveForm, frequency, dTime);
        if (this.amplitudeModulator) currSample = this.amplitudeModulator.getModulatedValue(currSample, dTime);
        const balanceR = (this.balance + 1) / 2;
        const balanceL = 1 - balanceR;
        const adsr = this.adsrForm.calcFactorByTime(dTime);
        if (adsr.stopped) {
            this.tracker._oscillators.splice(this.tracker._oscillators.indexOf(this),1);
        }
        return {
            L: currSample * balanceL * adsr.val,
            R: currSample * balanceR * adsr.val
        };
    }
}
