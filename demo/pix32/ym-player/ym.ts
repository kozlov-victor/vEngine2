import {BinBuffer} from "./internal/binBuffer";
import {LhaFile} from "./lha/lhaFile";
import {Wave} from "./internal/wav";
import {Optional} from "@engine/core/declarations";

const LEONARD = '!LeOnArD!' as const;
const END = 'End!' as const;

export type tFrame = [
    r0:number,r1:number,
    r2:number,r3:number,
    r4:number,r5:number,
    r6:number,r7:number,
    r8:number,r9:number,
    r10:number,r11:number,
    r12:number,r13:number,
    r14:number,r15:number
];


export class Ym {
    private buffer:BinBuffer;

    private numOfFrames:number;
    private frameFreq:number;
    private interleavedOrder:boolean;
    private songName:string;
    private authorName:string;
    private songComment:string;
    private rawFrames:number[];
    private frames:tFrame[] = [];

    private masterClock:number;

    constructor(arr:number[]|ArrayBuffer) {
        const bb:BinBuffer = new BinBuffer(arr);
        if (bb.readString(2)==='YM') { // this is uncompressed file
           this.read(bb.getArray());
        } else { // lha-compressed
            bb.resetPointer();
            const lhaFile:LhaFile = new LhaFile(bb);
            const body:number[] = lhaFile.getInputStreamByIndex(0).toArray();
            this.read(body);
        }

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

    private currentFrameNumber:number = 0;
    private periodA:number = 0;
    private periodB:number = 0;
    private periodC:number = 0;
    private periodNoise:number = 0;
    private volumeA:number = 0;
    private envA:boolean = false;
    private volumeB:number = 0;
    private envB:boolean = false;
    private volumeC:number = 0;
    private envC:boolean = false;
    private periodEnv:number = 0;
    private attack:number = 0;
    private hold:number = 0;
    private alternate:number = 0;
    private envStep:number = 0;
    private countEnv:number = 0;
    private holding:number = 0;
    private volumeEnv:number = 0;
    private divide:number = 15;
    private countA:number = 0;
    private outputA:number = 0;
    private countB:number = 0;
    private outputB:number = 0;
    private countC:number = 0;
    private outputC:number = 0;
    private countNoise:number = 0;
    private random:number = 1;
    private outputNoise:number = 1;
    private cA:number = 0;
    private cB:number = 0;
    private cC:number = 0;
    private outA:number = 0;
    private outB:number = 0;
    private outC:number = 0;
    private amplitudes:number[] = [0, 1, 2, 3, 4, 5, 6, 8, 10, 16, 22, 28, 36, 45, 53, 63];

    private sampleRate:number = 44100; // 8000 44100

    private setCurrentFrame(frameNumber:number):void{
        this.currentFrameNumber = frameNumber;
        const frame = this.frames[frameNumber];
        this.periodA = (frame[1] & 0xF) << 8 | frame[0];
        this.periodB = (frame[3] & 0xF) << 8 | frame[2];
        this.periodC = (frame[5] & 0xF) << 8 | frame[4];
        this.periodNoise = (frame[6] & 0x1F) * 2;
        this.volumeA = frame[8] & 0xF;
        this.envA = ((frame[8] & 0x10) !== 0);
        this.volumeB = frame[9] & 0xF;
        this.envB = ((frame[9] & 0x10) !== 0);
        this.volumeC = frame[10] & 0xF;
        this.envC = ((frame[10] & 0x10) !== 0);
        this.periodEnv = (frame[12] << 8 | frame[11]) << 1;

        this.attack = ((frame[13] & 0x4) === 0) ? 0 : 15;
        if ((frame[13] & 0x8) === 0) {
            this.hold = 1;
            this.alternate = this.attack;
        } else {
            this.hold = frame[13] & 0x1;
            this.alternate = frame[13] & 0x2;
        }
        // this.envStep = 15;
        // this.countEnv = 15;
        // this.holding = 0;
        this.volumeEnv = this.attack ^ 0xF;

    }

    // one processor cycle
    private cycle():void {
        const frame = this.frames[this.currentFrameNumber];
        if (this.divide === 0) {
            this.divide = 7;
            if (++this.countA >= this.periodA) {
                this.countA = 0;
                this.outputA ^= 0x1;
            }
            if (++this.countB >= this.periodB) {
                this.countB = 0;
                this.outputB ^= 0x1;
            }
            if (++this.countC >= this.periodC) {
                this.countC = 0;
                this.outputC ^= 0x1;
            }
            if (++this.countNoise >= this.periodNoise) {
                this.countNoise = 0;
                if ((this.random + 1 & 0x2) !== 0) this.outputNoise ^= 0x1;
                if ((this.random & 0x1) !== 0) this.random ^= 0x24000;
                this.random >>= 1;
            }
            const enable = frame[7];
            const enableA = (this.outputA | enable & 0x1) & (this.outputNoise | enable >> 3 & 0x1);
            const enableB = (this.outputB | enable >> 1 & 0x1) & (this.outputNoise | enable >> 4 & 0x1);
            const enableC = (this.outputC | enable >> 2 & 0x1) & (this.outputNoise | enable >> 5 & 0x1);
            if (this.holding === 0 && ++this.countEnv >= this.periodEnv) {
                this.countEnv = 0;
                if (this.envStep === 0) {
                    if (this.hold !== 0) {
                        if (this.alternate !== 0) this.attack ^= 0xF;
                        this.holding = 1;
                    } else {
                        if (this.alternate !== 0) this.attack ^= 0xF;
                        this.envStep = 15;
                    }
                } else {
                    this.envStep--;
                }
            }
            this.volumeEnv = this.envStep ^ this.attack;
            this.cA = enableA * (this.envA ? this.volumeEnv : this.volumeA);
            this.cB = enableB * (this.envB ? this.volumeEnv : this.volumeB);
            this.cC = enableC * (this.envC ? this.volumeEnv : this.volumeC);
            this.outA = this.amplitudes[this.cA];
            this.outB = this.amplitudes[this.cB];
            this.outC = this.amplitudes[this.cC];
            this.outB = ~~(this.outB * 0.75);
        } else {
            this.divide--;
        }
    }

    public getFrameSnapshotByTime(timeMs:number):Optional<Readonly<tFrame>>{
        const timeForOneFrame:number = 1000/this.frameFreq;
        const index:number = ~~(timeMs/timeForOneFrame);
        if (this.frames[index]) return this.frames[index];
        else return undefined;
    }

    public renderToBlob():Blob{
        const pcmSamples:number[] = [];
        const samplesInFrame:number = this.sampleRate/this.frameFreq;
        const cyclesForOneSample:number = this.masterClock/this.sampleRate;

        for (let i:number=0;i<this.frames.length;i++) {
            this.setCurrentFrame(i);
            for (let j:number = 0; j < samplesInFrame; j++) {
                for (let k:number=0;k<cyclesForOneSample;k++) this.cycle();
                pcmSamples.push(~~((this.outA + this.outB) * 128 - 8192));
                pcmSamples.push((~~(this.outB + this.outC) * 128 - 8192));
            }
        }
        return Wave.encodeWAV(pcmSamples,this.sampleRate);
    }

    public renderToArrayBuffer():Promise<ArrayBuffer> {
        const blob:Blob = this.renderToBlob();
        if (blob.arrayBuffer!==undefined) return blob.arrayBuffer();
        else return new Promise<ArrayBuffer>((resolve) => {
            const fr:FileReader = new FileReader();
            fr.onload = () => {
                resolve(fr.result as ArrayBuffer);
            };
            fr.readAsArrayBuffer(blob);
        })
    }

}
