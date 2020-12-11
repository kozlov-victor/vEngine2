
/**
 * This class is used to represent a lha file entry.
 *
 * @author Nobuyasu SUEHIRO <nosue@users.sourceforge.net>
 */
export class LhaEntry {

    /**
     * Creates a new lha entry.
     */
    public constructor() {
    }
    // A default entry name encoding type
    public static readonly HD_STR_ENCODING: string = "MS932"; // default entry
    // name encoding
    // type

    // Method signatures
    /** The compression method signature for directory */
    public static readonly METHOD_SIG_LHD: string = "-lhd-";
    /** The compression method signature for lh0 */
    public static readonly METHOD_SIG_LH0: string = "-lh0-";
    /** The compression method signature for lh1 */
    public static readonly METHOD_SIG_LH1: string = "-lh1-";
    /** The compression method signature for lh2 */
    public static readonly METHOD_SIG_LH2: string = "-lh2-";
    /** The compression method signature for lh3 */
    public static readonly METHOD_SIG_LH3: string = "-lh3-";
    /** The compression method signature for lh4 */
    public static readonly METHOD_SIG_LH4: string = "-lh4-";
    /** The compression method signature for lh5 */
    public static readonly METHOD_SIG_LH5: string = "-lh5-";
    /** The compression method signature for lh6 */
    public static readonly METHOD_SIG_LH6: string = "-lh6-";
    /** The compression method signature for lh7 */
    public static readonly METHOD_SIG_LH7: string = "-lh7-";
    /** The compression method signature for lzs */
    public static readonly METHOD_SIG_LZS: string = "-lzs-";
    /** The compression method signature for lz4 */
    public static readonly METHOD_SIG_LZ4: string = "-lz4-";
    /** The compression method signature for lz5 */
    public static readonly METHOD_SIG_LZ5: string = "-lz5-";

    // OS id signatres
    /** The operation system signature for generic */
    public static readonly OSID_SIG_GENERIC: number = 0x00;
    /** The operation system signature for MS-DOS */
    public static readonly OSID_SIG_MSDOS: number = 0x4D;
    /** The operation system signature for OS/2 */
    public static readonly OSID_SIG_OS2: number = 0x32;
    /** The operation system signature for OS9 */
    public static readonly OSID_SIG_OS9: number = 0x39;
    /** The operation system signature for OS/68K */
    public static readonly OSID_SIG_OS68K: number = 0x4B;
    /** The operation system signature for OS/386 */
    public static readonly OSID_SIG_OS386: number = 0x33;
    /** The operation system signature for HUMAN. */
    public static readonly OSID_SIG_HUMAN: number = 0x48;
    /** The operation system signature for Unix */
    public static readonly OSID_SIG_UNIX: number = 0x55;
    /** The operation system signature for CP/M */
    public static readonly OSID_SIG_CPM: number = 0x43;
    /** The operation system signature for Flex */
    public static readonly OSID_SIG_FLEX: number = 0x46;
    /** The operation system signature for Macintosh */
    public static readonly OSID_SIG_MAC: number = 0x6D;
    /** The operation system signature for Runser */
    public static readonly OSID_SIG_RUNSER: number = 0x52;
    /** The operation system signature for Java */
    public static readonly OSID_SIG_JAVA: number = 0x4A;
    /** The operation system signature for Windows95 (from UNLHA32.DLL) */
    public static readonly OSID_SIG_WIN32: number = 0x77;
    /** The operation system signature for WindowsNT (from UNLHA32.DLL) */
    public static readonly OSID_SIG_WINNT: number = 0x57;

    // Extend header signatres
    /** The extend header signature: header crc and information */
    public static readonly EXHDR_SIG_COMMON: number = 0x00;
    /** The extend header signature: file name */
    public static readonly EXHDR_SIG_FILENAME: number = 0x01;
    /** The extend header signature: directory name */
    public static readonly EXHDR_SIG_DIRNAME: number = 0x02;
    /** The extend header signature: comment */
    public static readonly EXHDR_SIG_COMMENT: number = 0x3f;
    /** The extend header signature: ms-dos attributes */
    public static readonly EXHDR_SIG_DOSATTR: number = 0x40;
    /** The extend header signature: ms-dos time stamps (from UNLHA32.DLL) */
    public static readonly EXHDR_SIG_DOSTIMES: number = 0x41;
    /** The extend header signature: unix permisson */
    public static readonly EXHDR_SIG_UNIXPERM: number = 0x50;
    /** The extend header signature: unix group id,user id */
    public static readonly EXHDR_SIG_UNIXID: number = 0x51;
    /** The extend header signature: unix group name */
    public static readonly EXHDR_SIG_UNIXGROUPNAME: number = 0x52;
    /** The extend header signature: unix user name */
    public static readonly EXHDR_SIG_UNIXUSERNAME: number = 0x53;
    /** The extend header signature: unix last modified time */
    public static readonly EXHDR_SIG_UNIXLMTIME: number = 0x54;

    /** method ID */
    protected method: string;
    /** compressed size ID */
    protected compressedSize: number;
    /** original size */
    protected originalSize: number;
    /** time stamp */
    protected timeStamp: Date;
    /** file path and name */
    protected file: string;
    /** file crc */
    protected crc: number;
    /** file crc flag */
    protected fcrc: boolean = false;
    /** os type */
    protected os: number;
    /** offset of compressed data from beginning of lzh file */
    protected offset: number = -1;

    /**
     * Converts MS-DOS time to Java time.
     */
    private static dosToJavaTime(dtime: number): number {
        const d: Date = new Date();
        // public GregorianCalendar(int year, int month, int dayOfMonth, int hourOfDay, int minute, int second)
        d.setFullYear((((dtime >> 25) & 0x7f) + 1980));
        d.setMonth((((dtime >> 21) & 0x0f) - 1));
        d.setDate(((dtime >> 16) & 0x1f));
        d.setHours(((dtime >> 11) & 0x1f));
        d.setMinutes(((dtime >> 5) & 0x3f));
        d.setSeconds(((dtime << 1) & 0x3e));
        return d.getTime();
    }

    /**
     * Converts Java time to MS-DOS time.
     */
    private static javaToDosTime(time: number): number {
        const c: Date = new Date(time);

        const year: number = c.getFullYear() + 1900;
        if (year < 1980) {
            return (1 << 21) | (1 << 16);
        }

        return (
            ((year - 1980) << 25) |
            ((c.getMonth() + 1) << 21) |
            (c.getDate() << 16) |
            (c.getHours() << 11) |
            ((c.getMinutes()) << 5) |
            (c.getSeconds() >> 1)
        );
    }

    /**
     * Sets the compress method id string.
     *
     * @param method
     *            the compress method id string
     * @throws IllegalArgumentException
     *             if the compress method id is not supported
     * @see #getMethod()
     */
    public setMethod(method: string): void {
        if ([
                LhaEntry.METHOD_SIG_LHD,
                LhaEntry.METHOD_SIG_LH0,
                LhaEntry.METHOD_SIG_LH1,
                LhaEntry.METHOD_SIG_LH2,
                LhaEntry.METHOD_SIG_LH3,
                LhaEntry.METHOD_SIG_LH4,
                LhaEntry.METHOD_SIG_LH5,
                LhaEntry.METHOD_SIG_LH6,
                LhaEntry.METHOD_SIG_LH7,
                LhaEntry.METHOD_SIG_LZS,
                LhaEntry.METHOD_SIG_LZ4,
                LhaEntry.METHOD_SIG_LZ5
            ].indexOf(method) === -1) throw (new Error("Invalid lzh entry method " + method));
        this.method = method;
    }

    /**
     * Returns the compress method id string.
     *
     * @return the compress method id string
     * @see #setMethod(String)
     */
    public getMethod(): string {
        return this.method;
    }

    /**
     * Sets the compressed size.
     *
     * @param compressedSize
     *            the compressed data size
     * @throws IllegalArgumentException
     *             if the compressed data size is less than 0 or greater than
     *             0xFFFFFFFF
     * @see #getCompressedSize()
     */
    public setCompressedSize(compressedSize: number): void {
        if (compressedSize < 0 || compressedSize > 0xFFFFFFFF)
            throw (new Error("Invalid lzh entry compressed data size"));

        this.compressedSize = compressedSize;
    }

    /**
     * Returns the compressed data size.
     *
     * @return the compressed data size
     * @see #setCompressedSize(long)
     */
    public getCompressedSize(): number {
        return this.compressedSize;
    }

    /**
     * Sets the original data size.
     *
     * @param originalSize
     *            the original data size
     * @throws IllegalArgumentException
     *             if the original data size is less than 0 or greater than
     *             0xFFFFFFFF
     * @see #getOriginalSize()
     */
    public setOriginalSize(originalSize: number): void {
        if (originalSize < 0 || originalSize > 0xFFFFFFFF)
            throw (new Error("Invalid lha entry original data size"));

        this.originalSize = originalSize;
    }

    /**
     * Returns the original size.
     *
     * @return the original size
     * @see #setOriginalSize(long)
     */
    public getOriginalSize(): number {
        return this.originalSize;
    }

    /**
     * Sets the time stamp of data.
     *
     * @param timeStamp
     *            the time stamp of data
     * @see #getTimeStamp()
     */
    protected setTimeStamp(timeStamp: Date): void {
        this.timeStamp = timeStamp;
    }

    /**
     * Returns the time stamp of data.
     *
     * @return the time stamp of data
     * @see #setTimeStamp(Date)
     */
    public getTimeStamp(): Date {
        return new Date(this.timeStamp.getTime());
    }


    public setDosTimeStamp(tstamp: number):void {
        this.timeStamp = new Date(LhaEntry.dosToJavaTime(tstamp));
    }

    /**
     * Returns the MS-DOS time stamp of data.
     *
     * @return the MS-DOS time stamp of data
     * @see #setDosTimeStamp(long)
     */
    public getDosTimeStamp(): number {
        return (LhaEntry.javaToDosTime(this.timeStamp.getTime()));
    }

    /**
     * Sets the unix time stamp of header.
     *
     * @param tstamp
     *            the unix time stamp of header
     * @see #getHeaderTimeStamp()
     */
    public setHeaderTimeStamp(tstamp: number): void {
        this.timeStamp = new Date(tstamp * 1000);
    }

    /**
     * Returns the unix time stamp of header.
     *
     * @return the unix time stamp of header
     * @see #setHeaderTimeStamp(long)
     */
    public getHeaderTimeStamp(): number {
        if (this.timeStamp === null)
            return -1;
        return (this.timeStamp.getTime());
    }

    /**
     * Returns the File/Name by string.
     *
     * @param f
     * @see #setFile(File)
     * @see #getFile()
     */
    public setFile(f: string): void {
        this.file = f;
    }


    /**
     * Returns the File/Name.
     *
     * @return the File/Name
     * @see #setFile(String)
     * @see #setFile(File)
     */
    public getFile(): string {
        return this.file;
    }

    /**
     * Sets the CRC value.
     *
     * @param crc
     *            the CRC value
     * @see #getCRC()
     * @see #hasCRC()
     */
    public setCRC(crc: number): void {
        this.fcrc = true;
        this.crc = crc;
    }

    /**
     * Returns the CRC value. Before use this method, you should check this
     * entry has CRC or not.
     *
     * @return the CRC value
     * @see #setCRC(int)
     * @see #hasCRC()
     */
    public getCRC(): number {
        return this.crc;
    }

    /**
     * Returns this entry has CRC or not.
     *
     * @return true if this entry has CRC.
     * @see #setCRC(int)
     * @see #getCRC()
     */
    public hasCRC(): boolean {
        return this.fcrc;
    }

    /**
     * Sets the Operation System signature.
     *
     * @param os
     *            the Operation System signature
     * @see #getOS()
     */
    public setOS(os: number): void {
        this.os = os;
    }

    /**
     * Returns the Operation System signature.
     *
     * @return the Operation System signature
     * @see #setOS(byte)
     */
    public getOS(): number {
        return this.os;
    }


    /**
     * Sets the offset of compression data in file. Be carefull the offset is
     * not offset in lha entry.
     *
     * @param offset
     *            the offset of compression data in file
     * @throws IllegalArgumentException
     *             if the length of the offset is less than 0 or greater than
     *             0xFFFFFFFF
     * @see #getOffset()
     */
    public setOffset(offset: number): void {
        if (offset < 0 || offset > 0xFFFFFFFF)
            throw (new Error("Invalid lzh entry offset"));

        this.offset = offset;
    }

    /**
     * Returns the offset of compression data in file. Be carefull the offset is
     * not offset in lha entry.
     *
     * @return the offset from in file
     * @see #setOffset(long)
     */
    public getOffset(): number {
        return this.offset;
    }
}
