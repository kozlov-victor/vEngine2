import {LhaDecoder} from "./lhaDecoder";
import {Checksum} from "./checksum";
import {CRC16} from "./CRC16";
import {arr} from "./utils";
import {LhaException} from "./lhaException";
import {Lh1Decoder} from "./lh1Decoder";
import {LhaEntry} from "./lhaEntry";
import {Lh4Decoder} from "./lh4Decoder";
import {LhdDecoder} from "./lhdDecoder";
import {NocompressDecoder} from "./nocompressDecoder";
import {LzsDecoder} from "./lzsDecoder";
import {Lz5Decoder} from "./lz5Decoder";
import {LhaFileInputStream} from "./lhaFile";

export class LhaDecoderInputStream {

    /**
     * Creates a new lha input stream.
     *
     * @param _in
     *            the actual input stream
     * @param entry
     *            the lha entry of current input stream
     */
    constructor(_in:LhaFileInputStream, entry:LhaEntry) {
        this.entry = entry;
        this.crc = new CRC16();
        this.skipBuffer = arr(LhaDecoderInputStream.SIZE_SKIP_BUFFER);

        this.entryCount = entry.getOriginalSize();
        this.decoder = LhaDecoderInputStream.createDecorder(_in, this.entryCount, entry.getMethod());

        this.crc.reset();
    }
    private static readonly SIZE_SKIP_BUFFER:number = 512;

    protected decoder:LhaDecoder;
    protected entry:LhaEntry;
    protected crc:Checksum;
    protected skipBuffer:number[];
    protected entryCount:number;

    /**
     * Creates a new decoder for input stream.
     */
    private static createDecorder(_in:LhaFileInputStream, originalSize:number, method:string):LhaDecoder {
        if (method===(LhaEntry.METHOD_SIG_LHD)) {
            return (new LhdDecoder());
        } else if (method===LhaEntry.METHOD_SIG_LH0) {
            return (new NocompressDecoder(_in, originalSize));
        } else if (method===LhaEntry.METHOD_SIG_LH1) {
            return (new Lh1Decoder(_in, originalSize));
        } else if (method===LhaEntry.METHOD_SIG_LH2) {
            throw (new LhaException("Unsupported method: " + method));
        } else if (method===LhaEntry.METHOD_SIG_LH3) {
            throw (new LhaException("Unsupported method: " + method));
        } else if (method===LhaEntry.METHOD_SIG_LH4) {
            return (new Lh4Decoder(_in, originalSize, 12, 14, 4));
        } else if (method===LhaEntry.METHOD_SIG_LH5) {
            return (new Lh4Decoder(_in, originalSize, 13, 14, 4));
        } else if (method===LhaEntry.METHOD_SIG_LH6) {
            return (new Lh4Decoder(_in, originalSize, 15, 16, 5));
        } else if (method===LhaEntry.METHOD_SIG_LH7) {
            return (new Lh4Decoder(_in, originalSize, 16, 17, 5));
        } else if (method===LhaEntry.METHOD_SIG_LZS) {
            return (new LzsDecoder(_in, originalSize));
        } else if (method===LhaEntry.METHOD_SIG_LZ4) {
            return (new NocompressDecoder(_in, originalSize));
        } else if (method===LhaEntry.METHOD_SIG_LZ5) {
            return (new Lz5Decoder(_in, originalSize));
        }

        throw (new LhaException("Unknown method: " + method));
    }

    /**
     * Gets the checksum of input stream.
     *
     * @return the checksum of input stream
     */
    public getChecksum():Checksum {
        return (this.crc);
    }

    /**
     * Returns 0 after EOF has reached for the current entry data, otherwise
     * always return 1. Programs should not count on this method to return the
     * actual number of bytes that could be read without blocking.
     *
     * @return 1 before EOF and 0 after EOF has reached for input stream.
     * @throws IOException
     *             if an I/O error has occurred
     */
    public available():number {
        if (this.decoder === null) {
            return 0;
        }
        return (this.entryCount > 0 ? 1 : 0);
    }

    /**
     * Reads from the input stream.
     *
     * @param pos
     *            the offset in lha file
     * @return the next byte of data, or <code>-1</code> if the end of the
     *         stream is reached
     * @throws IOException
     *             if an I/O error has occurred
     */
    public read():number {
        if (this.decoder === null) {
            return -1;
        }

        const b:number[] = arr(1);
        const n:number = this.decoder.read(b, 0, 1);
        if (n > 0) {
            this.crc.update(b[0]);
            --this.entryCount;
        }

        return (b[0]);
    }

    public toArray():number[]{
        const res:number[] = [];
        while (this.available()) res.push(this.read());
        return res;
    }

    /**
     * Reads from the input stream into an array of bytes.
     *
     * @param pos
     *            the offset in lha file
     * @param b
     *            the buffer into which the data is read
     * @param off
     *            the start offset in array <code>b</code> at which the data
     *            is written
     * @param len
     *            the maximum number of bytes to read
     * @return the total number of bytes read into the buffer, or
     *         <code>-1</code> if there is no more data because the end of the
     *         stream has been reached
     * @throws IOException
     *             if an I/O error has occurred
     */
    public read_2(b:number[], off:number, len:number):number {
        if (this.decoder === null) {
            return (-1);
        }

        const n:number = this.decoder.read(b, off, len);
        if (n > 0) {
            this.crc.update_2(b, off, n);
            this.entryCount -= n;
        }

        return (n);
    }

    /**
     * Returns 0 after EOF has reached for the input stream, otherwise always
     * return 1. Programs should not count on this method to return the actual
     * number of bytes that could be read without blocking.
     *
     * @param n
     *            the number of bytes to skip
     * @return the actual number of bytes skipped
     * @throws IOException
     *             if an I/O error has occurred
     */
    public skip(n:number):number  {
        if (n <= 0) {
            return (0);
        }

        if (n > Number.MAX_VALUE) {
            n = Number.MAX_VALUE;
        }
        let total:number = 0;
        while (total < n) {
            let len = n - total;
            if (len > this.skipBuffer.length) {
                len = this.skipBuffer.length;
            }

            len = this.read_2(this.skipBuffer, 0, len);
            if (len === -1) {
                break;
            } else {
                this.crc.update_2(this.skipBuffer, 0, len);
            }

            total += len;
        }

        this.entryCount -= total;
        return (total);
    }

    /**
     * Closes the input stream.
     *
     * @throws IOException
     *             if an I/O error has occured
     */
    public close():void {
        if (this.decoder !== null) {
            this.decoder.close();
            // tslint:disable-next-line:no-null-keyword
            this.decoder = null!;
            // tslint:disable-next-line:no-null-keyword
            this.entry = null!;
            // tslint:disable-next-line:no-null-keyword
            this.crc = null!;
        }
    }

    /**
     * Reads out the current input stream, check crc, closes the current input
     * stream.
     *
     * @throws IOException
     *             if an I/O error has occured
     */
    public  closeEntry():void {
        const skipCount:number = this.skip(this.entryCount);
        if (this.entryCount !== skipCount) {
            throw new LhaException("Data length not matched");
        }

        if ((this.entry.hasCRC()) && (this.entry.getCRC() !== this.crc.getValue())) {
            throw new LhaException("Data crc is not matched");
        }
        this.close();
    }


}
