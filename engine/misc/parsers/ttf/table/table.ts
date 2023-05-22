
export class TableConsts {
    // Table constants
    public static readonly BASE = 0x42415345; // Baseline data [OpenType]
    public static readonly CFF  = 0x43464620; // PostScript font program (compact font format) [PostScript]
    public static readonly DSIG = 0x44534947; // Digital signature
    public static readonly EBDT = 0x45424454; // Embedded bitmap data
    public static readonly EBLC = 0x45424c43; // Embedded bitmap location data
    public static readonly EBSC = 0x45425343; // Embedded bitmap scaling data
    public static readonly GDEF = 0x47444546; // Glyph definition data [OpenType]
    public static readonly GPOS = 0x47504f53; // Glyph positioning data [OpenType]
    public static readonly GSUB = 0x47535542; // Glyph substitution data [OpenType]
    public static readonly JSTF = 0x4a535446; // Justification data [OpenType]
    public static readonly LTSH = 0x4c545348; // Linear threshold table
    public static readonly MMFX = 0x4d4d4658; // Multiple master font metrics [PostScript]
    public static readonly MMSD = 0x4d4d5344; // Multiple master supplementary data [PostScript]
    public static readonly OS_2 = 0x4f532f32; // OS/2 and Windows specific metrics [r]
    public static readonly PCLT = 0x50434c54; // PCL5
    public static readonly VDMX = 0x56444d58; // Vertical Device Metrics table
    public static readonly cmap = 0x636d6170; // character to glyph mapping [r]
    public static readonly cvt  = 0x63767420; // Control Value Table
    public static readonly fpgm = 0x6670676d; // font program
    public static readonly fvar = 0x66766172; // Apple's font variations table [PostScript]
    public static readonly gasp = 0x67617370; // grid-fitting and scan conversion procedure (grayscale)
    public static readonly glyf = 0x676c7966; // glyph data [r]
    public static readonly hdmx = 0x68646d78; // horizontal device metrics
    public static readonly head = 0x68656164; // font header [r]
    public static readonly hhea = 0x68686561; // horizontal header [r]
    public static readonly hmtx = 0x686d7478; // horizontal metrics [r]
    public static readonly kern = 0x6b65726e; // kerning
    public static readonly loca = 0x6c6f6361; // index to location [r]
    public static readonly maxp = 0x6d617870; // maximum profile [r]
    public static readonly c_name = 0x6e616d65; // naming table [r]
    public static readonly prep = 0x70726570; // CVT Program
    public static readonly post = 0x706f7374; // PostScript information [r]
    public static readonly vhea = 0x76686561; // Vertical Metrics header
    public static readonly vmtx = 0x766d7478; // Vertical Metrics

    // Platform IDs
    public static readonly platformAppleUnicode = 0;
    public static readonly platformMacintosh = 1;
    public static readonly platformISO = 2;
    public static readonly platformMicrosoft = 3;

    // Microsoft Encoding IDs
    public static readonly encodingUndefined = 0;
    public static readonly encodingUGL = 1;

    // Macintosh Encoding IDs
    public static readonly encodingRoman = 0;
    public static readonly encodingJapanese = 1;
    public static readonly encodingChinese = 2;
    public static readonly encodingKorean = 3;
    public static readonly encodingArabic = 4;
    public static readonly encodingHebrew = 5;
    public static readonly encodingGreek = 6;
    public static readonly encodingRussian = 7;
    public static readonly encodingRSymbol = 8;
    public static readonly encodingDevanagari = 9;
    public static readonly encodingGurmukhi = 10;
    public static readonly encodingGujarati = 11;
    public static readonly encodingOriya = 12;
    public static readonly encodingBengali = 13;
    public static readonly encodingTamil = 14;
    public static readonly encodingTelugu = 15;
    public static readonly encodingKannada = 16;
    public static readonly encodingMalayalam = 17;
    public static readonly encodingSinhalese = 18;
    public static readonly encodingBurmese = 19;
    public static readonly encodingKhmer = 20;
    public static readonly encodingThai = 21;
    public static readonly encodingLaotian = 22;
    public static readonly encodingGeorgian = 23;
    public static readonly encodingArmenian = 24;
    public static readonly encodingMaldivian = 25;
    public static readonly encodingTibetan = 26;
    public static readonly encodingMongolian = 27;
    public static readonly encodingGeez = 28;
    public static readonly encodingSlavic = 29;
    public static readonly encodingVietnamese = 30;
    public static readonly encodingSindhi = 31;
    public static readonly encodingUninterp = 32;

    // ISO Encoding IDs
    public static readonly encodingASCII = 0;
    public static readonly encodingISO10646 = 1;
    public static readonly encodingISO8859_1 = 2;

    // Microsoft Language IDs
    public static readonly languageSQI = 0x041c;
    public static readonly languageEUQ = 0x042d;
    public static readonly languageBEL = 0x0423;
    public static readonly languageBGR = 0x0402;
    public static readonly languageCAT = 0x0403;
    public static readonly languageSHL = 0x041a;
    public static readonly languageCSY = 0x0405;
    public static readonly languageDAN = 0x0406;
    public static readonly languageNLD = 0x0413;
    public static readonly languageNLB = 0x0813;
    public static readonly languageENU = 0x0409;
    public static readonly languageENG = 0x0809;
    public static readonly languageENA = 0x0c09;
    public static readonly languageENC = 0x1009;
    public static readonly languageENZ = 0x1409;
    public static readonly languageENI = 0x1809;
    public static readonly languageETI = 0x0425;
    public static readonly languageFIN = 0x040b;
    public static readonly languageFRA = 0x040c;
    public static readonly languageFRB = 0x080c;
    public static readonly languageFRC = 0x0c0c;
    public static readonly languageFRS = 0x100c;
    public static readonly languageFRL = 0x140c;
    public static readonly languageDEU = 0x0407;
    public static readonly languageDES = 0x0807;
    public static readonly languageDEA = 0x0c07;
    public static readonly languageDEL = 0x1007;
    public static readonly languageDEC = 0x1407;
    public static readonly languageELL = 0x0408;
    public static readonly languageHUN = 0x040e;
    public static readonly languageISL = 0x040f;
    public static readonly languageITA = 0x0410;
    public static readonly languageITS = 0x0810;
    public static readonly languageLVI = 0x0426;
    public static readonly languageLTH = 0x0427;
    public static readonly languageNOR = 0x0414;
    public static readonly languageNON = 0x0814;
    public static readonly languagePLK = 0x0415;
    public static readonly languagePTB = 0x0416;
    public static readonly languagePTG = 0x0816;
    public static readonly languageROM = 0x0418;
    public static readonly languageRUS = 0x0419;
    public static readonly languageSKY = 0x041b;
    public static readonly languageSLV = 0x0424;
    public static readonly languageESP = 0x040a;
    public static readonly languageESM = 0x080a;
    public static readonly languageESN = 0x0c0a;
    public static readonly languageSVE = 0x041d;
    public static readonly languageTRK = 0x041f;
    public static readonly languageUKR = 0x0422;

    // Macintosh Language IDs
    public static readonly languageEnglish = 0;
    public static readonly languageFrench = 1;
    public static readonly languageGerman = 2;
    public static readonly languageItalian = 3;
    public static readonly languageDutch = 4;
    public static readonly languageSwedish = 5;
    public static readonly languageSpanish = 6;
    public static readonly languageDanish = 7;
    public static readonly languagePortuguese = 8;
    public static readonly languageNorwegian = 9;
    public static readonly languageHebrew = 10;
    public static readonly languageJapanese = 11;
    public static readonly languageArabic = 12;
    public static readonly languageFinnish = 13;
    public static readonly languageGreek = 14;
    public static readonly languageIcelandic = 15;
    public static readonly languageMaltese = 16;
    public static readonly languageTurkish = 17;
    public static readonly languageYugoslavian = 18;
    public static readonly languageChinese = 19;
    public static readonly languageUrdu = 20;
    public static readonly languageHindi = 21;
    public static readonly languageThai = 22;

    // Name IDs
    public static readonly nameCopyrightNotice = 0;
    public static readonly nameFontFamilyName = 1;
    public static readonly nameFontSubfamilyName = 2;
    public static readonly nameUniqueFontIdentifier = 3;
    public static readonly nameFullFontName = 4;
    public static readonly nameVersionString = 5;
    public static readonly namePostscriptName = 6;
    public static readonly nameTrademark = 7;
}

export interface Table {
    getType():number;
}
