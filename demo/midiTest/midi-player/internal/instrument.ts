import {WaveForms} from "./waveForms";
import {InstrumentSettings} from "./types";
import {
    ConstantDecayFrequencyModulator, DynamicDecayFrequencyModulator,
    WaveAdditiveModulator, WaveAdditiveModulator2, WaveMultiplicativeModulator
} from "./modulators";

export class Instrument {

    // https://virtualpiano.eu/
    public readonly defaultInstrumentSettings = {
        grandPiano: {
            adsr: {a: 0.001, d: 0.07, s: 0.6, r: 1, base: 0.6},
            waveForms: [{amplitude: 0.9, form: WaveForms.harmonic},{amplitude:0.1, form: WaveForms.triangle}] ,
            name: 'grandPiano',
        },
        brightPiano: {
            adsr: {a: 0.003, d: 0.08, s: 0.4, r: 0.9, base: 0.5},
            waveForms: [{amplitude: 0.9, form: WaveForms.harmonic},{amplitude:0.1, form: WaveForms.triangle}],
            name: 'brightPiano',
        },
        syntPiano: {
            adsr: {a: 0.001, d: 0.07, s: 0.5, r: 0.9, base: 0.6},
            waveForms: [{amplitude: 0.9, form: WaveForms.triangle},{amplitude:0.1, form: WaveForms.sawTooth}],
            name: 'syntPiano',
        },
        clavier: {
            adsr: {a: 0.001, d: 0.1, s: 0.4, r: 0.8, base: 0.5},
            waveForms: [{amplitude: 0.9, form: WaveForms.triangle},{amplitude:0.1, form: WaveForms.sawTooth}],
            name: 'clavier',
        },
        xylophone: {
            adsr: {a: 0.001, d: 0.1, s: 0.8, r: 2, base: 0.5},
            waveForms: [
                {
                    amplitude: 0.9, form: WaveForms.triangle,
                    am: ()=>new WaveAdditiveModulator2(8, 0.15),
                },
                {amplitude:0.1, form: WaveForms.sin}
            ],
            name: 'xylophone',
        },
        musicBox: {
            adsr: {a: 0.02, d: 0.1, s: 0.8, r: 2, base: 0.5},
            waveForms: [
                {
                    amplitude: 0.9, form: WaveForms.triangle,
                    am: ()=>new WaveAdditiveModulator2(8, 0.15),
                },
                {amplitude:0.1, form: WaveForms.sin}
            ],
            name: 'musicBox',
        },
        marimba: {
            adsr: {a: 0.001, d: 0.1, s: 0.8, r: 1, base: 0.5},
            waveForms: [
                {
                    amplitude:1,form: WaveForms.dirtyWave(5,1, WaveForms.triangle),
                    am: ()=>new WaveAdditiveModulator2(8, 0.15),
                }
            ],
            name: 'marimba',
        },
        tubularBells: {
            adsr: {a: 0.001, d: 0.1, s: 0.9, r: 2, base: 0.5},
            waveForms: [
                {
                    amplitude:1, form: WaveForms.dirtyWave(7,1, WaveForms.triangle),
                    am: ()=>new WaveAdditiveModulator2(8, 0.3),
                }
            ],
            name: 'tubularBells',
        },
        violin: {
            adsr: {a: 0.04, d: 0.1, s: 5, r: 0.8, base: 0.8},
            waveForms: [
                {
                    amplitude: 0.9, form: WaveForms.sinHarmonics,
                    fm: ()=>new WaveAdditiveModulator(2,0.01),
                },
                {amplitude:0.1, form: WaveForms.triangle}
            ],
            name: 'violin',
        },
        violinTremolo: {
            adsr: {a: 0.04, d: 0.1, s: 5, r: 0.8, base: 0.8},
            waveForms: [
                {
                    amplitude: 0.9, form: WaveForms.sinHarmonics,
                    am: ()=>new WaveAdditiveModulator2(3, 0.5),
                    fm: ()=>new WaveAdditiveModulator(2,0.01),
                },
                {amplitude:0.1, form: WaveForms.triangle}
            ],
            name: 'violinTremolo',
        } ,
        bass: {
            adsr: {a: 0.02, d: 0.01, s: 0.8, r: 0.7, base: 0.6},
            waveForms: [{amplitude: 0.8, form: WaveForms.trapezia},{amplitude:0.2, form: WaveForms.triangle}],
            name: 'bass'
        },
        pizzicatto: {
            adsr: {a: 0.01, d: 0.07, s: 0.3, r: 0.4, base: 0.5},
            waveForms: [{amplitude: 0.9, form: WaveForms.sawTooth},{amplitude:0.1, form: WaveForms.sinHarmonics}],
            name: 'pizzicatto'
        },
        electroGuitarClean: {
            adsr: {a: 0.01, d: 0.01, s: 1.1, r: 0.4, base: 0.5},
            waveForms: [
                {amplitude:0.4, form: WaveForms.triangle},
                {amplitude:0.4, form: WaveForms.sawTooth},
                {amplitude:0.2, form: WaveForms.square}
            ],
            name: 'electroGuitarClean',
        },
        electroGuitarOverdriven: {
            adsr: {a: 0.01, d: 0.01, s: 1.1, r: 0.4, base: 0.5},
            waveForms: [{amplitude: 0.8, form: WaveForms.square},{amplitude:0.2, form: WaveForms.sawTooth}],
            name: 'electroGuitarOverdriven',
        },
        electroGuitarDistortion: {
            adsr: {a: 0.01, d: 0.01, s: 1.1, r: 0.4, base: 0.5},
            waveForms: [
                {
                    amplitude: 0.7, form: WaveForms.trapezia
                },
                {
                    amplitude: 0.2, form: WaveForms.sawTooth,
                    am: ()=>new WaveAdditiveModulator2(5, 0.5),
                },
                {
                    amplitude: 0.1, form: WaveForms.square,
                    am: ()=>new WaveAdditiveModulator2(3, 0.5),
                }
            ],
            name: 'distortion',
        },
        acousticBassDrum: {
            adsr: {a: 0.01, d: 0.05, s: 0.1, r: 0.2, base: 0.5},
            waveForms: [
                {
                    amplitude: 1, form: WaveForms.dirtyWave(5,2, WaveForms.sin),
                    fm: ()=>new ConstantDecayFrequencyModulator(110,160),
                }
            ],
            name: 'acousticBassDrum',
        },
        bassDrum: {
            adsr: {a: 0.01, d: 0.05, s: 0.1, r: 0.2, base: 0.5},
            waveForms: [
                {
                    amplitude: 1, form: WaveForms.dirtyWave(10,2, WaveForms.sin),
                    fm: ()=>new ConstantDecayFrequencyModulator(110,165),
                }
            ],
            name: 'bassDrum',
        },
        snareDrum: {
            adsr: {a: 0.001, d: 0.01, s: 0.06, r: 0.1, base: 0.5},
            waveForms: [
                {
                    amplitude: 1, form: WaveForms.dirtyWave(10,2, WaveForms.triangle),
                    fm: ()=>new ConstantDecayFrequencyModulator(190,320),
                }
            ],
            name: 'snareDrum',
        },
        electricSnareDrum: {
            adsr: {a: 0.001, d: 0.01, s: 0.09, r: 0.15, base: 0.5},
            waveForms: [
                {
                    amplitude: 1, form: WaveForms.dirtyWave(8,2, WaveForms.triangle),
                    fm: ()=>new ConstantDecayFrequencyModulator(195,325),
                }
            ],
            name: 'electricSnareDrum',
        },
        electricDynamicDrum: {
            adsr: {a: 0.001, d: 0.01, s: 0.09, r: 0.15, base: 0.5},
            waveForms: [
                {
                    amplitude: 1, form: WaveForms.dirtyWave(5,2, WaveForms.triangle),
                    fm: ()=>new DynamicDecayFrequencyModulator(325),
                }
            ],
            name: 'electricDynamicDrum',
        },
        snareDrumClosed: {
            adsr: {a: 0.001, d: 0.01, s: 0.06, r: 0.01, base: 0.5},
            waveForms: [
                {
                    amplitude: 1, form: WaveForms.dirtyWave(10,2, WaveForms.triangle),
                    fm: ()=>new ConstantDecayFrequencyModulator(185,340),
                }
            ],
            name: 'snareDrumClosed',
        },
        lowFloorTomDrum: {
            adsr: {a: 0.001, d: 0.01, s: 0.08, r: 0.1, base: 0.5},
            waveForms: [
                {
                    amplitude: 1, form: WaveForms.dirtyWave(10,2, WaveForms.triangle),
                    fm: ()=>new ConstantDecayFrequencyModulator(160,320),
                }
            ],
            name: 'lowFloorTomDrum',
        },
        timpani: {
            adsr: {a: 0.001, d: 0.01, s: 0.08, r: 0.1, base: 0.5},
            waveForms: [
                {
                    amplitude: 1, form: WaveForms.dirtyWave(10,2, WaveForms.triangle),
                    fm: ()=>new DynamicDecayFrequencyModulator(330),
                }
            ],
            name: 'timpani',
        },
        steelDrums: {
            adsr: {a: 0.001, d: 0.01, s: 0.08, r: 0.1, base: 0.5},
            waveForms: [
                {
                    amplitude: 1, form: WaveForms.dirtyWave(5,1, WaveForms.triangle),
                    fm: ()=>new DynamicDecayFrequencyModulator(190),
                }
            ],
            name: 'steelDrums',
        },
        woodDrums: {
            adsr: {a: 0.001, d: 0.01, s: 0.08, r: 0.1, base: 0.5},
            waveForms: [
                {
                    amplitude: 1, form: WaveForms.dirtyWaveNoise(10,2, WaveForms.triangle, WaveForms.whiteNoise, 0.4),
                    fm: ()=>new DynamicDecayFrequencyModulator(210),
                }
            ],
            name: 'woodDrums',
        },
        highFloorTomDrum: {
            adsr: {a: 0.001, d: 0.01, s: 0.08, r: 0.12, base: 0.5},
            waveForms: [
                {
                    amplitude: 1, form: WaveForms.dirtyWave(10,2, WaveForms.triangle),
                    fm: ()=>new ConstantDecayFrequencyModulator(170,320),
                }
            ],
            name: 'highFloorTomDrum',
        },
        lowTomDrum: {
            adsr: {a: 0.001, d: 0.01, s: 0.08, r: 0.15, base: 0.5},
            waveForms: [
                {
                    amplitude: 1, form: WaveForms.dirtyWave(10, 2, WaveForms.triangle),
                    fm: () => new ConstantDecayFrequencyModulator(165, 310),
                }
            ],
            name: 'lowTomDrum',
        },
        lowMidTomDrum: {
            adsr: {a: 0.001, d: 0.01, s: 0.08, r: 0.15, base: 0.5},
            waveForms: [
                {
                    amplitude: 1, form: WaveForms.dirtyWave(10,2, WaveForms.triangle),
                    fm: ()=>new ConstantDecayFrequencyModulator(175,320),
                }
            ],
            name: 'lowMidTomDrum',
        },
        highMidTomDrum: {
            adsr: {a: 0.001, d: 0.01, s: 0.08, r: 0.2, base: 0.5},
            waveForms: [
                {
                    amplitude: 1, form: WaveForms.dirtyWave(10,2, WaveForms.triangle),
                    fm: () => new ConstantDecayFrequencyModulator(180, 320),
                }
            ],
            name: 'highMidTomDrum',
        },
        highWoodBlock: {
            adsr: {a: 0.001, d: 0.01, s: 0.08, r: 0.2, base: 0.5},
            waveForms: [
                {
                    amplitude: 1, form: WaveForms.dirtyWave(10,2, WaveForms.triangle),
                    fm: ()=>new ConstantDecayFrequencyModulator(190,1),
                }
            ],
            name: 'highWoodBlock',
        },
        lowWoodBlock: {
            adsr: {a: 0.001, d: 0.01, s: 0.08, r: 0.2, base: 0.5},
            waveForms: [
                {
                    amplitude: 1, form: WaveForms.dirtyWave(10,2, WaveForms.triangle),
                    fm: ()=>new ConstantDecayFrequencyModulator(150,1),
                }
            ],
            name: 'lowWoodBlock',
        },
        highBongo: {
            adsr: {a: 0.001, d: 0.01, s: 0.08, r: 0.2, base: 0.5},
            waveForms: [
                {
                    amplitude: 1, form: WaveForms.dirtyWave(5,1, WaveForms.triangle),
                    fm: ()=>new ConstantDecayFrequencyModulator(200,1),
                }
            ],
            name: 'highBongo',
        },
        lowBongo: {
            adsr: {a: 0.001, d: 0.01, s: 0.08, r: 0.2, base: 0.5},
            waveForms: [
                {
                    amplitude: 1, form: WaveForms.dirtyWave(5,2, WaveForms.triangle),
                    fm: ()=>new ConstantDecayFrequencyModulator(150,1),
                }
            ],
            name: 'lowBongo',
        },
        muteHighConga: {
            adsr: {a: 0.001, d: 0.01, s: 0.05, r: 0.1, base: 0.5},
            waveForms: [
                {
                    amplitude: 1, form: WaveForms.dirtyWave(5,2, WaveForms.sinHarmonics),
                    fm: ()=>new ConstantDecayFrequencyModulator(300,1),
                }
            ],
            name: 'muteHighConga',
        },
        openHighConga: {
            adsr: {a: 0.001, d: 0.01, s: 0.08, r: 0.2, base: 0.5},
            waveForms: [
                {
                    amplitude: 1, form: WaveForms.dirtyWave(5,2, WaveForms.sinHarmonics),
                    fm: ()=>new ConstantDecayFrequencyModulator(300,1),
                }
            ],
            name: 'muteHighConga',
        },
        lowConga: {
            adsr: {a: 0.001, d: 0.01, s: 0.08, r: 0.2, base: 0.5},
            waveForms: [
                {
                    amplitude: 1, form: WaveForms.dirtyWave(5,2, WaveForms.sinHarmonics),
                    fm: ()=>new ConstantDecayFrequencyModulator(250,1),
                }
            ],
            name: 'lowConga',
        },
        highTimbale: {
            adsr: {a: 0.001, d: 0.01, s: 0.08, r: 0.2, base: 0.5},
            waveForms: [
                {
                    amplitude: 1, form: WaveForms.dirtyWave(3,2, WaveForms.square),
                    fm: ()=>new ConstantDecayFrequencyModulator(300,1),
                }
            ],
            name: 'highTimbale',
        },
        lowTimbale: {
            adsr: {a: 0.001, d: 0.01, s: 0.08, r: 0.2, base: 0.5},
            waveForms: [
                {
                    amplitude: 1, form: WaveForms.dirtyWave(3,2, WaveForms.square),
                    fm: ()=>new ConstantDecayFrequencyModulator(260,1),
                }
            ],
            name: 'lowTimbale',
        },
        highAgogo: {
            adsr: {a: 0.001, d: 0.01, s: 0.08, r: 0.2, base: 0.5},
            waveForms: [
                {
                    amplitude: 1, form: WaveForms.dirtyWave(3,2, WaveForms.triangle),
                    fm: ()=>new ConstantDecayFrequencyModulator(850,1),
                }
            ],
            name: 'highAgogo',
        },
        lowAgogo: {
            adsr: {a: 0.001, d: 0.01, s: 0.08, r: 0.2, base: 0.5},
            waveForms: [
                {
                    amplitude: 1, form: WaveForms.dirtyWave(3,2, WaveForms.triangle),
                    fm: ()=>new ConstantDecayFrequencyModulator(790,1),
                }
            ],
            name: 'lowAgogo',
        },
        highTomDrum: {
            adsr: {a: 0.001, d: 0.01, s: 0.08, r: 0.15, base: 0.5},
            waveForms: [
                {
                    amplitude: 1, form: WaveForms.dirtyWave(10,2, WaveForms.triangle),
                    fm: ()=>new ConstantDecayFrequencyModulator(185,325),
                }
            ],
            name: 'highTomDrum',
        },
        hiHatOpenedDrum: {
            adsr: {a: 0.001, d: 0.02, s: 0.1, r: 0.2, base: 0.5},
            waveForms: [
                {
                    amplitude: 1, form: WaveForms.dirtyWaveNoise(90,2, WaveForms.triangle, WaveForms.pinkNoise, 0.65),
                    fm: ()=>new ConstantDecayFrequencyModulator(705,50),
                }
            ],
            name: 'hiHatOpenedDrum',
        },
        hiHatClosedDrum: {
            adsr: {a: 0.001, d: 0.01, s: 0.05, r: 0.05, base: 0.5},
            waveForms: [
                {
                    amplitude: 1, form: WaveForms.dirtyWaveNoise(90,2, WaveForms.triangle, WaveForms.pinkNoise, 0.6),
                    fm: ()=>new ConstantDecayFrequencyModulator(700,50),
                }
            ],
            name: 'hiHatClosedDrum',
        },
        pedalHiHat: {
            adsr: {a: 0.001, d: 0.015, s: 0.01, r: 0.05, base: 0.5},
            waveForms: [
                {
                    amplitude: 1, form: WaveForms.dirtyWaveNoise(90,2, WaveForms.triangle, WaveForms.pinkNoise, 0.6),
                    fm: ()=>new ConstantDecayFrequencyModulator(710,50),
                }
            ],
            name: 'hiHatClosedDrum',
        },
        clap: {
            adsr: {a: 0.001, d: 0.025, s: 0.02, r: 0.02, base: 0.5},
            waveForms: [
                {
                    amplitude: 1, form: WaveForms.dirtyWaveNoise(80,2, WaveForms.triangle, WaveForms.whiteNoise, 0.5),
                    fm: ()=>new ConstantDecayFrequencyModulator(610,50),
                }
            ],
            name: 'clap',
        },
        fxHelicopter: {
            adsr: {a: 0.001, d: 0.025, s: 5, r: 0.1, base: 0.5},
            waveForms: [
                {
                    amplitude: 1, form: WaveForms.brownNoise,
                    am: ()=>new WaveMultiplicativeModulator(10),
                }
            ],
            name: 'fxHelicopter',
        },
        fxTremolo: {
            adsr: {a: 0.001, d: 0.025, s: 5, r: 0.1, base: 0.5},
            waveForms: [{amplitude: 1, form: WaveForms.tremolo}],
            name: 'fxTremolo',
        },
        fxTremolo2: {
            adsr: {a: 0.001, d: 0.025, s: 5, r: 0.1, base: 0.5},
            waveForms: [{amplitude: 1, form: WaveForms.tremolo2}],
            name: 'fxTremolo2',
        },
        fxApplause: {
            adsr: {a: 0.001, d: 0.025, s: 5, r: 0.1, base: 0.5},
            waveForms: [
                {
                    amplitude: 1, form: WaveForms.whiteNoise,
                    am: ()=>new WaveMultiplicativeModulator(4),
                }
            ],
            name: 'fxApplause',
        },
        sideStick: {
            adsr: {a: 0.001, d: 0.025, s: 0.02, r: 0.02, base: 0.5},
            waveForms: [
                {
                    amplitude: 1, form: WaveForms.dirtyWave(400,10, WaveForms.triangle),
                    fm: ()=>new ConstantDecayFrequencyModulator(1000,1),
                }
            ],
            name: 'sideStick',
        },
        cymbalDrum: {
            adsr: {a: 0.001, d: 0.025, s: 0.8, r: 0.02, base: 0.5},
            waveForms: [
                {
                    amplitude: 1, form: WaveForms.dirtyWaveNoise(80,2, WaveForms.triangle, WaveForms.pinkNoise, 0.6),
                }
            ],
            name: 'cymbalDrum',
        },
        crashCymbal1: {
            adsr: {a: 0.001, d: 0.03, s: 1, r: 0.2, base: 0.5},
            waveForms: [
                {
                    amplitude: 1, form: WaveForms.dirtyWaveNoise(100,2, WaveForms.triangle, WaveForms.pinkNoise, 0.6),
                }
            ],
            name: 'crashCymbal1',
        },
        crashCymbal2: {
            adsr: {a: 0.001, d: 0.03, s: 1, r: 0.2, base: 0.5},
            waveForms: [
                {
                    amplitude: 0.1, form: WaveForms.brownNoise,
                }
            ],
            name: 'crashCymbal2',
        },
        rideCymbal1: {
            adsr: {a: 0.001, d: 0.03, s: 1, r: 0.02, base: 1},
            waveForms: [
                {
                    amplitude: 0.7, form: WaveForms.pinkNoise,
                }
            ],
            name: 'rideCymbal1',
        },
        rideCymbal2: {
            adsr: {a: 0.001, d: 0.03, s: 1, r: 0.1, base: 0.5},
            waveForms: [
                {
                    amplitude: 0.1, form: WaveForms.brownNoise,
                }
            ],
            name: 'rideCymbal2',
        },
        splashCymbal: {
            adsr: {a: 0.001, d: 0.03, s: 0.5, r: 0.4, base: 0.5},
            waveForms: [
                {
                    amplitude: 0.4, form: WaveForms.dirtyWave(25,1, WaveForms.triangle),
                }
            ],
            name: 'splashCymbal',
        },
        vibraslap: {
            adsr: {a: 0.001, d: 0.02, s: 0.22, r: 0.6, base: 0.5},
            waveForms: [
                {
                    amplitude: 1, form: WaveForms.dirtyWaveNoise(80,2, WaveForms.triangle, WaveForms.pinkNoise, 0.4),
                    fm: ()=>new ConstantDecayFrequencyModulator(700,50),
                    am: ()=>new WaveMultiplicativeModulator(8),
                }
            ],
            name: 'vibraslap',
        },
        rideBellDrum: {
            adsr: {a: 0.01, d: 0.07, s: 0.3, r: 0.4, base: 0.5},
            waveForms: [
                {
                    amplitude: 1, form: WaveForms.sinHarmonics,
                    fm: ()=>new ConstantDecayFrequencyModulator(155,0),
                }
            ],
            name: 'rideBellDrum',
        },
        cowBellDrum: {
            adsr: {a: 0.01, d: 0.07, s: 0.1, r: 0.2, base: 0.5},
            waveForms: [
                {
                    amplitude: 1, form: WaveForms.sinHarmonics,
                    fm: ()=>new ConstantDecayFrequencyModulator(800,0),
                }
            ],
            name: 'rideBellDrum',
        },
        organ: {
            adsr: {a: 0.01, d: 0.001, s: 10, r: 1, base: 0.5},
            waveForms: [
                {amplitude: 0.9, form: WaveForms.harmonic},
                {amplitude:0.1, form: WaveForms.triangle}
            ],
            name: 'organ'
        },
        syntesatorTriangle: {
            adsr: {a: 0.01, d: 0.01, s: 10, r: 0.6, base: 0.5},
            waveForms: [
                {
                    amplitude: 1, form: WaveForms.triangle,
                    am: ()=>new WaveAdditiveModulator2(12, 0.3),
                }
            ],
            name: 'syntesatorTriangle'
        },
        syntesatorSquare: {
            adsr: {a: 0.01, d: 0.01, s: 10, r: 0.6, base: 0.5},
            waveForms: [
                {
                    amplitude: 1, form: WaveForms.square,
                    am: ()=>new WaveAdditiveModulator2(12, 0.3),
                },
            ],
            name: 'syntesatorSquare'
        },
        syntesatorSawtooth: {
            adsr: {a: 0.01, d: 0.01, s: 10, r: 0.6, base: 0.5},
            waveForms: [
                {
                    amplitude: 1, form: WaveForms.sawTooth,
                    am: ()=>new WaveAdditiveModulator2(12, 0.3),
                }
            ],
            name: 'syntesatorSawtooth'
        },
        acoustic: {
            adsr: {a: 0.02, d: 0.1, s: 0.9, r: 0.4, base: 0.5},
            waveForms: [
                {amplitude: 0.9, form: WaveForms.sinHarmonics},{amplitude:0.1, form: WaveForms.triangle}
            ],
            name: 'acoustic'
        },
        acousticSteel: {
            adsr: {a: 0.02, d: 0.1, s: 0.9, r: 0.4, base: 0.5},
            waveForms: [{amplitude: 0.8, form: WaveForms.sawTooth},{amplitude:0.2,form:WaveForms.triangle}],
            name: 'acousticSteel'
        },
        harp: {
            adsr: {a: 0.02, d: 0.1, s: 0.9, r: 2, base: 0.5},
            waveForms: [{amplitude: 0.9, form: WaveForms.triangle},{amplitude:0.1,form:WaveForms.sawTooth}],
            name: 'harp'
        },
        acousticSteelMuted: {
            adsr: {a: 0.02, d: 0.1, s: 0.3, r: 0.3, base: 0.5},
            waveForms: [{amplitude: 0.8, form: WaveForms.sawTooth},{amplitude:0.2,form:WaveForms.triangle}],
            name: 'acousticSteelMuted'
        },
        chorus: {
            adsr: {a: 0.02, d: 0.1, s: 2, r: 0.4, base: 0.5},
            waveForms: [
                {
                    amplitude: 0.9, form: WaveForms.chorus,
                    am: ()=>new WaveAdditiveModulator2(10, 0.13),
                },
                {
                    amplitude:0.1,form:WaveForms.sawTooth,
                    am: ()=>new WaveAdditiveModulator2(8, 0.2),
                }
            ],
            name: 'chorus'
        },
        orchestra: {
            adsr: {a: 0.01, d: 0.1, s: 3, r: 0.4, base: 0.5},
            waveForms: [
                {
                    amplitude: 0.9, form: WaveForms.chorus},{amplitude:0.1,form:WaveForms.sawTooth,
                    am: ()=>new WaveAdditiveModulator2(9, 0.15),
                }
            ],
            name: 'orchestra'
        },
        acousticHarmonics: {
            adsr: {a: 0.02, d: 0.1, s: 0.8, r: 0.4, base: 0.5},
            waveForms: [{amplitude: 0.9, form: WaveForms.sinHarmonics},{amplitude:0.1,form:WaveForms.triangle}],
            name: 'acousticHarmonics'
        },
        rockOrgan: {
            adsr: {a: 0.01, d: 0.001, s: 10, r: 0.6, base: 0.5},
            waveForms: [
                {
                    amplitude: 0.9, form: WaveForms.triangle,
                    am: ()=>new WaveAdditiveModulator2(5, 0.05),
                },
                {amplitude:0.1,form:WaveForms.sawTooth}
            ],
            name: 'rockOrgan'
        },
        accordion: {
            adsr: {a: 0.02, d: 0.001, s: 10, r: 0.4, base: 0.5},
            waveForms: [
                {
                    amplitude: 0.9, form: WaveForms.harmonic,
                    am: ()=>new WaveAdditiveModulator2(4,0.4),
                },
                {amplitude:0.1,form:WaveForms.triangle}
            ],
            name: 'accordion'
        },
        pipe: {
            adsr: {a: 0.06, d: 0.3, s: 4, r: 0.2, base: 0.5},
            waveForms: [
                {
                    amplitude: 0.9, form: WaveForms.harmonic,
                    am: ()=>new WaveAdditiveModulator2(1.8,0.1),
                },
                {
                    amplitude:0.1,form:WaveForms.triangle,
                    am: ()=>new WaveAdditiveModulator2(0.5,0.1),
                }
            ],
            name: 'pipe',
        },
        pipeMuted: {
            adsr: {a: 0.06, d: 0.3, s: 4, r: 0.2, base: 0.5},
            waveForms: [
                {
                    amplitude: 0.9, form: WaveForms.sinHarmonics,
                    am: ()=>new WaveAdditiveModulator2(2,0.1),
                },
                {amplitude:0.1,form:WaveForms.triangle}
            ],
            name: 'pipe',
        },
        blownBottle: {
            adsr: {a: 0.05, d: 0.3, s: 4, r: 0.2, base: 0.5},
            waveForms: [
                {
                    amplitude:1, form:WaveForms.dirtyWave(2,1, WaveForms.triangle),
                    am: ()=>new WaveAdditiveModulator2(2,0.1),
                }
            ],
            name: 'blownBottle',
        },
        flute: {
            adsr: {a: 0.03, d: 0.2, s: 4, r: 0.2, base: 0.5},
            waveForms: [
                {
                    amplitude:0.9, form:WaveForms.harmonic,
                    am: ()=>new WaveAdditiveModulator2(2.1,0.15),
                    fm: ()=>new WaveAdditiveModulator(1.9, 0.2),
                },
                {amplitude:0.1,form:WaveForms.triangle}],
            name: 'flute',
        },
        saxophone: {
            adsr: {a: 0.05, d: 0.1, s: 4, r: 0.8, base: 0.5},
            waveForms: [
                {
                    amplitude:0.8, form:WaveForms.harmonic,
                    am: ()=>new WaveAdditiveModulator2(2.2,0.2),
                },
                {amplitude:0.2,form:WaveForms.triangle}
            ],
            name: 'saxophone',
        },
        noop: {
            adsr: {a: 0, d: 0, s: 0, r: 0, base: 0},
            waveForms: [
                {
                    amplitude:0, form:WaveForms.noop,
                }
            ],
            name: 'saxophone',
        },
    } satisfies Record<string, InstrumentSettings>;

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
    private cachedRequest:Record<number, InstrumentSettings> = {};

    public getOscillatorSettingsByMidiInstrumentNumber(num:number = 1,note:number,percussion:boolean):InstrumentSettings {
        if (!percussion && this.cachedRequest[num]) return this.cachedRequest[num];
        if (percussion && this.cachedRequest[note]) return this.cachedRequest[note];

        let result:InstrumentSettings;

        //percussion = true; // todo for debug

        if (percussion) {
            //note = 57; // todo for debug
            switch (note) {
                case 35:  // Acoustic Bass Drum
                    result = this.defaultInstrumentSettings.acousticBassDrum;
                    break;
                case 36:  // Bass Drum 1
                    result = this.defaultInstrumentSettings.bassDrum;
                    break;
                case 37: // Side Stick
                    result = this.defaultInstrumentSettings.sideStick;
                    break;
                case 38: // Acoustic Snare
                    result = this.defaultInstrumentSettings.snareDrum;
                    break;
                case 39: // Hand Clap
                    result = this.defaultInstrumentSettings.clap;
                    break;
                case 40: // Electric Snare
                    result = this.defaultInstrumentSettings.electricSnareDrum;
                    break;
                case 41: // Low Floor Tom
                    result = this.defaultInstrumentSettings.lowFloorTomDrum;
                    break;
                case 42: // Closed Hi Hat
                    result = this.defaultInstrumentSettings.hiHatClosedDrum;
                    break;
                case 43: // High Floor Tom
                    result = this.defaultInstrumentSettings.highFloorTomDrum;
                    break;
                case 44: // Pedal Hi-Hat
                    result = this.defaultInstrumentSettings.pedalHiHat;
                    break;
                case 45: // Low Tom
                    result = this.defaultInstrumentSettings.lowTomDrum;
                    break;
                case 46: // Open Hi-Hat
                    result = this.defaultInstrumentSettings.hiHatOpenedDrum;
                    break;
                case 47: // Low-Mid Tom
                    result = this.defaultInstrumentSettings.lowMidTomDrum;
                    break;
                case 48: // Hi Mid Tom
                    result = this.defaultInstrumentSettings.highMidTomDrum;
                    break;
                case 49: // Crash Cymbal 1
                    result = result = this.defaultInstrumentSettings.crashCymbal1;
                    break;
                case 50: // High Tom
                    result = this.defaultInstrumentSettings.highTomDrum;
                    break;
                case 51: // Ride Cymbal 1
                    result = result = this.defaultInstrumentSettings.rideCymbal1;
                    break;
                case 52: // Chinese Cymbal
                    result = result = this.defaultInstrumentSettings.cymbalDrum;
                    break;
                case 53: // Ride Bell
                    result = result = this.defaultInstrumentSettings.rideBellDrum;
                    break;
                case 54: // Tambourine
                    result = result = this.defaultInstrumentSettings.clap;
                    break;
                case 55: // Splash Cymbal
                    result = result = this.defaultInstrumentSettings.splashCymbal;
                    break;
                case 56: // Cowbell
                    result = result = this.defaultInstrumentSettings.cowBellDrum;
                    break;
                case 57: // Crash Cymbal 2
                    result = result = this.defaultInstrumentSettings.crashCymbal2;
                    break;
                case 58: // Vibraslap
                    result = result = this.defaultInstrumentSettings.vibraslap;
                    break;
                case 59: // Ride Cymbal 2
                    result = result = this.defaultInstrumentSettings.rideCymbal2;
                    break;
                case 60: // Hi Bongo
                    result = this.defaultInstrumentSettings.highBongo;
                    break;
                case 61: // Low Bongo
                    result = this.defaultInstrumentSettings.lowBongo;
                    break;
                case 62: // Mute Hi Conga
                    result = this.defaultInstrumentSettings.muteHighConga;
                    break;
                case 63: // Open Hi Conga
                    result = this.defaultInstrumentSettings.openHighConga;
                    break;
                case 64:  // Low Conga
                    result = this.defaultInstrumentSettings.lowConga;
                    break;
                case 65: // High Timbale
                    result = this.defaultInstrumentSettings.highTimbale;
                    break;
                case 66: // Low Timbale
                    result = this.defaultInstrumentSettings.lowTimbale;
                    break;
                case 67: // High Agogo
                    result = this.defaultInstrumentSettings.highAgogo;
                    break;
                case 68: // Low Agogo
                    result = this.defaultInstrumentSettings.lowAgogo;
                    break;
                case 69: // Cabasa
                case 70: // Maracas
                case 71: // Short Whistle
                case 72: // Long Whistle
                case 73: // Short Guiro
                case 74: // Long Guiro
                case 75: // Claves
                    result = this.defaultInstrumentSettings.sideStick;
                    break;
                case 76: // Hi Wood Block
                    result = this.defaultInstrumentSettings.highWoodBlock;
                    break;
                case 77: // Low Wood Block
                    result = this.defaultInstrumentSettings.lowWoodBlock;
                    break;
                case 78: // Mute Cuica
                case 79: // Open Cuica
                case 80: // Mute Triangle
                case 81: // Open Triangle
                    result = this.defaultInstrumentSettings.sideStick;
                    break;
                default:
                    console.log(`default drum with note: ${note}`);
                    result = this.defaultInstrumentSettings.snareDrum;
                    break;
            }
            this.cachedRequest[note] = result;
        }
        else {
            switch (num) {
                // *Piano*
                case 1: // Acoustic Grand Piano
                    result = this.defaultInstrumentSettings.grandPiano;
                    break;
                case 2: // Bright Acoustic Piano
                    result = this.defaultInstrumentSettings.brightPiano;
                    break;
                case 3: // Electric Grand Piano
                case 4: // Honky-tonk Piano
                    result = this.defaultInstrumentSettings.grandPiano;
                    break;
                case 5: // Electric Piano 1
                case 6: // Electric Piano 2
                    result = this.defaultInstrumentSettings.syntPiano;
                    break;
                case 7: // Harpsichord
                case 8: // Clavinet
                    result = this.defaultInstrumentSettings.clavier;
                    break;
                // *Chromatic Percussion*
                case 9: // Celesta
                case 10: // Glockenspiel
                case 11: // Music Box
                    result = this.defaultInstrumentSettings.musicBox;
                    break;
                case 12: // Vibraphone
                    result = this.defaultInstrumentSettings.xylophone;
                    break;
                case 13: // Marimba
                    result = this.defaultInstrumentSettings.marimba;
                    break;
                case 14: // Xylophone
                    result = this.defaultInstrumentSettings.xylophone;
                    break;
                case 15: // Tubular Bells
                    result = this.defaultInstrumentSettings.tubularBells;
                    break;
                case 16: // Dulcimer
                    result = this.defaultInstrumentSettings.tubularBells;
                    break;
                // *Organ*
                case 17: // Drawbar Organ
                case 18: // Percussive Organ
                case 19: // Rock Organ
                    result = this.defaultInstrumentSettings.rockOrgan;
                    break;
                case 20: // Church Organ
                case 21: // Reed Organ
                    result = this.defaultInstrumentSettings.organ;
                    break;
                case 22: // Accordion
                case 23: // Harmonica
                case 24: // Tango Accordion
                    result = this.defaultInstrumentSettings.accordion;
                    break;
                case 25: // *Guitar* Acoustic Guitar (nylon)
                    result = this.defaultInstrumentSettings.acoustic;
                    break;
                case 26: // Acoustic Guitar (steel)
                    result = this.defaultInstrumentSettings.acousticSteel;
                    break;
                case 27: // Electric Guitar (jazz)
                    result = this.defaultInstrumentSettings.acousticSteel;
                    break;
                case 28: // Electric Guitar (clean)
                    result = this.defaultInstrumentSettings.electroGuitarClean;
                    break;
                case 29: // Electric Guitar (muted)
                    result = this.defaultInstrumentSettings.acousticSteelMuted;
                    break;
                case 30: // Overdriven Guitar
                    result = this.defaultInstrumentSettings.electroGuitarOverdriven;
                    break;
                case 31: // Distortion Guitar
                    result = this.defaultInstrumentSettings.electroGuitarDistortion;
                    break;
                case 32: // Guitar harmonics
                    result = this.defaultInstrumentSettings.acousticHarmonics;
                    break;
                // Bass:
                case 33: // *Bass* Acoustic Bass
                case 34: // Electric Bass (finger)
                case 35: // Electric Bass (pick)
                case 36: // Fretless Bass
                    result = this.defaultInstrumentSettings.bass;
                    break;
                case 37: // Slap Bass 1
                case 38: // Slap Bass 2
                    result = this.defaultInstrumentSettings.pizzicatto;
                    break;
                case 39: // Synth Bass 1
                case 40: // Synth Bass 2
                    result = this.defaultInstrumentSettings.syntesatorTriangle;
                    break;
                case 41: // *Strings* Violin
                case 42: // Viola
                case 43: // Cello
                case 44: // Contrabass
                    result = this.defaultInstrumentSettings.violin;
                    break;
                case 45: // Tremolo Strings
                    result = this.defaultInstrumentSettings.violinTremolo;
                    break;
                case 46: // Pizzicato Strings
                    result = this.defaultInstrumentSettings.pizzicatto;
                    break;
                case 47: // Orchestral Harp
                    result = this.defaultInstrumentSettings.harp;
                    break;
                case 48: // Timpani
                    result = this.defaultInstrumentSettings.timpani;
                    break;
                case 49: // *Strings (continued)* String Ensemble 1
                case 50: // String Ensemble 2
                    result = this.defaultInstrumentSettings.orchestra;
                    break;
                case 51: // Synth Strings 1
                    result = this.defaultInstrumentSettings.syntesatorTriangle;
                    break;
                case 52: // Synth Strings 2
                    result = this.defaultInstrumentSettings.syntesatorSawtooth;
                    break;
                case 53: // Choir Aahs
                case 54: // Voice Oohs
                    result = this.defaultInstrumentSettings.chorus;
                    break;
                case 55: // Synth Voice
                    result = this.defaultInstrumentSettings.syntesatorSquare;
                    break;
                case 56: // Orchestra Hit
                    result = this.defaultInstrumentSettings.orchestra;
                    break;
                // *Brass*
                case 57: // Trumpet
                case 58: // Trombone
                case 59: // Tuba
                    result = this.defaultInstrumentSettings.pipe;
                    break;
                case 60: // Muted Trumpet
                    result = this.defaultInstrumentSettings.pipeMuted;
                    break;
                case 61: // French Horn
                case 62: // Brass Section
                case 63: // Synth Brass 1
                case 64: // Synth Brass 2
                    result = this.defaultInstrumentSettings.pipe;
                    break;
                // *Reed*
                case 65: // Soprano Sax
                case 66: // Alto Sax
                case 67: // Tenor Sax
                case 68: // Baritone Sax
                    result = this.defaultInstrumentSettings.saxophone;
                    break;
                case 69: // Oboe
                case 70: // English Horn
                case 71: // Bassoon
                case 72: // Clarinet
                    result = this.defaultInstrumentSettings.pipe;
                    break;
                case 73: // *Pipe* Piccolo
                case 74: // Flute
                case 75: // Recorder
                case 76: // Pan Flute
                    result = this.defaultInstrumentSettings.flute;
                    break;
                case 77: // Blown Bottle
                    result = this.defaultInstrumentSettings.blownBottle;
                    break;
                case 78: // Shakuhachi
                case 79: // Whistle
                case 80: // Ocarina
                    result = this.defaultInstrumentSettings.flute;
                    break;
                // *Synth Lead*
                case 81: // Lead 1 (square)
                    result = this.defaultInstrumentSettings.syntesatorSquare;
                    break;
                case 82: // Lead 2 (sawtooth)
                    result = this.defaultInstrumentSettings.syntesatorSawtooth;
                    break;
                case 83: // Lead 3 (calliope)
                    result = this.defaultInstrumentSettings.syntesatorTriangle;
                    break;
                case 84: // Lead 4 (chiff)
                    result = this.defaultInstrumentSettings.syntesatorSawtooth;
                    break;
                case 85: // Lead 5 (charang)
                    result = this.defaultInstrumentSettings.syntesatorTriangle;
                    break;
                case 86: // Lead 6 (voice)
                    result = this.defaultInstrumentSettings.syntesatorSquare;
                    break;
                case 87: // Lead 7 (fifths)
                    result = this.defaultInstrumentSettings.chorus;
                    break;
                case 88: // Lead 8 (bass + lead)
                    result = this.defaultInstrumentSettings.acousticHarmonics;
                    break;
                case 89: // *Synth Pad* Pad 1 (new age)
                    result = this.defaultInstrumentSettings.syntesatorSawtooth;
                    break
                case 90: // Pad 2 (warm)
                    result = this.defaultInstrumentSettings.syntesatorTriangle;
                    break;
                case 91: // Pad 3 (polysynth)
                    result = this.defaultInstrumentSettings.syntesatorSawtooth;
                    break;
                case 92: // Pad 4 (choir)
                    result = this.defaultInstrumentSettings.chorus;
                    break;
                case 93: // Pad 5 (bowed)
                case 94: // Pad 6 (metallic)
                    result = this.defaultInstrumentSettings.syntesatorSquare;
                    break;
                case 95: // Pad 7 (halo)
                case 96: // Pad 8 (sweep)
                    result = this.defaultInstrumentSettings.syntesatorSawtooth;
                    break;

                // *Synth Effects*
                case 97: // FX 1 (rain)
                    result = this.defaultInstrumentSettings.syntesatorTriangle;
                    break;
                case 98: // FX 2 (soundtrack)
                    result = this.defaultInstrumentSettings.tubularBells;
                    break;
                case 99: // FX 3 (crystal)
                    result = this.defaultInstrumentSettings.harp;
                    break;
                case 100: // FX 4 (atmosphere)
                    result = this.defaultInstrumentSettings.flute;
                    break;
                case 101: //FX 5 (brightness)
                    result = this.defaultInstrumentSettings.musicBox;
                    break;
                case 102: // FX 6 (goblins)
                    result = this.defaultInstrumentSettings.pipe;
                    break;
                case 103: // FX 7 (echoes)
                    result = this.defaultInstrumentSettings.saxophone;
                    break;
                case 104: // FX 8 (sci-fi)
                    result = this.defaultInstrumentSettings.marimba;
                    break;

                // *Ethnic*
                case 105: // Sitar
                case 106: // Banjo
                case 107: // Shamisen
                case 108: // Koto
                case 109: // Kalimba
                    result = this.defaultInstrumentSettings.acousticSteel;
                    break;
                case 110: // Bag pipe
                    result = this.defaultInstrumentSettings.pipe;
                    break;
                case 111: // Fiddle
                    result = this.defaultInstrumentSettings.violin;
                    break;
                case 112: // Shanai
                    result = this.defaultInstrumentSettings.flute;
                    break;
                // *Percussive*
                case 113: // Tinkle Bell
                    result = this.defaultInstrumentSettings.tubularBells;
                    break;
                case 114: // Agogo
                    result = this.defaultInstrumentSettings.marimba;
                    break;
                case 115: // Steel Drums
                    result = this.defaultInstrumentSettings.steelDrums;
                    break;
                case 116: // Woodblock
                    result = this.defaultInstrumentSettings.woodDrums;
                    break;
                case 117: // Taiko Drum
                    result = this.defaultInstrumentSettings.timpani;
                    break;
                case 118: // Melodic Tom
                    result = this.defaultInstrumentSettings.marimba;
                    break;
                case 119: // Synth Drum
                    result = this.defaultInstrumentSettings.electricDynamicDrum;
                    break; // <-----
                case 120: // *Sound effects* Reverse Cymbal
                    result = this.defaultInstrumentSettings.clap;
                    break;
                case 121: // Guitar Fret Noise
                case 122: // Breath Noise
                case 123: // Seashore
                case 124: // Bird Tweet
                    result = this.defaultInstrumentSettings.fxTremolo;
                    break;
                case 125: // Telephone Ring
                    result = this.defaultInstrumentSettings.fxTremolo2;
                    break;
                case 126: // Helicopter
                    result = this.defaultInstrumentSettings.fxHelicopter;
                    break;
                case 127: // Applause
                    result = this.defaultInstrumentSettings.fxApplause;
                    break;
                case 128: // Gunshot
                    result = this.defaultInstrumentSettings.clap;
                    break;
                default:
                    console.log(`default instrument with num: ${num}`);
                    result = this.defaultInstrumentSettings.grandPiano;
            }
            this.cachedRequest[num] = result;
        }
        console.log({num,note,name:result.name});
        return result;
    }

    public resetCache():void {
        this.cachedRequest = {};
    }

}
