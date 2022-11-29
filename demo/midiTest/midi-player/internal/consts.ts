import {CalcUtils} from "./calcUtils";
import {PRESETS} from "./types";


export const defaultPresets:PRESETS = {
    channels: [
        {balance: 0.1},
        {balance: 0.2},
        {balance: 0.1},
        {balance: 0.7},
        {balance: 0.5},
        {balance: 1.0},
        {balance: 0.9},
        {balance: 0.1},
        {balance: 0.2},
        {balance: 0.1},
        {balance: 0.7},
        {balance: 0.5},
        {balance: 1.0},
        {balance: 0.6},
        {balance: 0.1},
        {balance: 0.7},
    ]
}

let cnt = 0;
export const log = (...val:any[])=>{
    cnt++;
    if (cnt>6000) throw 'stopped';
    console.log(...val);
}

export const wait = ()=>{
    return new Promise<void>(resolve=>{
        setTimeout(()=>resolve(undefined),1);
    });
}

export const MIDI_NOTE_TO_FREQUENCY_TABLE: number[] = [];
for (let x = 0; x < 127; ++x) {
    MIDI_NOTE_TO_FREQUENCY_TABLE[x] = CalcUtils.midiNumberToFr(x);
}
