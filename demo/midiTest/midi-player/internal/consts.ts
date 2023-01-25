import {CalcUtils} from "./calcUtils";

export const wait = ()=>{
    return new Promise<void>(resolve=>{
        setTimeout(()=>resolve(undefined),1);
    });
}

export const MIDI_NOTE_TO_FREQUENCY_TABLE: number[] = [];
for (let x = 0; x < 127; ++x) {
    MIDI_NOTE_TO_FREQUENCY_TABLE[x] = CalcUtils.midiNumberToFr(x);
}
