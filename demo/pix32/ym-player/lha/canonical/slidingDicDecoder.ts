import {LhaDecoder} from "./lhaDecoder";
import {arr, arraycopy} from "./utils";
import {LhaFileInputStream} from "./lhaFile";

/**
 *
 * @author Nobuyasu SUEHIRO <nosue@users.sourceforge.net>
 */
export abstract class SlidingDicDecoder implements LhaDecoder {
    static readonly OFFSET: number = 0x100 - 3;
    static readonly UNSINGED_CHAR_MAX: number = 255;
    static readonly CHAR_BIT: number = 8;
    static readonly THRESHOLD: number = 3;
    static readonly MAX_MATCH: number = 256;

    protected _in: LhaFileInputStream;
    protected originalSize: number;
    protected decodeCount: number;

    protected positionAdjust: number;
    protected dictionarySize: number;
    protected dictionaryMask: number;
    protected dictionaryBuffer: number[];
    protected bufferPointerBegin: number;
    protected bufferPointerEnd: number;

    protected bitBuffer: number;
    protected subBitBuffer: number;
    protected bitCount: number;

    protected needInitialRead: boolean;


    constructor(_in: LhaFileInputStream, originalSize: number, dictionaryBit: number, positionAdjust: number) {
        this._in = _in;
        this.originalSize = originalSize;
        this.decodeCount = 0;

        this.positionAdjust = positionAdjust;
        this.dictionarySize = 1 << dictionaryBit;
        this.dictionaryMask = this.dictionarySize - 1;
        this.dictionaryBuffer = arr(this.dictionarySize);
        this.bufferPointerBegin = 0;
        this.bufferPointerEnd = 0;

        this.bitBuffer = 0;
        this.subBitBuffer = 0;
        this.bitCount = 0;

        this.needInitialRead = true;
    }

    public close(): void {
    }

    /**
     *
     */
    public read(b: number[], off: number, len: number): number {
        if (this.needInitialRead) {
            this.initRead();
            this.needInitialRead = false;
        }

        const sl: number = len;
        const rs: number = this.bufferPointerEnd - this.bufferPointerBegin;

        if (rs < 0) {
            const bl: number = this.dictionarySize - this.bufferPointerBegin;

            if (bl >= len) {
                arraycopy(this.dictionaryBuffer, this.bufferPointerBegin, b, off, len);
                this.bufferPointerBegin += len;
                if (this.bufferPointerBegin === this.dictionarySize) {
                    this.bufferPointerBegin = 0;
                }

                return (sl);
            } else {
                arraycopy(this.dictionaryBuffer, this.bufferPointerBegin, b, off, bl);
                off += bl;
                len -= bl;
                this.bufferPointerBegin = 0;

                if (this.bufferPointerEnd >= len) {
                    arraycopy(this.dictionaryBuffer, 0, b, off, len);
                    this.bufferPointerBegin = len;
                    return (sl);
                } else if (this.bufferPointerEnd !== 0) {
                    arraycopy(this.dictionaryBuffer, 0, b, off, this.bufferPointerEnd);
                    off += this.bufferPointerEnd;
                    len -= this.bufferPointerEnd;
                    this.bufferPointerBegin = this.bufferPointerEnd;
                }
            }
        } else if (rs >= len) {
            arraycopy(this.dictionaryBuffer, this.bufferPointerBegin, b, off, len);
            this.bufferPointerBegin += len;
            return (sl);
        } else if (rs !== 0) {
            arraycopy(this.dictionaryBuffer, this.bufferPointerBegin, b, off, rs);
            off += rs;
            len -= rs;
            this.bufferPointerBegin = this.bufferPointerEnd;
        }

        if (this.originalSize <= this.decodeCount) {
            const l: number = sl - len;
            return l > 0 ? l : -1;
        }

        while ((this.decodeCount < this.originalSize) && (len > 0)) {
            const c: number = this.decodeCode();
            if (c <= SlidingDicDecoder.UNSINGED_CHAR_MAX) {
                ++this.decodeCount;
                --len;
                ++this.bufferPointerBegin;
                this.dictionaryBuffer[this.bufferPointerEnd++] = b[off++] = c; // todo (byte)c
                if (this.bufferPointerEnd === this.dictionarySize) {
                    this.bufferPointerBegin = this.bufferPointerEnd = 0;
                }
            } else {
                const matchLength: number = c - this.positionAdjust;
                const matchOffset: number = this.decodePosition();
                const matchPosition: number = (this.bufferPointerEnd - matchOffset - 1) & this.dictionaryMask;
                this.decodeCount += matchLength;

                for (let k: number = 0; k < matchLength; ++k) {
                    // todo (byte) (dictionaryBuffer[])
                    const t = this.dictionaryBuffer[(matchPosition + k) & this.dictionaryMask] & 0xFF;
                    this.dictionaryBuffer[this.bufferPointerEnd++] = t;
                    if (len > 0) {
                        --len;
                        ++this.bufferPointerBegin;
                        if (this.bufferPointerBegin === this.dictionarySize) {
                            this.bufferPointerBegin = 0;
                        }
                        b[off++] = t;
                    }

                    if (this.bufferPointerEnd === this.dictionarySize) {
                        this.bufferPointerEnd = 0;
                    }
                }
            }
        }

        return (sl - len);
    }


    protected fillBitBuffer(n: number): void {
        while (n > this.bitCount) {
            n -= this.bitCount;
            this.bitBuffer = (this.bitBuffer << this.bitCount)
                + (this.subBitBuffer >>> (SlidingDicDecoder.CHAR_BIT - this.bitCount));

            const c: number = this._in.read();
            this.subBitBuffer = (c > 0) ? c : 0;
            this.bitCount = SlidingDicDecoder.CHAR_BIT;
        }

        this.bitCount -= n;
        this.bitBuffer = ((this.bitBuffer << n) + (this.subBitBuffer >>> (SlidingDicDecoder.CHAR_BIT - n))) & 0xFFFF;
        this.subBitBuffer = (this.subBitBuffer << n) & 0x00FF;
    }


    protected getBits(n: number): number {
        const x: number = this.bitBuffer >>> (2 * SlidingDicDecoder.CHAR_BIT - n);
        this.fillBitBuffer(n);
        return (x);
    }

    protected abstract decodeCode(): number;
    protected abstract  decodePosition():number;
    protected abstract   initRead(): void;
}
