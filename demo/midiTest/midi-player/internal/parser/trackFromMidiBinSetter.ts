import {ISetter} from "./iSetter";
import {INTERNAL_MIDI_COMMAND} from "../types";
import {parse_midi} from "./parser";

export class TrackFromMidiBinSetter implements ISetter{

    private lastEventSampleNum = 0;
    private numOfTracks = 0;

    constructor(private data:ArrayBuffer, private sampleRate: number,private sampleToCommandsMap: Record<number, INTERNAL_MIDI_COMMAND[]>) {
        this.run();
    }

    public getLastEventSampleNum(): number {
        return this.lastEventSampleNum;
    }

    public getNumOfTracks(): number {
        return this.numOfTracks;
    }

    private run(): void {
        const parsed = parse_midi(this.data);
        console.log(parsed);
        parsed.forEach(track=>{
            let noteFound = false;
            track.events.forEach(ev=>{

                const time = ev.absoluteTime;
                const sampleNum = ~~(time * this.sampleRate);
                if (!this.sampleToCommandsMap[sampleNum]) this.sampleToCommandsMap[sampleNum] = [];

                switch (ev.type) {
                    case 'noteOn': {
                        if (sampleNum>this.lastEventSampleNum) this.lastEventSampleNum = sampleNum;
                        this.sampleToCommandsMap[sampleNum].push({
                            opCode: 'noteOn',
                            channel: {
                                channelNumber: ev.channel!,
                            },
                            payload: {
                                note: ev.noteNumber!,
                                velocity: ev.velocity!/127,
                            }
                        });
                        noteFound = true;
                        break;
                    }
                    case 'programChange': {
                        this.sampleToCommandsMap[sampleNum].push({
                            opCode: ev.type,
                            channel: {
                                channelNumber: ev.channel!,
                            },
                            payload: {
                                instrumentNumber: ev.programNumber!
                            }
                        });
                        break;
                    }
                    case 'noteOff': {
                        if (sampleNum>this.lastEventSampleNum) this.lastEventSampleNum = sampleNum;
                        this.sampleToCommandsMap[sampleNum].push({
                            opCode: 'noteOff',
                            channel: {
                                channelNumber: ev.channel!,
                            },
                            payload: {
                                note: ev.noteNumber!,
                            }
                        });
                        noteFound = true;
                        break;
                    }
                    case 'pitchBend': {
                        this.sampleToCommandsMap[sampleNum].push({
                            opCode: ev.type,
                            channel: {
                                channelNumber: ev.channel!,
                            },
                            payload: {
                                pitchBend: ev.value!,
                            }
                        });
                        break;
                    }
                    case 'controller': { // https://cmtext.indiana.edu/MIDI/chapter3_controller_change2.php
                        if (
                            ev.controllerType===64 || // sustain pedal
                            ev.controllerType===65 || // Portamento On/Off
                            ev.controllerType===66 || // Sostenuto On/Off
                            ev.controllerType===67 || // Soft Pedal On/Off
                            ev.controllerType===68 || // Legato Footswitch
                            ev.controllerType===69 // Hold 2
                        ) {
                            this.sampleToCommandsMap[sampleNum].push({
                                opCode: ev.value===0?'pedalOff':'pedalOn',
                                channel: {
                                    channelNumber: ev.channel!,
                                }
                            });
                        }
                        else if (
                            ev.controllerType===7 || // channel volume
                            ev.controllerType===11 // expression controller
                        ) {
                            this.sampleToCommandsMap[sampleNum].push({
                                opCode: 'channelVelocity',
                                channel: {
                                    channelNumber: ev.channel!,
                                },
                                payload: {
                                    velocity: ev.value! / 127
                                }
                            });
                        }
                        else if (ev.controllerType===1) { //  modulation wheel
                            this.sampleToCommandsMap[sampleNum].push({
                                opCode: 'modulationWheel',
                                channel: {
                                    channelNumber: ev.channel!,
                                },
                                payload: {
                                    value: 4 * ev.value! / 127
                                }
                            });
                        }
                        else if (
                            ev.controllerType===10  ||   // pan
                            ev.controllerType===8        // balance
                        ) {
                            this.sampleToCommandsMap[sampleNum].push({
                                opCode: 'setPan',
                                channel: {
                                    channelNumber: ev.channel!,
                                },
                                payload: {
                                    value: ev.value! / 127
                                }
                            });
                        }
                        else if (ev.controllerType===120) { // All Sound Off
                            this.sampleToCommandsMap[sampleNum].push({
                                opCode: 'allSoundOff',
                            });
                        }
                        else if (ev.controllerType===123) { // All Sound Off
                            this.sampleToCommandsMap[sampleNum].push({
                                opCode: 'allNotesOff',
                            });
                        }
                        else {
                            console.log(`control with controllerType=${ev.controllerType} is not implemented (channel: ${ev.channel}, value: ${ev.value!})`);
                        }
                        break;
                    }
                }

                if (this.sampleToCommandsMap[sampleNum].length===0) delete this.sampleToCommandsMap[sampleNum];

            });
            if (noteFound) this.numOfTracks++;
        });
    }



}
