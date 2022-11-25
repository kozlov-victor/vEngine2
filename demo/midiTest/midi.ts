import {Wave} from "../pix32/ym-player/internal/wav";
import {createRange} from "@engine/misc/object";
import {MathEx} from "@engine/misc/math/mathEx";


interface ADSRPoint {
    from: { time: number, val: number },
    to: { time: number, val: number }
}

type WAVE_FORM = (fr: number, t: number)=>number;

interface SAMPLE {
    L: number;
    R: number;
}

interface IASDR {
    a:number;
    s:number;
    d:number;
    r:number;
}


interface CHANNEL_PRESET {
    balance: number;
}

interface PRESETS {
    channels: CHANNEL_PRESET[];
}

interface MIDI_COMMAND {
    name: string;
    midi: number;
    time: number;
    velocity: number;
    duration: number;
}


interface INTERNAL_MIDI_NOTE_COMMAND {
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

interface INTERNAL_MIDI_PITCH_BEND_COMMAND {
    opCode: 'pitchBend';
    channel: {
        channelNumber: number;
        percussion: boolean;
        instrumentNumber: number;
    },
    payload: {
        pitchBend:number;
    }
}

type INTERNAL_MIDI_COMMAND = INTERNAL_MIDI_NOTE_COMMAND | INTERNAL_MIDI_PITCH_BEND_COMMAND;

export interface IMidiJson {
    header?: any;
    startTime?: number;
    duration?: number;
    tracks: ({
        startTime: number;
        duration: number;
        length: number;
        controlChanges?: any;
        id: number;
        name?: string;
        channelNumber?: number;
        channel?: number;
        pitchBends?: any;
        notes?:{
            name: string;
            midi: number;
            time: number;
            velocity: number;
            duration: number;
            durationTicks?: number;
            ticks?: number;
        }[];
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

const defaultPresets:PRESETS = {
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

class CalcUtils {

    private static noteString = [
        {name: "C", sharp: false},
        {name: "C", sharp: true},
        {name: "D", sharp: false},
        {name: "D", sharp: true},
        {name: "E", sharp: false},
        {name: "F", sharp: false},
        {name: "F", sharp: true},
        {name: "G", sharp: false},
        {name: "G", sharp: true},
        {name: "A", sharp: false},
        {name: "A", sharp: true},
        {name: "B", sharp: false}
    ];

    public static midiNumberToFr(x: number): number {
        return (440 / 32) * Math.pow(2, ((x - 9) / 12)); //  let a = 440; // a is 440 hz...
    }

    public static letterToNoteNum(str: string): number {
        const letter = str[0].toUpperCase();
        let sharp = false;
        let number: number;
        if (str.indexOf('#') > -1) {
            sharp = true;
            number = parseInt(str.substr(2));
        } else {
            sharp = false;
            number = parseInt(str.substr(1));
        }
        const baseNumber = CalcUtils.noteString.findIndex(it => {
            return it.name == letter && it.sharp == sharp;
        });
        return baseNumber + number * 24;
    }

    public static noteNumToLetter(noteNum: number) {
        const octave = ~~((noteNum / 12) - 1);
        const noteIndex = (noteNum % 12);
        const note = CalcUtils.noteString[noteIndex];
        return `${note.name}${note.sharp ? '#' : ''}${octave}`;
    }

}

namespace WaveForms {

    export const sin: WAVE_FORM = (fr: number, t: number): number => {
        return Math.sin( 2*Math.PI * t * fr);
    }

    export const sin2: WAVE_FORM = (fr: number, t: number): number => {
        return (
            0.7 * sin(fr, t) +
            0.2 * sin(2/1 * fr, t) +
            0.1 * sin(3/2 * fr, t)
        );
    }

    export const noise: WAVE_FORM = (fr: number, t: number): number => {
        const r = Math.random();
        return r * 2 - 1;
    }

    export const beat: WAVE_FORM = (fr: number, t: number): number => {
        return (
            2/6 * square(fr / 2, t) +
            3/6 * MathEx.clamp(3 * sin2(fr, t), -1,1) +
            1/6 * MathEx.clamp(3 * sin2(fr + 5, t), -1,1)
        );
    }

    export const square: WAVE_FORM = (fr: number, t: number): number => {
        const sample = sin(fr, t);
        return sample < 0 ? -1 : 1;
    }

    export const triangle: WAVE_FORM = (fr: number, t: number): number => {
        return (
            0.54 * sin2(        fr,   t)    +
            0.1  * sin2(2/1 * fr,   t)    +
            0.1  * sin2(4/1 * fr,   t)    +
            0.1  * sin2(8/1 * fr,   t)    +
            0.1  * sin2(3/2 * fr,   t)    +
            0.01 * sin (4/3 * fr,   t)    +
            0.01 * sin (5/4 * fr,   t)    +
            0.01 * sin (6/5 * fr,   t)    +
            0.01 * sin (7/6 * fr,   t)
        );
    }

    export const tremolo: WAVE_FORM = (fr: number, t: number): number => {
        const semiPeriod = ~~(t * 100) % 6;
        if (semiPeriod > 3) fr *= 2;
        return sin(fr, t);
    }

    export const tremolo2: WAVE_FORM = (fr: number, t: number): number => {
        const semiPeriod = ~~(t * 100) % 6;
        if (semiPeriod > 4) fr *= 3;
        else if (semiPeriod > 2) fr *= 2;
        return sin(fr, t);
    }

    export const distortion: WAVE_FORM = (fr: number, t: number): number => {
        const x = triangle(fr, t);
        const base = 0.5;
        return MathEx.clamp(x/(1 - Math.abs(x)),-base,base);
    }

}

class ASDRForm {

    private readonly attack: ADSRPoint;
    private readonly sustain: ADSRPoint;
    private readonly delay: ADSRPoint;
    private readonly release: ADSRPoint;

    private forceReleaseStartedAt:number;
    public forceRelease:boolean = false; // key is released, so force go to "d" ("delay") segment if ADSR curve

    constructor(asdr:IASDR) {
        const {a,s,d,r} =  asdr;
        this.attack = {from: {time: 0, val: 0}, to: {time: a, val: 1}};
        this.sustain = {from: {time: a, val: 1}, to: {time: a + s, val: 1}};
        this.delay = {from: {time: a + s, val: 1}, to: {time: a + s + d, val: 0.5}};
        this.release = {from: {time: a + s + d, val: 0.5}, to: {time: a + s + d + r, val: 0}};
    }

    private static _linear(t: number, b: number, c: number, d: number): number {
        return c * t / d + b;
    }


    public calcFactorByTime(t: number): {stopped:boolean,val:number} {
        let closestPrevPoint = this.attack;
        if (this.forceRelease) {
            if (this.forceReleaseStartedAt===undefined) this.forceReleaseStartedAt = t;
            const d = t - this.forceReleaseStartedAt;
            if (d>this.release.to.time - this.release.from.time) {
                return {
                    stopped: true,
                    val: 0,
                }
            }
            closestPrevPoint = this.release;
        } else {
            [this.sustain, this.delay, this.release].forEach(point => {
                if (t > point.from.time) {
                    closestPrevPoint = point;
                }
            });
        }
        let val = ASDRForm._linear(
            t,
            closestPrevPoint.from.val, closestPrevPoint.to.val - closestPrevPoint.from.val,
            closestPrevPoint.to.time - closestPrevPoint.from.time
        );
        if (val < 0) val = 0;
        let stopped = false;
        if (closestPrevPoint===this.release && val===0) stopped = true;
        return {
            stopped,
            val
        };
    }

}

let cnt = 0;
const log = (...val:any[])=>{
    cnt++;
    if (cnt>6000) throw 'stopped';
    console.log(...val);
}

interface InstrumentSettings {
    adsr: IASDR;
    waveForm: WAVE_FORM;
    fm?:()=>BaseModulator;
    am?:()=>BaseModulator;
    name: string;
}

class Instrument {
    public readonly defaultInstrumentSettings = {
        piano: {
            adsr: {a: 0.02, s: 0.1, d: 0.3, r: 1},
            waveForm: WaveForms.triangle,
            name: 'piano',
        } as InstrumentSettings,
        bass: {
            adsr: {a: 0.02, s: 0.1, d: 0.4, r: 1},
            waveForm: WaveForms.triangle,
            name: 'bass'
        } as InstrumentSettings,
        distortion: {
            adsr: {a: 0.01, s: 0.01, d: 1.1, r: 0.4},
            waveForm: WaveForms.distortion,
            name: 'distortion'
        } as InstrumentSettings,
        bassDrum: {
            adsr: {a: 0.01, s: 0.05, d: 0.2, r: 0.3},
            waveForm: WaveForms.beat,
            fm: ()=>new DecayFrequencyModulator(70,145),
            name: 'bassDrum',
        } as InstrumentSettings,
        snareDrum: {
            adsr: {a: 0.01, s: 0.05, d: 0.1, r: 0.01},
            waveForm: WaveForms.beat,
            fm: ()=>new DecayFrequencyModulator(80,150),
            name: 'snareDrum',
        } as InstrumentSettings,
        lowFloorTomDrum: {
            adsr: {a: 0.01, s: 0.05, d: 0.1, r: 0.01},
            waveForm: WaveForms.beat,
            fm: ()=>new DecayFrequencyModulator(90,42),
            name: 'lowFloorTomDrum',
        } as InstrumentSettings,
        highFloorTomDrum: {
            adsr: {a: 0.01, s: 0.05, d: 0.1, r: 0.01},
            waveForm: WaveForms.beat,
            fm: ()=>new DecayFrequencyModulator(95,44),
            name: 'highFloorTomDrum',
        } as InstrumentSettings,
        lowMidTomDrum: {
            adsr: {a: 0.01, s: 0.05, d: 0.1, r: 0.01},
            waveForm: WaveForms.beat,
            fm: ()=>new DecayFrequencyModulator(100,152),
            name: 'lowMidTomDrum',
        } as InstrumentSettings,
        highMidTomDrum: {
            adsr: {a: 0.01, s: 0.05, d: 0.1, r: 0.01},
            waveForm: WaveForms.beat,
            fm: () => new DecayFrequencyModulator(110, 155),
            name: 'highMidTomDrum',
        } as InstrumentSettings,
        hiHatClosedDrum: {
            adsr: {a: 0.01, s: 0.01, d: 0.05, r: 0.05},
            waveForm: WaveForms.noise,
            name: 'hiHatClosedDrum',
        } as InstrumentSettings,
        hiHatOpenedDrum: {
            adsr: {a: 0.01, s: 0.02, d: 0.1, r: 0.2},
            waveForm: WaveForms.noise,
            name: 'hiHatOpenedDrum',
        } as InstrumentSettings,
        organ: {
            adsr: {a: 0.01, s: 0.001, d: 10, r: 1},
            waveForm: WaveForms.triangle,
            name: 'organ'
        } as InstrumentSettings,
        rockOrgan: {
            adsr: {a: 0.01, s: 0.001, d: 10, r: 1},
            waveForm: WaveForms.triangle,
            am: ()=>new WaveMultiplicativeModulator(5),
            name: 'rockOrgan'
        } as InstrumentSettings,
        pipe: {
            adsr: {a: 0.02, s: 0.01, d: 3, r: 0.2},
            waveForm: WaveForms.triangle,
            name: 'pipe'
        } as InstrumentSettings,
    } as const;

    /*
        Piano:
        1 Acoustic Grand Piano
        2 Bright Acoustic Piano
        3 Electric Grand Piano
        4 Honky-tonk Piano
        5 Electric Piano 1
        6 Electric Piano 2
        7 Harpsichord
        8 Clavinet

        Chromatic Percussion:
        9 Celesta
        10 Glockenspiel
        11 Music Box
        12 Vibraphone
        13 Marimba
        14 Xylophone
        15 Tubular Bells
        16 Dulcimer

        Organ:
        17 Drawbar Organ
        18 Percussive Organ
        19 Rock Organ
        20 Church Organ
        21 Reed Organ
        22 Accordion
        23 Harmonica
        24 Tango Accordion

        Guitar:
        25 Acoustic Guitar (nylon)
        26 Acoustic Guitar (steel)
        27 Electric Guitar (jazz)
        28 Electric Guitar (clean)
        29 Electric Guitar (muted)
        30 Overdriven Guitar
        31 Distortion Guitar
        32 Guitar harmonics

        Bass:
        33 Acoustic Bass
        34 Electric Bass (finger)
        35 Electric Bass (pick)
        36 Fretless Bass
        37 Slap Bass 1
        38 Slap Bass 2
        39 Synth Bass 1
        40 Synth Bass 2

        Strings:
        41 Violin
        42 Viola
        43 Cello
        44 Contrabass
        45 Tremolo Strings
        46 Pizzicato Strings
        47 Orchestral Harp
        48 Timpani

        Strings (continued):
        49 String Ensemble 1
        50 String Ensemble 2
        51 Synth Strings 1
        52 Synth Strings 2
        53 Choir Aahs
        54 Voice Oohs
        55 Synth Voice
        56 Orchestra Hit

        Brass:
        57 Trumpet
        58 Trombone
        59 Tuba
        60 Muted Trumpet
        61 French Horn
        62 Brass Section
        63 Synth Brass 1
        64 Synth Brass 2

        Reed:
        65 Soprano Sax
        66 Alto Sax
        67 Tenor Sax
        68 Baritone Sax
        69 Oboe
        70 English Horn
        71 Bassoon
        72 Clarinet

        Pipe:
        73 Piccolo
        74 Flute
        75 Recorder
        76 Pan Flute
        77 Blown Bottle
        78 Shakuhachi
        79 Whistle
        80 Ocarina

        Synth Lead:
        81 Lead 1 (square)
        82 Lead 2 (sawtooth)
        83 Lead 3 (calliope)
        84 Lead 4 (chiff)
        85 Lead 5 (charang)
        86 Lead 6 (voice)
        87 Lead 7 (fifths)
        88 Lead 8 (bass + lead)

        Synth Pad:
        89 Pad 1 (new age)
        90 Pad 2 (warm)
        91 Pad 3 (polysynth)
        92 Pad 4 (choir)
        93 Pad 5 (bowed)
        94 Pad 6 (metallic)
        95 Pad 7 (halo)
        96 Pad 8 (sweep)

        Synth Effects:
        97 FX 1 (rain)
        98 FX 2 (soundtrack)
        99 FX 3 (crystal)
        100 FX 4 (atmosphere)
        101 FX 5 (brightness)
        102 FX 6 (goblins)
        103 FX 7 (echoes)
        104 FX 8 (sci-fi)

        Ethnic:
        105 Sitar
        106 Banjo
        107 Shamisen
        108 Koto
        109 Kalimba
        110 Bag pipe
        111 Fiddle
        112 Shanai

        Percussive:
        113 Tinkle Bell
        114 Agogo
        115 Steel Drums
        116 Woodblock
        117 Taiko Drum
        118 Melodic Tom
        119 Synth Drum

        Sound effects:
        120 Reverse Cymbal
        121 Guitar Fret Noise
        122 Breath Noise
        123 Seashore
        124 Bird Tweet
        125 Telephone Ring
        126 Helicopter
        127 Applause
        128 Gunshot

        drums
        35 B0 Acoustic Bass Drum        59 B2 Ride Cymbal 2
        36 C1 Bass Drum 1               60 C3 Hi Bongo
        37 C#1 Side Stick               61 C#3 Low Bongo
        38 D1 Acoustic Snare            62 D3 Mute Hi Conga
        39 Eb1 Hand Clap                63 Eb3 Open Hi Conga
        40 E1 Electric Snare            64 E3 Low Conga
        41 F1 Low Floor Tom             65 F3 High Timbale
        42 F#1 Closed Hi Hat            66 F#3 Low Timbale
        43 G1 High Floor Tom            67 G3 High Agogo
        44 Ab1 Pedal Hi-Hat             68 Ab3 Low Agogo
        45 A1 Low Tom                   69 A3 Cabasa
        46 Bb1 Open Hi-Hat              70 Bb3 Maracas
        47 B1 Low-Mid Tom               71 B3 Short Whistle
        48 C2 Hi Mid Tom                72 C4 Long Whistle
        49 C#2 Crash Cymbal 1           73 C#4 Short Guiro
        50 D2 High Tom                  74 D4 Long Guiro
        51 Eb2 Ride Cymbal 1            75 Eb4 Claves
        52 E2 Chinese Cymbal            76 E4 Hi Wood Block
        53 F2 Ride Bell                 77 F4 Low Wood Block
        54 F#2 Tambourine               78 F#4 Mute Cuica
        55 G2 Splash Cymbal             79 G4 Open Cuica
        56 Ab2 Cowbell                  80 Ab4 Mute Triangle
        57 A2 Crash Cymbal 2            81 A4 Open Triangle
        58 Bb2 Vibraslap

     */

    private midiInstrumentsTable = [
        {
            range: [...createRange({from: 1, to: 16+1})],
            settings: this.defaultInstrumentSettings.piano,
        },
        {
            range: [17,18,19],
            settings: this.defaultInstrumentSettings.rockOrgan,
        },
        {
            range: [...createRange({from: 17, to: 24+1})],
            settings: this.defaultInstrumentSettings.organ,
        },
        {
            range: [44,...createRange({from: 33, to: 40+1})],
            settings: this.defaultInstrumentSettings.bass,
        },
        {
            range: [...createRange({from: 65, to: 80+1})],
            settings: this.defaultInstrumentSettings.pipe,
        },
        {
            range: [...createRange({from: 113, to: 119+1})],
            settings: this.defaultInstrumentSettings.snareDrum,
        },
        {
            range: [...createRange({from: 27, to: 31+1})],
            settings: this.defaultInstrumentSettings.distortion,
        },
    ]

    private cachedRequest:Record<number, InstrumentSettings> = {};

    public getOscillatorSettingsByMidiInstrumentNumber(num:number,note:number,percussion:boolean):InstrumentSettings {
        if (!percussion && this.cachedRequest[num]) return this.cachedRequest[num];
        if (percussion && this.cachedRequest[note]) return this.cachedRequest[note];

        let result:InstrumentSettings|undefined = undefined;

        if (percussion) {
            switch (note) {
                case 35:
                case 36:
                    result = this.defaultInstrumentSettings.bassDrum;
                    break;
                case 41:
                    result = this.defaultInstrumentSettings.lowFloorTomDrum;
                    break;
                case 43:
                    result = this.defaultInstrumentSettings.highFloorTomDrum;
                    break;
                case 45:
                case 47:
                    result = this.defaultInstrumentSettings.lowMidTomDrum;
                    break;
                case 48:
                case 50:
                    result = this.defaultInstrumentSettings.highMidTomDrum;
                    break;
                case 42:
                case 44:
                    result = this.defaultInstrumentSettings.hiHatClosedDrum;
                    break;
                case 46:
                case 49:
                case 51:
                case 55:
                case 57:
                    result = this.defaultInstrumentSettings.hiHatOpenedDrum;
                    break;
                default:
                    result = this.defaultInstrumentSettings.snareDrum;
                    break;
            }
            this.cachedRequest[note] = result;
        } else {
            for (const instr of this.midiInstrumentsTable) {
                if (instr.range.includes(num)) {
                    result = instr.settings;
                    break;
                }
            }
            if (result===undefined) {
                result = this.defaultInstrumentSettings.piano;
            }
            this.cachedRequest[num] = result;
        }

        console.log(num,note,result.name);
        return result;
    }

}

abstract class BaseModulator {

    protected constructor() {
    }

    public abstract getModulatedValue(baseValue:number, t: number): number;

}

class DecayFrequencyModulator extends BaseModulator {


    public constructor(private readonly baseFrequency:number, private readonly decayHzPerSecond: number) {
        super();
    }

    public override getModulatedValue(baseFrequency:number, t: number): number {
        let fr = this.baseFrequency - t * this.decayHzPerSecond;
        if (fr<0) fr = 0;
        return fr;
    }

}

class WaveMultiplicativeModulator extends BaseModulator {

    public constructor(private readonly frequency:number) {
        super();
    }

    public override getModulatedValue(baseAmplitude:number, t: number): number {
        return (
            baseAmplitude * WaveForms.sin(this.frequency, t)
        );
    }

}

class WaveAdditiveModulator extends BaseModulator {

    public constructor(private readonly frequency:number, private amplitude: number,) {
        super();
    }

    public override getModulatedValue(baseAmplitude:number, t: number): number {
        return (
            baseAmplitude + this.amplitude * WaveForms.sin(this.frequency, t)
        );
    }

}

class Oscillator {

    public velocity: number = 1;
    public waveForm: WAVE_FORM;
    public balance: number = 0.5;
    public adsrForm: ASDRForm;
    public frequency: number;
    public pitchBend: number = 0;
    public frequencyModulator:BaseModulator|undefined;
    public amplitudeModulator:BaseModulator|undefined;
    public lastTriggeredCommandIndex:number;
    public currentNoteId:number;

    private startedAt:number;

    constructor(private tracker:Tracker) {}

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
        let frequency = this.frequency;
        if (this.frequencyModulator!==undefined) frequency = this.frequencyModulator.getModulatedValue(frequency,dTime);
        let currSample = Oscillator._generateWaveForm(this.velocity, this.waveForm, frequency, dTime);
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

const wait = ()=>{
    return new Promise<void>(resolve=>{
        setTimeout(()=>resolve(undefined),1);
    });
}

const MIDI_NOTE_TO_FREQUENCY_TABLE: number[] = [];
for (let x = 0; x < 127; ++x) {
    MIDI_NOTE_TO_FREQUENCY_TABLE[x] = CalcUtils.midiNumberToFr(x);
}

export class Tracker {

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
    }

    public setTrack(midiJson:IMidiJson) {
        this._init();
        midiJson.tracks.forEach(t=>{
            if (!t.notes?.length) return;
            this.numOfTracks++;
            console.log(`track: ${t.name}`);
            //if (t.name!=='Guitar Solo') return;
            this.setTrackNotes(t);
        });
    }

    private setTrackNotes(t:IMidiJson['tracks'][0]) {
        if (!t.notes) return;
        t.notes.forEach(n=>{

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
            this.lastEventSampleNum = noteOffSampleNum;
            //}
        });
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
        return await URL.createObjectURL(blob);
    }

    private execCommand(command: INTERNAL_MIDI_COMMAND,i:number):void {
        if (command.opCode === 'noteOn') {

            const instrumentSettings =
                this.instrument.getOscillatorSettingsByMidiInstrumentNumber(command.channel.instrumentNumber,command.payload.note,command.channel.percussion);

            const oscillator = new Oscillator(this);
            oscillator.frequency = MIDI_NOTE_TO_FREQUENCY_TABLE[command.payload.note];
            oscillator.velocity = command.payload.velocity;
            oscillator.waveForm = instrumentSettings.waveForm;
            oscillator.balance = this.presets.channels[command.channel.channelNumber]?.balance ?? 0.5;
            oscillator.lastTriggeredCommandIndex = i;
            oscillator.currentNoteId = command.payload.noteId;
            oscillator.adsrForm = new ASDRForm(instrumentSettings.adsr);
            oscillator.frequencyModulator = instrumentSettings.fm?.();
            oscillator.amplitudeModulator = instrumentSettings.am?.();
            this._oscillators.push(oscillator);
        } else if (command.opCode === 'noteOff') {
            for (let i = 0; i < this._oscillators.length; i++) {
                if (this._oscillators[i].currentNoteId === command.payload.noteId) {
                    this._oscillators[i].adsrForm.forceRelease = true;
                    break;
                }
            }
        } else throw `unknown command ${command.opCode}`;
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
