import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {Game} from "@engine/core/game";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Color} from "@engine/renderer/common/color";
import {ISize} from "@engine/geometry/size";
import {Polygon} from "@engine/renderable/impl/geometry/polygon";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Ellipse} from "@engine/renderable/impl/geometry/ellipse";
import {Line} from "@engine/renderable/impl/geometry/line";
import {closePolylinePoints} from "@engine/renderable/impl/geometry/_internal/closePolylinePoints";
import {BasicStringTokenizer} from "@engine/renderable/impl/geometry/_internal/basicStringTokenizer";
import {MathEx} from "@engine/misc/mathEx";
import {FastMap} from "@engine/misc/collection/fastMap";
import {Optional} from "@engine/core/declarations";
import {DebugError} from "@engine/debug/debugError";
import {Image} from "@engine/renderable/impl/general/image/image";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {LazyImageCacheSurface} from "@engine/renderable/impl/surface/lazyImageCacheSurface";
import {ITexture} from "@engine/renderer/common/texture";
import {TaskQueue} from "@engine/resources/taskQueue";
import {XmlDocument, XmlNode} from "@engine/misc/parsers/xml/xmlELements";
import {EndCapStyle, JointStyle} from "@engine/renderable/impl/geometry/_internal/triangulatedPathFromPolyline";
import {EvenOddCompositionFilter} from "@engine/renderer/webGl/filters/composition/evenOddCompositionFilter";
import {ColorFactory} from "@engine/renderer/common/colorFactory";

const getColor = (literal:string)=>{
    if (literal.indexOf('url')===0) {
        console.log(`urls is not supported: ${literal}`);
        return Color.NONE.clone();
    }
    if (!literal || literal==='none') return Color.NONE.clone();
    return ColorFactory.fromCSS(literal);
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

// https://oreillymedia.github.io/Using_SVG/guide/units.html
const calcNumberWithMeasure = (val:number,measure:string,containerSize:number,):number=>{
    if (!measure) return val;
    switch (measure) {
        case '%':
            return val*containerSize/100;
        case 'px':
            return val;
        case 'mm':
            // 1cm ≅ 37.795px or user units
            return val*0.01*37.795;
        case 'cm':
            return val*37.795;
        case 'in':
            return val*96;
        case 'pc':
            return val*16;
        case 'pt':
            // 1pt ≅ 1.3333px
            return val*1.3333;
        default:
            throw new DebugError(`unknown measure: ` + measure);
    }
};


const getNumberWithMeasure = (literal:string,containerSize:number,defaultValue:number):number=>{
    if (!literal) return defaultValue;
    const tokenizer = new BasicStringTokenizer(literal);
    const val:number = tokenizer.getNextNumber();
    const measure:string = !tokenizer.isEof()?tokenizer.getNextToken(tokenizer._CHAR+'%'):'';
    return calcNumberWithMeasure(val,measure,containerSize);
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

    private map:FastMap<XmlNode, Record<string, string>> = new FastMap<XmlNode, Record<string, string>>();

    public getStyle(el:XmlNode):Record<string, string> {
        let styleMap = this.map.get(el);
        if (styleMap===undefined) {
            styleMap = this.styleAttrToMap(el.getAttribute('style'));
            this.map.put(el,styleMap);
        }
        return styleMap;
    }

    public mergeStyle(s1:string,s2:string):string {
        const map1 = this.styleAttrToMap(s1);
        const map2 = this.styleAttrToMap(s2);
        Object.keys(map2).forEach(key=>{
            map1[key] = map2[key];
        });
        let result = '';
        Object.keys(map1).forEach(key=>{
            if (!key) return;
            const value = map1[key] ?? '';
            result+=`${key}:${value};`;
        });
        return result;
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

    constructor(private game:Game, private document:XmlNode, private rootContainer:SvgImage, private preloadedResources:Record<string, ITexture>) {
    }

    private getFillStrokeParams(el:XmlNode):{lineWidth:Optional<number>,fillColor:Color,drawColor:Color} {

        const rawStrokeValue:string = this.lookUpProperty(el,'stroke',true);
        const rawFillValue:string = this.lookUpProperty(el,'fill',true);

        let lineWidth:Optional<number>;
        if (!rawStrokeValue) lineWidth = undefined;
        else {
            lineWidth = getNumber(this.lookUpProperty(el,'stroke-width',true),1);
        }

        const fillColor:Color = getColor(rawFillValue ?? '#000000');
        const drawColor:Color = getColor(rawStrokeValue);

        const fillOpacity:number = getNumber(this.lookUpProperty(el,'fill-opacity',true),1);
        const strokeOpacity:number = getNumber(this.lookUpProperty(el,'stroke-opacity',true),1);

        if (rawFillValue!=='none') fillColor.a = ~~(fillOpacity*255) as Uint8;
        if (rawStrokeValue!=='none') drawColor.a = ~~(strokeOpacity*255) as Uint8;

        return {lineWidth,fillColor,drawColor};
    }

    private _parseTransformString(parentView:RenderableModel,transform:string):RenderableModel {
        let lastView:RenderableModel = parentView;
        transform = transform.trim();
        if (!transform) return parentView;
        const stringTokenizer:BasicStringTokenizer = new BasicStringTokenizer(transform);
        while (!stringTokenizer.isEof()) {
            const token:string = stringTokenizer.getNextToken(stringTokenizer._CHAR);
            //console.log({token});
            if (token==='translate') {
                stringTokenizer.skipRequiredToken('(');
                const x:number = stringTokenizer.getNextNumber();
                const measureX:string = stringTokenizer.getNextToken(stringTokenizer._CHAR+'%');
                const y:number = stringTokenizer.getNextNumber(0);
                const measureY:string = stringTokenizer.getNextToken(stringTokenizer._CHAR+'%');
                stringTokenizer.skipRequiredToken(')');
                const transformed:RenderableModel = new SimpleGameObjectContainer(this.game);
                transformed.pos.setXY(
                    calcNumberWithMeasure(x,measureX,this.rootContainer.size.width),
                    calcNumberWithMeasure(y,measureY,this.rootContainer.size.height)
                );
                lastView.appendChild(transformed);
                lastView = transformed;
            } else if (token==='scale') {
                stringTokenizer.skipRequiredToken('(');
                const x:number = stringTokenizer.getNextNumber();
                const measureX:string = stringTokenizer.getNextToken(stringTokenizer._CHAR+'%');
                const y:number = stringTokenizer.getNextNumber(x);
                const measureY:string = stringTokenizer.getNextToken(stringTokenizer._CHAR+'%');
                stringTokenizer.skipRequiredToken(')');
                const transformed:RenderableModel = new SimpleGameObjectContainer(this.game);
                transformed.scale.setXY(
                    calcNumberWithMeasure(x,measureX,1),
                    calcNumberWithMeasure(y,measureY,1)
                );
                lastView.appendChild(transformed);
                lastView = transformed;
            } else if (token==='rotate') {
                stringTokenizer.skipRequiredToken('(');
                const x: number = stringTokenizer.getNextNumber();
                const centerX: number = stringTokenizer.getNextNumber(0);
                const centerY: number = stringTokenizer.getNextNumber(0);
                stringTokenizer.skipOptionalToken('deg');
                stringTokenizer.skipRequiredToken(')');
                const transformed: RenderableModel = new SimpleGameObjectContainer(this.game);
                transformed.angle = MathEx.degToRad(x);
                transformed.transformPoint.setXY(centerX,centerY);
                lastView.appendChild(transformed);
                lastView = transformed;
            }
            else if (token==='skewY') {
                stringTokenizer.skipRequiredToken('(');
                const y: number = stringTokenizer.getNextNumber();
                stringTokenizer.skipRequiredToken(')');
                const transformed: RenderableModel = new SimpleGameObjectContainer(this.game);
                transformed.skew.setY(MathEx.degToRad(y));
                lastView.appendChild(transformed);
                lastView = transformed;
            }
            else if (token==='skewX') {
                stringTokenizer.skipRequiredToken('(');
                const x: number = stringTokenizer.getNextNumber();
                stringTokenizer.skipRequiredToken(')');
                const transformed: RenderableModel = new SimpleGameObjectContainer(this.game);
                transformed.skew.setX(MathEx.degToRad(x));
                lastView.appendChild(transformed);
                lastView = transformed;
            }
            else if (token==='matrix') {
                stringTokenizer.skipRequiredToken('(');
                const a:number = stringTokenizer.getNextNumber();
                const b:number = stringTokenizer.getNextNumber();
                const c:number = stringTokenizer.getNextNumber();
                const d:number = stringTokenizer.getNextNumber();
                const e:number = stringTokenizer.getNextNumber();
                const f:number = stringTokenizer.getNextNumber();

                stringTokenizer.skipRequiredToken(')');

                const delta:number = a * d - b * c;

                // https://frederic-wang.fr/decomposition-of-2d-transform-matrices.html

                lastView = this._parseTransformString(lastView,`translate(${e} ${f})`);

                if (a !== 0 || b !== 0) {
                    const r = Math.sqrt(a*a+b*b);
                    lastView = this._parseTransformString(lastView,`rotate(${MathEx.radToDeg(b > 0 ? Math.acos(a/r) : -Math.acos(a/r))})`);
                    lastView = this._parseTransformString(lastView,`scale(${r}, ${delta/r})`);
                    lastView = this._parseTransformString(lastView,`skewX(${MathEx.radToDeg(Math.atan((a*c+b*d)/(r*r)))})`);
                } else if (c !== 0 || d !== 0) {
                    const s = Math.sqrt(c*c+d*d);
                    lastView = this._parseTransformString(lastView,`rotate(${MathEx.radToDeg(Math.PI/2 - (d > 0 ? Math.acos(-c/s) : -Math.acos(c/s)))})`);
                    lastView = this._parseTransformString(lastView,`scale(${delta/s}, ${s})`);
                    lastView = this._parseTransformString(lastView,`skewX(${MathEx.radToDeg(Math.atan((a*c+b*d)/(s*s)))})`);
                } else { // a = b = c = d = 0
                    lastView = this._parseTransformString(lastView,`scale(0 0)`);
                }
            }
            else {
                throw new Error(`unknown transform function: ${token}`);
            }
        }
        return lastView;
    }

    private resolveTransformations(parentView:RenderableModel, el:XmlNode):RenderableModel {
        const transform:string = this.lookUpProperty(el,'transform',false);
        return this._parseTransformString(parentView,transform);
    }

    private resolveOpacity(el:XmlNode):number{
        const opacity:string = this.lookUpProperty(el,'opacity',false);
        return getNumber(opacity,1);
    }

    private createElementContainer(parentView:RenderableModel,el:XmlNode):RenderableModel{
        let container:RenderableModel = new SimpleGameObjectContainer(this.game);
        parentView.appendChild(container);
        container.alpha = this.resolveOpacity(el);
        container = this.resolveTransformations(container,el);
        return container;
    }

    private lookUpProperty(el:XmlNode, propName:string, lookupParents:boolean):string{
        let currentNode:XmlNode = el;
        let result:string = undefined!;
        while (currentNode!==undefined) {
           result = this.elementStylesHolder.getStyle(currentNode)[propName];
           if (!result) result = currentNode.getAttribute(propName);
           if (result) break;
           if (!lookupParents) break;
           currentNode = currentNode.parent;
        }
        if (result===undefined) result = '';
        return result;
    }

    private setCommonProperties(view:RenderableModel,el:XmlNode):void {
        const display:string = this.lookUpProperty(el,'display',false);
        if (display==='none') view.visible = false;
    }

    private renderPath(parentView:RenderableModel,el:XmlNode):void {
        const data:string = el.getAttribute('d');
        if (!data) return undefined;

        const container:RenderableModel = this.createElementContainer(parentView,el);
        const {lineWidth,fillColor,drawColor} = this.getFillStrokeParams(el);
        let fillRule = this.lookUpProperty(el,'fill-rule',true);
        if (['nonzero','evenodd'].indexOf(fillRule)===-1) fillRule = 'nonzero';

        // https://developer.mozilla.org/ru/docs/Web/SVG/Attribute/fill-rule
        container.forceDrawChildrenOnNewSurface = true;
        let directionOfBaseShapeIsCc:boolean;
        Polygon.fromMultiCurveSvgPath(this.game,data).forEach((p,i,arr)=>{
            p.fillColor = fillColor;
            if (i==0 && fillRule==='nonzero') directionOfBaseShapeIsCc = p.isClockWise();
            if (i>0) {
                if (fillRule==='evenodd' || p.isClockWise()!==directionOfBaseShapeIsCc) {
                    p.filters = [new EvenOddCompositionFilter(this.game)];
                }
            }
            container.appendChild(p);
        });

        if (lineWidth!=undefined && lineWidth>0) {
            const lineCapRaw:string = this.lookUpProperty(el,'stroke-linecap',false); // butt round square
            const lineJointRaw:string = this.lookUpProperty(el,'stroke-linejoin',false); // miter round bevel miter-clip arcs

            let endCapStyle:Optional<EndCapStyle>;
            if (lineCapRaw==='butt') endCapStyle = EndCapStyle.BUTT;
            else if (lineCapRaw==='round') endCapStyle = EndCapStyle.ROUND;
            else if (lineCapRaw==='square') endCapStyle = EndCapStyle.SQUARE;
            else if (lineCapRaw) {
                console.warn(`unknown stroke-linecap: ${lineCapRaw}`);
            }

            let jointStyle:Optional<JointStyle>;
            if (lineJointRaw==='miter') jointStyle = JointStyle.MITER;
            else if (lineJointRaw==='round') jointStyle = JointStyle.ROUND;
            else if (lineJointRaw==='bevel') jointStyle = JointStyle.BEVEL;
            else if (lineJointRaw==='miter-clip') jointStyle = JointStyle.MITER;
            else if (lineJointRaw==='arcs') jointStyle = JointStyle.ROUND;
            else if (lineJointRaw) {
                console.warn(`unknown stroke-linejoin: ${lineJointRaw}`);
            }

            PolyLine.fromMultiCurveSvgPath(this.game,data,{lineWidth,endCapStyle,jointStyle}).forEach(p=>{
                p.color.setFrom(drawColor);
                container.appendChild(p);
            });
        }
        this.setCommonProperties(container,el);
    }

    private renderCircle(parentView:RenderableModel,el:XmlNode):void {
        const container:RenderableModel = this.createElementContainer(parentView,el);
        const {lineWidth = 0,fillColor,drawColor} = this.getFillStrokeParams(el);
        const cx:number = getNumberWithMeasure(el.getAttribute('cx'),this.rootContainer.size.width,0);
        const cy:number = getNumberWithMeasure(el.getAttribute('cy'),this.rootContainer.size.height,0);
        const r:number = getNumberWithMeasure(el.getAttribute('r'),this.rootContainer.size.width,10)+lineWidth/2;

        const circle:Circle = new Circle(this.game);
        circle.center.setXY(cx,cy);
        circle.fillColor = fillColor;
        circle.color = drawColor;
        circle.lineWidth = lineWidth;
        circle.radius = r;
        this.setCommonProperties(circle,el);
        container.appendChild(circle);
    }

    private renderImage(parentView:RenderableModel,el:XmlNode):void {
        const container:RenderableModel = this.createElementContainer(parentView,el);
        const x:number = getNumberWithMeasure(el.getAttribute('cx'),this.rootContainer.size.width,0);
        const y:number = getNumberWithMeasure(el.getAttribute('cy'),this.rootContainer.size.height,0);
        const width:number = getNumberWithMeasure(this.lookUpProperty(el,'width',false),this.rootContainer.size.width,0);
        const height:number = getNumberWithMeasure(this.lookUpProperty(el,'height',false),this.rootContainer.size.height,0);
        const url:string = el.getAttribute('xlink:href');
        if (!url) return;

        if (this.preloadedResources[url]===undefined) throw new DebugError(`resource image is not preloaded! Invoke .preload() method`);
        const image:Image = new Image(this.game,this.preloadedResources[url]);
        image.pos.setXY(x,y);
        if (width) image.scale.setX(width/image.getTexture().size.width);
        if (height) image.scale.setY(height/image.getTexture().size.height);

        this.setCommonProperties(image,el);
        container.appendChild(image);
    }

    private renderEllipse(parentView:RenderableModel,el:XmlNode):void {
        const container:RenderableModel = this.createElementContainer(parentView,el);
        const {lineWidth = 0,fillColor,drawColor} = this.getFillStrokeParams(el);
        const cx:number = getNumberWithMeasure(el.getAttribute('cx'),this.rootContainer.size.width,0);
        const cy:number = getNumberWithMeasure(el.getAttribute('cy'),this.rootContainer.size.height,0);
        const rx:number = getNumberWithMeasure(el.getAttribute('rx'),this.rootContainer.size.width,10)+lineWidth/2;
        const ry:number = getNumberWithMeasure(el.getAttribute('ry'),this.rootContainer.size.width,10)+lineWidth/2;

        const ellipse:Ellipse = new Ellipse(this.game);
        ellipse.center.setXY(cx,cy);
        ellipse.fillColor = fillColor;
        ellipse.color = drawColor;
        ellipse.lineWidth = lineWidth;
        ellipse.radiusX = rx;
        ellipse.radiusY = ry;
        this.setCommonProperties(ellipse,el);
        container.appendChild(ellipse);
    }

    // ry is not supported
    private renderRect(parentView:RenderableModel,el:XmlNode):void {
        const container:RenderableModel = this.createElementContainer(parentView,el);
        const {lineWidth = 0,fillColor,drawColor} = this.getFillStrokeParams(el);
        const x:number = getNumberWithMeasure(el.getAttribute('x'),this.rootContainer.size.width,0);
        const y:number = getNumberWithMeasure(el.getAttribute('y'),this.rootContainer.size.height,0);
        const width:number = getNumberWithMeasure(el.getAttribute('width'),this.rootContainer.size.width,1);
        const height:number = getNumberWithMeasure(el.getAttribute('height'),this.rootContainer.size.height,1);
        const borderRadius:number = getNumberWithMeasure(el.getAttribute('rx'),this.rootContainer.size.width,0);

        if (width===0 || height===0) return;

        const rect:Rectangle = new Rectangle(this.game);
        rect.size.setWH(width+lineWidth*2,height+lineWidth*2);
        rect.pos.setXY(x-lineWidth,y-lineWidth);
        rect.fillColor = fillColor;
        rect.color = drawColor;
        rect.lineWidth = lineWidth;
        rect.borderRadius = borderRadius;
        this.setCommonProperties(rect,el);
        container.appendChild(rect);
    }

    private renderLine(parentView:RenderableModel,el:XmlNode):void {
        const container:RenderableModel = this.createElementContainer(parentView,el);
        let {lineWidth,drawColor} = this.getFillStrokeParams(el);
        if (lineWidth===undefined) lineWidth = 1;
        const x1:number = getNumberWithMeasure(el.getAttribute('x1'),this.rootContainer.size.width,0);
        const y1:number = getNumberWithMeasure(el.getAttribute('y1'),this.rootContainer.size.height,0);
        const x2:number = getNumberWithMeasure(el.getAttribute('x2'),this.rootContainer.size.width,1);
        const y2:number = getNumberWithMeasure(el.getAttribute('y2'),this.rootContainer.size.height,1);

        const line:Line = new Line(this.game);
        line.setXYX1Y1(x1,y1,x2,y2);
        line.lineWidth = lineWidth;
        line.color = drawColor;
        this.setCommonProperties(line,el);
        container.appendChild(line);
    }


    private renderPolyline(parentView:RenderableModel, el:XmlNode, asPolygon:boolean):void {
        const container:RenderableModel = this.createElementContainer(parentView,el);
        const {lineWidth,fillColor,drawColor} = this.getFillStrokeParams(el);
        const points:string = getString(el.getAttribute('points'),'');
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
            const polygon:Polygon = Polygon.fromVertices(this.game,verticesToFIll);
            polygon.fillColor.setFrom(fillColor);
            container.appendChild(polygon);
        }

        if (lineWidth!==undefined && lineWidth>0 && drawColor.a>0) {
            const polyline:PolyLine = PolyLine.fromVertices(this.game,vertices,{lineWidth});
            polyline.color.setFrom(drawColor);
            container.appendChild(polyline);
        }
        this.setCommonProperties(container,el);
    }

    private renderGroup(parentView:RenderableModel,el:XmlNode):RenderableModel {
        const container:RenderableModel = this.createElementContainer(parentView,el);
        const x:number = getNumberWithMeasure(el.getAttribute('x'),this.rootContainer.size.width,undefined!);
        const y:number = getNumberWithMeasure(el.getAttribute('y'),this.rootContainer.size.height,undefined!);
        if (x!==undefined) container.pos.setX(x);
        if (y!==undefined) container.pos.setY(y);

        el.getChildNodes().forEach(c=>{
            this.renderTag(container,c);
        });
        this.setCommonProperties(container,el);
        return container;
    }

    private renderAnchor(parentView:RenderableModel,el:XmlNode):RenderableModel {
        const container:RenderableModel = this.renderGroup(parentView,el);
        const href:Optional<string> = el.getAttribute('href') || el.getAttribute('xlink:href');
        if (href) {
            this.rootContainer.mouseEventHandler.on(MOUSE_EVENTS.click,_=>{
                window.open(href);
            });
        }
        return container;
    }

    private renderUse(parentView:RenderableModel,el:XmlNode):Optional<RenderableModel>{
        let idRef:string = el.getAttribute('xlink:href');
        if (idRef.indexOf('#')!==0) throw new DebugError(`wrong reference: ${idRef}`);
        idRef = idRef.substr(1);
        const refElement:XmlNode = this.document.getElementById(idRef)!;
        if (refElement.tagName==='symbol') { // render symbol as group
            refElement.tagName = 'g';
        }
        const refElementCloned:XmlNode = refElement.clone();
        Object.keys(el.getAttributes()).forEach(key=>{
            if (['xlink:href','id'].indexOf(key)>-1) return;
            if (key==='style') {
                const mergedStyle =
                    this.elementStylesHolder.mergeStyle(
                        refElement.getAttribute('style'),
                        el.getAttribute('style')
                    );
                refElementCloned.setAttribute('style',mergedStyle);
            }
            else refElementCloned.setAttribute(key,el.getAttribute(key));
        });
        (refElementCloned as {parent:XmlNode}).parent = el.parent;
        return this.renderTag(parentView,refElementCloned);
    }

    public renderTag(view:RenderableModel,el:XmlNode):Optional<RenderableModel> {
        switch (el.tagName) {
            case 'svg': {
                el.getChildNodes().forEach(c=>this.renderTag(view,c));
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
            case 'image': {
                this.renderImage(view,el);
                return undefined;
            }
            case 'a': {
                return this.renderAnchor(view,el);
            }
            case 'g': {
                return this.renderGroup(view,el);
            }
            case 'use': {
                return this.renderUse(view,el);
            }
            case 'defs':
            case 'symbol': {
                // ignore
                return undefined;
            }
            default: {
                console.log(`unknown tag: ${el.tagName}`);
                return undefined;
            }
        }
    }

}

export class SvgImage extends SimpleGameObjectContainer {

    private constructor(game:Game, private doc:XmlDocument, private preferredSize?:ISize) {
        super(game);
    }

    private svgElementRenderer:SvgElementRenderer;

    private preloadedTextures:Record<string,ITexture> = {};

    public static async create(game:Game, taskQueue:TaskQueue, doc:XmlDocument, preferredSize?:ISize):Promise<SvgImage> {
        const image:SvgImage = new SvgImage(game, doc, preferredSize);
        await image.preload(taskQueue);
        image.parse();
        return image;
    }

    private parse():void {

        const rootSvgTag:XmlNode = this.doc.querySelector('svg');
        console.log(this.doc, rootSvgTag);

        const viewBox:[number,number,number,number] = getNumberArray(rootSvgTag.getAttribute('viewBox'),4,0);
        let width:number = getNumberWithMeasure(rootSvgTag.getAttribute('width'),this.game.size.width,0) || viewBox[2];
        let height:number = getNumberWithMeasure(rootSvgTag.getAttribute('height'),this.game.size.height,0) || viewBox[3];
        if (width===0) width = 100;
        if (height===0) height = 100;
        if (viewBox[2]===0) viewBox[2] = width;
        if (viewBox[3]===0) viewBox[3] = height;

        const rootView:RenderableModel = new SimpleGameObjectContainer(this.game);
        rootView.pos.setXY(-viewBox[0],-viewBox[1]);
        if (this.preferredSize!==undefined) {
            this.size.setFrom(this.preferredSize);
        } else {
            this.size.setWH(width,height);
        }
        const scaleByViewPort:number = Math.min(this.size.width/viewBox[2],this.size.height/viewBox[3]);
        rootView.scale.setXY(scaleByViewPort);

        this.svgElementRenderer = new SvgElementRenderer(this.game,rootSvgTag,this,this.preloadedTextures);

        this.traverseDocument(rootView,rootSvgTag);
        const drawingSurface = new LazyImageCacheSurface(this.game,this.size);
        drawingSurface.appendChild(rootView);
        drawingSurface.requestRedraw();
        this.appendChild(drawingSurface);

        //this.appendChild(rootView);
    }

    private async preload(taskQueue:TaskQueue):Promise<void> {
        if (DEBUG) {
            if (taskQueue.getLoader().isResolved()) {
                throw new DebugError(`current taskQueue is completed`);
            }
        }
        const elements:XmlNode[] = this.doc.querySelectorAll('image');
        for (const el of elements) {
            const url:string = el.getAttribute('xlink:href');
            if (!url) continue;
            this.preloadedTextures[url] = await taskQueue.getLoader().loadTexture(url);
        }
    }

    private traverseDocument(view:RenderableModel,el:XmlNode):void {
        this.svgElementRenderer.renderTag(view,el);
    }

}
