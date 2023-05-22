import {Lookup} from "@engine/misc/parsers/ttf/table/lookup";
import {LookupSubtableFactory} from "@engine/misc/parsers/ttf/table/lookupSubtableFactory";
import {Feature} from "@engine/misc/parsers/ttf/table/feature";
import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";

export class LookupList {

    private readonly lookupCount:number;
    private readonly lookupOffsets: number[];
    private readonly lookups:Lookup[];

    constructor(raf: RandomAccessFile, offset: number, factory: LookupSubtableFactory) {
        raf.seek(offset);
        this.lookupCount = raf.readUnsignedShort();
        this.lookupOffsets = new Array(this.lookupCount);
        this.lookups = new Array(this.lookupCount);
        for (let i = 0; i < this.lookupCount; i++) {
            this.lookupOffsets[i] = raf.readUnsignedShort();
        }
        for (let i = 0; i < this.lookupCount; i++) {
            this.lookups[i] = new Lookup(factory, raf, offset + this.lookupOffsets[i]);
        }
    }

    public getLookup(feature:Feature, index: number):Lookup {
        if (feature.getLookupCount() > index) {
            const i = feature.getLookupListIndex(index);
            return this.lookups[i];
        }
        return null!;
    }

}

