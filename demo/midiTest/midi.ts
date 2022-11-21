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

type tOpCode = 'noteOn' | 'noteOff';

interface INTERNAL_MIDI_COMMAND {
    opCode: tOpCode;
    track: number;
    note: number;
    velocity: number;
    percussion: boolean;
    instrumentNumber: number;
    noteId:number;
}

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
        {
            balance: 0.1
        },
        {
            balance: 0.2
        },
        {
            balance: 0.1
        },
        {
            balance: 0.7
        },
        {
            balance: 0.5
        },
        {
            balance: 1
        },
        {
            balance: -0.9
        }
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

class WaveForms {

    public static sin: WAVE_FORM = (fr: number, t: number): number => {
        return Math.sin( Math.PI * t * fr);
    }

    public static sin2: WAVE_FORM = (fr: number, t: number): number => {
        return (
            0.7 * this.sin(fr, t) +
            0.2 * this.sin(2/1 * fr, t) +
            0.1 * this.sin(3/2 * fr, t)
        );
    }

    public static noise: WAVE_FORM = (fr: number, t: number): number => {
        return Math.random()*2 - 1;
    }

    public static sinAndNoise: WAVE_FORM = (fr: number, t: number): number => {
        return (
            1/6 * this.noise(fr, t) +
            5/6 * this.triangle(fr, t)
        );
    }

    public static square: WAVE_FORM = (fr: number, t: number): number => {
        const sample = this.sin(fr, t);
        return sample < 0 ? -1 : 1;
    }

    public static triangle: WAVE_FORM = (fr: number, t: number): number => {
        return (
            0.54 * this.sin (         fr,   t)    +
            0.1  * this.sin2(2/1 * fr,   t)    +
            0.1  * this.sin2(4/1 * fr,   t)    +
            0.1  * this.sin2(8/1 * fr,   t)    +
            0.1  * this.sin (3/2 * fr,   t)    +
            0.01 * this.sin (4/3 * fr,   t)    +
            0.01 * this.sin (5/4 * fr,   t)    +
            0.01 * this.sin (6/5 * fr,   t)    +
            0.01 * this.sin (7/6 * fr,   t)
        );
    }

    public static tremolo: WAVE_FORM = (fr: number, t: number): number => {
        const semiPeriod = ~~(t * 100) % 6;
        if (semiPeriod > 3) fr *= 2;
        return this.sin(fr, t);
    }

    public static tremolo2: WAVE_FORM = (fr: number, t: number): number => {
        const semiPeriod = ~~(t * 100) % 6;
        if (semiPeriod > 4) fr *= 3;
        else if (semiPeriod > 2) fr *= 2;
        return this.sin(fr, t);
    }

    public static distortion: WAVE_FORM = (fr: number, t: number): number => {
        return MathEx.clamp(2*this.triangle(fr,t),-1,1);
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
    fm?:()=>FrequencyModulator;
    name: string;
}

class Instrument {
    public readonly defaultInstrumentSettings = {
        piano: {
            adsr: {a: 0.02, s: 0.1, d: 0.3, r: 1},
            waveForm: WaveForms.triangle,
            name: 'piano'
        } as InstrumentSettings,
        bass: {
            adsr: {a: 0.02, s: 0.1, d: 0.4, r: 1},
            waveForm: WaveForms.triangle,
            name: 'bass'
        } as InstrumentSettings,
        distortion: {
            adsr: {a: 0.02, s: 0.1, d: 0.4, r: 1},
            waveForm: WaveForms.distortion,
            name: 'distortion'
        } as InstrumentSettings,
        bassDrum: {
            adsr: {a: 0.01, s: 0.05, d: 0.2, r: 0.3},
            waveForm: WaveForms.sinAndNoise,
            fm: ()=>new DecayFrequencyModulator(150,10),
            name: 'bassDrum',
        } as InstrumentSettings,
        snareDrum: {
            adsr: {a: 0.01, s: 0.05, d: 0.1, r: 0.01},
            waveForm: WaveForms.noise,
            name: 'snareDrum',
        } as InstrumentSettings,
        hiHatDrum: {
            adsr: {a: 0.01, s: 0.1, d: 0.1, r: 0.1},
            waveForm: WaveForms.noise,
            name: 'hiHatDrum',
        } as InstrumentSettings,
        organ: {
            adsr: {a: 0.01, s: 0.001, d: 10, r: 1},
            waveForm: WaveForms.triangle,
            name: 'organ'
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
            range: [...createRange({from: 28, to: 31+1})],
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
                    console.log('----------------bass drum',note);
                    result = this.defaultInstrumentSettings.bassDrum;
                    break;
                case 42:
                case 44:
                case 46:
                    console.log('----------------hi hat',note);
                    result = this.defaultInstrumentSettings.hiHatDrum;
                    break;
                default:
                    console.log('----------------default drum',note);
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

        console.log(num,result.name);
        return result;
    }

}

abstract class FrequencyModulator {

    protected constructor() {
    }

    public abstract getModulatedFrequency(baseFrequency:number,t: number): number;

}

class DecayFrequencyModulator extends FrequencyModulator {


    public constructor(private readonly baseFrequency:number, private readonly decayHzPerSecond: number) {
        super();
    }

    public override getModulatedFrequency(baseFrequency:number,t: number): number {
        let fr = this.baseFrequency - t * this.decayHzPerSecond;
        if (fr<0) fr = 0;
        return fr;
    }

}

class Oscillator {

    public velocity: number = 1;
    public waveForm: WAVE_FORM;
    public balance: number = 0.5;
    public adsrForm: ASDRForm;
    public frequency: number;
    public frequencyModulator:FrequencyModulator|undefined;
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
        if (this.frequencyModulator!==undefined) frequency = this.frequencyModulator.getModulatedFrequency(this.frequency,dTime);
        const currSample = Oscillator._generateWaveForm(this.velocity, this.waveForm, frequency, dTime);
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


export class Tracker {

    private readonly midiNoteToFrequencyTable: number[];
    private sampleToCommandsMap: Record<number, INTERNAL_MIDI_COMMAND[]>;
    private lastEventTime: number;
    private numOfTracks:number;
    private nextId:number;
    private instrument = new Instrument();
    public readonly _oscillators: Oscillator[] = [];

    constructor(public readonly sampleRate: number = 11025, private presets: PRESETS = defaultPresets) {
        this.midiNoteToFrequencyTable = [];
        for (let x = 0; x < 127; ++x) {
            this.midiNoteToFrequencyTable[x] = CalcUtils.midiNumberToFr(x);
        }
    }

    private _init() {
        this.sampleToCommandsMap = {};
        this.lastEventTime = 0;
        this.numOfTracks = 0;
        this.nextId = 0;
    }


    private _commandToInternalCommand(noteId:number, instrumentNumber: number, time: number, opCode: tOpCode, cmd: MIDI_COMMAND, track:IMidiJson['tracks'][0]): void {
        const sampleNum = ~~(time * this.sampleRate);
        if (!this.sampleToCommandsMap[sampleNum]) this.sampleToCommandsMap[sampleNum] = [];
        this.sampleToCommandsMap[sampleNum].push({
            note: cmd.midi,
            opCode,
            track: track.id,
            velocity: cmd.velocity,
            percussion: track.isPercussion===true,
            noteId,
            instrumentNumber
        });
        if (this.lastEventTime < sampleNum) this.lastEventTime = sampleNum;
    }

    public setTrack(midiJson:IMidiJson) {
        this._init();
        midiJson.tracks.forEach(t=>{
            if (!t.notes?.length) return;
            //if (!t.isPercussion) return;
            this.numOfTracks++;
            const instrumentNumber = t.instrumentNumber ?? t.instrument?.number ?? 1;
            t.notes.forEach(n=>{
                const noteId = this.nextId++;
                //if ([35,36].includes(n.midi)) {
                    this._commandToInternalCommand(noteId, instrumentNumber, n.time,'noteOn', n, t);
                    this._commandToInternalCommand(noteId,instrumentNumber, n.time + n.duration, 'noteOff', n, t);
                //}
            });
        });
    }

    public toURL():string {
        const res: number[] = [];
        for (let i = 0; i < this.lastEventTime; i++) {
            const sample = this.generateSample(i);
            const base = 0b0011_1111_1111_1111;
            res.push(~~(sample.L*base));
            res.push(~~(sample.R*base));
        }
        const blob = Wave.encodeWAV(res, this.sampleRate);
        return URL.createObjectURL(blob);
    }

    private execCommand(command: INTERNAL_MIDI_COMMAND,i:number):void {
        if (command.opCode === 'noteOn') {

            const instrumentSettings =
                this.instrument.getOscillatorSettingsByMidiInstrumentNumber(command.instrumentNumber,command.note,command.percussion);

            const oscillator = new Oscillator(this);
            oscillator.frequency = this.midiNoteToFrequencyTable[command.note];
            oscillator.velocity = command.velocity;
            oscillator.waveForm = instrumentSettings.waveForm;
            oscillator.balance = this.presets.channels[command.track]?.balance ?? 0.5;
            oscillator.lastTriggeredCommandIndex = i;
            oscillator.currentNoteId = command.noteId;
            oscillator.adsrForm = new ASDRForm(instrumentSettings.adsr);
            oscillator.frequencyModulator = instrumentSettings.fm?.();
            this._oscillators.push(oscillator);
        } else if (command.opCode === 'noteOff') {
            for (let i = 0; i < this._oscillators.length; i++) {
                if (this._oscillators[i].currentNoteId === command.noteId) {
                    this._oscillators[i].adsrForm.forceRelease = true;
                    break;
                }
            }
        } else throw `unknown command ${command.opCode}`;
    }

    private generateSample(currentSampleNum: number):SAMPLE {
        currentSampleNum %= this.lastEventTime;
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
