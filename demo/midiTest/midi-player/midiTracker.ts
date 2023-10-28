import {Wave} from "../../pix32/ym-player/internal/wav";
import {
    CHANNEL_PRESET,
    IMidiJson,
    INTERNAL_MIDI_COMMAND,
    INTERNAL_SET_INSTRUMENT_COMMAND,
    IWaveFormItem,
    SAMPLE
} from "./internal/types";
import {Instrument} from "./internal/instrument";
import {Oscillator} from "./internal/oscillator";
import {wait} from "./internal/consts";
import {PlayingContext} from "./internal/playingContext";
import {AdsrForm} from "./internal/adsrForm";
import {TrackFromJsonSetter} from "./internal/parser/trackFromJsonSetter";
import {TrackFromMidiBinSetter} from "./internal/parser/trackFromMidiBinSetter";
import {SimpleWheelChannelModulator} from "./internal/modulators";

export class MidiTracker {

    private sampleToCommandsMap: Record<number, INTERNAL_MIDI_COMMAND[]>;
    private lastEventSampleNum: number;
    private numOfTracks:number;
    private channelPresets:CHANNEL_PRESET[] = Array(16);
    private instrument = new Instrument();
    public readonly _oscillators: Oscillator[] = [];

    constructor(public readonly sampleRate: number = 11025) {}

    private _init() {
        this.sampleToCommandsMap = {};
        this.lastEventSampleNum = 0;
        this.numOfTracks = 0;
        this._oscillators.length = 0;
        this.instrument.resetCache();
        const l = this.channelPresets.length;
        for (let i=0;i<l;i++) {
            this.channelPresets[i] = {
                balance: 0.5,
                velocity: 1,
                am: new SimpleWheelChannelModulator(0),
                instrumentNumber: 0,
                pitchBend: 0,
                pedalOn: false,
            };
        }
    }

    public setTrackFromJSON(midiJson:IMidiJson) {
        this._init();
        const setter = new TrackFromJsonSetter(midiJson, this.sampleRate, this.sampleToCommandsMap);
        this.lastEventSampleNum = setter.getLastEventSampleNum();
        this.numOfTracks = setter.getNumOfTracks();
    }

    public setTrackFromMidiBin(data:ArrayBuffer) {
        this._init();
        const setter = new TrackFromMidiBinSetter(data, this.sampleRate, this.sampleToCommandsMap);
        this.lastEventSampleNum = setter.getLastEventSampleNum();
        this.numOfTracks = setter.getNumOfTracks();
    }


    public async toURL(progress?:(n:number)=>void):Promise<string> {
        const res: number[] = [];
        for (let i = 0; i < this.lastEventSampleNum; i++) {
            const sample = this.generateSample(i);
            const base = 0b0111_1111_1111_1111;
            res.push(~~(sample.L*base));
            res.push(~~(sample.R*base));
            if (i%100_000===0) await wait();
            progress?.(i/this.lastEventSampleNum)
        }
        const blob = Wave.encodeWAV(res, this.sampleRate);
        return URL.createObjectURL(blob);
    }

    private playingContext:PlayingContext;

    public async play():Promise<void> {

        await this.playingContext?.stop();

        let ptr = 0;

        if (!this.playingContext) this.playingContext = new PlayingContext(this.sampleRate);

        this.playingContext.scriptNode.onaudioprocess = (audioProcessingEvent)=> {

            const inputBuffer = audioProcessingEvent.inputBuffer;
            const outputBuffer = audioProcessingEvent.outputBuffer;

            const outputDataLeft = outputBuffer.getChannelData(0);
            const outputDataRight = outputBuffer.getChannelData(1);
            for (let i = 0; i < inputBuffer.length; i++) {
                if (ptr>=this.lastEventSampleNum && this._oscillators.length===0) {
                    this.playingContext.stop();
                    break;
                }
                const sample = this.generateSample(ptr);
                outputDataLeft[i] = sample.L;
                outputDataRight[i] = sample.R;
                ptr++;
            }
        };
    }

    private execCommand(command: INTERNAL_MIDI_COMMAND):void {

        switch (command.opCode) {
            case 'noteOn': {
                // to debug separate channel
                //if (command.channel.channelNumber as any!==2) break;
                const instrumentSettings =
                    this.instrument.getOscillatorSettingsByMidiInstrumentNumber(
                        this.channelPresets[command.channel.channelNumber].instrumentNumber,
                        command.payload.note,
                        command.channel.channelNumber===9
                    );
                const oscillator = new Oscillator(this);
                oscillator.note = command.payload.note;
                oscillator.velocity = command.payload.velocity;
                const waveForms:IWaveFormItem[] = [];
                instrumentSettings.waveForms.forEach(wf=>{
                    const wfCopy:IWaveFormItem = {
                        ...wf,
                        amInstance:wf.am?.(),
                        fmInstance:wf.fm?.(),
                    };
                    waveForms.push(wfCopy);
                });
                oscillator.waveForms = waveForms;
                oscillator.currentNoteNumber = command.payload.note;
                oscillator.adsrForm = new AdsrForm(instrumentSettings.adsr);
                oscillator.channel = this.channelPresets[command.channel.channelNumber];
                this._oscillators.push(oscillator);
                break;
            }
            case 'programChange': {
                const cmd = command as INTERNAL_SET_INSTRUMENT_COMMAND;
                console.log(`programChange: ${cmd.payload.instrumentNumber} channel ${command.channel.channelNumber}`);
                this.channelPresets[cmd.channel.channelNumber].instrumentNumber = cmd.payload.instrumentNumber;
                break;
            }
            case 'noteOff': {
                for (let i = 0; i < this._oscillators.length; i++) {
                    if (
                        this._oscillators[i].channel === this.channelPresets[command.channel.channelNumber] &&
                        this._oscillators[i].currentNoteNumber === command.payload.note
                    ) {
                        this._oscillators[i].adsrForm.forceRelease = true;
                    }
                }
                break;
            }
            case 'pedalOn': {
                const currentChannel:CHANNEL_PRESET = this.channelPresets[command.channel.channelNumber];
                currentChannel.pedalOn = true;
                break;
            }
            case 'pedalOff': {
                const currentChannel:CHANNEL_PRESET = this.channelPresets[command.channel.channelNumber];
                currentChannel.pedalOn = false;
                break;
            }
            case 'channelVelocity': {
                const currentChannel:CHANNEL_PRESET = this.channelPresets[command.channel.channelNumber];
                currentChannel.velocity = command.payload.velocity;
                break;
            }
            case 'pitchBend': {
                console.log(`pitchBend: ${command.payload.pitchBend} channel ${command.channel.channelNumber}`);
                const currentChannel:CHANNEL_PRESET = this.channelPresets[command.channel.channelNumber];
                currentChannel.pitchBend = command.payload.pitchBend;
                break;
            }
            case 'modulationWheel': {
                console.log(`wheel: ${command.payload.value}`);
                const currentChannel:CHANNEL_PRESET = this.channelPresets[command.channel.channelNumber];
                currentChannel.am.frequency = 2*command.payload.value;
                break;
            }
            case 'setPan': {
                console.log(`pan: ${command.payload.value} for channel ${command.channel.channelNumber}`);
                const currentChannel:CHANNEL_PRESET = this.channelPresets[command.channel.channelNumber];
                currentChannel.balance = command.payload.value;
                break;
            }
            case 'allSoundOff': {
                this._oscillators.length = 0;
                break;
            }
            case 'allNotesOff': {
                this._oscillators.forEach(o=>{
                    o.adsrForm.forceRelease = true;
                });
                this.channelPresets.forEach(p=>{
                   p.pedalOn = false;
                });
                break;
            }
            default:
                throw `unknown command ${JSON.stringify(command)}`;
        }
    }

    private generateSample(currentSampleNum: number):SAMPLE {

        const possibleCommands = this.sampleToCommandsMap[currentSampleNum];
        if (possibleCommands !== undefined) {
            for (let i = 0; i < possibleCommands.length; i++) {
                this.execCommand(possibleCommands[i]);
            }
        }

        const sumAll: SAMPLE = {L: 0, R: 0};
        for (let i: number = 0; i < this._oscillators.length; i++) {
            const sample: SAMPLE = this._oscillators[i].generateSample(currentSampleNum);
            sumAll.L += sample.L;
            sumAll.R += sample.R;
        }
        const mixed:SAMPLE = {L:0, R:0};
        mixed.L = sumAll.L/this.numOfTracks;
        mixed.R = sumAll.R/this.numOfTracks;
        return mixed;

        // mix by formula: out = (s1 + s2) - (s1 * s2);
        // const A = 100;
        // if (!this._oscillators.length) return {L:0,R:0};
        // const res:SAMPLE = this._oscillators[0].generateSample(currentSampleNum);
        // res.L*=A;
        // res.R*=A;
        // for (let i: number = 1; i < this._oscillators.length; i++) {
        //     const sample = this._oscillators[i].generateSample(currentSampleNum);
        //     sample.L*=A;
        //     sample.R*=A;
        //     res.L = (res.L+sample.L) - (res.L*sample.L);
        //     res.R = (res.R+sample.R) - (res.R*sample.R);
        // }
        // res.L/=A;
        // res.R/=A;
        // return res;
    }

}
