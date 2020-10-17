import {SlidingDicDecoder} from "./slidingDicDecoder";
import {arr} from "./utils";
import {LhaException} from "./lhaException";
import {LhaFileInputStream} from "./lhaFile";

/**
 *
 * @author Nobuyasu SUEHIRO <nosue@users.sourceforge.net>
 */
export abstract class LhDecoder extends SlidingDicDecoder {
    protected static readonly NPT:number = 0x80;
    protected static readonly NC:number =
        SlidingDicDecoder.UNSINGED_CHAR_MAX + SlidingDicDecoder.MAX_MATCH + 2 - SlidingDicDecoder.THRESHOLD;
    protected static readonly POSITION_TABLE_SIZE:number = 256;

    protected treeLeft:number[];
    protected treeRight:number[];
    protected positionTable:number[];
    protected positionLength:number[];


    constructor(_in:LhaFileInputStream, originalSize:number, dictionaryBit:number, positionAdjust:number) {
    super(_in, originalSize, dictionaryBit, positionAdjust);

    this.treeLeft = arr(2 * LhDecoder.NC - 1);
    this.treeRight = arr(2 * LhDecoder.NC - 1);
    this.positionTable = arr(LhDecoder.POSITION_TABLE_SIZE);
    this.positionLength = arr(LhDecoder.NPT);
}

    protected makeTable(nchar:number, bitLength:number[], tableBits:number, table:number[]){

    const countTable:number[] = arr(17);
    const weightTable:number[] = arr(17);
    const startTable:number[] = arr(17);
    let total:number;
    let j, k, m:number;

    for (let i:number = 1; i <= 16; ++i) {
        countTable[i] = 0;
        weightTable[i] = 1 << (16 - i);
    }

    for (let i:number = 0; i < nchar; ++i) {
        if (bitLength[i] > 16) {
            throw (new LhaException("Bad table."));
        }

        ++countTable[bitLength[i]];
    }

    total = 0;
    for (let i:number = 1; i <= 16; ++i) {
        startTable[i] = total;
        total += weightTable[i] * countTable[i];
    }

    if (((total & 0xffff) !== 0) || (tableBits > 16)) {
        throw (new LhaException("Bad table."));
    }

    m = 16 - tableBits;
    for (let i:number = 1; i <= tableBits; ++i) {
        startTable[i] >>>= m;
        weightTable[i] >>>= m;
    }

    j = startTable[tableBits + 1] >>> m;
    k = 1 << tableBits;
    if (k > 4096) {
        k = 4096;
    }
    if (j !== 0) {
        for (let i:number = j; i < k; ++i) {
            table[i] = 0;
        }
    }

    let avail:number = nchar;
    for (j = 0; j < nchar; ++j) {
        k = bitLength[j];
        if (k === 0) {
            continue;
        }

        let l:number = startTable[k] + weightTable[k];
        if (k <= tableBits) {
            if (l > 4096) {
                l = 4096;
            }
            for (let i:number = startTable[k]; i < l; ++i) {
                table[i] = j;
            }
        } else {
            let t:number[] = table;
            let start:number = startTable[k];
            let p:number = start >>> m;
            if (p > 4096) {
                throw (new LhaException("Bad table."));
            }
            start <<= tableBits;
            for (let n:number = k - tableBits; n > 0; --n) {
                if (t[p] === 0) {
                    this.treeRight[avail] = this.treeLeft[avail] = 0;
                    t[p] = avail++;
                }

                p = t[p];
                if ((start & 0x8000) !== 0) {
                    t = this.treeRight;
                } else {
                    t = this.treeLeft;
                }
                start <<= 1;
            }
            t[p] = j;
        }

        startTable[k] = l;
    }
}

}
