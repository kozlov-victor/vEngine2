

// LH4, LHA (-lh4-) extractor, no crc/sum-checks
// Erland Ranvinge (erland.ranvinge@gmail.com)
// Based on a mix of Nobuyasu Suehiro's Java implementation and Simon Howard's C version.
// Hacked by Matt Westcott to unpack raw LHA streams rather than LZH archive files, and
//  support lh5 mode

export class LhaArrayReader {

    public static readonly SeekAbsolute = 0 as const;
    public static readonly SeekRelative = 1 as const;

    offset:number = 0;
    subOffset:number = 7;

    public constructor(private buffer:number[]) {
    }

    public readBits(bits:number):number {
        const bitMasks = [1, 2, 4, 8, 16, 32, 64, 128] as const;
        let byt:number = this.buffer[this.offset];
        let result:number = 0;
        for (let bitIndex:number = 0; bitIndex < bits; bitIndex++) {
            const bit:number = (byt & bitMasks[this.subOffset]) >> this.subOffset;
            result <<= 1;
            result = result | bit;
            this.subOffset--;
            if (this.subOffset < 0) {
                if (this.offset + 1 >= this.buffer.length)
                    return -1;

                byt = this.buffer[++this.offset];
                this.subOffset = 7;
            }
        }
        return result;
    }

    private readUInt8():number {
        if (this.offset + 1 >= this.buffer.length) return -1;
        return this.buffer[this.offset++];
    }

    private readUInt16():number {
        if (this.offset + 2 >= this.buffer.length)
            return -1;
        const value:number =
            (this.buffer[this.offset] & 0xFF) |
            ((this.buffer[this.offset+1] << 8) & 0xFF00);
        this.offset += 2;
        return value;
    }

    private readUInt32():number {
        if (this.offset + 4 >= this.buffer.length)
            return -1;
        const value:number =
            (this.buffer[this.offset] & 0xFF) |
            ((this.buffer[this.offset+1] << 8) & 0xFF00) |
            ((this.buffer[this.offset+2] << 16) & 0xFF0000) |
            ((this.buffer[this.offset+3] << 24) & 0xFF000000);
        this.offset += 4;
        return value;
    }

    private readString(size:number):string|-1 {
        if (this.offset + size >= this.buffer.length)
            return -1;
        let result = '';
        for (let i:number = 0; i < size; i++)
            result += String.fromCharCode(this.buffer[this.offset++]);
        return result;
    }

    public readLength():number{
        let length:number = this.readBits(3);
        if (length === -1)
            return -1;

        if (length === 7) {
            while (this.readBits(1) !== 0) {
                length++;
            }
        }
        return length;
    }

    public seek(offset:number, mode:0|1){
        switch (mode) {
            case LhaArrayReader.SeekAbsolute:
                this.offset = offset;
                this.subOffset = 7;
                break;
            case LhaArrayReader.SeekRelative:
                this.offset += offset;
                this.subOffset = 7;
                break;
        }
    }

    private getPosition():number {
        return this.offset;
    }


}


class LhaArrayWriter {

    public offset:number = 0;
    public data:Uint8Array = new Uint8Array(this.size);

    constructor(public size:number) {
    }

    public write(data:number):void{
        this.data[this.offset++] = data;
    }

}

class LhaTree {

    private static readonly LEAF:number = (1 << 15);

    private tree:number[] = [];
    private nextEntry:number;
    private allocated:number;

    public setConstant(code:number):void {
        this.tree[0] = code | LhaTree.LEAF;
    }

    public expand(){
        const endOffset:number = this.allocated;
        while (this.nextEntry < endOffset) {
            this.tree[this.nextEntry] = this.allocated;
            this.allocated += 2;
            this.nextEntry++;
        }
    }

    public addCodesWithLength(codeLengths:number[], codeLength:number):boolean{
        let done:boolean = true;
        for (let i:number = 0; i < codeLengths.length; i++) {
            if (codeLengths[i] === codeLength) {
                const node:number = this.nextEntry++;
                this.tree[node] = i | LhaTree.LEAF;
            } else if (codeLengths[i] > codeLength) {
                done = false;
            }
        }
        return done;
    }

    public build(codeLengths:number[], size:number):void{
        this.tree = [];
        for (let i:number = 0; i < size; i++)
            this.tree[i] = LhaTree.LEAF;

        this.nextEntry = 0;
        this.allocated = 1;
        let codeLength:number = 0;
        do {
            this.expand();
            codeLength++;
        } while (!this.addCodesWithLength(codeLengths, codeLength));
    }

    public readCode(reader:LhaArrayReader):number {
        let code:number = this.tree[0];
        while ((code & LhaTree.LEAF) === 0) {
            const bit = reader.readBits(1);
            code = this.tree[code + bit];
        }
        return code & ~LhaTree.LEAF;
    }

}


class LhaRingBuffer {

    private data:number[] = [];
    private offset:number = 0;

    constructor(private size:number) {
    }

    public add(value:number):void{
        this.data[this.offset] = value;
        this.offset = (this.offset + 1) % this.size;
    }

    public get(offset:number, length:number):number[] {
        const pos = this.offset + this.size - offset - 1;
        const result = [];
        for (let i = 0; i < length; i++) {
            const code = this.data[(pos + i) % this.size];
            result.push(code);
            this.add(code);
        }
        return result;
    }


}

export class LhaReader {

    private offsetTree:LhaTree = new LhaTree();
    private codeTree:LhaTree = new LhaTree();
    private ringBuffer:LhaRingBuffer;

    constructor(private reader:LhaArrayReader, mode:'lh4'|'lh5') {
        if (mode === 'lh4') {
            this.ringBuffer = new LhaRingBuffer(1 << 13);
        } else if (mode === 'lh5') {
            this.ringBuffer = new LhaRingBuffer(1 << 14);
        } else {
            throw new Error('mode must be either lh4 or lh5');
        }
    }

    public readCodeTable(){
        const reader:LhaArrayReader = this.reader;
        const codeCount:number = Math.min(reader.readBits(9), 510);
        if (codeCount <= 0) {
            const constant = reader.readBits(9);
            this.codeTree.setConstant(constant);
            return;
        }
        const codeLengths:number[] = [];
        for (let i:number = 0; i < codeCount; ) {
            const code:number = this.offsetTree.readCode(reader);
            if (code <= 2) {
                let skip:number = 1;
                if (code === 1)
                    skip = reader.readBits(4) + 3;
                else if (code === 2)
                    skip = reader.readBits(9) + 20;
                while (--skip >= 0) {
                    codeLengths.push(0);
                    i++;
                }
            } else {
                codeLengths.push(code - 2);
                i++;
            }
        }
        this.codeTree.build(codeLengths, 510 * 2);
    }

    public readTempTable():void{
        const reader:LhaArrayReader = this.reader;
        const codeCount:number = Math.min(reader.readBits(5), 19);
        if (codeCount <= 0) {
            const constant:number = reader.readBits(5);
            this.offsetTree.setConstant(constant);
            return;
        }
        const codeLengths:number[] = [];
        for (let i:number = 0; i < codeCount; i++) {
            const codeLength:number = reader.readLength();
            codeLengths.push(codeLength);
            if (i === 2) { // The dreaded special bit that no-one (including me) seems to understand.
                let length:number = reader.readBits(2);
                while (length-- > 0) {
                    codeLengths.push(0);
                    i++;
                }
            }
        }
        this.offsetTree.build(codeLengths, 19 * 2);
    }

    public readOffsetTable():void {
        const reader:LhaArrayReader = this.reader;
        const codeCount:number = Math.min(reader.readBits(4), 14);
        if (codeCount <= 0) {
            const constant:number = reader.readBits(4);
            this.offsetTree.setConstant(constant);
            return;
        } else {
            const codeLengths:number[] = [];
            for (let i = 0; i < codeCount; i++) {
                codeLengths[i] = reader.readLength();
            }
            this.offsetTree.build(codeLengths, 19 * 2);
        }
    }

    public extract(offset:number, originalSize:number):Uint8Array{
        this.reader.seek(offset, LhaArrayReader.SeekAbsolute);
        const writer:LhaArrayWriter = new LhaArrayWriter(originalSize);
        while (this.extractBlock(writer)) {}
        return writer.data;
    }

    private extractBlock(writer:LhaArrayWriter):boolean{
        const reader:LhaArrayReader = this.reader;
        const blockSize = reader.readBits(16);
        if (blockSize <= 0) {// || reader.offset >= reader.size
            return false;
        }

        this.readTempTable();
        this.readCodeTable();
        this.readOffsetTable();

        for (let i:number = 0; i < blockSize; i++) {
            const code:number = this.codeTree.readCode(reader);
            if (code < 256) {
                this.ringBuffer.add(code);
                writer.write(code);
            } else {
                const bits:number = this.offsetTree.readCode(reader);
                let offset:number = bits;
                if (bits >= 2) {
                    offset = reader.readBits(bits - 1);
                    offset = offset + (1 << (bits - 1));
                }

                const length:number = code - 256 + 3;
                const chunk:number[] = this.ringBuffer.get(offset, length);
                for (const j of chunk) writer.write(j);
            }
        }
        return true;
    }

}

