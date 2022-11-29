import {createRange} from "@engine/misc/object";
import {WaveForms} from "./waveForms";
import {InstrumentSettings} from "./types";
import {DecayFrequencyModulator, WaveMultiplicativeModulator} from "./modulators";

export class Instrument {
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
