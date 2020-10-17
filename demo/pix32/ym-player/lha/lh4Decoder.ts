import {LhDecoder} from "./lhDecoder";
import {arr} from "./utils";
import {LhaFileInputStream} from "./lhaFile";

/**
 *
 * @author Nobuyasu SUEHIRO <nosue@users.sourceforge.net>
 */
export class Lh4Decoder extends LhDecoder {
    private static readonly UNSIGNED_SHORT_BIT: number = 16;
    private static readonly NT: number = Lh4Decoder.UNSIGNED_SHORT_BIT + 3;
    private static readonly TBIT: number = 5;
    private static readonly CBIT: number = 9;
    private static readonly CODE_TABLE_SIZE: number = 4096;

    private codeLength: number[];
    private codeTable: number[];

    private np: number;
    private positionBit: number;
    private blockSize: number;

    constructor(_in: LhaFileInputStream, originalSize: number, dictionaryBit: number, np: number, positionBit: number) {
        super(_in, originalSize, dictionaryBit, Lh4Decoder.OFFSET);

        this.codeLength = arr(Lh4Decoder.NC);
        this.codeTable = arr(Lh4Decoder.CODE_TABLE_SIZE);

        this.np = np;
        this.positionBit = positionBit;
        this.blockSize = 0;
    }

    protected initRead(): void {
        this.fillBitBuffer(2 * Lh4Decoder.CHAR_BIT);
    }

    protected decodeCode(): number {
        if (this.blockSize === 0) {
            this.blockSize = this.getBits(16);
            this.readPositionLength(Lh4Decoder.NT, Lh4Decoder.TBIT, 3);
            this.readCodeLength();
            this.readPositionLength(this.np, this.positionBit, -1);
        }

        --this.blockSize;
        let j: number = this.codeTable[this.bitBuffer >>> (16 - 12)];

        if (j < Lh4Decoder.NC) {
            this.fillBitBuffer(this.codeLength[j]);
        } else {
            this.fillBitBuffer(12);
            let mask: number = 1 << (16 - 1);
            do {
                if ((this.bitBuffer & mask) !== 0) {
                    j = this.treeRight[j];
                } else {
                    j = this.treeLeft[j];
                }

                mask >>>= 1;
            } while ((j >= Lh4Decoder.NC) && ((mask !== 0) || (j !== this.treeLeft[j])));

            this.fillBitBuffer(this.codeLength[j] - 12);
        }

        return (j);
    }

    protected decodePosition(): number {
        let j: number = this.positionTable[this.bitBuffer >>> (16 - 8)];

        if (j < this.np) {
            this.fillBitBuffer(this.positionLength[j]);
        } else {
            this.fillBitBuffer(8);

            let mask: number = 1 << (16 - 1);
            do {
                if ((this.bitBuffer & mask) !== 0) {
                    j = this.treeRight[j];
                } else {
                    j = this.treeLeft[j];
                }

                mask >>>= 1;
            } while ((j >= this.np) && ((mask !== 0) || (j !== this.treeLeft[j])));

            this.fillBitBuffer(this.positionLength[j] - 8);
        }

        if (j !== 0) {
            j = ((1 << (j - 1)) + this.getBits(j - 1));
        }

        return (j);
    }

    private readPositionLength(nn: number, nbit: number, i_special: number): void {
        const n: number = this.getBits(nbit);
        if (n === 0) {
            const c: number = this.getBits(nbit);

            for (let i: number = 0; i < nn; ++i) {
                this.positionLength[i] = 0;
            }

            for (let i: number = 0; i < Lh4Decoder.POSITION_TABLE_SIZE; ++i) {
                this.positionTable[i] = c;
            }
        } else {
            let i: number = 0;
            const max: number = n < Lh4Decoder.NPT ? n : Lh4Decoder.NPT;
            while (i < max) {
                let c: number = this.bitBuffer >>> (16 - 3);
                if (c !== 7) {
                    this.fillBitBuffer(3);
                } else {
                    let mask: number = 1 << (16 - 4);
                    while ((mask & this.bitBuffer) !== 0) {
                        mask >>>= 1;
                        ++c;
                    }
                    this.fillBitBuffer(c - 3);
                }

                this.positionLength[i++] = c;

                if (i === i_special) {
                    c = this.getBits(2);
                    while ((--c >= 0) && (i < Lh4Decoder.NPT)) {
                        this.positionLength[i++] = 0;
                    }
                }
            }

            while (i < nn) {
                this.positionLength[i++] = 0;
            }

            this.makeTable(nn, this.positionLength, 8, this.positionTable);
        }
    }

    private readCodeLength(): void {
        const n: number = this.getBits(Lh4Decoder.CBIT);
        if (n === 0) {
            const c: number = this.getBits(Lh4Decoder.CBIT);
            for (let i: number = 0; i < Lh4Decoder.NC; ++i) {
                this.codeLength[i] = 0;
            }

            for (let i: number = 0; i < Lh4Decoder.CODE_TABLE_SIZE; ++i) {
                this.codeTable[i] = c;
            }
        } else {
            let i: number = 0;
            const max: number = n < Lh4Decoder.NC ? n : Lh4Decoder.NC;
            while (i < max) {
                let c: number = this.positionTable[this.bitBuffer >>> (16 - 8)];
                if (c >= Lh4Decoder.NT) {
                    let mask: number = 1 << (16 - 9);
                    do {
                        if ((this.bitBuffer & mask) !== 0) {
                            c = this.treeRight[c];
                        } else {
                            c = this.treeLeft[c];
                        }

                        mask >>>= 1;
                    } while ((c >= Lh4Decoder.NT) && ((mask !== 0) || (c !== this.treeLeft[c])));
                }

                this.fillBitBuffer(this.positionLength[c]);

                if (c <= 2) {
                    if (c === 0) {
                        c = 1;
                    } else if (c === 1) {
                        c = this.getBits(4) + 3;
                    } else {
                        c = this.getBits(Lh4Decoder.CBIT) + 20;
                    }

                    while (--c >= 0) {
                        this.codeLength[i++] = 0;
                    }
                } else {
                    this.codeLength[i++] = c - 2;
                }
            }

            while (i < Lh4Decoder.NC) {
                this.codeLength[i++] = 0;
            }

            this.makeTable(Lh4Decoder.NC, this.codeLength, 12, this.codeTable);
        }
    }

}
