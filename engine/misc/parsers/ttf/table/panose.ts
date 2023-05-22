import {StringBuffer} from "@engine/misc/parsers/ttf/misc/stringBuffer";

export class Panose {

    public readonly bFamilyType:number;
    public readonly bSerifStyle:number;
    public readonly bWeight:number;
    public readonly bProportion:number;
    public readonly bContrast:number;
    public readonly bStrokeVariation:number;
    public readonly bArmStyle:number;
    public readonly bLetterform:number;
    public readonly bMidline:number;
    public readonly bXHeight:number;

    constructor(panose: number[]) {
        this.bFamilyType = panose[0];
        this.bSerifStyle = panose[1];
        this.bWeight = panose[2];
        this.bProportion = panose[3];
        this.bContrast = panose[4];
        this.bStrokeVariation = panose[5];
        this.bArmStyle = panose[6];
        this.bLetterform = panose[7];
        this.bMidline = panose[8];
        this.bXHeight = panose[9];
    }

    public toString() {
        const sb = new StringBuffer();
        sb.append(this.bFamilyType).append(" ")
            .append(this.bSerifStyle).append(" ")
            .append(this.bWeight).append(" ")
            .append(this.bProportion).append(" ")
            .append(this.bContrast).append(" ")
            .append(this.bStrokeVariation).append(" ")
            .append(this.bArmStyle).append(" ")
            .append(this.bLetterform).append(" ")
            .append(this.bMidline).append(" ")
            .append(this.bXHeight);
        return sb.toString();
    }

}
