import {BinBuffer} from "./internal/binBuffer";
import {LhaArrayReader, LhaReader} from "./lha/lhaDecoderLight";
import {AbstractChipTrack} from "./abstract/abstractChipTrack";


export class Vtx extends AbstractChipTrack {

    private buffer:BinBuffer;

    constructor(arr:number[]|ArrayBuffer) {
        super();
        this.read(arr);
    }

    private read(arr:number[]|ArrayBuffer){
        this.buffer = new BinBuffer(arr);
        // https://github.com/demozoo/cowbell/blob/master/cowbell/ay_chip/vtx_player.js
        // https://documentation.help/AY-3-8910.12-ZX-Spectrum/ay_e0irc.htm
        const format:string = this.buffer.readString(2);
        if(['ym','ay'].indexOf(format)===-1) throw new Error(`unsupported format:${format}`);

        // Playing mode by default:
        // Bits 0-2 determine stereo mode:
        // 0 – MONO, 1 – ABC, 2 – ACB, 3 – BAC,
        // 4 – BCA, 5 – CAB, 6 – CBA (dec)
        const stereoMode:number = this.buffer.readByte();
        if (stereoMode>6) throw new Error(`bad stereo mode: ${stereoMode}`);

        //  Loop VBL number (from zero =
        //  beginning of melody).
        this.buffer.readUInt16(true);

        // AY chip frequency for this melody
        this.masterClock = this.buffer.readUInt32(true); // YM master clock implementation in Hz
        if (this.masterClock<100000 || this.masterClock>100000000) throw new Error(`wrong master clock frequency (${this.masterClock})`);

        // Player frequency (VBL per sec)
        this.frameFreq = this.buffer.readByte(); // todo

        // Year of composition creating
        const year = this.buffer.readUInt16(true);
        console.log(year);

        // Size of not packed data
        const unpackedSize:number = this.buffer.readUInt32(true);

        this.songName = this.buffer.readNTString();
        this.authorName = this.buffer.readNTString();
        this.songComment = this.buffer.readNTString();
        const comment1:string = this.buffer.readNTString();
        const comment2:string = this.buffer.readNTString();

        console.log(this.songName);
        console.log(this.authorName);
        console.log(this.songComment);
        console.log(comment1);
        console.log(comment2);

        this.interleavedOrder = true;

        const lha:LhaReader = new LhaReader(new LhaArrayReader(this.buffer.getArray()), 'lh5');
        if (unpackedSize % 14>0) throw new Error(`wrong unpacked length: ${unpackedSize},unpacked data must be mod of 14`);
        const unpackedData:Uint8Array = lha.extract(this.buffer.getPointer(), unpackedSize);

        const streamLength:number = unpackedSize / 14;
        this.numOfFrames = streamLength;
        let lastEnvelopeVal:number = 0;
        for (let i:number = 0; i < this.numOfFrames; i++) {
            this.frames[i] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        }
        for (let i:number = 0; i < streamLength; i++) {
            for (let chan:number = 0; chan < 14; chan++) {
                const val:number = unpackedData[chan * streamLength + i];
                if (chan < 13) {
                    this.frames[i][chan] = val;
                } else {
                    if (val === 0xff) {
                        this.frames[i][13] = lastEnvelopeVal;
                        this.frames[i][14] = 0;
                    } else {
                        this.frames[i][13] = val;
                        lastEnvelopeVal = val;
                        this.frames[i][14] = 1;
                    }
                }
            }
        }

    }

}
