import {CHANNEL_PRESET, IWaveFormItem, SAMPLE, WAVE_FORM} from "./types";
import {AdsrForm} from "./adsrForm";
import {AbstractModulator} from "./modulators";
import type {MidiTracker} from "../midiTracker";
import {node} from "webpack";
import {CalcUtils} from "./calcUtils";
import {MIDI_NOTE_TO_FREQUENCY_TABLE} from "./consts";


export class Oscillator {

    public waveForms: IWaveFormItem[];
    public adsrForm: AdsrForm;
    public velocity: number;
    public currentNoteNumber: number;
    public channel:CHANNEL_PRESET;
    public note:number;

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
        let frequency:number;
        if (this.channel.pitchBend===0) frequency = MIDI_NOTE_TO_FREQUENCY_TABLE[this.note];
        else {
            frequency = CalcUtils.midiNumberToFr(this.note + this.channel.pitchBend);
        }

        let currSample = 0;
        for (const w of this.waveForms) {
            let modulatedFrequency = frequency;
            if (w.fmInstance!==undefined) modulatedFrequency = w.fmInstance.getModulatedValue(frequency,dTime);
            let modulatedSample =
                w.amplitude *
                Oscillator._generateWaveForm(this.velocity * this.channel.velocity, w.form, modulatedFrequency, dTime);
            if (w.amInstance && modulatedSample>0) modulatedSample = w.amInstance.getModulatedValue(modulatedSample, dTime);
            currSample+=modulatedSample;
        }
        if (this.channel.am && currSample>0) currSample = this.channel.am.getModulatedValue(currSample, dTime);
        const balanceR = this.channel.balance;
        const balanceL = 1 - balanceR;
        const envelope = this.adsrForm.calcFactorByTime(dTime,this.channel.pedalOn);
        if (envelope.stopped) {
            this.tracker._oscillators.splice(this.tracker._oscillators.indexOf(this),1);
        }
        return {
            L: currSample * balanceL * envelope.val,
            R: currSample * balanceR * envelope.val
        };
    }
}
