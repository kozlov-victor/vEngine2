import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";

export abstract class Program {

    private instructions:number[];

    public getInstructions() {
        return this.instructions;
    }

    protected readInstructions(raf:RandomAccessFile, count: number):void {
        this.instructions = new Array(count);
        for (let i = 0; i < count; i++) {
            this.instructions[i] = raf.readUnsignedByte();
        }
    }

    // protected readInstructions(bais:ByteArrayInputStream, count: number) {
    //     this.instructions = new Array(count);
    //     for (let i = 0; i < count; i++) {
    //         this.instructions[i] = bais.read();
    //     }
    // }
}
