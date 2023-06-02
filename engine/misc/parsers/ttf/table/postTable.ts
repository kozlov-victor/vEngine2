import {Table, TableConsts} from "@engine/misc/parsers/ttf/table/table";
import {DirectoryEntry} from "@engine/misc/parsers/ttf/table/directoryEntry";
import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";

export class PostTable implements Table {

    private static readonly macGlyphName = [
        ".notdef",      // 0
        "null",         // 1
        "CR",           // 2
        "space",        // 3
        "exclam",       // 4
        "quotedbl",     // 5
        "numbersign",   // 6
        "dollar",       // 7
        "percent",      // 8
        "ampersand",    // 9
        "quotesingle",  // 10
        "parenleft",    // 11
        "parenright",   // 12
        "asterisk",     // 13
        "plus",         // 14
        "comma",        // 15
        "hyphen",       // 16
        "period",       // 17
        "slash",        // 18
        "zero",         // 19
        "one",          // 20
        "two",          // 21
        "three",        // 22
        "four",         // 23
        "five",         // 24
        "six",          // 25
        "seven",        // 26
        "eight",        // 27
        "nine",         // 28
        "colon",        // 29
        "semicolon",    // 30
        "less",         // 31
        "equal",        // 32
        "greater",      // 33
        "question",     // 34
        "at",           // 35
        "A",            // 36
        "B",            // 37
        "C",            // 38
        "D",            // 39
        "E",            // 40
        "F",            // 41
        "G",            // 42
        "H",            // 43
        "I",            // 44
        "J",            // 45
        "K",            // 46
        "L",            // 47
        "M",            // 48
        "N",            // 49
        "O",            // 50
        "P",            // 51
        "Q",            // 52
        "R",            // 53
        "S",            // 54
        "T",            // 55
        "U",            // 56
        "V",            // 57
        "W",            // 58
        "X",            // 59
        "Y",            // 60
        "Z",            // 61
        "bracketleft",  // 62
        "backslash",    // 63
        "bracketright", // 64
        "asciicircum",  // 65
        "underscore",   // 66
        "grave",        // 67
        "a",            // 68
        "b",            // 69
        "c",            // 70
        "d",            // 71
        "e",            // 72
        "f",            // 73
        "g",            // 74
        "h",            // 75
        "i",            // 76
        "j",            // 77
        "k",            // 78
        "l",            // 79
        "m",            // 80
        "n",            // 81
        "o",            // 82
        "p",            // 83
        "q",            // 84
        "r",            // 85
        "s",            // 86
        "t",            // 87
        "u",            // 88
        "v",            // 89
        "w",            // 90
        "x",            // 91
        "y",            // 92
        "z",            // 93
        "braceleft",    // 94
        "bar",          // 95
        "braceright",   // 96
        "asciitilde",   // 97
        "Adieresis",    // 98
        "Aring",        // 99
        "Ccedilla",     // 100
        "Eacute",       // 101
        "Ntilde",       // 102
        "Odieresis",    // 103
        "Udieresis",    // 104
        "aacute",       // 105
        "agrave",       // 106
        "acircumflex",  // 107
        "adieresis",    // 108
        "atilde",       // 109
        "aring",        // 110
        "ccedilla",     // 111
        "eacute",       // 112
        "egrave",       // 113
        "ecircumflex",  // 114
        "edieresis",    // 115
        "iacute",       // 116
        "igrave",       // 117
        "icircumflex",  // 118
        "idieresis",    // 119
        "ntilde",       // 120
        "oacute",       // 121
        "ograve",       // 122
        "ocircumflex",  // 123
        "odieresis",    // 124
        "otilde",       // 125
        "uacute",       // 126
        "ugrave",       // 127
        "ucircumflex",  // 128
        "udieresis",    // 129
        "dagger",       // 130
        "degree",       // 131
        "cent",         // 132
        "sterling",     // 133
        "section",      // 134
        "bullet",       // 135
        "paragraph",    // 136
        "germandbls",   // 137
        "registered",   // 138
        "copyright",    // 139
        "trademark",    // 140
        "acute",        // 141
        "dieresis",     // 142
        "notequal",     // 143
        "AE",           // 144
        "Oslash",       // 145
        "infinity",     // 146
        "plusminus",    // 147
        "lessequal",    // 148
        "greaterequal", // 149
        "yen",          // 150
        "mu",           // 151
        "partialdiff",  // 152
        "summation",    // 153
        "product",      // 154
        "pi",           // 155
        "integral'",    // 156
        "ordfeminine",  // 157
        "ordmasculine", // 158
        "Omega",        // 159
        "ae",           // 160
        "oslash",       // 161
        "questiondown", // 162
        "exclamdown",   // 163
        "logicalnot",   // 164
        "radical",      // 165
        "florin",       // 166
        "approxequal",  // 167
        "increment",    // 168
        "guillemotleft",// 169
        "guillemotright",//170
        "ellipsis",     // 171
        "nbspace",      // 172
        "Agrave",       // 173
        "Atilde",       // 174
        "Otilde",       // 175
        "OE",           // 176
        "oe",           // 177
        "endash",       // 178
        "emdash",       // 179
        "quotedblleft", // 180
        "quotedblright",// 181
        "quoteleft",    // 182
        "quoteright",   // 183
        "divide",       // 184
        "lozenge",      // 185
        "ydieresis",    // 186
        "Ydieresis",    // 187
        "fraction",     // 188
        "currency",     // 189
        "guilsinglleft",// 190
        "guilsinglright",//191
        "fi",           // 192
        "fl",           // 193
        "daggerdbl",    // 194
        "middot",       // 195
        "quotesinglbase",//196
        "quotedblbase", // 197
        "perthousand",  // 198
        "Acircumflex",  // 199
        "Ecircumflex",  // 200
        "Aacute",       // 201
        "Edieresis",    // 202
        "Egrave",       // 203
        "Iacute",       // 204
        "Icircumflex",  // 205
        "Idieresis",    // 206
        "Igrave",       // 207
        "Oacute",       // 208
        "Ocircumflex",  // 209
        "",             // 210
        "Ograve",       // 211
        "Uacute",       // 212
        "Ucircumflex",  // 213
        "Ugrave",       // 214
        "dotlessi",     // 215
        "circumflex",   // 216
        "tilde",        // 217
        "overscore",    // 218
        "breve",        // 219
        "dotaccent",    // 220
        "ring",         // 221
        "cedilla",      // 222
        "hungarumlaut", // 223
        "ogonek",       // 224
        "caron",        // 225
        "Lslash",       // 226
        "lslash",       // 227
        "Scaron",       // 228
        "scaron",       // 229
        "Zcaron",       // 230
        "zcaron",       // 231
        "brokenbar",    // 232
        "Eth",          // 233
        "eth",          // 234
        "Yacute",       // 235
        "yacute",       // 236
        "Thorn",        // 237
        "thorn",        // 238
        "minus",        // 239
        "multiply",     // 240
        "onesuperior",  // 241
        "twosuperior",  // 242
        "threesuperior",// 243
        "onehalf",      // 244
        "onequarter",   // 245
        "threequarters",// 246
        "franc",        // 247
        "Gbreve",       // 248
        "gbreve",       // 249
        "Idot",         // 250
        "Scedilla",     // 251
        "scedilla",     // 252
        "Cacute",       // 253
        "cacute",       // 254
        "Ccaron",       // 255
        "ccaron",       // 256
        ""              // 257
    ]

    private version: number;
    private italicAngle: number;
    private underlinePosition: number;
    private underlineThickness: number;
    private isFixedPitch: number;
    private minMemType42: number;
    private maxMemType42: number;
    private minMemType1: number;
    private maxMemType1: number;

    // v2
    private numGlyphs: number;
    private glyphNameIndex: number[];
    private psGlyphName: string[];

    constructor(de: DirectoryEntry, raf: RandomAccessFile)  {
        raf.seek(de.offset);
        this.version = raf.readInt();
        this.italicAngle = raf.readInt();
        this.underlinePosition = raf.readShort();
        this.underlineThickness = raf.readShort();
        this.isFixedPitch = raf.readInt();
        this.minMemType42 = raf.readInt();
        this.maxMemType42 = raf.readInt();
        this.minMemType1 = raf.readInt();
        this.maxMemType1 = raf.readInt();

        if (this.version == 0x00020000) {
            this.numGlyphs = raf.readUnsignedShort();
            this.glyphNameIndex = new Array(this.numGlyphs);
            for (let i = 0; i < this.numGlyphs; i++) {
                this.glyphNameIndex[i] = raf.readUnsignedShort();
            }
            let h = this.highestGlyphNameIndex();
            if (h > 257) {
                h -= 257;
                this.psGlyphName = new Array(h);
                for (let i = 0; i < h; i++) {
                    const len = raf.readUnsignedByte();
                    const buf:number[] = new Array(len);
                    raf.readFully(buf);
                    this.psGlyphName[i] = String.fromCharCode(...buf); // todo
                }
            }
        } else if (this.version == 0x00020005) {
            // pass
        }
    }

    private highestGlyphNameIndex() {
        let high = 0;
        for (let i = 0; i < this.numGlyphs; i++) {
            if (high < this.glyphNameIndex[i]) {
                high = this.glyphNameIndex[i];
            }
        }
        return high;
    }

    public getGlyphName(i: number) {
        if (this.version === 0x00020000) {
            return (this.glyphNameIndex[i] > 257)
                ? this.psGlyphName[this.glyphNameIndex[i] - 258]
                : PostTable.macGlyphName[this.glyphNameIndex[i]];
        } else {
            return null;
        }
    }

    public getType() {
        return TableConsts.post;
    }

}
