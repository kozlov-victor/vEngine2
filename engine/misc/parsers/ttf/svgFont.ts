import {XMLConstants} from "@engine/misc/parsers/ttf/constants/xmlConstants";
import {Glyph} from "@engine/misc/parsers/ttf/glyph";
import {SvgConstants} from "@engine/misc/parsers/ttf/constants/svgConstants";
import {TableConsts} from "@engine/misc/parsers/ttf/table/table";
import {Font} from "@engine/misc/parsers/ttf/font";
import {CmapFormat} from "@engine/misc/parsers/ttf/table/cmapFormat";
import {GsubTable} from "@engine/misc/parsers/ttf/table/gsubTable";
import {SingleSubst} from "@engine/misc/parsers/ttf/table/singleSubst";
import {ScriptTags} from "@engine/misc/parsers/ttf/table/scriptTags";
import {FeatureTags} from "@engine/misc/parsers/ttf/table/featureTags";
import {KernTable} from "@engine/misc/parsers/ttf/table/kernTable";
import {PostTable} from "@engine/misc/parsers/ttf/table/postTable";
import {KerningPair} from "@engine/misc/parsers/ttf/table/kerningPair";
import {toInt} from "@engine/misc/parsers/ttf/misc/toInt";
import {StringBuffer} from "@engine/misc/parsers/ttf/misc/stringBuffer";
import {PrintStream} from "@engine/misc/parsers/ttf/misc/printStream";

export class SVGFont {
    private static readonly EOL = '\n';
    private static readonly DEFAULT_FIRST = 32;
    private static readonly DEFAULT_LAST = 126;
    private static QUOT_EOL = XMLConstants.XML_CHAR_QUOT + SVGFont.EOL;


    protected static encodeEntities(s: string):string {
        const sb = new StringBuffer();
        for (let i = 0; i < s.length; i++) {
            if (s.charAt(i) === XMLConstants.XML_CHAR_LT) {
                sb.append(XMLConstants.XML_ENTITY_LT);
            } else if (s.charAt(i) === XMLConstants.XML_CHAR_GT) {
                sb.append(XMLConstants.XML_ENTITY_GT);
            } else if (s.charAt(i) === XMLConstants.XML_CHAR_AMP) {
                sb.append(XMLConstants.XML_ENTITY_AMP);
            } else if (s.charAt(i) === XMLConstants.XML_CHAR_APOS) {
                sb.append(XMLConstants.XML_ENTITY_APOS);
            } else if(s.charAt(i) === XMLConstants.XML_CHAR_QUOT) {
                sb.append(XMLConstants.XML_ENTITY_QUOT);
            } else {
                sb.append(s.charAt(i));
            }
        }
        return sb.toString();
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

    protected static getSVGFontFaceElement(font: Font): string {
        const sb = new StringBuffer();
        const fontFamily = font.getNameTable().getRecord(TableConsts.nameFontFamilyName);
        const unitsPerEm = font.getHeadTable().unitsPerEm;
        const panose = font.getOS2Table().panose.toString();
        const ascent = font.getHheaTable().ascender;
        const descent = font.getHheaTable().descender;
        const baseline = 0; // bit 0 of head.flags will indicate if this is true

        //      <!ELEMENT font-face (%descTitleMetadata;,font-face-src?,definition-src?) >
        //           <!ATTLIST font-face
        //             %stdAttrs;
        //             font-family CDATA #IMPLIED
        //             font-style CDATA #IMPLIED
        //             font-variant CDATA #IMPLIED
        //             font-weight CDATA #IMPLIED
        //             font-stretch CDATA #IMPLIED
        //             font-size CDATA #IMPLIED
        //             unicode-range CDATA #IMPLIED
        //             units-per-em %Number; #IMPLIED
        //             panose-1 CDATA #IMPLIED
        //             stemv %Number; #IMPLIED
        //             stemh %Number; #IMPLIED
        //             slope %Number; #IMPLIED
        //             cap-height %Number; #IMPLIED
        //             x-height %Number; #IMPLIED
        //             accent-height %Number; #IMPLIED
        //             ascent %Number; #IMPLIED
        //             descent %Number; #IMPLIED
        //             widths CDATA #IMPLIED
        //             bbox CDATA #IMPLIED
        //             ideographic %Number; #IMPLIED
        //             alphabetic %Number; #IMPLIED
        //             mathematical %Number; #IMPLIED
        //             hanging %Number; #IMPLIED
        //             v-ideographic %Number; #IMPLIED
        //             v-alphabetic %Number; #IMPLIED
        //             v-mathematical %Number; #IMPLIED
        //             v-hanging %Number; #IMPLIED
        //             underline-position %Number; #IMPLIED
        //             underline-thickness %Number; #IMPLIED
        //             strikethrough-position %Number; #IMPLIED
        //             strikethrough-thickness %Number; #IMPLIED
        //             overline-position %Number; #IMPLIED
        //             overline-thickness %Number; #IMPLIED >

        sb.append(XMLConstants.XML_OPEN_TAG_START).append(SvgConstants.SVG_FONT_FACE_TAG).append(SVGFont.EOL)
            .append(XMLConstants.XML_TAB).append(SvgConstants.SVG_FONT_FAMILY_ATTRIBUTE).append(XMLConstants.XML_EQUAL_QUOT).append(fontFamily).append(SVGFont.QUOT_EOL)
            // .append("  font-family=\"").append(fontFamily).append("\"\r\n")
            .append(XMLConstants.XML_TAB).append(SvgConstants.SVG_UNITS_PER_EM_ATTRIBUTE).append(XMLConstants.XML_EQUAL_QUOT).append(unitsPerEm).append(SVGFont.QUOT_EOL)
            //.append("  units-per-em=\"").append(unitsPerEm).append("\"\r\n")
            .append(XMLConstants.XML_TAB).append(SvgConstants.SVG_PANOSE_1_ATTRIBUTE).append(XMLConstants.XML_EQUAL_QUOT).append(panose).append(SVGFont.QUOT_EOL)
            // .append("  panose-1=\"").append(panose).append("\"\r\n")
            .append(XMLConstants.XML_TAB).append(SvgConstants.SVG_ASCENT_ATTRIBUTE).append(XMLConstants.XML_EQUAL_QUOT).append(ascent).append(SVGFont.QUOT_EOL)
            // .append("  ascent=\"").append(ascent).append("\"\r\n")
            .append(XMLConstants.XML_TAB).append(SvgConstants.SVG_DESCENT_ATTRIBUTE).append(XMLConstants.XML_EQUAL_QUOT).append(descent).append(SVGFont.QUOT_EOL)
            // .append("  descent=\"").append(descent).append("\"\r\n")
            .append(XMLConstants.XML_TAB).append(SvgConstants.SVG_ALPHABETIC_ATTRIBUTE).append(XMLConstants.XML_EQUAL_QUOT).append(baseline).append(XMLConstants.XML_CHAR_QUOT)
            .append(XMLConstants.XML_OPEN_TAG_END_NO_CHILDREN).append(SVGFont.EOL);
            //.append("  baseline=\"").append(baseline).append("\"/>\r\n");

        return sb.toString();
    }

    /**
     * Returns a &lt;font&gt;&#x2e;&#x2e;&#x2e;&lt;/font&gt; block,
     * defining the specified font.
     *
     * @param ps
     * @param font The TrueType font to be converted to SVG
     * @param id An XML id attribute for the font element
     * @param first The first character in the output range
     * @param last The last character in the output range
     * @param autoRange
     * @param forceAscii Force the use of the ASCII character map
     */
    protected static writeFontAsSVGFragment(ps: PrintStream, font: Font, id: string, first: number, last: number, autoRange: boolean, forceAscii: boolean):void {
        //    StringBuffer sb = new StringBuffer();
        //    int horiz_advance_x = font.getHmtxTable().getAdvanceWidth(
        //      font.getHheaTable().getNumberOfHMetrics() - 1);
        const horiz_advance_x = font.getOS2Table().xAvgCharWidth;

        ps.print(XMLConstants.XML_OPEN_TAG_START);
        ps.print(SvgConstants.SVG_FONT_TAG);
        ps.print(XMLConstants.XML_SPACE);
        // ps.print("<font ");
        if (id) {
            ps.print(SvgConstants.SVG_ID_ATTRIBUTE);
            ps.print(XMLConstants.XML_EQUAL_QUOT);
            // ps.print("id=\"");
            ps.print(id);
            ps.print(XMLConstants.XML_CHAR_QUOT);
            ps.print(XMLConstants.XML_SPACE);
            // ps.print("\" ");
        }

        ps.print(SvgConstants.SVG_HORIZ_ADV_X_ATTRIBUTE);
        ps.print(XMLConstants.XML_EQUAL_QUOT);
        // ps.print("horiz-adv-x=\"");
        ps.print(horiz_advance_x);
        ps.print(XMLConstants.XML_CHAR_QUOT);
        ps.print(XMLConstants.XML_OPEN_TAG_END_CHILDREN);
        // ps.println("\">");

        ps.print(this.getSVGFontFaceElement(font));

        // Decide upon a cmap table to use for our character to glyph look-up
        let cmapFmt:CmapFormat;
        if (forceAscii) {
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
        ps.println(this.getGlyphAsSVG(font, font.getGlyph(0), 0, horiz_advance_x,
            initialSubst, medialSubst, terminalSubst, ""));

        try {
            if (first === -1) {
                if (!autoRange) first = SVGFont.DEFAULT_FIRST;
                else            first = cmapFmt.getFirst();
            }
            if (last === -1) {
                if (!autoRange) last = SVGFont.DEFAULT_LAST;
                else            last = cmapFmt.getLast();
            }

            // Include our requested range
            const glyphSet = new Set();
            for (let i = first; i <= last; i++) {
                const glyphIndex = cmapFmt.mapCharCode(i);
                //        ps.println(String.valueOf(i) + " -> " + String.valueOf(glyphIndex));
                //      if (font.getGlyphs()[glyphIndex] != null)
                //        sb.append(font.getGlyphs()[glyphIndex].toString() + "\n");

                if (glyphIndex > 0) {
                    // add glyph ID to set so we can filter later
                    glyphSet.add(glyphIndex);

                    ps.println(this.getGlyphAsSVG(
                        font,
                        font.getGlyph(glyphIndex),
                        glyphIndex,
                        horiz_advance_x,
                        initialSubst, medialSubst, terminalSubst,
                        (32 <= i && i <= 127) ?
                        this.encodeEntities( String.fromCharCode(i) ) :
                        XMLConstants.XML_CHAR_REF_PREFIX + i.toString(16) + XMLConstants.XML_CHAR_REF_SUFFIX));
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
                        ps.println(this.getKerningPairAsSVG(kpair, post));
                    }
                }
            }
        } catch (e) {
            console.error(e);
        }

        ps.print(XMLConstants.XML_CLOSE_TAG_START);
        ps.print(SvgConstants.SVG_FONT_TAG);
        ps.println(XMLConstants.XML_CLOSE_TAG_END);
        // ps.println("</font>");
    }

    private static _getGlyphAsSVG(
            font: Font,
            glyph: Glyph,
            glyphIndex: number,
            defaultHorizAdvanceX: number,
            attrib: string,
            code: string):string {

        const sb = new StringBuffer();
        let firstIndex = 0;
        let count = 0;
        let i: number;
        const horiz_advance_x = font.getHmtxTable().getAdvanceWidth(glyphIndex);

        if (glyphIndex === 0) {
            sb.append(XMLConstants.XML_OPEN_TAG_START);
            sb.append(SvgConstants.SVG_MISSING_GLYPH_TAG);
            // sb.append("<missing-glyph");
        } else {

            // Unicode value
            sb.append(XMLConstants.XML_OPEN_TAG_START)
                .append(SvgConstants.SVG_GLYPH_TAG).append(XMLConstants.XML_SPACE).append(SvgConstants.SVG_UNICODE_ATTRIBUTE)
                .append(XMLConstants.XML_EQUAL_QUOT).append(code).append(XMLConstants.XML_CHAR_QUOT);
            // sb.append("<glyph unicode=\"").append(code).append("\"");

            // Glyph name
            const glyphName = font.getPostTable().getGlyphName(glyphIndex);
            if (glyphName) {
                sb.append(XMLConstants.XML_SPACE).append(SvgConstants.SVG_GLYPH_NAME_ATTRIBUTE).append(XMLConstants.XML_EQUAL_QUOT)
                    // sb.append(" glyph-name=\"")
                    .append(glyphName)
                    // .append("\"");
                    .append(XMLConstants.XML_CHAR_QUOT);
            }
        }
        if (horiz_advance_x !== defaultHorizAdvanceX) {
            sb.append(XMLConstants.XML_SPACE).append(SvgConstants.SVG_HORIZ_ADV_X_ATTRIBUTE).append(XMLConstants.XML_EQUAL_QUOT)
                .append(horiz_advance_x).append(XMLConstants.XML_CHAR_QUOT);
            // sb.append(" horiz-adv-x=\"").append(horiz_advance_x).append("\"");
        }

        if (attrib) {
            sb.append(attrib);
        }

        if (glyph) {
            // sb.append(" d=\"");
            sb.append(XMLConstants.XML_SPACE).append(SvgConstants.SVG_D_ATTRIBUTE).append(XMLConstants.XML_EQUAL_QUOT);
            for (i = 0; i < glyph.getPointCount(); i++) {
                count++;
                if (glyph.getPoint(i).endOfContour) {
                    sb.append(SVGFont.getContourAsSVGPathData(glyph, firstIndex, count));
                    firstIndex = i + 1;
                    count = 0;
                }
            }
            // sb.append("\"");
            sb.append(XMLConstants.XML_CHAR_QUOT);
        }

        sb.append(XMLConstants.XML_OPEN_TAG_END_NO_CHILDREN);
        // sb.append("/>");

        // Chop-up the string into 255 character lines
        SVGFont.chopUpStringBuffer(sb);

        return sb.toString();
    }

    private static getGlyphAsSVG(
            font: Font,
            glyph: Glyph,
            glyphIndex: number,
            defaultHorizAdvanceX: number,
            arabInitSubst: SingleSubst,
            arabMediSubst: SingleSubst,
            arabTermSubst: SingleSubst,
            code: string):string {

        const sb = new StringBuffer();
        let substituted = false;

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
            sb.append(SVGFont._getGlyphAsSVG(
                font,
                font.getGlyph(arabInitGlyphIndex),
                arabInitGlyphIndex,
                defaultHorizAdvanceX,
                // " arabic-form=\"initial\"",
                (XMLConstants.XML_SPACE + SvgConstants.SVG_ARABIC_FORM_ATTRIBUTE + XMLConstants.XML_EQUAL_QUOT +
                    SvgConstants.SVG_INITIAL_VALUE + XMLConstants.XML_CHAR_QUOT),
                code));
            // sb.append("\r\n");
            sb.append(SVGFont.EOL);
            substituted = true;
        }

        if (arabMediGlyphIndex !== glyphIndex) {
            sb.append(SVGFont._getGlyphAsSVG(
                font,
                font.getGlyph(arabMediGlyphIndex),
                arabMediGlyphIndex,
                defaultHorizAdvanceX,
                // " arabic-form=\"medial\"",
                (XMLConstants.XML_SPACE + SvgConstants.SVG_ARABIC_FORM_ATTRIBUTE + XMLConstants.XML_EQUAL_QUOT +
                    SvgConstants.SVG_MEDIAL_VALUE + XMLConstants.XML_CHAR_QUOT),
                code));
            // sb.append("\r\n");
            sb.append(SVGFont.EOL);
            substituted = true;
        }

        if (arabTermGlyphIndex !== glyphIndex) {
            sb.append(SVGFont._getGlyphAsSVG(
                font,
                font.getGlyph(arabTermGlyphIndex),
                arabTermGlyphIndex,
                defaultHorizAdvanceX,
                // " arabic-form=\"terminal\"",
                (XMLConstants.XML_SPACE + SvgConstants.SVG_ARABIC_FORM_ATTRIBUTE + XMLConstants.XML_EQUAL_QUOT +
                    SvgConstants.SVG_TERMINAL_VALUE + XMLConstants.XML_CHAR_QUOT),
                code));
            // sb.append("\r\n");
            sb.append(SVGFont.EOL);
            substituted = true;
        }

        if (substituted) {
            sb.append(SVGFont._getGlyphAsSVG(
                font,
                glyph,
                glyphIndex,
                defaultHorizAdvanceX,
                // " arabic-form=\"isolated\"",
                (XMLConstants.XML_SPACE + SvgConstants.SVG_ARABIC_FORM_ATTRIBUTE + XMLConstants.XML_EQUAL_QUOT +
                    SvgConstants.SVG_ISOLATED_VALUE + XMLConstants.XML_CHAR_QUOT),
                code));
        } else {
            sb.append(SVGFont._getGlyphAsSVG(
                font,
                glyph,
                glyphIndex,
                defaultHorizAdvanceX,
                null!,
                code));
        }

        return sb.toString();
    }

    protected static getKerningPairAsSVG(kp: KerningPair,post: PostTable): string {
        const leftGlyphName = post.getGlyphName(kp.left);
        const rightGlyphName = post.getGlyphName(kp.right);

        const sb = new StringBuffer();
        // sb.append("<hkern ");
        sb.append(XMLConstants.XML_OPEN_TAG_START).append(SvgConstants.SVG_HKERN_TAG).append(XMLConstants.XML_SPACE);

        if (!leftGlyphName) {
            sb.append(SvgConstants.SVG_U1_ATTRIBUTE).append(XMLConstants.XML_EQUAL_QUOT);

            sb.append(kp.left);
        } else {
            // sb.append("g1=\"");
            sb.append(SvgConstants.SVG_G1_ATTRIBUTE).append(XMLConstants.XML_EQUAL_QUOT);

            sb.append(leftGlyphName);
        }

        // sb.append("\" ");
        sb.append(XMLConstants.XML_CHAR_QUOT).append(XMLConstants.XML_SPACE);

        if (!rightGlyphName) {
            // sb.append("u2=\"");
            sb.append(SvgConstants.SVG_U2_ATTRIBUTE).append(XMLConstants.XML_EQUAL_QUOT);

            sb.append(kp.right);
        } else {
            // sb.append("g2=\"");
            sb.append(SvgConstants.SVG_G2_ATTRIBUTE).append(XMLConstants.XML_EQUAL_QUOT);

            sb.append(rightGlyphName);
        }

        // sb.append("\" k=\"");
        sb.append(XMLConstants.XML_CHAR_QUOT).append(XMLConstants.XML_SPACE).append(SvgConstants.SVG_K_ATTRIBUTE).append(XMLConstants.XML_EQUAL_QUOT);

        // SVG kerning values are inverted from TrueType's.
        sb.append(-kp.value);
        // sb.append("\"/>");
        sb.append(XMLConstants.XML_CHAR_QUOT).append(XMLConstants.XML_OPEN_TAG_END_NO_CHILDREN);

        return sb.toString();
    }
/*
    protected static String getGlyphAsPath(Glyph glyph) {
        StringBuffer sb = new StringBuffer();
        int firstIndex = 0;
        int count = 0;
        int i;

        for (i = 0; i < glyph.getPointCount(); i++) {
            count++;
            if (glyph.getPoint(i).endOfContour) {
                sb.append(getContourAsSVGPathData(glyph, firstIndex, count));
                firstIndex = i + 1;
                count = 0;
            }
        }
        return sb.toString();
    }

    protected static void writeTextAsSVGFragment(PrintStream ps, Font f, int size, String text) {
        CmapFormat cmapFmt = f.getCmapTable().getCmapFormat(Table.platformMicrosoft, Table.encodingUGL);
        int x = 0;
        for (short i = 0; i < text.length(); i++) {
            int glyphIndex = cmapFmt.mapCharCode((short)text.charAt(i));
            Glyph glyph = f.getGlyph(glyphIndex);
            if (glyph != null) {
                ps.println(translateSVG(x, 0, getGlyphAsSVGPath(glyph)));
                x += glyph.getAdvanceWidth();
            }
        }
    }
*/
    protected static writeSvgBegin(ps: PrintStream): void {
        ps.println("<?xml version=\"1.0\" standalone=\"no\"?> <!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 20001102//EN\"");
        ps.println("\"http://www.w3.org/TR/2000/CR-SVG-20001102/DTD/svg-20001102.dtd\" >");
        ps.println("<svg width=\"100%\" height=\"100%\">");
        // ps.println(Messages.formatMessage(CONFIG_SVG_BEGIN,
        //                                   new Object[]{SVG_PUBLIC_ID, SVG_SYSTEM_ID}));

    }

    protected static writeSvgDefsBegin(ps: PrintStream): void {
        //ps.println("<defs>");
        ps.println(XMLConstants.XML_OPEN_TAG_START + SvgConstants.SVG_DEFS_TAG + XMLConstants.XML_OPEN_TAG_END_CHILDREN);
    }

    protected static writeSvgDefsEnd(ps: PrintStream):void {
        // ps.println("</defs>");
        ps.println(XMLConstants.XML_CLOSE_TAG_START + SvgConstants.SVG_DEFS_TAG + XMLConstants.XML_CLOSE_TAG_END);
    }

    protected static writeSvgEnd(ps: PrintStream):void {
        // ps.println("</svg>");
        ps.println(XMLConstants.XML_CLOSE_TAG_START + SvgConstants.SVG_SVG_TAG + XMLConstants.XML_CLOSE_TAG_END);
    }

    protected static writeSvgTestCard(ps: PrintStream, fontFamily: string):void {
        ps.println(SvgConstants.SVG_TEST_CARD_START);
        ps.println(fontFamily);
        ps.println(SvgConstants.SVG_TEST_CARD_END);

        /*ps.println("<g style=\"font-family: '" + fontFamily + "'; font-size:18;fill:black\">");
        ps.println("<text x=\"20\" y=\"60\"> !&quot;#$%&amp;&apos;()*+,-./0123456789:;&lt;&gt;?</text>");
        ps.println("<text x=\"20\" y=\"120\">@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_</text>");
        ps.println("<text x=\"20\" y=\"180\">`abcdefghijklmnopqrstuvwxyz{|}~</text>");
        ps.println("<text x=\"20\" y=\"240\">&#x80;&#x81;&#x82;&#x83;&#x84;&#x85;&#x86;&#x87;&#x88;&#x89;&#x8a;&#x8b;
        &#x8c;&#x8d;&#x8e;&#x8f;&#x90;&#x91;&#x92;&#x93;&#x94;&#x95;&#x96;&#x97;&#x98;&#x99;&#x9a;&#x9b;&#x9c;&#x9d;
        &#x9e;&#x9f;</text>");
        ps.println("<text x=\"20\" y=\"300\">&#xa0;&#xa1;&#xa2;&#xa3;&#xa4;&#xa5;&#xa6;&#xa7;&#xa8;&#xa9;&#xaa;&#xab;
        &#xac;&#xad;&#xae;&#xaf;&#xb0;&#xb1;&#xb2;&#xb3;&#xb4;&#xb5;&#xb6;&#xb7;&#xb8;&#xb9;&#xba;&#xbb;&#xbc;&#xbd;
        &#xbe;&#xbf;</text>");
        ps.println("<text x=\"20\" y=\"360\">&#xc0;&#xc1;&#xc2;&#xc3;&#xc4;&#xc5;&#xc6;&#xc7;&#xc8;&#xc9;&#xca;&#xcb;
        &#xcc;&#xcd;&#xce;&#xcf;&#xd0;&#xd1;&#xd2;&#xd3;&#xd4;&#xd5;&#xd6;&#xd7;&#xd8;&#xd9;&#xda;&#xdb;&#xdc;&#xdd;
        &#xde;&#xdf;</text>");
        ps.println("<text x=\"20\" y=\"420\">&#xe0;&#xe1;&#xe2;&#xe3;&#xe4;&#xe5;&#xe6;&#xe7;&#xe8;&#xe9;&#xea;&#xeb;
        &#xec;&#xed;&#xee;&#xef;&#xf0;&#xf1;&#xf2;&#xf3;&#xf4;&#xf5;&#xf6;&#xf7;&#xf8;&#xf9;&#xfa;&#xfb;&#xfc;&#xfd;
        &#xfe;&#xff;</text>");
        ps.println("</g>");*/
    }


    public static renderToXml(buff:ArrayBuffer):string {
        const ps = new PrintStream();
        const font = Font.create(buff);

        const id = '';
        const low:number = undefined!;
        const high:number = undefined!;
        const autoRange = false;
        const ascii = false;
        const testCard = false;

        // Write the various parts of the SVG file
        SVGFont.writeSvgBegin(ps);
        SVGFont.writeSvgDefsBegin(ps);
        SVGFont.writeFontAsSVGFragment(
            ps,
            font,
            id,
            low ?? -1,
            high ?? -1,
            autoRange,
            ascii
        );
        SVGFont.writeSvgDefsEnd(ps);
        if (testCard) {
            const fontFamily = font.getNameTable().getRecord(TableConsts.nameFontFamilyName);
            SVGFont.writeSvgTestCard(ps, fontFamily);
        }
        SVGFont.writeSvgEnd(ps);
        return ps.toString();
    }

    private static chopUpStringBuffer(sb: StringBuffer):void {
        if (sb.length() < 256) {
            return;
        } else {
            // Being rather simplistic about it, for now we'll insert a newline after
            // 240 chars
            for (let i = 240; i < sb.length(); i++) {
                if (sb.charAt(i) == ' ') {
                    sb.setCharAt(i, '\n');
                    i += 240;
                }
            }
        }
    }

    private static midValue(a: number, b: number):number {
        return a + toInt((b - a)/2);
    }

    /*private static String translateSVG(int x, int y, String svgText) {
        StringBuffer sb = new StringBuffer();
        sb.append("<g transform=\"translate(")
            .append(String.valueOf(x))
            .append(" ")
            .append(String.valueOf(y))
            .append(")\">")
            .append(svgText)
            .append("</g>");
        return sb.toString();
        }*/
}
