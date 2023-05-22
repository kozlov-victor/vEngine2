import {Table, TableConsts} from "@engine/misc/parsers/ttf/table/table";
import {Panose} from "@engine/misc/parsers/ttf/table/panose";
import {DirectoryEntry} from "@engine/misc/parsers/ttf/table/directoryEntry";
import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";
export class Os2Table implements Table {

    public readonly version: number;
    public readonly xAvgCharWidth: number;
    public readonly usWeightClass: number;
    public readonly usWidthClass: number;
    public readonly fsType: number;
    public readonly ySubscriptXSize: number;
    public readonly ySubscriptYSize: number;
    public readonly ySubscriptXOffset: number;
    public readonly ySubscriptYOffset: number;
    public readonly ySuperscriptXSize: number;
    public readonly ySuperscriptYSize: number;
    public readonly ySuperscriptXOffset: number;
    public readonly ySuperscriptYOffset: number;
    public readonly yStrikeoutSize: number;
    public readonly yStrikeoutPosition: number;
    public readonly sFamilyClass: number;
    public readonly panose:Panose;
    public readonly ulUnicodeRange1: number;
    public readonly ulUnicodeRange2: number;
    public readonly ulUnicodeRange3: number;
    public readonly ulUnicodeRange4: number;
    public readonly achVendorID: number;
    public readonly fsSelection: number;
    public readonly usFirstCharIndex: number;
    public readonly usLastCharIndex: number;
    public readonly sTypoAscender: number;
    public readonly sTypoDescender: number;
    public readonly sTypoLineGap: number;
    public readonly usWinAscent: number;
    public readonly usWinDescent: number;
    public readonly ulCodePageRange1: number;
    public readonly ulCodePageRange2: number;

    constructor(de: DirectoryEntry, raf: RandomAccessFile) {
        raf.seek(de.offset);
        this.version = raf.readUnsignedShort();
        this.xAvgCharWidth = raf.readShort();
        this.usWeightClass = raf.readUnsignedShort();
        this.usWidthClass = raf.readUnsignedShort();
        this.fsType = raf.readShort();
        this.ySubscriptXSize = raf.readShort();
        this.ySubscriptYSize = raf.readShort();
        this.ySubscriptXOffset = raf.readShort();
        this.ySubscriptYOffset = raf.readShort();
        this.ySuperscriptXSize = raf.readShort();
        this.ySuperscriptYSize = raf.readShort();
        this.ySuperscriptXOffset = raf.readShort();
        this.ySuperscriptYOffset = raf.readShort();
        this.yStrikeoutSize = raf.readShort();
        this.yStrikeoutPosition = raf.readShort();
        this.sFamilyClass = raf.readShort();
        const buf = new Array(10);
        raf.read(buf);
        this.panose = new Panose(buf);
        this.ulUnicodeRange1 = raf.readInt();
        this.ulUnicodeRange2 = raf.readInt();
        this.ulUnicodeRange3 = raf.readInt();
        this.ulUnicodeRange4 = raf.readInt();
        this.achVendorID = raf.readInt();
        this.fsSelection = raf.readShort();
        this.usFirstCharIndex = raf.readUnsignedShort();
        this.usLastCharIndex = raf.readUnsignedShort();
        this.sTypoAscender = raf.readShort();
        this.sTypoDescender = raf.readShort();
        this.sTypoLineGap = raf.readShort();
        this.usWinAscent = raf.readUnsignedShort();
        this.usWinDescent = raf.readUnsignedShort();
        this.ulCodePageRange1 = raf.readInt();
        this.ulCodePageRange2 = raf.readInt();
    }

    public getType() {
        return TableConsts.OS_2;
    }
}
