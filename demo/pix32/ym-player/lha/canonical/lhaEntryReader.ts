import {Checksum} from "./checksum";
import {CRC16} from "./CRC16";
import {LhaEntry} from "./lhaEntry";
import {arr} from "./utils";
import {LhaException} from "./lhaException";
import {Sum} from "./sum";

/**
 * This is a abstract class for used to unpack a lha header.<br>
 * <br>
 * Supports level 0,1,2 header format.<br>
 * Does'nt support header search.<br>
 *
 * @author Nobuyasu SUEHIRO <nosue@users.sourceforge.net>
 */
export abstract class LhaEntryReader {

    /**
     * Creates a lha header reader.
     *
     * @param encoding file/directory name encoding
     */
    constructor(encoding: string) {
        this.encoding = encoding;

        this.calcSum = new Sum();
        this.calcCRC = new CRC16();
    }
    /** File path separator : ms-dos,windows */
    protected static readonly HD_CHR_DELIM_MSDOS: string = '\\';
    /** File path separator : unix */
    protected static readonly HD_CHR_DELIM_UNIX: string = '/';
    /** File path separator : macintosh */
    protected static readonly HD_CHR_DELIM_MAC: string = ':';
    /** File path separator : generic */
    protected static readonly HD_CHR_DELIM_EXTRA: number = 0xFF;

    /** Union header size and level field offset */
    protected static readonly HDRU_SIZE: number = 21;

    /** Union header field offset : header size */
    protected static readonly HDRU_OFF_HEADERSIZE: number = 0;
    /** Union header field offset : header level */
    protected static readonly HDRU_OFF_LVL: number = 20;

    /** Level 0 header field offset : header check sum */
    protected static readonly HDR0_OFF_SUM: number = 1;
    /** Level 0 header field offset : method signature */
    protected static readonly HDR0_OFF_METHOD: number = 2;
    /** Level 0 header field offset : compressed file size */
    protected static readonly HDR0_OFF_COMPSIZE: number = 7;
    /** Level 0 header field offset : original file size */
    protected static readonly HDR0_OFF_ORIGSIZE: number = 11;
    /** Level 0 header field offset : time stamp (ms-dos format) */
    protected static readonly HDR0_OFF_TIMESTAMP: number = 15;
    /** Level 0 header field offset : file attribute (ms-dos format) */
    protected static readonly HDR0_OFF_FILEATTR: number = 19;

    /** Level 1 header field offset : header check sum */
    protected static readonly HDR1_OFF_SUM: number = 1;
    /** Level 1 header field offset : method signature */
    protected static readonly HDR1_OFF_METHOD: number = 2;
    /** Level 1 header field offset : skip size */
    protected static readonly HDR1_OFF_SKIPSIZE: number = 7;
    /** Level 1 header field offset : original file size */
    protected static readonly HDR1_OFF_ORIGSIZE: number = 11;
    /** Level 1 header field offset : time stamp (ms-dos format) */
    protected static readonly HDR1_OFF_TIMESTAMP: number = 15;
    /** Level 1 header field offset : constant value (0x20) */
    protected static readonly HDR1_OFF_19: number = 19;

    /** Level 2 header field offset : method signature */
    protected static readonly HDR2_OFF_METHOD: number = 2;
    /** Level 2 header field offset : compressed file size */
    protected static readonly HDR2_OFF_COMPSIZE: number = 7;
    /** Level 2 header field offset : original file size */
    protected static readonly HDR2_OFF_ORIGSIZE: number = 11;
    /** Level 2 header field offset : time stamp unix format) */
    protected static readonly HDR2_OFF_TIMESTAMP: number = 15;
    /** Level 2 header field offset : reserved */
    protected static readonly HDR2_OFF_RESERVED: number = 19;

    /** Header level signature : level 0 */
    protected static readonly HDR_SIG_LVL0: number = 0x00;
    /** Header level signature : level 1 */
    protected static readonly HDR_SIG_LVL1: number = 0x01;
    /** Header level signature : level 2 */
    protected static readonly HDR_SIG_LVL2: number = 0x02;

    protected static readonly HD_STR_METHOD_ENCODING: string = "US-ASCII";

    protected encoding: string;
    protected srcSum: number;
    protected srcCRC: number;
    protected calcSum: Checksum;
    protected calcCRC: Checksum;
    protected flagSum: boolean;
    protected flagCRC: boolean;
    protected fileName: string = "";
    protected dirName: string = "";


    private static _strFromChars(array: number[], from: number, length: number): string {
        let res: string = '';
        for (let i: number = 0; i < length; i++) {
            const code: number = array[i+from];
            res += String.fromCharCode(code);
        }
        return res;
    }

    /**
     * Fetches unsigned 16-bit value from byte array at specified offset. The
     * bytes are assumed to be in Intel (little-endian) byte order.
     */
    private static get16(b: number[], off: number): number {
        return ((b[off] & 0xFF) | ((b[off + 1] & 0xFF) << 8));
    }

    /**
     * Fetches unsigned 32-bit value from byte array at specified offset. The
     * bytes are assumed to be in Intel (little-endian) byte order.
     */
    private static get32(b: number[], off: number): number {
        return (LhaEntryReader.get16(b, off) | (LhaEntryReader.get16(b, off + 2) << 16));
    }

    /**
     * Reads a lha header infomation.
     *
     * @return a lha entry
     * @throws LhaException
     *             if a lha format error has occurred
     * @throws IOException
     *             if an I/O error has occurred
     */
    public readHeader(): LhaEntry|null {
        const base: number[] = arr(LhaEntryReader.HDRU_SIZE);

        this.calcSum.reset();
        this.calcCRC.reset();
        this.flagSum = false;
        this.flagCRC = false;
        this.fileName = "";
        this.dirName = "";

        const n: number = this._read(base);
        if ((n <= 0) || ((n === 1) && (base[LhaEntryReader.HDRU_OFF_HEADERSIZE] === 0))) {
            // tslint:disable-next-line:no-null-keyword
            return null;

        } else if (n !== LhaEntryReader.HDRU_SIZE) {
            throw (new LhaException("header is broken (header size does'nt match)"));
        }

        let e: LhaEntry;
        switch (base[LhaEntryReader.HDRU_OFF_LVL]) {
            case LhaEntryReader.HDR_SIG_LVL0:
                e = this.readHeader_Lv0(base);
                break;

            case LhaEntryReader.HDR_SIG_LVL1:
                e = this.readHeader_Lv1(base);
                break;

            case LhaEntryReader.HDR_SIG_LVL2:
                e = this.readHeader_Lv2(base);
                break;

            default:
                throw (new LhaException("Unsupported Lha header level: " + base[LhaEntryReader.HDRU_OFF_LVL]));
        }

        // if ((e.getMethod()==LhaEntry.METHOD_SIG_LHD)
        //     && (e.getFile().getPath().length() == 0)) {
        //     throw (new LhaException("Lha header is broken (file name length is zero)"));
        // }

        if (this.flagSum && (this.srcSum !== this.calcSum.getValue())) {
            throw (new LhaException("Lha header is broken (header check sum doesn't match)"));
        }

        if (this.flagCRC && (this.srcCRC !== this.calcCRC.getValue())) {
            throw (new LhaException("Lha header is broken (header crc doesn't match"));
        }

        return (e);
    }


    /**
     * Reads a level 0 lha header infomation.
     *
     * @param base
     *            readed datas for judge header type
     * @return a lha entry
     * @throws LhaException
     *             if a lha format error has occurred
     * @throws IOException
     *             if an I/O error has occurred
     */
    protected readHeader_Lv0(base: number[]): LhaEntry {
        const e: LhaEntry = new LhaEntry();

        this.flagSum = true;

        const headerSize: number = base[LhaEntryReader.HDRU_OFF_HEADERSIZE];
        this.srcSum = base[LhaEntryReader.HDR0_OFF_SUM];
        if (this.srcSum < 0) {
            this.srcSum += 256;
        }
        //e.setMethod(new String(base, LhaEntryReader.HDR0_OFF_METHOD, 5, LhaEntryReader.HD_STR_METHOD_ENCODING));
        e.setMethod(LhaEntryReader._strFromChars(base, LhaEntryReader.HDR0_OFF_METHOD, 5));

        e.setCompressedSize(LhaEntryReader.get32(base, LhaEntryReader.HDR0_OFF_COMPSIZE));
        e.setOriginalSize(LhaEntryReader.get32(base, LhaEntryReader.HDR0_OFF_ORIGSIZE));
        e.setDosTimeStamp(LhaEntryReader.get32(base, LhaEntryReader.HDR0_OFF_TIMESTAMP));

        this.calcSum.update_2(base, 2, base.length - 2);

        let buf: number[] = arr(1);
        if (this._read(buf) !== buf.length) {
            throw (new LhaException("Lha header is broken (header size does'nt match)"));
        }
        const nameSize: number = buf[0];
        this.calcSum.update_2(buf, 0, buf.length);

        buf = arr(nameSize);
        if (this._read(buf) !== buf.length) {
            throw (new LhaException("Lha header is broken (cannot read name)"));
        }
        //String name = new String(buf, encoding);
        const name: string = String.fromCharCode(...buf);
        this.calcSum.update_2(buf, 0, buf.length);

        const diff: number = headerSize - nameSize;
        if ((diff !== 20) && (diff !== 22) && (diff < 23)) {
            throw (new LhaException("Lha header is broken (header size does'nt match)"));
        }

        e.setOS(LhaEntry.OSID_SIG_GENERIC);

        if (diff >= 22) {
            buf = arr(2);
            if (this._read(buf) !== buf.length) {
                throw (new LhaException("Lha header is broken (cannot read crc value)"));
            }
            e.setCRC(LhaEntryReader.get16(buf, 0));
            this.calcSum.update_2(buf, 0, buf.length);
        }

        if (diff >= 23) {
            buf = arr(1);
            if (this._read(buf) !== buf.length) {
                throw (new LhaException("Lha header is broken (cannot read os signature)"));
            }
            e.setOS(buf[0]);
            this.calcSum.update_2(buf, 0, buf.length);
        }

        if (diff > 23) {
            buf = arr(diff - 24);
            if (this._read(buf) !== buf.length) {
                throw (new LhaException("Lha header is broken (cannot read ext)"));
            }
            this.calcSum.update_2(buf, 0, buf.length);
        }

        e.setFile(this.convertFilePath(name, e.getOS()));

        return (e);
    }

    /**
     * Reads a level 1 lha header infomation.
     *
     * @param base
     *            readed datas for judge header type
     * @return a lha entry
     * @throws LhaException
     *             if a lha format error has occurred
     * @throws IOException
     *             if an I/O error has occurred
     */
    protected  readHeader_Lv1(base: number[]): LhaEntry {
        const e: LhaEntry = new LhaEntry();

        this.flagSum = true;

        this.srcSum = base[LhaEntryReader.HDR1_OFF_SUM];
        if (this.srcSum < 0) {
            this.srcSum += 256;
        }

        e.setMethod(LhaEntryReader._strFromChars(base, LhaEntryReader.HDR1_OFF_METHOD, 5));
        e.setOriginalSize(LhaEntryReader.get32(base, LhaEntryReader.HDR1_OFF_ORIGSIZE));
        e.setDosTimeStamp(LhaEntryReader.get32(base, LhaEntryReader.HDR1_OFF_TIMESTAMP));

        if (base[LhaEntryReader.HDR1_OFF_19] !== 0x20) {
            throw (new LhaException("Lha header is broken (offset 19 is not 0x20)"));
        }

        this.calcSum.update_2(base, 2, base.length - 2);
        this.calcCRC.update_2(base, 0, base.length);

        let buf: number[] = arr(1);
        if (this._read(buf) !== buf.length) {
            throw (new LhaException("Lha header is broken (cannot read name size)"));
        }
        const nameSize: number = buf[0];
        this.calcSum.update_2(buf, 0, buf.length);
        this.calcCRC.update_2(buf, 0, buf.length);

        let name: string = "";
        if (nameSize > 0) {
            buf = arr(nameSize);
            if (this._read(buf) !== buf.length) {
                throw (new LhaException("Lha header is broken (cannot read name)"));
            }
            name = String.fromCharCode(...buf);
            this.calcSum.update_2(buf, 0, buf.length);
            this.calcCRC.update_2(buf, 0, buf.length);
        }

        buf = arr(2);
        if (this._read(buf) !== buf.length) {
            throw (new LhaException("Lha header is broken (cannot read crc value)"));
        }
        e.setCRC(LhaEntryReader.get16(buf, 0));
        this.calcSum.update_2(buf, 0, buf.length);
        this.calcCRC.update_2(buf, 0, buf.length);

        buf = arr(1);
        if (this._read(buf) !== buf.length) {
            throw (new LhaException("Lha header is broken (cannot read os signature)"));
        }
        e.setOS(buf[0]);
        this.calcSum.update_2(buf, 0, buf.length);
        this.calcCRC.update_2(buf, 0, buf.length);

        let extSize: number = 0;
        buf = arr(2);
        if (this._read(buf) !== buf.length) {
            throw (new LhaException("Lha header is broken (cannot read ext)"));
        }
        this.calcSum.update_2(buf, 0, buf.length);
        this.calcCRC.update_2(buf, 0, buf.length);
        for (let next: number = LhaEntryReader.get16(buf, 0); next > 0; next = this.readExHeader(e, next)) {
            extSize += next;
        }

        e.setCompressedSize(LhaEntryReader.get32(base, LhaEntryReader.HDR0_OFF_COMPSIZE) - extSize);
        if (this.fileName.length > 0) {
            name = this.dirName + this.fileName;
        } else {
            name = this.convertFilePath(name, e.getOS());
        }

        e.setFile(name);

        return (e);
    }

    /**
     * Reads a level 2 lha header infomation.
     *
     * @param base
     *            readed datas for judge header type
     * @return a lha entry
     * @throws LhaException
     *             if a lha format error has occurred
     * @throws IOException
     *             if an I/O error has occurred
     */
    protected readHeader_Lv2(base: number[]): LhaEntry {
        const e: LhaEntry = new LhaEntry();

        e.setMethod(LhaEntryReader._strFromChars(base, LhaEntryReader.HDR2_OFF_METHOD, 5));
        e.setCompressedSize(LhaEntryReader.get32(base, LhaEntryReader.HDR2_OFF_COMPSIZE));
        e.setOriginalSize(LhaEntryReader.get32(base, LhaEntryReader.HDR2_OFF_ORIGSIZE));
        e.setHeaderTimeStamp(LhaEntryReader.get32(base, LhaEntryReader.HDR2_OFF_TIMESTAMP));

        this.calcCRC.update_2(base, 0, base.length);

        let buf: number[] = arr(2);
        if (this._read(buf) !== buf.length) {
            throw (new LhaException("Lha header is broken (cannot read crc value)"));
        }
        e.setCRC(LhaEntryReader.get16(buf, 0));
        this.calcCRC.update_2(buf, 0, buf.length);

        buf = arr(1);
        if (this._read(buf) !== buf.length) {
            throw (new LhaException("Lha header is broken (cannot read os signature)"));
        }
        e.setOS(buf[0]);
        this.calcCRC.update_2(buf, 0, buf.length);

        buf = arr(2);
        if (this._read(buf) !== buf.length) {
            throw (new LhaException("Lha header is broken (cannot read ext)"));
        }
        this.calcCRC.update_2(buf, 0, buf.length);
        for (let next: number = LhaEntryReader.get16(buf, 0); next > 0; next = this.readExHeader(e, next))
            ;

        e.setFile(this.dirName + this.fileName);

        return (e);
    }

    /**
     * Reads a extra header information in level 2 lha header.
     *
     * @param e
     *            a current lha entry
     * @param size
     *            header size
     * @return next header size
     * @throws LhaException
     *             if a lha format error has occurred
     * @throws IOException
     *             if an I/O error has occurred
     */
    protected readExHeader(e: LhaEntry, size: number): number {
        const buf: number[] = arr(size);

        if (this._read(buf) !== buf.length)
            throw (new LhaException("header is broken"));

        switch (buf[0]) {
            case LhaEntry.EXHDR_SIG_COMMON:
                this.flagCRC = true;
                this.srcCRC = LhaEntryReader.get16(buf, 1);
                buf[1] = 0x00;
                buf[2] = 0x00;
                break;

            case LhaEntry.EXHDR_SIG_FILENAME:
                this.fileName = LhaEntryReader._strFromChars(buf, 1, size - 3);
                break;

            case LhaEntry.EXHDR_SIG_DIRNAME:
                let dname = '';
                let pi: number = 0;
                for (let i: number = 1; i <= (size - 3); ++i) {
                    if (buf[i] === LhaEntryReader.HD_CHR_DELIM_EXTRA) {
                        dname += LhaEntryReader._strFromChars(buf, pi + 1, i - pi - 1);
                        dname += '/';
                        pi = i;
                    }
                }
                dname += LhaEntryReader._strFromChars(buf, pi + 1, size - 3 - pi);
                this.dirName = dname;
                break;

            case LhaEntry.EXHDR_SIG_COMMENT:
                break;

            case LhaEntry.EXHDR_SIG_DOSATTR:
                break;

            case LhaEntry.EXHDR_SIG_DOSTIMES:
                break;

            case LhaEntry.EXHDR_SIG_UNIXPERM:
                break;

            case LhaEntry.EXHDR_SIG_UNIXID:
                break;

            case LhaEntry.EXHDR_SIG_UNIXGROUPNAME:
                break;

            case LhaEntry.EXHDR_SIG_UNIXUSERNAME:
                break;

            case LhaEntry.EXHDR_SIG_UNIXLMTIME:
                break;

            default:
                break;
        }

        this.calcCRC.update_2(buf, 0, buf.length);

        return (LhaEntryReader.get16(buf, size - 2));
    }

    /**
     * Converts a OS depend file path to a current system file path.
     *
     * @param s
     *            the file path string in header
     * @param os
     *            the OS signature
     * @return the file path string on current system
     */
    protected convertFilePath(s: string, os: number): string {
        let delim: string;

        switch (os) {
            case LhaEntry.OSID_SIG_GENERIC:
            case LhaEntry.OSID_SIG_MSDOS:
            case LhaEntry.OSID_SIG_WIN32:
            case LhaEntry.OSID_SIG_WINNT:
                delim = LhaEntryReader.HD_CHR_DELIM_MSDOS;
                break;

            case LhaEntry.OSID_SIG_MAC:
                delim = LhaEntryReader.HD_CHR_DELIM_MAC;
                break;

            default:
                delim = LhaEntryReader.HD_CHR_DELIM_UNIX;
                break;
        }

        const c: string[] = s.split('');
        for (let i: number = 0; i < c.length; ++i) {
            if (c[i] === delim)
                c[i] = '/';
            else if (c[i] === '/')
                c[i] = delim;
        }
        return c.join('');
    }

    /**
     * abstract method for read datas.
     *
     * @param b
     *            the buffer into which the data is read
     * @return the total number of bytes read into the buffer, or
     *         <code>-1</code> if there is no more data because the end of the
     *         stream has been reached
     * @throws IOException
     *             if an I/O error has occurred
     */
    protected abstract  _read(b: number[]): number;
}
