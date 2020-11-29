import {BinBuffer} from "../../internal/binBuffer";
import {LhaEntry} from "./lhaEntry";
import {LhaEntryReader} from "./lhaEntryReader";
import {LhaException} from "./lhaException";
import {LhaDecoderInputStream} from "./lhaDecoderInputStream";


export class LhaFile {
    private readonly raf: BinBuffer; // RandomAccessFile
    private encoding: string;
    private name: string;
    private readonly entryList: LhaEntry[] = [];
    private readonly entryMap: Record<string, LhaEntry> = {};
    private size: number;
    private pos: number;

    public constructor(_in: BinBuffer) {
        this.raf = _in;
        this.entryList = [];
        this.entryMap = {};
        this.makeEntryMap();
    }

    /**
     * Returns the lha file entry for the specified name, or null if not found.
     *
     * @param name
     *            the name of the entry
     * @return the lha file entry, or null if not found
     */
    public getEntryByName(name: string): LhaEntry {
        return this.entryMap[name];
    }

    /**
     * Returns the lha file entry for the specified index, or null if not found.
     *
     * @param index
     *            the index of the entry
     * @return the lha file entry, or null if not found
     */
    public getEntryByIndex(index: number): LhaEntry {
        return this.entryList[index];
    }

    /**
     * Returns an input stream for reading the contents of the specified lha
     * file entry.
     *
     * @param entry
     *            the lha file entry
     * @return the input stream for reading the contents of the specified lha
     *         file entry
     * @throws IOException
     *             if an I/O error has occurred
     */
    public getInputStream(entry:LhaEntry):LhaDecoderInputStream {
        return (new LhaDecoderInputStream(new LhaFileInputStream(this, entry), entry));
    }

    public getInputStreamByIndex(index:number):LhaDecoderInputStream {
        return this.getInputStream(this.getEntryByIndex(index));
    }

    /**
     * Returns the path name of the lha file.
     *
     * @return the path name of the lha file
     */
    public getName(): string {
        return "";
    }

    /**
     * Returns an iterator of the lha file entries
     *
     * @return an iterator of the lha file entries
     */
    // public Iterator entryIterator() {
    //     return (entryList.iterator());
    // }

    /**
     * Reads from the current lha entry into an array of bytes.
     */
    public read(pos: number, b: number[], off: number, len: number): number {
        if (pos !== this.pos)
            this.raf.setPointer(pos);

        const n: number = this.raf.readBytesToArray(b, off, len);
        if (n > 0) this.pos = pos + n;
        return (n);
    }

    /**
     * Reads from the current lha entry.
     */
    public read_2(pos: number): number {
        if (pos !== this.pos) this.raf.setPointer(pos);

        const n: number = this.raf.readByte();
        if (n > 0) this.pos = pos + 1;

        return (n);
    }

    /**
     * Returns the number of entries in the lha file.
     *
     * @return the number of entries in the lha file
     */
    public getSize(): number {
        return this.size;
    }

    /**
     * Closes the lha file
     *
     * @throws IOException
     *             if an I/O error has occured
     */
    public close(): void {

    }

    /**
     * Make entry map in lha file.
     *
     * @throws LhaException
     *             if a lha format error has occurred
     * @throws IOException
     *             if an I/O error has occured
     */
    private makeEntryMap(): void {

        const raf = this.raf;
        const hr = new class extends LhaEntryReader {
            protected _read(b: number[]): number {
                return (raf.readBytesToArray_2(b));
            }
        }(this.encoding);

        this.size = 0;
        while (true) {
            const e: LhaEntry | null = hr.readHeader();

            if (e === null)
                break;

            e.setOffset(raf.getPointer());
            this.entryList.push(e);
            this.entryMap[e.getFile()] = e;
            ++this.size;

            const skipSize: number = e.getCompressedSize();
            if (raf.skip(skipSize) !== skipSize)
                throw (new LhaException("Lha header is broken"));
        }
    }
}


/*
 * Inner class implementing the input stream used to read a lha file entry.
 */
export class LhaFileInputStream  {
    private file:LhaFile;
    private pos:number;
    private count:number;

    public constructor(file:LhaFile, entry:LhaEntry) {
        if ((file === null) || (entry === null))
        throw (new Error('NullPointerException'));

        this.file = file;
        this.pos = entry.getOffset();
        this.count = entry.getCompressedSize();
    }

    public read_2(b:number[], off:number, len:number):number {
        if (this.count === 0)
            return (-1);

        if (len > this.count) {
            if (Number.MAX_VALUE < this.count) {
                len = Number.MAX_VALUE;
            } else {
                len = this.count;
            }
        }

        len = this.file.read(this.pos, b, off, len);
        if (len === -1)
            throw (new LhaException("premature EOF"));

        this.pos += len;
        this.count -= len;

        return (len);
    }

    public read():number {
        if (this.count === 0)
            return (-1);

        const n:number = this.file.read_2(this.pos);
        if (n === -1)
            throw (new LhaException("premature EOF"));

        ++this.pos;
        --this.count;

        return (n);
    }
}
