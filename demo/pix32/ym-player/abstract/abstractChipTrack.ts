
import {Optional} from "@engine/core/declarations";
import {Wave} from "../internal/wav";

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

export abstract class AbstractChipTrack {

    protected numOfFrames: number;
    protected frameFreq: number;
    protected interleavedOrder: boolean;
    protected songName: string;
    protected authorName: string;
    protected songComment: string;
    protected frames: tFrame[] = [];
    protected masterClock: number;

    protected currentFrameNumber: number = 0;
    protected periodA: number = 0;
    protected periodB: number = 0;
    protected periodC: number = 0;
    protected periodNoise: number = 0;
    protected volumeA: number = 0;
    protected envA: boolean = false;
    protected volumeB: number = 0;
    protected envB: boolean = false;
    protected volumeC: number = 0;
    protected envC: boolean = false;
    protected periodEnv: number = 0;
    protected attack: number = 0;
    protected hold: number = 0;
    protected alternate: number = 0;
    protected envStep: number = 0;
    protected countEnv: number = 0;
    protected holding: number = 0;
    protected volumeEnv: number = 0;
    protected divide: number = 15;
    protected countA: number = 0;
    protected outputA: number = 0;
    protected countB: number = 0;
    protected outputB: number = 0;
    protected countC: number = 0;
    protected outputC: number = 0;
    protected countNoise: number = 0;
    protected random: number = 1;
    protected outputNoise: number = 1;
    protected cA: number = 0;
    protected cB: number = 0;
    protected cC: number = 0;
    protected outA: number = 0;
    protected outB: number = 0;
    protected outC: number = 0;
    protected amplitudes: number[] = [0, 1, 2, 3, 4, 5, 6, 8, 10, 16, 22, 28, 36, 45, 53, 63];

    protected sampleRate: number = 44100; // 8000 44100


    private setCurrentFrame(frameNumber: number): void {
        const prefFrame = this.frames[this.currentFrameNumber];
        this.currentFrameNumber = frameNumber;
        const frame: tFrame = this.frames[frameNumber];
        for (let index: number = 0; index < 15; index++) {
            if (frame[index] !== prefFrame[index]) {
                const value = frame[index];
                frame[index] = value;
                switch (index) {
                    case 0:
                    case 1:
                        this.periodA = (frame[1] & 0xF) << 8 | frame[0];
                        break;
                    case 2:
                    case 3:
                        this.periodB = (frame[3] & 0xF) << 8 | frame[2];
                        break;
                    case 4:
                    case 5:
                        this.periodC = (frame[5] & 0xF) << 8 | frame[4];
                        break;
                    case 6:
                        this.periodNoise = (value & 0x1F) * 2;
                        break;
                    case 8:
                        this.volumeA = value & 0xF;
                        this.envA = ((value & 0x10) !== 0);
                        break;
                    case 9:
                        this.volumeB = value & 0xF;
                        this.envB = ((value & 0x10) !== 0);
                        break;
                    case 10:
                        this.volumeC = value & 0xF;
                        this.envC = ((value & 0x10) !== 0);
                        break;
                    case 11:
                    case 12:
                        this.periodEnv = (frame[12] << 8 | frame[11]) << 1;
                        break;
                    case 13:
                        this.attack = ((value & 0x4) === 0) ? 0 : 15;
                        if ((value & 0x8) === 0) {
                            this.hold = 1;
                            this.alternate = this.attack;
                        } else {
                            this.hold = value & 0x1;
                            this.alternate = value & 0x2;
                        }
                        this.envStep = 15;
                        this.countEnv = 15;
                        this.holding = 0;
                        this.volumeEnv = this.attack ^ 0xF;
                        break;
                }
            }
        }
    }

    // one processor cycle
    private cycle(): void {
        const frame: tFrame = this.frames[this.currentFrameNumber];
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
            const enable: number = frame[7];
            const enableA: number = (this.outputA | enable & 0x1) & (this.outputNoise | enable >> 3 & 0x1);
            const enableB: number = (this.outputB | enable >> 1 & 0x1) & (this.outputNoise | enable >> 4 & 0x1);
            const enableC: number = (this.outputC | enable >> 2 & 0x1) & (this.outputNoise | enable >> 5 & 0x1);
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

    public getFrameSnapshotByTime(timeMs: number): Optional<Readonly<tFrame>> {
        const timeForOneFrame: number = 1000 / this.frameFreq;
        const index: number = ~~(timeMs / timeForOneFrame);
        if (this.frames[index]) return this.frames[index];
        else return undefined;
    }


    public renderToBlob(): Blob {
        const pcmSamples: number[] = [];
        const samplesInFrame: number = this.sampleRate / this.frameFreq;
        const cyclesForOneSample: number = this.masterClock / this.sampleRate;

        for (let i: number = 0; i < this.frames.length; i++) {
            this.setCurrentFrame(i);
            for (let j: number = 0; j < samplesInFrame; j++) {
                for (let k: number = 0; k < cyclesForOneSample; k++) this.cycle();
                pcmSamples.push(~~((this.outA + this.outB) * 128 - 8192));
                pcmSamples.push((~~(this.outB + this.outC) * 128 - 8192));
            }
        }
        return Wave.encodeWAV(pcmSamples, this.sampleRate);
    }

    public renderToArrayBuffer(): Promise<ArrayBuffer> {
        const blob: Blob = this.renderToBlob();
        if (blob.arrayBuffer !== undefined) return blob.arrayBuffer();
        else return new Promise<ArrayBuffer>((resolve) => {
            const fr: FileReader = new FileReader();
            fr.onload = () => {
                resolve(fr.result as ArrayBuffer);
            };
            fr.readAsArrayBuffer(blob);
        })
    }

    public abstract getTrackInfo(): string;

}

