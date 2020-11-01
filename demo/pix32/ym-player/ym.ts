import {BinBuffer} from "./internal/binBuffer";
import {LhaFile} from "./lha/lhaFile";
import {AbstractChipTrack} from "./abstract/abstractChipTrack";

const LEONARD = '!LeOnArD!' as const;
const END = 'End!' as const;


export class Ym extends AbstractChipTrack {

    private buffer:BinBuffer;
    private rawFrames:number[];

    constructor(arr:number[]|ArrayBuffer) {
        super();
        const bb:BinBuffer = new BinBuffer(arr);
        if (bb.readString(2)==='YM') { // this is uncompressed file
           this.readyBody(bb.getArray());
        } else { // lha-compressed
            bb.resetPointer();
            const lhaFile:LhaFile = new LhaFile(bb);
            const body:number[] = lhaFile.getInputStreamByIndex(0).toArray();
            this.readyBody(body);
        }
        this.readFrames();
    }

    private readyBody(arr:number[]){
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

}
