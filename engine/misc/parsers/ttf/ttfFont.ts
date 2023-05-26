import {Font} from "@engine/misc/parsers/ttf/font";
import {TableConsts} from "@engine/misc/parsers/ttf/table/table";
import {CmapFormat} from "@engine/misc/parsers/ttf/table/cmapFormat";
import {GsubTable} from "@engine/misc/parsers/ttf/table/gsubTable";
import {SingleSubst} from "@engine/misc/parsers/ttf/table/singleSubst";
import {ScriptTags} from "@engine/misc/parsers/ttf/table/scriptTags";
import {FeatureTags} from "@engine/misc/parsers/ttf/table/featureTags";
import {XMLConstants} from "@engine/misc/parsers/ttf/constants/xmlConstants";
import {KernTable} from "@engine/misc/parsers/ttf/table/kernTable";
import {PostTable} from "@engine/misc/parsers/ttf/table/postTable";
import {Glyph} from "@engine/misc/parsers/ttf/glyph";
import {StringBuffer} from "@engine/misc/parsers/ttf/misc/stringBuffer";
import {SvgConstants} from "@engine/misc/parsers/ttf/constants/svgConstants";
import {toInt} from "@engine/misc/parsers/ttf/misc/toInt";


export interface IGlyph {
    code: string;
    path: string;
    width: number;
}

export interface IKerning {
    left: string;
    right: string;
    value: number;
}

export interface ITtfFontData {
    fontFamily: string;
    glyphs: IGlyph[];
    unitsPerEm: number;
    yMax: number;
    ascent: number;
    descent: number;
    kerning:IKerning[];
}

export class TtfFont {

    private static readonly DEFAULT_FIRST = 32;
    private static readonly DEFAULT_LAST = 126;

    public static parse(buff:ArrayBuffer,symbolsToRender?:string[]):ITtfFontData {
        const font = Font.create(buff);

        let first = -1;
        let last = -1;
        const autoRange = false;
        const ascii = false;

        const fontFamily = font.getNameTable().getRecord(TableConsts.nameFontFamilyName);
        const unitsPerEm = font.getHeadTable().unitsPerEm;
        const yMax = font.getHeadTable().yMax;
        const ascent = font.getHheaTable().ascender;
        const descent = font.getHheaTable().descender;
        const horiz_advance_x = font.getOS2Table().xAvgCharWidth;
        const glyphs:IGlyph[] = [];
        const kerning:IKerning[] = [];

        // Decide upon a cmap table to use for our character to glyph look-up
        let cmapFmt:CmapFormat;
        if (ascii) {
            // We've been asked to use the ASCII/Macintosh cmap format
            cmapFmt = font.getCmapTable().getCmapFormat(
                TableConsts.platformMacintosh,
                TableConsts.encodingRoman );
        } else {
            // The default behaviour is to use the Unicode cmap encoding
            cmapFmt = font.getCmapTable().getCmapFormat(
                TableConsts.platformMicrosoft,
                TableConsts.encodingUGL );
            if (!cmapFmt) {
                // This might be a symbol font, so we'll look for an "undefined" encoding
                cmapFmt = font.getCmapTable().getCmapFormat(
                    TableConsts.platformMicrosoft,
                    TableConsts.encodingUndefined );
            }
        }
        if (!cmapFmt) {
            throw new Error("Cannot find a suitable cmap table");
        }

        // If this font includes arabic script, we want to specify
        // substitutions for initial, medial, terminal & isolated
        // cases.
        const gsub = font.getTable(TableConsts.GSUB) as GsubTable;
        let initialSubst:SingleSubst = null!;
        let medialSubst:SingleSubst = null!;
        let terminalSubst:SingleSubst = null!;
        if (gsub) {
            const s = gsub.scriptList.findScript(ScriptTags.SCRIPT_TAG_ARAB);
            if (s) {
                const ls = s.getDefaultLangSys();
                if (ls) {
                    const init = gsub.featureList.findFeature(ls, FeatureTags.FEATURE_TAG_INIT);
                    const medi = gsub.featureList.findFeature(ls, FeatureTags.FEATURE_TAG_MEDI);
                    const fina = gsub.featureList.findFeature(ls, FeatureTags.FEATURE_TAG_FINA);

                    if (init) {
                        initialSubst =
                            gsub.lookupList.getLookup(init, 0).getSubtable(0) as SingleSubst;
                    }
                    if (medi) {
                        medialSubst =
                            gsub.lookupList.getLookup(medi, 0).getSubtable(0) as SingleSubst;
                    }
                    if (fina != null) {
                        terminalSubst =
                            gsub.lookupList.getLookup(fina, 0).getSubtable(0) as SingleSubst;
                    }
                }
            }
        }

        // Include the missing glyph
        const missingGlyphs = TtfFont.getGlyphAsSVG(font, font.getGlyph(0), 0, horiz_advance_x,
            initialSubst, medialSubst, terminalSubst, "");
        glyphs.push(...missingGlyphs);

        try {
            if (first === -1) {
                if (!autoRange) first = TtfFont.DEFAULT_FIRST;
                else            first = cmapFmt.getFirst();
            }
            if (last === -1) {
                if (!autoRange) last = TtfFont.DEFAULT_LAST;
                else            last = cmapFmt.getLast();
            }


            // Include our requested range
            const glyphSet = new Set<number>();

            let rangeToRender:number[];
            if (symbolsToRender) rangeToRender = symbolsToRender.map(it=>it.charCodeAt(0));
            else {
                rangeToRender = [];
                for (let i=first;i<last;i++) {
                    rangeToRender.push(i);
                }
            }

            for (const i of rangeToRender) {
                const glyphIndex = cmapFmt.mapCharCode(i);

                if (glyphIndex > 0) {
                    // add glyph ID to set so we can filter later
                    glyphSet.add(glyphIndex);

                    const parsed = TtfFont.getGlyphAsSVG(
                        font,
                        font.getGlyph(glyphIndex),
                        glyphIndex,
                        horiz_advance_x,
                        initialSubst, medialSubst, terminalSubst,
                        String.fromCharCode(i)
                    );
                    glyphs.push(...parsed);
                }

            }

            // Output kerning pairs from the requested range
            const kern = font.getTable(TableConsts.kern) as KernTable;
            if (kern) {
                const kst = kern.getSubtable(0);
                const post = font.getTable(TableConsts.post) as PostTable;
                for (let i = 0; i < kst.getKerningPairCount(); i++) {
                    const kpair = kst.getKerningPair(i);
                    // check if left and right are both in our glyph set
                    if (glyphSet.has(kpair.left) && glyphSet.has(kpair.right)) {
                        const kern: IKerning = {
                            left: String.fromCharCode(kpair.left),
                            right: String.fromCharCode(kpair.right),
                            value: kpair.value,
                        }
                    }
                }
            }
        } catch (e) {
            console.error(e);
        }

        return {
            fontFamily,
            glyphs,
            unitsPerEm,
            yMax,
            ascent,
            descent,
            kerning,
        }

    }

    private static getGlyphAsSVG(
        font: Font,
        glyph: Glyph,
        glyphIndex: number,
        defaultHorizAdvanceX: number,
        arabInitSubst: SingleSubst,
        arabMediSubst: SingleSubst,
        arabTermSubst: SingleSubst,
        code: string):IGlyph[] {

        let substituted = false;
        const res:IGlyph[] = [];

        // arabic = "initial | medial | terminal | isolated"
        let arabInitGlyphIndex = glyphIndex;
        let arabMediGlyphIndex = glyphIndex;
        let arabTermGlyphIndex = glyphIndex;
        if (arabInitSubst) {
            arabInitGlyphIndex = arabInitSubst.substitute(glyphIndex);
        }
        if (arabMediSubst) {
            arabMediGlyphIndex = arabMediSubst.substitute(glyphIndex);
        }
        if (arabTermSubst) {
            arabTermGlyphIndex = arabTermSubst.substitute(glyphIndex);
        }

        if (arabInitGlyphIndex !== glyphIndex) {
            substituted = true;
        }

        if (arabMediGlyphIndex !== glyphIndex) {
            const glyphParsed =
                TtfFont._getGlyphAsSVG(
                    font,
                    font.getGlyph(arabMediGlyphIndex),
                    arabMediGlyphIndex,
                    defaultHorizAdvanceX,
                    code
                );
            res.push(glyphParsed);
            substituted = true;
        }

        if (arabTermGlyphIndex !== glyphIndex) {
            const glyphParsed = TtfFont._getGlyphAsSVG(
                font,
                font.getGlyph(arabTermGlyphIndex),
                arabTermGlyphIndex,
                defaultHorizAdvanceX,
                code
            );
            res.push(glyphParsed);
            substituted = true;
        }

        if (substituted) {
            const glyphParsed = TtfFont._getGlyphAsSVG(
                font,
                glyph,
                glyphIndex,
                defaultHorizAdvanceX,
                code
            );
            res.push(glyphParsed);
        } else {
            const glyphParsed = TtfFont._getGlyphAsSVG(
                font,
                glyph,
                glyphIndex,
                defaultHorizAdvanceX,
                code
            );
            res.push(glyphParsed);
        }

        return res;

    }

    private static _getGlyphAsSVG(
        font: Font,
        glyph: Glyph,
        glyphIndex: number,
        defaultHorizAdvanceX: number,
        code: string):IGlyph {

        let firstIndex = 0;
        let count = 0;
        let i: number;
        const horiz_advance_x = font.getHmtxTable().getAdvanceWidth(glyphIndex);
        const parsedGlyph = {} as IGlyph;

        if (glyphIndex === 0) {
            // missing-glyph
        } else {

            // Unicode value
            parsedGlyph.code = code;

            // Glyph name
            // const glyphName = font.getPostTable().getGlyphName(glyphIndex);
        }
        if (horiz_advance_x !== defaultHorizAdvanceX) {
            // horiz_advance_x
        }

        if (glyph) {
            const pathAccum = new StringBuffer();
            for (i = 0; i < glyph.getPointCount(); i++) {
                count++;
                if (glyph.getPoint(i).endOfContour) {
                    pathAccum.append(TtfFont.getContourAsSVGPathData(glyph, firstIndex, count));
                    firstIndex = i + 1;
                    count = 0;
                }
            }
            parsedGlyph.path = pathAccum.toString();
            parsedGlyph.width = glyph.advanceWidth;
        }

        return parsedGlyph;

    }

    private static getContourAsSVGPathData(glyph: Glyph, startIndex: number, count: number):string {

        // If this is a single point on it's own, we can't do anything with it
        if (glyph.getPoint(startIndex).endOfContour) {
            return "";
        }


        const sb = new StringBuffer();
        let offset = 0;

        while (offset < count) {
            const point = glyph.getPoint(startIndex + (offset%count));
            const point_plus1 = glyph.getPoint(startIndex + ((offset+1)%count));
            const point_plus2 = glyph.getPoint(startIndex + ((offset+2)%count));

            if (offset === 0) {
                sb.append(SvgConstants.PATH_MOVE)
                    .append(point.x)
                    .append(XMLConstants.XML_SPACE)
                    .append(point.y);
            }

            if (point.onCurve && point_plus1.onCurve) {
                if (point_plus1.x === point.x) { // This is a vertical line
                    sb.append(SvgConstants.PATH_VERTICAL_LINE_TO)
                        .append(point_plus1.y);
                } else if (point_plus1.y === point.y) { // This is a horizontal line
                    sb.append(SvgConstants.PATH_HORIZONTAL_LINE_TO)
                        .append(point_plus1.x);
                } else {
                    sb.append(SvgConstants.PATH_LINE_TO)
                        .append(point_plus1.x)
                        .append(XMLConstants.XML_SPACE)
                        .append(point_plus1.y);
                }
                offset++;
            } else if (point.onCurve && !point_plus1.onCurve && point_plus2.onCurve) {
                // This is a curve with no implied points
                sb.append(SvgConstants.PATH_QUAD_TO)
                    .append(point_plus1.x)
                    .append(XMLConstants.XML_SPACE)
                    .append(point_plus1.y)
                    .append(XMLConstants.XML_SPACE)
                    .append(point_plus2.x)
                    .append(XMLConstants.XML_SPACE)
                    .append(point_plus2.y);
                offset+=2;
            } else if (point.onCurve && !point_plus1.onCurve && !point_plus2.onCurve) {
                // This is a curve with one implied point
                sb.append(SvgConstants.PATH_QUAD_TO)
                    .append(point_plus1.x)
                    .append(XMLConstants.XML_SPACE)
                    .append(point_plus1.y)
                    .append(XMLConstants.XML_SPACE)
                    .append(this.midValue(point_plus1.x, point_plus2.x))
                    .append(XMLConstants.XML_SPACE)
                    .append(this.midValue(point_plus1.y, point_plus2.y));
                offset+=2;
            } else if (!point.onCurve && !point_plus1.onCurve) {
                // This is a curve with two implied points
                sb.append(SvgConstants.PATH_SMOOTH_QUAD_TO)
                    .append(this.midValue(point.x, point_plus1.x))
                    .append(XMLConstants.XML_SPACE)
                    .append(this.midValue(point.y, point_plus1.y));
                offset++;
            } else if (!point.onCurve && point_plus1.onCurve) {
                sb.append(SvgConstants.PATH_SMOOTH_QUAD_TO)
                    .append(point_plus1.x)
                    .append(XMLConstants.XML_SPACE)
                    .append(point_plus1.y);
                offset++;
            } else {
                console.log("drawGlyph case not catered for!!");
                break;
            }
        }
        sb.append(SvgConstants.PATH_CLOSE);

        return sb.toString();
    }

    private static midValue(a: number, b: number):number {
        return a + toInt((b - a)/2);
    }

}
