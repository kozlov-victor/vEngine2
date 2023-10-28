import {IMidiJson, INTERNAL_MIDI_COMMAND} from "../types";
import {ISetter} from "./iSetter";

export class TrackFromJsonSetter implements ISetter {

    private lastEventSampleNum:number = 0;
    private numOfTracks:number = 0;

    constructor(private midiJson:IMidiJson, private sampleRate: number,private sampleToCommandsMap: Record<number, INTERNAL_MIDI_COMMAND[]>) {
        this.run();
    }

    private run():void {
        this.numOfTracks = 0;
        this.midiJson.tracks.forEach(t=>{
            if (!t.notes?.length) return;
            this.numOfTracks++;
            this.setTrackNotes(t);
            this.setPitchBandEvents(t);
            this.setPedalEvents(t);
        });
    }

    private setTrackNotes(t:IMidiJson['tracks'][0]) {
        t.notes?.forEach(n=>{

            //if ([27,28,29,30,31].includes(instrumentNumber)) {

            const percussion = t.isPercussion===true || t.instrument?.family === 'drums';
            const channelNumber = t.channelNumber ?? t.channel ?? 0;

            const noteOnTime = n.time;
            const noteOnSampleNum = ~~(noteOnTime * this.sampleRate);
            if (!this.sampleToCommandsMap[noteOnSampleNum]) this.sampleToCommandsMap[noteOnSampleNum] = [];
            this.sampleToCommandsMap[noteOnSampleNum].push({
                opCode: 'noteOn',
                channel: {
                    channelNumber
                },
                payload: {
                    note: n.midi,
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
                },
                payload: {
                    note: n.midi,
                }
            });
            if (noteOffSampleNum>this.lastEventSampleNum) this.lastEventSampleNum = noteOffSampleNum;
            //}
        });
    }

    private setPitchBandEvents(t:IMidiJson['tracks'][0]):void {
        t.pitchBends?.forEach(p=>{
            const noteOnTime = p.time;
            const channelNumber = t.channelNumber ?? t.channel ?? 0;
            const sampleNum = ~~(noteOnTime * this.sampleRate);
            if (!this.sampleToCommandsMap[sampleNum]) this.sampleToCommandsMap[sampleNum] = [];
            this.sampleToCommandsMap[sampleNum].push({
                opCode: 'pitchBend',
                channel: {
                    channelNumber,
                },
                payload: {
                    pitchBend:  p.value
                }
            });
        })
    }

    private setPedalEvents(t:IMidiJson['tracks'][0]):void {
        const pedalControlNumbers = [64];
        const pedalEvents:({time:number,value:number})[] = [];
        pedalControlNumbers.forEach(n=>{
            if (t.controlChanges?.[`${n}`]!==undefined) {
                pedalEvents.push(...t.controlChanges[`${n}`]);
            }
        });
        pedalEvents.forEach(p=>{
            const eventTime = p.time;
            const channelNumber = t.channelNumber ?? t.channel ?? 0;
            const sampleNum = ~~(eventTime * this.sampleRate);
            const opCode = p.value===0?'pedalOff':'pedalOn';
            if (!this.sampleToCommandsMap[sampleNum]) this.sampleToCommandsMap[sampleNum] = [];
            this.sampleToCommandsMap[sampleNum].push({
                opCode,
                channel: {
                    channelNumber,
                }
            });
        })
    }

    public getNumOfTracks():number {
        return this.numOfTracks;
    }

    public getLastEventSampleNum():number {
        return this.lastEventSampleNum;
    }

}
