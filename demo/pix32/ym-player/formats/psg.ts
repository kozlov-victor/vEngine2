import {AbstractChipTrack, tFrame} from "../abstract/abstractChipTrack";
import {BinBuffer} from "../internal/binBuffer";

export class Psg extends AbstractChipTrack {

    private readonly buffer:BinBuffer;

    private versionNumber:Uint8;

    constructor(arr:number[]|ArrayBuffer) {
        super();
        this.buffer = new BinBuffer(arr);
        this.read();
    }

    getTrackInfo(): string {
        return "";
    }

    private read():void {
        const psg = this.buffer.readString(3);
        const PSG = 'PSG' as const;
        if (psg!==PSG) throw new Error(`wrong header: ${psg}, expecting: '${PSG}`);

        const enfOfTExtMarker = this.buffer.readUInt8();
        const MARKER = 0x1A as const;
        if (enfOfTExtMarker!==MARKER) throw new Error(`wrong end-of-text marker: ${enfOfTExtMarker}, expecting: ${MARKER.toString(16)}`);
        this.versionNumber = this.buffer.readUInt8();
        this.buffer.readUInt8(); // player frequency for Player frequency (for versions 10+)
        this.buffer.readUints8(10); // skip this block
        const rawData = this.buffer.getRestUints8();
        let i = 0;
        while (i<rawData.length) {
            const frame:tFrame =
                this.frames.length>0?
                [...this.frames[this.frames.length-1]]:
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            this.frames.push(frame);
            while (rawData[i]<0xFF) {
                if  (rawData[i]==0xFE) {
                    i++;
                    const toSkip = rawData[i];
                    for (let i=0;i<toSkip*4;i++) {
                        this.frames.push([...this.frames[this.frames.length-1]]);
                    }
                    break;
                }
                Psg.ay_out(rawData[i],rawData[i+1],frame);
                i++;
                i++;
            }
            i++;
        }
        this.numOfFrames = this.frames.length;
        // https://documentation.help/AY-3-8910.12-ZX-Spectrum-ru/ay_r9zqf.htm
        this.frameFreq = 50; // БК interruption frequency
        // emulator https://zxart.ee/eng/music/database/rating:4/format:VTX/sortParameter:votes/sortOrder:rand/resultsType:zxitem/
        this.masterClock = 2000000; // БК-0010 processor frequency (3mHz, but 2 is more similar to original sound from emulator )
    }

    private static ay_out(port:Uint8, data:Uint8, frame:Uint8[]):void {
        if (port>16) {
            return;
        }
        frame[port] = data;
    }


}
