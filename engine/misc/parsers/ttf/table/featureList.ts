import {FeatureRecord} from "@engine/misc/parsers/ttf/table/featureRecord";
import {Feature} from "@engine/misc/parsers/ttf/table/feature";
import {LangSys} from "@engine/misc/parsers/ttf/table/langSys";
import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";

export class FeatureList {

    private readonly featureCount: number;
    private readonly featureRecords: FeatureRecord[];
    private readonly features: Feature[] ;

    constructor(raf: RandomAccessFile, offset: number) {
        raf.seek(offset);
        this.featureCount = raf.readUnsignedShort();
        this.featureRecords = new Array(this.featureCount);
        this.features = new Array(this.featureCount);
        for (let i = 0; i < this.featureCount; i++) {
            this.featureRecords[i] = new FeatureRecord(raf);
        }
        for (let i = 0; i < this.featureCount; i++) {
            this.features[i] = new Feature(raf, offset + this.featureRecords[i].getOffset());
        }
    }

    public findFeature(langSys: LangSys, tag: string) {
        if (tag.length != 4) {
            return null;
        }
        const tagVal = (
            (tag.charCodeAt(0)<<24)
            | (tag.charCodeAt(1)<<16)
            | (tag.charCodeAt(2)<<8)
            | tag.charCodeAt(3)
        );
        for (let i = 0; i < this.featureCount; i++) {
            if (this.featureRecords[i].getTag() === tagVal) {
                if (langSys.isFeatureIndexed(i)) {
                    return this.features[i];
                }
            }
        }
        return null;
    }

}
