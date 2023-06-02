
import {TableConsts} from "@engine/misc/parsers/ttf/table/table";
import {toInt} from "@engine/misc/parsers/ttf/misc/toInt";
import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";
import {StringBuffer} from "@engine/misc/parsers/ttf/misc/stringBuffer";

export class NameRecord {

    public readonly platformId: number;
    public readonly encodingId: number;
    public readonly languageId: number;
    public readonly nameId: number;
    public readonly stringLength: number;
    public readonly stringOffset: number;
    private record: string;

    constructor(raf: RandomAccessFile) {
        this.platformId = raf.readShort();
        this.encodingId = raf.readShort();
        this.languageId = raf.readShort();
        this.nameId = raf.readShort();
        this.stringLength = raf.readShort();
        this.stringOffset = raf.readShort();
    }


    public getRecordString() {
        return this.record;
    }

    public loadString(raf: RandomAccessFile, stringStorageOffset: number) {
        const sb = new StringBuffer();
        raf.seek(stringStorageOffset + this.stringOffset);
        if (this.platformId === TableConsts.platformAppleUnicode) {

            // Unicode (big-endian)
            for (let i = 0; i < toInt(this.stringLength/2); i++) {
                sb.append(raf.readChar());
            }
        } else if (this.platformId === TableConsts.platformMacintosh) {

            // Macintosh encoding, ASCII
            for (let i = 0; i < this.stringLength; i++) {
                sb.append(String.fromCharCode(raf.readByte()));
            }
        } else if (this.platformId === TableConsts.platformISO) {

            // ISO encoding, ASCII
            for (let i = 0; i < this.stringLength; i++) {
                sb.append(String.fromCharCode(raf.readByte()));
            }
        } else if (this.platformId === TableConsts.platformMicrosoft) {

            // Microsoft encoding, Unicode
            for (let i = 0; i < toInt(this.stringLength/2); i++) {
                const c = raf.readChar();
                sb.append(c);
            }
        }
        this.record = sb.toString();
    }
}
