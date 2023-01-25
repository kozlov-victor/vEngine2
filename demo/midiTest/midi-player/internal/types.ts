import {AbstractModulator, SimpleWheelChannelModulator} from "./modulators";

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
    d:number;
    s:number;
    r:number;
    base: number;
}

export interface CHANNEL_PRESET {
    balance: number;
    velocity:number;
    am:SimpleWheelChannelModulator;
    instrumentNumber:number;
    pitchBend:number;
    pedalOn:boolean;
}

export interface INTERNAL_MIDI_NOTE_ON_COMMAND {
    opCode: 'noteOn';
    channel: {
        channelNumber: number;
        instrumentNumber: number;
        percussion: boolean;
    },
    payload: {
        note: number;
        velocity: number;
    }
}

export interface INTERNAL_MIDI_NOTE_OFF_COMMAND {
    opCode: 'noteOff';
    channel: {
        channelNumber: number;
    },
    payload: {
        note: number;
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

export interface INTERNAL_MIDI_PEDAL_ON_COMMAND {
    opCode: 'pedalOn';
    channel: {
        channelNumber: number;
    }
}

export interface INTERNAL_MIDI_PEDAL_OFF_COMMAND {
    opCode: 'pedalOff';
    channel: {
        channelNumber: number;
    }
}

export interface INTERNAL_MIDI_SET_CHANNEL_VELOCITY_COMMAND {
    opCode: 'channelVelocity';
    channel: {
        channelNumber: number;
    },
    payload: {
        velocity:number;
    }
}

export interface INTERNAL_MIDI_SET_MODULATION_WHEEL_COMMAND {
    opCode: 'modulationWheel';
    channel: {
        channelNumber: number;
    },
    payload: {
        value:number;
    }
}

export interface INTERNAL_MIDI_SET_PAN_COMMAND {
    opCode: 'setPan';
    channel: {
        channelNumber: number;
    },
    payload: {
        value:number;
    }
}

export interface INTERNAL_MIDI_ALL_SOUND_OFF_COMMAND {
    opCode: 'allSoundOff';
}

export interface INTERNAL_MIDI_ALL_NOTES_OFF_COMMAND {
    opCode: 'allNotesOff';
}


export type INTERNAL_MIDI_COMMAND =
    INTERNAL_MIDI_NOTE_ON_COMMAND                   |
    INTERNAL_MIDI_NOTE_OFF_COMMAND                  |
    INTERNAL_MIDI_PITCH_BEND_COMMAND                |
    INTERNAL_MIDI_PEDAL_ON_COMMAND                  |
    INTERNAL_MIDI_PEDAL_OFF_COMMAND                 |
    INTERNAL_MIDI_SET_CHANNEL_VELOCITY_COMMAND      |
    INTERNAL_MIDI_SET_MODULATION_WHEEL_COMMAND      |
    INTERNAL_MIDI_SET_PAN_COMMAND                   |
    INTERNAL_MIDI_ALL_SOUND_OFF_COMMAND             |
    INTERNAL_MIDI_ALL_NOTES_OFF_COMMAND
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
        }[]>,
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

export interface IWaveFormItem {
    amplitude:number;
    form:WAVE_FORM;
    fm?:()=>AbstractModulator;
    am?:()=>AbstractModulator;
    fmInstance?:AbstractModulator;
    amInstance?:AbstractModulator;
}

export interface InstrumentSettings {
    adsr: IASDR;
    waveForms: IWaveFormItem[];
    name: string;
}
