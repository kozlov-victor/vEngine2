import {CssParser} from "@engine/misc/parsers/css/cssParser";
import {Game} from "@engine/core/game";
import {XmlNode} from "@engine/misc/parsers/xml/xmlElements";
import {ITexture} from "@engine/renderer/common/texture";
import {Optional} from "@engine/core/declarations";
import {Color} from "@engine/renderer/common/color";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {BasicStringTokenizer} from "@engine/renderable/impl/geometry/_internal/basicStringTokenizer";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {MathEx} from "@engine/misc/math/mathEx";
import {Polygon} from "@engine/renderable/impl/geometry/polygon";
import {EvenOddCompositionFilter} from "@engine/renderer/webGl/filters/composition/evenOddCompositionFilter";
import {EndCapStyle, JointStyle} from "@engine/renderable/impl/geometry/_internal/triangulatedPathFromPolyline";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {DebugError} from "@engine/debug/debugError";
import {Image} from "@engine/renderable/impl/general/image/image";
import {Ellipse} from "@engine/renderable/impl/geometry/ellipse";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Line} from "@engine/renderable/impl/geometry/line";
import {closePolylinePoints} from "@engine/renderable/impl/geometry/_internal/closePolylinePoints";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {SvgImage} from "../svgImage";
import {ElementStylesHolder} from "./elementStylesHolder";
import {SvgUtils} from "./svgUtils";
import {AbstractGradient} from "@engine/renderable/impl/fill/abstract/abstractGradient";
import {LinearGradient} from "@engine/renderable/impl/fill/linearGradient";
import {RadialGradient} from "@engine/renderable/impl/fill/radialGradient";

export class SvgElementRenderer {

    private elementStylesHolder = new ElementStylesHolder();
    private css = new CssParser();

    constructor(private game:Game, private document:XmlNode, private rootContainer:SvgImage, private preloadedResources:Record<string, ITexture>) {
        const cssRaw = document.getElementsByTagName('style').map(it=>it.getTextContent()).join('\n');
        this.css.parseCSS(cssRaw);
    }

    private resolveGradientNode(baseNode:Optional<XmlNode>):Optional<XmlNode> {
        if (!baseNode) return undefined;
        let href = baseNode.getAttribute('xlink:href');
        if (!href) return baseNode;
        baseNode = baseNode.clone();
        href = href.replace('#','');
        const refNode = this.document.getElementById(href);
        if (!refNode) return baseNode;
        else {
            Object.keys(baseNode.getAttributes()).forEach(k=>{
                refNode.setAttribute(k,baseNode!.getAttribute(k));
            });
            return refNode;
        }
    }

    private resolveGradient(val:string):Optional<AbstractGradient> {
        const gradientId = val.replace('url(#','').replace(')','');
        const gradientNode = this.resolveGradientNode(this.document.getElementById(gradientId));
        if (!gradientNode) return undefined;
        let gradient:Optional<AbstractGradient>;
        // gradientUnits="userSpaceOnUse" <-- ignored
        // gradientTransform="matrix(1,0,0,2.3714286,0,19.951903)" <-- ignored
        // gradientTransform="rotate(45)"
        if (gradientNode.tagName==='linearGradient') {
            gradient = new LinearGradient();
        }
        else if (gradientNode.tagName==='radialGradient') {
            gradient = new RadialGradient();
            const cx = SvgUtils.getNumberWithMeasure(gradientNode.getAttribute('cx'),1,0.5);
            const cy = SvgUtils.getNumberWithMeasure(gradientNode.getAttribute('cy'),1,0.5);
            // r fx fy spreadMethod - ignore
            (gradient as RadialGradient).center.setXY(cx,cy);
        } else {
            console.log(`unknown gradient tag: ${gradientNode.tagName}`);
        }

        if (gradient!=undefined) {
            gradientNode.getChildNodes().forEach(c=> {
                if (c.tagName !== 'stop') return;
                const offset = SvgUtils.getNumberWithMeasure(this.lookUpProperty(c,'offset',false),1,0)
                const color = SvgUtils.getColor(this.lookUpProperty(c,'stop-color',false));
                const opacity = SvgUtils.getNumber(this.lookUpProperty(c,'stop-opacity',false),-1);
                if (opacity!==-1) {
                    color.a = (255 * opacity) as Uint8;
                }
                gradient!.setColorAtPosition(offset,color);
            });
        }
        return gradient;
    }

    private getFillStrokeParams(el:XmlNode):{lineWidth:Optional<number>,fillColor:Color,fillGradient:Optional<AbstractGradient>,drawColor:Color} {

        const rawStrokeValue:string = this.lookUpProperty(el,'stroke',true);
        const rawFillValue:string = this.lookUpProperty(el,'fill',true);

        let lineWidth:Optional<number>;
        if (!rawStrokeValue) lineWidth = undefined;
        else {
            lineWidth = SvgUtils.getNumber(this.lookUpProperty(el,'stroke-width',true),1);
        }

        let fillGradient:Optional<AbstractGradient>;
        let fillColor:Color;
        if (rawFillValue.indexOf('url')>-1) {
            fillColor = Color.NONE.clone();
            fillGradient = this.resolveGradient(rawFillValue);
        } else {
            fillColor = SvgUtils.getColor(rawFillValue ?? '#000000');
        }
        const drawColor:Color = SvgUtils.getColor(rawStrokeValue);

        const fillOpacity:number = SvgUtils.getNumber(this.lookUpProperty(el,'fill-opacity',true),1);
        const strokeOpacity:number = SvgUtils.getNumber(this.lookUpProperty(el,'stroke-opacity',true),1);

        if (rawFillValue!=='none') fillColor.a = ~~(fillOpacity*255) as Uint8;
        if (rawStrokeValue!=='none') drawColor.a = ~~(strokeOpacity*255) as Uint8;

        return {lineWidth,fillColor,fillGradient,drawColor};
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
                    SvgUtils.calcNumberWithMeasure(x,measureX,this.rootContainer.size.width),
                    SvgUtils.calcNumberWithMeasure(y,measureY,this.rootContainer.size.height)
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
                    SvgUtils.calcNumberWithMeasure(x,measureX,1),
                    SvgUtils.calcNumberWithMeasure(y,measureY,1)
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
        return SvgUtils.getNumber(opacity,1);
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
        if (result===undefined) {
            const cssProps = this.css.getRulesForElement(el);
            result = cssProps[propName];
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
        let polygonContainer = new SimpleGameObjectContainer(this.game);
        const {lineWidth,fillColor,drawColor,fillGradient} = this.getFillStrokeParams(el);
        let fillRule = this.lookUpProperty(el,'fill-rule',true);
        if (['nonzero','evenodd'].indexOf(fillRule)===-1) fillRule = 'nonzero';

        // https://developer.mozilla.org/ru/docs/Web/SVG/Attribute/fill-rule
        polygonContainer.forceDrawChildrenOnNewSurface = true;
        let directionOfBaseShapeIsCc:boolean;
        Polygon.fromMultiCurveSvgPath(this.game,data).forEach((p,i,arr)=>{
            p.fillColor = fillColor;
            if (i==0 && fillRule==='nonzero') directionOfBaseShapeIsCc = p.isClockWise();
            if (i>0) {
                if (fillRule==='evenodd' || p.isClockWise()!==directionOfBaseShapeIsCc) {
                    p.filters = [new EvenOddCompositionFilter(this.game)];
                }
            }
            polygonContainer.appendChild(p);
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
                polygonContainer.appendChild(p);
            });
        }

        if (fillGradient!==undefined) {
            polygonContainer = SvgUtils.applyFillGradient(this.game,polygonContainer,fillGradient);
        }
        polygonContainer.appendTo(container);
        this.setCommonProperties(container,el);
    }

    private renderCircle(parentView:RenderableModel,el:XmlNode):void {
        const container:RenderableModel = this.createElementContainer(parentView,el);
        const {lineWidth = 0,fillColor,drawColor,fillGradient} = this.getFillStrokeParams(el);
        const cx:number = SvgUtils.getNumberWithMeasure(el.getAttribute('cx'),this.rootContainer.size.width,0);
        const cy:number = SvgUtils.getNumberWithMeasure(el.getAttribute('cy'),this.rootContainer.size.height,0);
        const r:number = SvgUtils.getNumberWithMeasure(el.getAttribute('r'),this.rootContainer.size.width,10)+lineWidth/2;

        const circle:Circle = new Circle(this.game);
        circle.center.setXY(cx,cy);
        circle.fillColor = fillColor;
        circle.color = drawColor;
        circle.lineWidth = lineWidth;
        circle.fillGradient = fillGradient;
        circle.radius = r;
        this.setCommonProperties(circle,el);
        container.appendChild(circle);
    }

    private renderImage(parentView:RenderableModel,el:XmlNode):void {
        const container:RenderableModel = this.createElementContainer(parentView,el);
        const x:number = SvgUtils.getNumberWithMeasure(el.getAttribute('cx'),this.rootContainer.size.width,0);
        const y:number = SvgUtils.getNumberWithMeasure(el.getAttribute('cy'),this.rootContainer.size.height,0);
        const width:number = SvgUtils.getNumberWithMeasure(this.lookUpProperty(el,'width',false),this.rootContainer.size.width,0);
        const height:number = SvgUtils.getNumberWithMeasure(this.lookUpProperty(el,'height',false),this.rootContainer.size.height,0);
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
        const {lineWidth = 0,fillColor,drawColor,fillGradient} = this.getFillStrokeParams(el);
        const cx:number = SvgUtils.getNumberWithMeasure(el.getAttribute('cx'),this.rootContainer.size.width,0);
        const cy:number = SvgUtils.getNumberWithMeasure(el.getAttribute('cy'),this.rootContainer.size.height,0);
        const rx:number = SvgUtils.getNumberWithMeasure(el.getAttribute('rx'),this.rootContainer.size.width,10)+lineWidth/2;
        const ry:number = SvgUtils.getNumberWithMeasure(el.getAttribute('ry'),this.rootContainer.size.width,10)+lineWidth/2;

        const ellipse:Ellipse = new Ellipse(this.game);
        ellipse.fillColor = fillColor;
        ellipse.color = drawColor;
        ellipse.lineWidth = lineWidth;
        ellipse.radiusX = rx;
        ellipse.radiusY = ry;
        ellipse.fillGradient = fillGradient;
        this.setCommonProperties(ellipse,el);
        ellipse.center.setXY(cx,cy);
        container.appendChild(ellipse);
    }

    // ry is not supported
    private renderRect(parentView:RenderableModel,el:XmlNode):void {
        const container:RenderableModel = this.createElementContainer(parentView,el);
        const {lineWidth = 0,fillColor,drawColor,fillGradient} = this.getFillStrokeParams(el);
        const x:number = SvgUtils.getNumberWithMeasure(el.getAttribute('x'),this.rootContainer.size.width,0);
        const y:number = SvgUtils.getNumberWithMeasure(el.getAttribute('y'),this.rootContainer.size.height,0);
        const width:number = SvgUtils.getNumberWithMeasure(el.getAttribute('width'),this.rootContainer.size.width,1);
        const height:number = SvgUtils.getNumberWithMeasure(el.getAttribute('height'),this.rootContainer.size.height,1);
        const borderRadius:number = SvgUtils.getNumberWithMeasure(el.getAttribute('rx'),this.rootContainer.size.width,0);

        if (width===0 || height===0) return;

        const rect:Rectangle = new Rectangle(this.game);
        rect.size.setWH(width+lineWidth*2,height+lineWidth*2);
        rect.fillColor = fillColor;
        rect.color = drawColor;
        rect.lineWidth = lineWidth;
        rect.borderRadius = borderRadius;
        this.setCommonProperties(rect,el);
        rect.pos.setXY(x-lineWidth,y-lineWidth);
        container.appendChild(rect);
        rect.fillGradient = fillGradient;
    }

    private renderLine(parentView:RenderableModel,el:XmlNode):void {
        const container:RenderableModel = this.createElementContainer(parentView,el);
        let {lineWidth,drawColor} = this.getFillStrokeParams(el);
        if (lineWidth===undefined) lineWidth = 1;
        const x1:number = SvgUtils.getNumberWithMeasure(el.getAttribute('x1'),this.rootContainer.size.width,0);
        const y1:number = SvgUtils.getNumberWithMeasure(el.getAttribute('y1'),this.rootContainer.size.height,0);
        const x2:number = SvgUtils.getNumberWithMeasure(el.getAttribute('x2'),this.rootContainer.size.width,1);
        const y2:number = SvgUtils.getNumberWithMeasure(el.getAttribute('y2'),this.rootContainer.size.height,1);

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
        const points:string = SvgUtils.getString(el.getAttribute('points'),'');
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
        const x:number = SvgUtils.getNumberWithMeasure(el.getAttribute('x'),this.rootContainer.size.width,undefined!);
        const y:number = SvgUtils.getNumberWithMeasure(el.getAttribute('y'),this.rootContainer.size.height,undefined!);
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
            case 'title':
            case 'style':
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
