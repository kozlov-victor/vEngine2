import {DebugError} from "@engine/debug/debugError";
import {Color, IColorJSON} from "@engine/renderer/common/color";

const NAMED_COLOR_TABLE:Record<string, `#${string}`> =
    {
        aliceblue: "#f0f8ff",
        antiquewhite: "#faebd7",
        aqua: "#00ffff",
        aquamarine: "#7fffd4",
        azure: "#f0ffff",
        beige: "#f5f5dc",
        bisque: "#ffe4c4",
        black: "#000000",
        blanchedalmond: "#ffebcd",
        blue: "#0000ff",
        blueviolet: "#8a2be2",
        brown: "#a52a2a",
        burlywood: "#deb887",
        cadetblue: "#5f9ea0",
        chartreuse: "#7fff00",
        chocolate: "#d2691e",
        coral: "#ff7f50",
        cornflowerblue: "#6495ed",
        cornsilk: "#fff8dc",
        crimson: "#dc143c",
        cyan: "#00ffff",
        darkblue: "#00008b",
        darkcyan: "#008b8b",
        darkgoldenrod: "#b8860b",
        darkgray: "#a9a9a9",
        darkgreen: "#006400",
        darkkhaki: "#bdb76b",
        darkmagenta: "#8b008b",
        darkolivegreen: "#556b2f",
        darkorange: "#ff8c00",
        darkorchid: "#9932cc",
        darkred: "#8b0000",
        darksalmon: "#e9967a",
        darkseagreen: "#8fbc8f",
        darkslateblue: "#483d8b",
        darkslategray: "#2f4f4f",
        darkturquoise: "#00ced1",
        darkviolet: "#9400d3",
        deeppink: "#ff1493",
        deepskyblue: "#00bfff",
        dimgray: "#696969",
        dodgerblue: "#1e90ff",
        firebrick: "#b22222",
        floralwhite: "#fffaf0",
        forestgreen: "#228b22",
        fuchsia: "#ff00ff",
        gainsboro: "#dcdcdc",
        ghostwhite: "#f8f8ff",
        gold: "#ffd700",
        goldenrod: "#daa520",
        gray: "#808080",
        green: "#008000",
        greenyellow: "#adff2f",
        honeydew: "#f0fff0",
        hotpink: "#ff69b4",
        indianred: "#cd5c5c",
        indigo: "#4b0082",
        ivory: "#fffff0",
        khaki: "#f0e68c",
        lavender: "#e6e6fa",
        lavenderblush: "#fff0f5",
        lawngreen: "#7cfc00",
        lemonchiffon: "#fffacd",
        lightblue: "#add8e6",
        lightcoral: "#f08080",
        lightcyan: "#e0ffff",
        lightgoldenrodyellow: "#fafad2",
        lightgrey: "#d3d3d3",
        lightgreen: "#90ee90",
        lightpink: "#ffb6c1",
        lightsalmon: "#ffa07a",
        lightseagreen: "#20b2aa",
        lightskyblue: "#87cefa",
        lightslategray: "#778899",
        lightsteelblue: "#b0c4de",
        lightyellow: "#ffffe0",
        lime: "#00ff00",
        limegreen: "#32cd32",
        linen: "#faf0e6",
        magenta: "#ff00ff",
        maroon: "#800000",
        mediumaquamarine: "#66cdaa",
        mediumblue: "#0000cd",
        mediumorchid: "#ba55d3",
        mediumpurple: "#9370d8",
        mediumseagreen: "#3cb371",
        mediumslateblue: "#7b68ee",
        mediumspringgreen: "#00fa9a",
        mediumturquoise: "#48d1cc",
        mediumvioletred: "#c71585",
        midnightblue: "#191970",
        mintcream: "#f5fffa",
        mistyrose: "#ffe4e1",
        moccasin: "#ffe4b5",
        navajowhite: "#ffdead",
        navy: "#000080",
        oldlace: "#fdf5e6",
        olive: "#808000",
        olivedrab: "#6b8e23",
        orange: "#ffa500",
        orangered: "#ff4500",
        orchid: "#da70d6",
        palegoldenrod: "#eee8aa",
        palegreen: "#98fb98",
        paleturquoise: "#afeeee",
        palevioletred: "#d87093",
        papayawhip: "#ffefd5",
        peachpuff: "#ffdab9",
        peru: "#cd853f",
        pink: "#ffc0cb",
        plum: "#dda0dd",
        powderblue: "#b0e0e6",
        purple: "#800080",
        rebeccapurple: "#663399",
        red: "#ff0000",
        rosybrown: "#bc8f8f",
        royalblue: "#4169e1",
        saddlebrown: "#8b4513",
        salmon: "#fa8072",
        sandybrown: "#f4a460",
        seagreen: "#2e8b57",
        seashell: "#fff5ee",
        sienna: "#a0522d",
        silver: "#c0c0c0",
        skyblue: "#87ceeb",
        slateblue: "#6a5acd",
        slategray: "#708090",
        snow: "#fffafa",
        springgreen: "#00ff7f",
        steelblue: "#4682b4",
        tan: "#d2b48c",
        teal: "#008080",
        thistle: "#d8bfd8",
        tomato: "#ff6347",
        turquoise: "#40e0d0",
        violet: "#ee82ee",
        wheat: "#f5deb3",
        white: "#ffffff",
        whitesmoke: "#f5f5f5",
        yellow: "#ffff00",
        yellowgreen: "#9acd32"
    };

export class ColorFactory {
    private static _calculateColorComponentsFromCss(literal:string):IColorJSON {
        literal = literal.trim().toLowerCase();
        if (NAMED_COLOR_TABLE[literal]!==undefined) literal = NAMED_COLOR_TABLE[literal];
        let r:Uint8 = 0,g:Uint8 = 0,b:Uint8 = 0,a:Uint8 = 0;
        if (literal.substr(0,1)==="#") {
            const numericPart:string = literal.substr(1);
            if (numericPart.length===3) { // string like fff
                r = ~~(parseInt(numericPart.substr(0,1),16) * 0xFF / 0xF) as Uint8;
                g = ~~(parseInt(numericPart.substr(1,1),16) * 0xFF / 0xF) as Uint8;
                b = ~~(parseInt(numericPart.substr(2,1),16) * 0xFF / 0xF) as Uint8;
                a = 255;
            } else if (numericPart.length===6) { // string like rrggbb
                r = ~~(parseInt(numericPart.substr(0,2),16)) as Uint8;
                g = ~~(parseInt(numericPart.substr(2,2),16)) as Uint8;
                b = ~~(parseInt(numericPart.substr(4,2),16)) as Uint8;
                a = 255;
            } else if (numericPart.length===8) { // string like rrggbbaa
                r = ~~(parseInt(numericPart.substr(0,2),16)) as Uint8;
                g = ~~(parseInt(numericPart.substr(2,2),16)) as Uint8;
                b = ~~(parseInt(numericPart.substr(4,2),16)) as Uint8;
                a = ~~(parseInt(numericPart.substr(6,2),16)) as Uint8;
            } else {
                if (DEBUG) throw new DebugError(`unsupported or wrong color literal: ${literal}`);
            }
        }
        else {
            if (literal.indexOf('rgb')===0) {
                [r,g,b,a] = literal.split("(")[1].split(")")[0].split(",").map(x=>+x) as [Uint8,Uint8,Uint8,Uint8];
                if (a===undefined) a = 255 as Uint8;
                else a=~~(a * 255) as Uint8;
            }
            else if (literal.indexOf('hsl')===0) {
                let h: number, s: number, l: number,
                    alfa: Uint8;
                [h, s, l, alfa] = literal.split("(")[1].split(")")[0].split(",").map(x => parseInt(x)) as [number, number, number, Uint8];
                if (alfa === undefined) alfa = 255 as Uint8;
                else alfa = ~~(alfa * 255) as Uint8;
                return this.fromHSLA(h, s, l, alfa);

            } else {
                if (DEBUG) throw new DebugError(`unsupported or wrong color literal: ${literal}`);
            }
        }
        return {r,g,b,a};
    }

    public static setHSLA(color:Color,h:number,s:number,l:number,a:Uint8):void{

        h = (h%360)/360;
        s/=100;
        l/=100;

        let r, g, b:number;

        if(s === 0){
            r = g = b = l; // achromatic
        }else{
            const hue2rgb = (pCol:number, qCol:number, t:number)=>{
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return pCol + (qCol - pCol) * 6 * t;
                if(t < 1/2) return qCol;
                if(t < 2/3) return pCol + (qCol - pCol) * (2/3 - t) * 6;
                return pCol;
            };

            const q:number = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p:number = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        const rResult:Uint8 = Math.round(r * 255) as Uint8;
        const gResult:Uint8 = Math.round(g * 255) as Uint8;
        const bResult:Uint8 = Math.round(b * 255) as Uint8;
        color.setRGBA(rResult,gResult,bResult,a);
    }


    public static setHSV(color:Color,h:number,s:number,v:number):void{
        h/=100;
        s/=100;
        v/=100;
        let r:number = 0, g:number = 0, b:number = 0;

        const i:number = Math.floor(h * 6);
        const f:number = h * 6 - i;
        const p:number = v * (1 - s);
        const q:number = v * (1 - f * s);
        const t:number = v * (1 - (1 - f) * s);

        switch (i % 6) {
            case 0: {
                r = v; g = t;
                b = p; break;
            }
            case 1: {
                r = q; g = v;
                b = p;
                break;
            }
            case 2: {
                r = p; g = v;
                b = t;
                break;
            }
            case 3: {
                r = p; g = q;
                b = v;
                break;
            }
            case 4: {
                r = t; g = p;
                b = v;
                break;
            }
            case 5: {
                r = v; g = p;
                b = q;
                break;
            }
        }
        color.setRGB(
            ~~(r*255) as Uint8,
            ~~(b*255) as Uint8,
            ~~(b*255) as Uint8,
        );
    }

    public static setHSL(color:Color,h:number,s:number,l:number):void{
        this.setHSLA(color,h,s,l,255);
    }

    // https://stackoverflow.com/questions/11068240/what-is-the-most-efficient-way-to-parse-a-css-color-in-javascript
    public static fromCSS(val:string):Color {
        const json:IColorJSON = this._calculateColorComponentsFromCss(val);
        const c = new Color();
        c.fromJSON(json);
        return c;
    }

    /**
     * @param h angle in degrees
     * @param s saturation 0-100%
     * @param l light 0-100%
     * @param a alpha 0-255
     */
    public static fromHSLA(h:number,s:number,l:number,a:Uint8):Color{
        const c:Color = new Color();
        this.setHSLA(c,h,s,l,a);
        return c;
    }

    public static fromHSL(h:number,s:number,l:number):Color{
        return this.fromHSLA(h,s,l,255);
    }

    /**
     * @param h hue 0-100%
     * @param s saturation 0-100%
     * @param v value 0-100%
     */
    public static fromHSV(h:number,s:number,v:number):Color{
        const c:Color = new Color();
        this.setHSV(c,h,s,v);
        return c;
    }

}
