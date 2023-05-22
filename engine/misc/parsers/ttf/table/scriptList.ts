
import {Script} from "@engine/misc/parsers/ttf/table/script";
import {ScriptRecord} from "@engine/misc/parsers/ttf/table/scriptRecord";
import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";

export class ScriptList {

    public readonly scriptCount:number;
    private readonly scriptRecords: ScriptRecord[];
    private readonly scripts:Script[];

    constructor(raf: RandomAccessFile, offset: number) {
        raf.seek(offset);
        this.scriptCount = raf.readUnsignedShort();
        this.scriptRecords = new Array(this.scriptCount);
        this.scripts = new Array(this.scriptCount);
        for (let i = 0; i < this.scriptCount; i++) {
            this.scriptRecords[i] = new ScriptRecord(raf);
        }
        for (let i = 0; i < this.scriptCount; i++) {
            this.scripts[i] = new Script(raf, offset + this.scriptRecords[i].offset);
        }
    }

    public getScriptRecord(i: number) {
        return this.scriptRecords[i];
    }

    public findScript(tag: string) {
        if (tag.length!= 4) {
            return null;
        }
        const tagVal = ((tag.charCodeAt(0)<<24)
            | (tag.charCodeAt(1)<<16)
            | (tag.charCodeAt(2)<<8)
            | tag.charCodeAt(3));
        for (let i = 0; i < this.scriptCount; i++) {
            if (this.scriptRecords[i].tag === tagVal) {
                return this.scripts[i];
            }
        }
        return null;
    }

}

