import {Wave} from "../pix32/ym-player/internal/wav";


interface ADSRPoint {
    from: { time: number, val: number },
    to: { time: number, val: number }
}

type WAVE_FORM = 'sin' | 'noise' | 'square' | 'triangle' | 'tremolo' | 'tremolo2';

interface SAMPLE {
    L: number;
    R: number;
}


interface CHANNEL_PRESET {
    velocity: number;
    waveForm: WAVE_FORM;
    balance: number;
}

interface PRESETS {
    numOfOscillators: number;
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
}

interface IMidiJson {
    header?: any;
    startTime?: number;
    duration?: number;
    tracks: ({
        startTime: number;
        duration: number;
        length: number;
        controlChanges: any;
        id: number;
        name?: string;
        channelNumber?: number;
        notes?:MIDI_COMMAND[];
        isPercussion?:boolean;
        instrumentNumber?: number;
        instrument?: string;
        instrumentFamily?: string;
    })[]
}

const defaultPresets:PRESETS = {
    numOfOscillators: 8,
    channels: [
        {
            velocity: 0.7,
            waveForm: 'square',
            balance: 0.1
        },
        {
            velocity: 0.6,
            waveForm: 'square',
            balance: 0.2
        },
        {
            velocity: 0.6,
            waveForm: 'sin',
            balance: 0.1
        },
        {
            velocity: 0.6,
            waveForm: "square",
            balance: 0.7
        },
        {
            velocity: 0.8,
            waveForm: "sin",
            balance: 0.5
        },
        {
            velocity: 0.8,
            waveForm: 'sin',
            balance: 1
        },
        {
            velocity: 0.4,
            waveForm: 'sin',
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


class ASDRForm {

    private readonly attack: ADSRPoint;
    private sustain: ADSRPoint;
    private delay: ADSRPoint;
    private release: ADSRPoint;
    private startedAt: number;

    constructor(a: number, s: number, d: number, r: number) {
        this.attack = {from: {time: 0, val: 0}, to: {time: a, val: 1}};
        this.sustain = {from: {time: a, val: 1}, to: {time: a + s, val: 1}};
        this.delay = {from: {time: a + s, val: 1}, to: {time: a + s + d, val: 0.5}};
        this.release = {from: {time: a + s + d, val: 0.5}, to: {time: a + s + d + r, val: 0}};
    }

    private static _linear(t: number, b: number, c: number, d: number): number {
        return c * t / d + b;
    }

    public calcFactorByTime(t: number): number {
        if (this.startedAt === undefined) this.startedAt = t;
        const dTime = t - this.startedAt;
        let closestPrevPoint = this.attack;
        [this.sustain, this.delay, this.release].forEach(point => {
            if (dTime > point.from.time) {
                closestPrevPoint = point;
            }
        });
        const res = ASDRForm._linear(
            dTime,
            closestPrevPoint.from.val, closestPrevPoint.to.val - closestPrevPoint.from.val,
            closestPrevPoint.to.time - closestPrevPoint.from.time
        );
        if (res < 0) return 0;
        return res;
    }

}

let cnt = 0;
const log = (...val:any[])=>{
    cnt++;
    if (cnt>5000) throw 'stopped';
    console.log(...val);
}

class Oscillator {

    private readonly sampleRate: number;

    public velocity: number;
    public waveForm: WAVE_FORM;
    public balance: number;
    public adsrForm: ASDRForm;
    public frequency: number;

    constructor(sampleRate: number) {
        this.sampleRate = sampleRate;
        this.frequency = 0;
        this.velocity = 1;
        this.waveForm = 'sin';
        this.balance = 0.5;
    }

    private sin(fr: number, t: number): number {
        return Math.sin((2.0 * Math.PI * t * fr));
    }

    private noise(fr: number, t: number): number {
        return Math.random();
    }

    private square(fr: number, t: number): number {
        const sample = this.sin(fr, t);
        return sample < 0 ? -1 : 1;
    }

    private triangle(fr: number, t: number): number {
        return this.sin(fr, t) + 1 / 9 * this.sin(3 * fr, t) + 1 / 25 * this.sin(5 * fr, t);
    }

    private tremolo(fr: number, t: number): number {
        const semiPeriod = ~~(t * 100) % 6;
        if (semiPeriod > 3) fr *= 2;
        return this.sin(fr, t);
    }

    private tremolo2(fr: number, t: number): number {
        const semiPeriod = ~~(t * 100) % 6;
        if (semiPeriod > 4) fr *= 3;
        else if (semiPeriod > 2) fr *= 2;
        return this.sin(fr, t);
    }

    private _generateWaveForm(
        velocity: number,
        waveForm: WAVE_FORM,
        frequency: number,
        t: number): number {
        if (velocity == 0 || frequency == 0) return 0;
        return velocity * (this[waveForm](frequency, t));
    }

    public generateSample(currentSampleNum: number): SAMPLE {
        const t: number = currentSampleNum / this.sampleRate;
        if (this.frequency === 0) return {L: 0, R: 0};
        const currSample: number = this._generateWaveForm(this.velocity, this.waveForm, this.frequency, t);
        const balanceR: number = (this.balance + 1) / 2;
        const balanceL: number = 1 - balanceR;
        const adsrFactor: number = this.adsrForm ? this.adsrForm.calcFactorByTime(t) : 1;
        return {
            L: currSample * balanceL * adsrFactor,
            R: currSample * balanceR * adsrFactor
        };
    }
}


export class Tracker {

    private readonly midiTable: number[];
    private sampleToCommandsMap: Record<number, INTERNAL_MIDI_COMMAND[]>;
    private lastEventTime: number;
    private oscillators: Oscillator[];

    constructor(private sampleRate: number = 11025, private presets: PRESETS = defaultPresets) {
        this.midiTable = [];
        for (let x = 0; x < 127; ++x) {
            this.midiTable[x] = CalcUtils.midiNumberToFr(x);
        }
    }

    private _init() {
        this.sampleToCommandsMap = {};
        this.lastEventTime = 0;
        this.oscillators = new Array(this.presets.numOfOscillators || 5);
        for (let i = 0; i < this.oscillators.length; i++) {
            this.oscillators[i] = new Oscillator(this.sampleRate);
        }
    }


    private _commandToInternalCommand(time: number, opCode: tOpCode, cmd: MIDI_COMMAND, track:IMidiJson['tracks'][0]): void {
        const sampleNum = ~~(time * this.sampleRate);
        if (!this.sampleToCommandsMap[sampleNum]) this.sampleToCommandsMap[sampleNum] = [];
        this.sampleToCommandsMap[sampleNum].push({
            note: cmd.midi,
            opCode,
            track: track.id,
            velocity: cmd.velocity,
            percussion: track.isPercussion===true,
        });
        if (this.lastEventTime < sampleNum) this.lastEventTime = sampleNum;
    }

    public setTrack(midiJson:IMidiJson) {
        this._init();
        midiJson.tracks.forEach(t=>{
            if (!t.notes) return;
            t.notes.forEach(n=>{
                this._commandToInternalCommand(n.time,'noteOn', n, t);
                this._commandToInternalCommand(n.time + n.duration, 'noteOff', n, t);
            });
        });
    }

    public toURL():string {
        const res: number[] = [];
        for (let i = 0; i < this.lastEventTime; i++) {
            const sample = this.generateSample(i);
            res.push(~~(sample.L*10000));
            res.push(~~(sample.R*10000));
        }
        const blob = Wave.encodeWAV(res, this.sampleRate);
        return URL.createObjectURL(blob);
    }

    private getFreeOscillator() {
        for (let i = 0; i < this.oscillators.length; i++) {
            if (this.oscillators[i].frequency === 0) {
                return this.oscillators[i];
            }
        }
        return null;
    }

    private execCommand(command: INTERNAL_MIDI_COMMAND):void {
        if (command.opCode === 'noteOn') {
            const freeOscillator = this.getFreeOscillator();
            if (freeOscillator) {
                const trackPreset = this.presets.channels[command.track] ||
                    {
                        velocity: 1,
                        waveForm: 'triangle',
                        balance: 0.5
                    };
                freeOscillator.frequency = this.midiTable[command.note];
                freeOscillator.velocity = trackPreset.velocity * command.velocity;
                freeOscillator.waveForm = command.percussion?'noise':trackPreset.waveForm;
                freeOscillator.balance = trackPreset.balance;
                freeOscillator.adsrForm =
                    command.percussion?
                        new ASDRForm(0.01, 0.05, 0.1, 3):
                        new ASDRForm(0.01, 0.2, 0.2, 1)
                ;
            }
        } else if (command.opCode === 'noteOff') {
            for (let i = 0; i < this.oscillators.length; i++) {
                if (this.oscillators[i].frequency === this.midiTable[command.note]) {
                    this.oscillators[i].frequency = 0;
                    this.oscillators[i].velocity = 0;
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
                this.execCommand(possibleCommands[i]);
            }
        }
        // mix by formula: out = (s1 + s2) - (s1 * s2);
        const sumAll: SAMPLE = {L: 0, R: 0};
        const multAll: SAMPLE = {L: 1, R: 1};
        for (let i: number = 0; i < this.oscillators.length; i++) {
            const sample: SAMPLE = this.oscillators[i].generateSample(currentSampleNum);
            sumAll.L += sample.L;
            sumAll.R += sample.R;
            multAll.L *= sample.L;
            multAll.R *= sample.R;
        }
        return {
            L: sumAll.L - multAll.L,
            R: sumAll.R - multAll.R
        };
    }
}


