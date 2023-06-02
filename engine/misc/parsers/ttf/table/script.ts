import {LangSys} from "@engine/misc/parsers/ttf/table/langSys";
import {LangSysRecord} from "@engine/misc/parsers/ttf/table/langSysRecord";
import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";

export class Script {

    private defaultLangSysOffset: number;
    private langSysCount: number;
    private langSysRecords:LangSysRecord[];
    private defaultLangSys: LangSys;
    private langSys:LangSys[];

    constructor(raf: RandomAccessFile, offset: number) {
        raf.seek(offset);
        this.defaultLangSysOffset = raf.readUnsignedShort();
        this.langSysCount = raf.readUnsignedShort();
        if (this.langSysCount > 0) {
            this.langSysRecords = new Array(this.langSysCount);
            for (let i = 0; i < this.langSysCount; i++) {
                this.langSysRecords[i] = new LangSysRecord(raf);
            }
        }

        // Read the LangSys tables
        if (this.langSysCount > 0) {
            this.langSys = new Array(this.langSysCount);
            for (let i = 0; i < this.langSysCount; i++) {
                raf.seek(offset + this.langSysRecords[i].offset);
                this.langSys[i] = new LangSys(raf);
            }
        }
        if (this.defaultLangSysOffset > 0) {
            raf.seek(offset + this.defaultLangSysOffset);
            this.defaultLangSys = new LangSys(raf);
        }
    }

    public getDefaultLangSys() {
        return this.defaultLangSys;
    }

}

