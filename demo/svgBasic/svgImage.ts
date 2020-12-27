import {NullGameObject} from "@engine/renderable/impl/general/nullGameObject";
import {Game} from "@engine/core/game";
import {BLEND_MODE, RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Color} from "@engine/renderer/common/color";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {ISize, Size} from "@engine/geometry/size";
import {Polygon} from "@engine/renderable/impl/geometry/polygon";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {Element} from "@engine/misc/xmlUtils";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Ellipse} from "@engine/renderable/impl/geometry/ellipse";
import {Line} from "@engine/renderable/impl/geometry/line";
import {closePolylinePoints} from "@engine/renderable/impl/geometry/_internal/closePolylinePoints";
import {BasicStringTokenizer} from "@engine/renderable/impl/geometry/_internal/basicStringTokenizer";
import {MathEx} from "@engine/misc/mathEx";
import {FastMap} from "@engine/misc/collection/fastMap";
import {Optional} from "@engine/core/declarations";

const NAMED_COLOR_TABLE:Record<string, string> =
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
        "indianred ": "#cd5c5c",
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

const getColor = (literal:string)=>{
    if (!literal || literal==='none') return Color.NONE.clone();
    if (NAMED_COLOR_TABLE[literal]!==undefined) literal = NAMED_COLOR_TABLE[literal];
    return Color.fromCssLiteral(literal);
};

const getString = (literal:string,defaultValue:string):string=>{
    if (!literal) return defaultValue;
    else return literal;
};

const getNumber = (literal:string,defaultValue:number):number=>{
    if (!literal) return defaultValue;
    const val:number = parseFloat(literal);
    if (Number.isNaN(val)) return defaultValue;
    else return val;
};

const getNumberArray = <T>(literal:string,size:number,defaultItemValue:number):T=>{
    let arr:number[];
    if (!literal) {
        arr = Array(size);
        arr.fill(defaultItemValue);
        return arr as unknown as T;
    }
    arr = literal.split(' ').map(it=>parseFloat(it));
    for (let i:number=0;i<size;i++) {
        if (!arr[i]) arr[i] = defaultItemValue;
    }
    return arr as unknown as T;
};

class ElementStylesHolder {

    private map:FastMap<Element, Record<string, string>> = new FastMap<Element, Record<string, string>>();

    public getStyle(el:Element):Record<string, string> {
        let styleMap = this.map.get(el);
        if (styleMap===undefined) {
            styleMap = this.styleAttrToMap(el.attributes.style);
            this.map.put(el,styleMap);
        }
        return styleMap;
    }

    private styleAttrToMap(style:string):Record<string, string> {
        const res:Record<string, string> = {};
        if (!style) return res;
        style.split(';').forEach(pair=>{
            const pairArr:string[] = pair.split(':');
            res[pairArr[0].trim()] = pairArr[1]?.trim();
        });
        return res;
    }

}

class SvgElementRenderer {

    private elementStylesHolder:ElementStylesHolder = new ElementStylesHolder();

    constructor(private game:Game) {
    }

    private getFillStrokeParams(el:Element):{lineWidth:number,fillColor:Color,drawColor:Color} {

        const rawStrokeValue:string = this.lookUpProperty(el,'stroke',true);
        const rawFillValue:string = this.lookUpProperty(el,'fill',true);

        let lineWidth:number = 0;
        if (!rawStrokeValue) lineWidth = 0;
        else {
            lineWidth = getNumber(this.lookUpProperty(el,'stroke-width',true),1);
        }

        const fillColor:Color = getColor(rawFillValue ?? '#000000');
        const drawColor:Color = getColor(rawStrokeValue);

        const fillOpacity:number = getNumber(this.lookUpProperty(el,'fill-opacity',true),1);
        const strokeOpacity:number = getNumber(this.lookUpProperty(el,'stroke-opacity',true),1);

        if (rawFillValue!=='none') fillColor.a = ~~(fillOpacity*255) as byte;
        if (rawStrokeValue!=='none') drawColor.a = ~~(strokeOpacity*255) as byte;

        return {lineWidth,fillColor,drawColor};
    }


    private resolveTransformations(view:RenderableModel, el:Element):RenderableModel {
        let lastView:RenderableModel = view;
        const transform:string = this.lookUpProperty(el,'transform',false);
        if (!transform) return lastView;
        const stringTokenizer:BasicStringTokenizer = new BasicStringTokenizer(transform.trim());
        while (!stringTokenizer.isEof()) {
            const token:string = stringTokenizer.getNextToken(stringTokenizer._CHAR);
            //console.log({token});
            if (token==='translate') {
                stringTokenizer.skipRequiredToken('(');
                const x:number = stringTokenizer.getNextNumber();
                const y:number = stringTokenizer.getNextNumber(0);
                stringTokenizer.skipRequiredToken(')');
                const transformed:RenderableModel = new NullGameObject(this.game);
                transformed.pos.setXY(x,y);
                lastView.appendChild(transformed);
                lastView = transformed;
            } else if (token==='scale') {
                stringTokenizer.skipRequiredToken('(');
                const x:number = stringTokenizer.getNextNumber();
                const y:number = stringTokenizer.getNextNumber(x);
                stringTokenizer.skipRequiredToken(')');
                const transformed:RenderableModel = new NullGameObject(this.game);
                transformed.scale.setXY(x,y);
                lastView.appendChild(transformed);
                lastView = transformed;
            } else if (token==='rotate') {
                stringTokenizer.skipRequiredToken('(');
                const x:number = stringTokenizer.getNextNumber();
                stringTokenizer.skipRequiredToken(')');
                const transformed:RenderableModel = new NullGameObject(this.game);
                transformed.angle = MathEx.degToRad(x);
                lastView.appendChild(transformed);
                lastView = transformed;
            } else {
                throw new Error(`unknown transform function: ${transform}`);
            }
        }
        return lastView;
    }

    private resolveOpacity(el:Element):number{
        const opacity:string = this.lookUpProperty(el,'opacity',false);
        return getNumber(opacity,1);
    }

    private createElementContainer(parentView:RenderableModel,el:Element):RenderableModel{
        let container:RenderableModel = new NullGameObject(this.game);
        parentView.appendChild(container);
        container.alpha = this.resolveOpacity(el);
        container = this.resolveTransformations(container,el);
        return container;
    }

    private lookUpProperty(el:Element,propName:string, lookupParents:boolean):string{
        let currentNode:Element = el;
        let result:string = undefined!;
        while (currentNode!==undefined) {
           result = this.elementStylesHolder.getStyle(currentNode)[propName];
           if (!result) result = currentNode.attributes[propName];
           if (result) break;
           if (!lookupParents) break;
           currentNode = currentNode.parent;
        }
        if (result===undefined) result = '';
        return result;
    }

    private renderPath(parentView:RenderableModel,el:Element):void {
        const data:string = el.attributes.d;
        if (!data) return undefined;

        const container:RenderableModel = this.createElementContainer(parentView,el);
        const {lineWidth,fillColor,drawColor} = this.getFillStrokeParams(el);

        Polygon.fromMultiCurveSvgPath(this.game,data).forEach((p,i,arr)=>{
            p.fillColor = fillColor;
            // if (arr.length>1 && p.isClockWise()) {
            //     p.blendMode = BLEND_MODE.SUBSTRACTIVE;
            // }
            container.appendChild(p);
        });

        if (lineWidth!==0) {
            PolyLine.fromMultiCurveSvgPath(this.game,data).forEach(p=>{
                p.lineWidth = lineWidth;
                p.color.set(drawColor);
                container.appendChild(p);
            });
        }
    }

    private renderCircle(parentView:RenderableModel,el:Element):void {
        const container:RenderableModel = this.createElementContainer(parentView,el);
        const {lineWidth,fillColor,drawColor} = this.getFillStrokeParams(el);
        const cx:number = getNumber(el.attributes.cx,0);
        const cy:number = getNumber(el.attributes.cy,0);
        const r:number = getNumber(el.attributes.r,10)+lineWidth/2;

        const circle:Circle = new Circle(this.game);
        circle.center.setXY(cx,cy);
        circle.fillColor = fillColor;
        circle.color = drawColor;
        circle.lineWidth = lineWidth;
        circle.radius = r;
        container.appendChild(circle);
    }

    private renderEllipse(parentView:RenderableModel,el:Element):void {
        const container:RenderableModel = this.createElementContainer(parentView,el);
        const {lineWidth,fillColor,drawColor} = this.getFillStrokeParams(el);
        const cx:number = getNumber(el.attributes.cx,0);
        const cy:number = getNumber(el.attributes.cy,0);
        const rx:number = getNumber(el.attributes.rx,10)+lineWidth/2;
        const ry:number = getNumber(el.attributes.ry,10)+lineWidth/2;

        const ellipse:Ellipse = new Ellipse(this.game);
        ellipse.center.setXY(cx,cy);
        ellipse.fillColor = fillColor;
        ellipse.color = drawColor;
        ellipse.lineWidth = lineWidth;
        ellipse.radiusX = rx;
        ellipse.radiusY = ry;
        container.appendChild(ellipse);
    }

    // ry is not supported
    private renderRect(parentView:RenderableModel,el:Element):void {
        const container:RenderableModel = this.createElementContainer(parentView,el);
        const {lineWidth,fillColor,drawColor} = this.getFillStrokeParams(el);
        const x:number = getNumber(el.attributes.x,0)-lineWidth/2;
        const y:number = getNumber(el.attributes.y,0)-lineWidth/2;
        const width:number = getNumber(el.attributes.width,1);
        const height:number = getNumber(el.attributes.height,1);
        const borderRadius:number = getNumber(el.attributes.rx,0);

        const rect:Rectangle = new Rectangle(this.game);
        rect.size.setWH(width,height);
        rect.pos.setXY(x,y);
        rect.fillColor = fillColor;
        rect.color = drawColor;
        rect.lineWidth = lineWidth;
        rect.borderRadius = borderRadius;
        container.appendChild(rect);
    }

    private renderLine(parentView:RenderableModel,el:Element):void {
        const container:RenderableModel = this.createElementContainer(parentView,el);
        const {lineWidth,drawColor} = this.getFillStrokeParams(el);
        const x1:number = getNumber(el.attributes.x1,0);
        const y1:number = getNumber(el.attributes.y1,0);
        const x2:number = getNumber(el.attributes.x2,1);
        const y2:number = getNumber(el.attributes.y2,1);

        const line:Line = new Line(this.game);
        line.setXYX1Y1(x1,y1,x2,y2);
        line.lineWidth = lineWidth;
        line.color = drawColor;
        container.appendChild(line);
    }


    private renderPolyline(parentView:RenderableModel,el:Element,asPolygon:boolean):void {
        const container:RenderableModel = this.createElementContainer(parentView,el);
        const {lineWidth,fillColor,drawColor} = this.getFillStrokeParams(el);
        const points:string = getString(el.attributes.points,'');
        if (!points) return;
        let vertices:number[] = [];
        const tokenizer:BasicStringTokenizer = new BasicStringTokenizer(points);
        while (!tokenizer.isEof()) {
            vertices.push(tokenizer.getNextNumber());
        }
        let closeInvoked:boolean = false;
        if (asPolygon) {
            vertices = closePolylinePoints(vertices);
            closeInvoked = true;
        }
        if (fillColor.a>0) {
            let verticesToFIll:number[] = [];
            if (!closeInvoked) {
                verticesToFIll = closePolylinePoints(vertices);
            } else verticesToFIll = vertices;
            const polygon:Polygon = Polygon.fromPoints(this.game,verticesToFIll);
            polygon.fillColor.set(fillColor);
            container.appendChild(polygon);
        }

        if (lineWidth>0 && drawColor.a>0) {
            const polyline:PolyLine = PolyLine.fromVertices(this.game,vertices);
            polyline.lineWidth = lineWidth;
            polyline.color.set(drawColor);
            container.appendChild(polyline);
        }
    }

    private renderGroup(parentView:RenderableModel,el:Element):RenderableModel {
        let container:RenderableModel = this.createElementContainer(parentView,el);
        el.children.forEach(c=>{
            const possibleNewEl = this.renderTag(container,c);
            if (possibleNewEl!==undefined) {
                container = possibleNewEl;
            }
        });
        return container;
    }

    public renderTag(view:RenderableModel,el:Element):Optional<RenderableModel> {
        switch (el.tagName) {
            case 'svg': {
                el.children.forEach(c=>this.renderTag(view,c));
                return undefined;
            }
            case 'path': {
                this.renderPath(view,el);
                return undefined;
            }
            case 'circle': {
                this.renderCircle(view,el);
                return undefined;
            }
            case 'ellipse': {
                this.renderEllipse(view,el);
                return undefined;
            }
            case 'rect': {
                this.renderRect(view,el);
                return undefined;
            }
            case 'line': {
                this.renderLine(view,el);
                return undefined;
            }
            case 'polygon': {
                this.renderPolyline(view,el,true);
                return undefined;
            }
            case 'polyline': {
                this.renderPolyline(view,el,false);
                return undefined;
            }
            case 'g': {
                return this.renderGroup(view,el);
            }
            default: {
                console.log(`unknown tag: ${el.tagName}`);
                return undefined;
            }
        }
    }

}

export class SvgImage extends NullGameObject {

    private svgElementRenderer:SvgElementRenderer;

    constructor(protected game:Game, private doc:Element, private preferredSize?:ISize) {
        super(game);
        const rootSvgTag = doc.querySelector('svg');
        this.svgElementRenderer = new SvgElementRenderer(this.game);

        const viewBox:[number,number,number,number] = getNumberArray(rootSvgTag.attributes.viewBox,4,0);
        let width:number = getNumber(rootSvgTag.attributes.width,0) || viewBox[2];
        let height:number = getNumber(rootSvgTag.attributes.height,0) || viewBox[3];
        if (width===0) width = 100;
        if (height===0) height = 100;
        if (viewBox[2]===0) viewBox[2] = width;
        if (viewBox[3]===0) viewBox[3] = height;

        const rootView:RenderableModel = new NullGameObject(this.game);
        rootView.pos.setXY(-viewBox[0],-viewBox[1]);
        if (this.preferredSize!==undefined) {
            this.size.set(this.preferredSize);
        } else {
            this.size.setWH(width,height);
        }
        const scaleByViewPort:number = Math.min(this.size.width/viewBox[2],this.size.height/viewBox[3]);
        rootView.scale.setXY(scaleByViewPort);

        this.traverseDocument(rootView,rootSvgTag);
        const drawingSurface = new DrawingSurface(this.game,this.size);
        drawingSurface.drawModel(rootView);
        this.appendChild(drawingSurface);
    }

    private traverseDocument(view:RenderableModel,el:Element):void {
        this.svgElementRenderer.renderTag(view,el);
    }

}
