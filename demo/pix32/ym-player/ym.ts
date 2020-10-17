
import {Wave} from "./internal/wav";
import {BinBuffer} from "./internal/binBuffer";
import {LhaFile} from "./lha/lhaFile";
import {isArray, isCommonArray} from "@engine/misc/object";

const LEONARD = '!LeOnArD!' as const;
const END = 'End!' as const;



const periodVoiceA = 1 as const;
const finePeriodVoiceA = 0 as const;
const periodVoiceB = 3 as const;
const finePeriodVoiceB = 2 as const;
const periodVoiceC = 5 as const;
const finePeriodVoiceC = 4 as const;
const noisePeriod = 6 as const;
const mixerControl = 7 as const;
const volumeControlA = 8 as const;
const volumeControlB = 9 as const;
const volumeControlC = 10 as const;
const envelopePeriod = 11 as const;
const envelopePeriodFine = 12 as const;
const envelopeShape = 13 as const;
const extendedData1 = 14 as const;
const extendedData2 = 15 as const;


class Oscillator {


    constructor() {

    }

    public sin(fr:number, t:number):number {
        return Math.sin((2.0 * Math.PI * t * fr));
    }

    public noise(fr:number,t:number):number {
        return 0.5*Math.random()+0.5*this.sin(fr,t);
    }

    public square(fr:number, t:number):number {
        const sample:number = this.sin(fr, t);
        return  sample < 0 ? -1 : 1;
    }

    public triangle(fr:number, t:number):number {
        return this.sin(fr, t) + 1 / 9 * this.sin(3 * fr, t) + 1 / 25 * this.sin(5 * fr, t);
    }

}

export class YM {

    private buffer:BinBuffer;

    private numOfFrames:number;
    private frameFreq:number;
    private interleavedOrder:boolean;
    private songName:string;
    private authorName:string;
    private songComment:string;
    private rawFrames:number[];
    private frames:[
        r0:number,r1:number,
        r2:number,r3:number,
        r4:number,r5:number,
        r6:number,r7:number,
        r8:number,r9:number,
        r10:number,r11:number,
        r12:number,r13:number,
        r14:number,r15:number,
    ][] = [];

    private oscillator:Oscillator = new Oscillator();

    private masterClock:number;

    constructor(arr:number[]|ArrayBuffer) {
        const bb:BinBuffer = new BinBuffer(arr);
        const lhaFile:LhaFile = new LhaFile(bb);
        const frames:number[] = lhaFile.getInputStreamByIndex(0).toArray();
        this.read(frames);
        this.readFrames();
    }

    private read(arr:number[]){
        this.buffer = new BinBuffer(arr);
        const format:string = this.buffer.readString(3);
        if(['YM6','YM5'].indexOf(format)===-1) throw new Error(`unsupported format:${format}`);
        if (this.buffer.readString(LEONARD.length)!==LEONARD) throw new Error(`bad header: expected "${LEONARD}" magic string`);

        this.numOfFrames = this.buffer.readUInt32();
        const attrs:number = this.buffer.readUInt32(); // attributes
        this.interleavedOrder = BinBuffer.isBitSet(0,attrs);
        const numOfDigiDrums:number = this.buffer.readUInt16(); // Nb of digidrum samples in file (can be 0)
        this.masterClock = this.buffer.readUInt32(); // YM master clock implementation in Hz
        if (this.masterClock<100000 || this.masterClock>100000000) throw new Error(`wrong master clock frequency (${this.masterClock})`);

        this.frameFreq = this.buffer.readUInt16();
        this.buffer.skip(4); // Loop frame (traditionnaly 0 to loop at the beginning)
        this.buffer.readUInt16(); // Size, in bytes, of future additionnal data. You have to skip these bytes. (always 0 for the moment)

        // Then, for each digidrum: (nothing if no digidrum)
        for (let i:number=0;i<numOfDigiDrums;i++) {
            const sampleSize:number = this.buffer.readUInt32();
            this.buffer.skip(sampleSize);
        }

        this.songName = this.buffer.readNTString();
        this.authorName = this.buffer.readNTString();
        this.songComment = this.buffer.readNTString();
        this.rawFrames = this.buffer.readBytes(this.numOfFrames*16);

        const terminator:string = this.buffer.readString(4);
        if (terminator!==END) throw new Error(`unexpected file terminator: ${terminator}`);
    }


    private readFrames(){
        if (!this.interleavedOrder) throw new Error(`non interleaved frames are not supported`);
        for (let i = 0; i < this.numOfFrames; i++) {
            this.frames[i] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        }
        let cnt:number=0;
        for (let r:number=0;r<16;r++) {
            for (let i = 0;i < this.numOfFrames; i++) {
                this.frames[i][r] = this.rawFrames[cnt++];
            }
        }
        if (cnt!==this.rawFrames.length) throw new Error(`frame reading error,expected to read ${this.rawFrames.length}, but ${cnt} is read`);
    }

    private calcSampleFromRegisters(registers:number[],
        time:number
    ):[a:number,b:number,c:number]{

        // ((this.regs[1] & 0xF) << 8 | this.regs[0]);
        const periodA:number = ((registers[periodVoiceA] & 0xF) << 8) | registers[finePeriodVoiceA];
        let frA:number = 0;
        if (periodA!==0) frA = this.masterClock/(16*periodA);

        let frB:number = 0;
        const periodB:number = ((registers[periodVoiceB] & 0xF) << 8) | registers[finePeriodVoiceB];
        if (periodB!==0) frB = this.masterClock/(16*periodB);

        let frC:number = 0;
        const periodC:number = ((registers[periodVoiceC] & 0xF) << 8) | registers[finePeriodVoiceC];
        if (periodC!==0) frC = this.masterClock/(16*periodC);

        const isLevelFixedA:boolean = !BinBuffer.isBitSet(5,registers[volumeControlA]);
        const isLevelFixedB:boolean = !BinBuffer.isBitSet(5,registers[volumeControlB]);
        const isLevelFixedC:boolean = !BinBuffer.isBitSet(5,registers[volumeControlC]);

        const envelopePer:number = (registers[envelopePeriod]*0xff+registers[envelopePeriodFine])/32;
        const envelopeFr:number = this.masterClock/(256*envelopePer);
        const envelopeSample:number = this.oscillator.sin(envelopeFr,time);

        const levelA:number = isLevelFixedA?(registers[volumeControlA]&0b111111)/0b111111:envelopeSample;
        const levelB:number = isLevelFixedB?(registers[volumeControlB]&0b111111)/0b111111:envelopeSample;
        const levelC:number = isLevelFixedC?(registers[volumeControlC]&0b111111)/0b111111:envelopeSample;

        const noisePer:number = registers[noisePeriod]&0b11111;
        let noiseFr:number = 0;
        if (noisePer!==0) noiseFr = this.masterClock/(16*noisePer);
        let sampleNoise = 0;
        if (noiseFr!==0) sampleNoise = this.oscillator.noise(noiseFr,time);

        const mixerChannelA:boolean = !BinBuffer.isBitSet(0,registers[mixerControl]);
        const mixerChannelB:boolean = !BinBuffer.isBitSet(1,registers[mixerControl]);
        const mixerChannelC:boolean = !BinBuffer.isBitSet(2,registers[mixerControl]);

        const mixerNoiseA:boolean = !BinBuffer.isBitSet(3,registers[mixerControl]);
        const mixerNoiseB:boolean = !BinBuffer.isBitSet(4,registers[mixerControl]);
        const mixerNoiseC:boolean = !BinBuffer.isBitSet(5,registers[mixerControl]); // todo 5?

        const sampleA:number = this.oscillator.square(frA,time);
        const sampleB:number = this.oscillator.square(frB,time);
        const sampleC:number = this.oscillator.square(frC,time);

        let resultA:number = 0, resultB:number = 0, resultC:number = 0;
        if (mixerNoiseA && mixerChannelA) resultA = (sampleA+sampleNoise)/2;
        else if (mixerNoiseA) resultA = sampleNoise;
        else if (mixerChannelA) resultA = sampleA;

        if (mixerNoiseB && mixerChannelB) resultB = (sampleB+sampleNoise)/2;
        else if (mixerNoiseB) resultB = sampleNoise;
        else if (mixerChannelB) resultB = sampleB;

        if (mixerNoiseC && mixerChannelC) resultC = (sampleC+sampleNoise)/2;
        else if (mixerNoiseC) resultC = sampleNoise;
        else if (mixerChannelC) resultC = sampleC;

        resultA*=levelA;
        resultB*=levelB;
        resultC*=levelC;

        return [resultA,resultB,resultC];
    }

    public renderToBlob():Blob{
        const sampleRate:number = 8000; // 44100
        const pcmSamples:number[] = [];
        let currSample:number=0;
        const frameTime:number = 1000/this.frameFreq;
        const samplesInFrame = sampleRate/this.frameFreq;
        const sampleTime:number = 1000/sampleRate;

        let time:number;
        for (let i:number=0;i<this.frames.length;i++) {
            const frame:number[] = this.frames[i];
            for (let j:number = 0; j < samplesInFrame; j++) {
                time = currSample/sampleRate;
                const s: [a:number,b:number,c:number] = this.calcSampleFromRegisters(frame, time);
                pcmSamples.push((s[0]+s[1])/2);
                pcmSamples.push(s[2]);
                currSample++;
            }
        }
        return Wave.encodeWAV(pcmSamples,sampleRate);
    }

    public renderToObjectUrl():string{
        return URL.createObjectURL(this.renderToBlob());
    }

    public renderToAudio():HTMLAudioElement{
        const audio:HTMLAudioElement = document.createElement('audio');
        audio.src = this.renderToObjectUrl();
        return audio;
    }

}
