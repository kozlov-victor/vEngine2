import {AbstractModulator} from "./modulators";

export interface ADSRPoint {
    from: { time: number, val: number },
    to: { time: number, val: number }
}

export type WAVE_FORM = (fr: number, t: number)=>number;

export interface SAMPLE {
    L: number;
    R: number;
}

export interface IASDR {
    a:number;
    s:number;
    d:number;
    r:number;
}


export interface CHANNEL_PRESET {
    balance: number;
}

export interface PRESETS {
    channels: CHANNEL_PRESET[];
}

export interface INTERNAL_MIDI_NOTE_COMMAND {
    opCode: 'noteOn'|'noteOff';
    channel: {
        channelNumber: number;
        percussion: boolean;
        instrumentNumber: number;
    },
    payload: {
        noteId:number;
        note: number;
        velocity: number;
    }
}

export interface INTERNAL_MIDI_PITCH_BEND_COMMAND {
    opCode: 'pitchBend';
    channel: {
        channelNumber: number;
    },
    payload: {
        pitchBend:number;
    }
}


export type INTERNAL_MIDI_COMMAND =
    INTERNAL_MIDI_NOTE_COMMAND |
    INTERNAL_MIDI_PITCH_BEND_COMMAND
    ;

export interface IMidiJson {
    header?: any;
    startTime?: number;
    duration?: number;
    tracks: ({
        startTime: number;
        duration: number;
        length: number;
        id: number;
        name?: string;
        channelNumber?: number;
        channel?: number;
        pitchBends?: {
            ticks: number;
            time: number;
            value: number;
        }[];
        notes?:{
            name: string;
            midi: number;
            time: number;
            velocity: number;
            duration: number;
            durationTicks?: number;
            ticks?: number;
        }[];
        controlChanges?: Record<string, {
            number: number;
            ticks: number;
            time: number;
            value: number;
        }>,
        isPercussion?:boolean;
        instrumentNumber?: number;
        instrument?: {
            family: string,
            number: number,
            name: string,
        };
        instrumentFamily?: string;
    })[]
}

export interface InstrumentSettings {
    adsr: IASDR;
    waveForm: WAVE_FORM;
    fm?:()=>AbstractModulator;
    am?:()=>AbstractModulator;
    name: string;
}
