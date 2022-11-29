import {Wave} from "../../pix32/ym-player/internal/wav";
import {IMidiJson, INTERNAL_MIDI_COMMAND, PRESETS, SAMPLE} from "./internal/types";
import {Instrument} from "./internal/instrument";
import {Oscillator} from "./internal/oscillator";
import {defaultPresets, MIDI_NOTE_TO_FREQUENCY_TABLE, wait} from "./internal/consts";
import {PlayingContext} from "./internal/playingContext";
import {ASDRForm} from "./internal/asdrForm";

export class MidiTracker {

    private sampleToCommandsMap: Record<number, INTERNAL_MIDI_COMMAND[]>;
    private lastEventSampleNum: number;
    private numOfTracks:number;
    private nextId:number;
    private instrument = new Instrument();
    public readonly _oscillators: Oscillator[] = [];

    constructor(public readonly sampleRate: number = 11025, private presets: PRESETS = defaultPresets) {}

    private _init() {
        this.sampleToCommandsMap = {};
        this.lastEventSampleNum = 0;
        this.numOfTracks = 0;
        this.nextId = 0;
        this._oscillators.length = 0;
    }

    public setTrack(midiJson:IMidiJson) {
        this._init();
        midiJson.tracks.forEach(t=>{
            if (!t.notes?.length) return;
            this.numOfTracks++;
            //if (t.name!=='Guitar Solo') return;
            this.setTrackNotes(t);
            this.setPitchBandEvents(t);
            this.setPedalEvents(t);
        });
    }

    private setTrackNotes(t:IMidiJson['tracks'][0]) {
        t.notes?.forEach(n=>{

            //if ([27,28,29,30,31].includes(instrumentNumber)) {

            const instrumentNumber = t.instrumentNumber ?? t.instrument?.number ?? 1;
            const percussion = t.isPercussion===true || t.instrument?.family === 'drums';
            const channelNumber = t.channelNumber ?? t.channel ?? 0;
            const noteId = this.nextId++;

            const noteOnTime = n.time;
            const noteOnSampleNum = ~~(noteOnTime * this.sampleRate);
            if (!this.sampleToCommandsMap[noteOnSampleNum]) this.sampleToCommandsMap[noteOnSampleNum] = [];
            this.sampleToCommandsMap[noteOnSampleNum].push({
                opCode: 'noteOn',
                channel: {
                    channelNumber,
                    percussion,
                    instrumentNumber
                },
                payload: {
                    note: n.midi,
                    noteId,
                    velocity: n.velocity
                }
            });

            const noteOffTime = n.time + n.duration;
            const noteOffSampleNum = ~~(noteOffTime * this.sampleRate);
            if (!this.sampleToCommandsMap[noteOffSampleNum]) this.sampleToCommandsMap[noteOffSampleNum] = [];
            this.sampleToCommandsMap[noteOffSampleNum].push({
                opCode: 'noteOff',
                channel: {
                    channelNumber,
                    percussion,
                    instrumentNumber
                },
                payload: {
                    note: n.midi,
                    noteId,
                    velocity: n.velocity,
                }
            });
            if (noteOffSampleNum>this.lastEventSampleNum) this.lastEventSampleNum = noteOffSampleNum;
            //}
        });
    }

    private setPitchBandEvents(t:IMidiJson['tracks'][0]):void {
        t.pitchBends?.forEach(p=>{
            const noteOnTime = p.time;
            const channelNumber = t.channelNumber ?? t.channel ?? 0;
            const sampleNum = ~~(noteOnTime * this.sampleRate);
            if (!this.sampleToCommandsMap[sampleNum]) this.sampleToCommandsMap[sampleNum] = [];
            this.sampleToCommandsMap[sampleNum].push({
                opCode: 'pitchBend',
                channel: {
                    channelNumber,
                },
                payload: {
                    pitchBend:   12 * p.value
                }
            });
        })
    }

    private setPedalEvents(t:IMidiJson['tracks'][0]):void {
        const pedalControlNumbers = [64];
        const pedalEvents:({time:number,value:number})[] = [];
        pedalControlNumbers.forEach(n=>{
            if (t.controlChanges?.[`${n}`]!==undefined) {
                pedalEvents.push(...t.controlChanges[`${n}`]);
            }
        });
        pedalEvents.forEach(p=>{
            const eventTime = p.time;
            const channelNumber = t.channelNumber ?? t.channel ?? 0;
            const sampleNum = ~~(eventTime * this.sampleRate);
            const opCode = p.value===0?'pedalOff':'pedalOn';
            if (!this.sampleToCommandsMap[sampleNum]) this.sampleToCommandsMap[sampleNum] = [];
            this.sampleToCommandsMap[sampleNum].push({
                opCode,
                channel: {
                    channelNumber,
                }
            });
        })
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

    public async play1():Promise<void> {

        await this.playingContext?.stop();

        let ptr = 0;

        if (!this.playingContext) this.playingContext = new PlayingContext(this.sampleRate);

        this.playingContext.scriptNode.onaudioprocess = (audioProcessingEvent)=> {

            const inputBuffer = audioProcessingEvent.inputBuffer;
            const outputBuffer = audioProcessingEvent.outputBuffer;

            const outputDataLeft = outputBuffer.getChannelData(0);
            const outputDataRight = outputBuffer.getChannelData(1);
            for (let i = 0; i < inputBuffer.length; i++) {
                if (ptr>=this.lastEventSampleNum) {
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

    private execCommand(command: INTERNAL_MIDI_COMMAND,i:number):void {
        switch (command.opCode) {
            case "noteOn": {
                const instrumentSettings =
                    this.instrument.getOscillatorSettingsByMidiInstrumentNumber(command.channel.instrumentNumber, command.payload.note, command.channel.percussion);
                const oscillator = new Oscillator(this);
                oscillator.frequency = MIDI_NOTE_TO_FREQUENCY_TABLE[command.payload.note];
                oscillator.velocity = command.payload.velocity;
                oscillator.waveForm = instrumentSettings.waveForm;
                oscillator.balance = this.presets.channels[command.channel.channelNumber]?.balance ?? 0.5;
                oscillator.lastTriggeredCommandIndex = i;
                oscillator.currentNoteId = command.payload.noteId;
                oscillator.adsrForm = new ASDRForm(instrumentSettings.adsr);
                oscillator.channel.channelNumber = command.channel.channelNumber;
                oscillator.frequencyModulator = instrumentSettings.fm?.();
                oscillator.amplitudeModulator = instrumentSettings.am?.();
                this._oscillators.push(oscillator);
                break;
            }
            case "noteOff": {
                for (let i = 0; i < this._oscillators.length; i++) {
                    if (this._oscillators[i].currentNoteId === command.payload.noteId) {
                        this._oscillators[i].adsrForm.forceRelease = true;
                        break;
                    }
                }
                break;
            }
            case "pedalOn": {
                for (let i = 0; i < this._oscillators.length; i++) {
                    if (this._oscillators[i].channel.channelNumber === command.channel.channelNumber) {
                        this._oscillators[i].adsrForm.pedalOn = true;
                        break;
                    }
                }
                break;
            }
            case "pedalOff": {
                for (let i = 0; i < this._oscillators.length; i++) {
                    if (this._oscillators[i].channel.channelNumber === command.channel.channelNumber) {
                        this._oscillators[i].adsrForm.pedalOn = false;
                        break;
                    }
                }
                break;
            }
            case "pitchBend": {
                for (let i = 0; i < this._oscillators.length; i++) {
                    if (this._oscillators[i].channel.channelNumber === command.channel.channelNumber) {
                        this._oscillators[i].channel.pitchBend = command.payload.pitchBend;
                    }
                }
                break;
            }
            default:
                throw `unknown command ${JSON.stringify(command)}`;
        }
    }

    private generateSample(currentSampleNum: number):SAMPLE {
        currentSampleNum %= this.lastEventSampleNum;
        const possibleCommands = this.sampleToCommandsMap[currentSampleNum];
        if (possibleCommands !== undefined) {
            for (let i = 0; i < possibleCommands.length; i++) {
                this.execCommand(possibleCommands[i],i);
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
    }

}
