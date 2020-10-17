
import {BinBuffer} from "./binBuffer";
export class Wave {

    public static encodeWAV(samples:number[],sampleRate:number):Blob {

        const binBuffer:BinBuffer = new BinBuffer(44 + samples.length * 2);
        binBuffer.writeString('RIFF');
        binBuffer.writeUInt32(32 + samples.length * 2, true);
        binBuffer.writeString('WAVE');
        binBuffer.writeString('fmt ');
        binBuffer.writeUInt32(16, true);
        binBuffer.writeUInt16(1, true);
        binBuffer.writeUInt16(2, true);
        binBuffer.writeUInt32(sampleRate, true);
        binBuffer.writeUInt32(sampleRate * 4, true);
        binBuffer.writeUInt16(4, true);
        binBuffer.writeUInt16(16, true);
        binBuffer.writeString('data');
        binBuffer.writeUInt32(samples.length * 2, true);

        for (let i:number = 0; i < samples.length; i++) {
            const s:number = Math.max(-1, Math.min(1, samples[i])) - 1;
            binBuffer.writeUInt16(~~(s*0x7fff), true);
        }

        return new Blob([binBuffer.getView()], {type: 'audio/wav'});
    }

}
