import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ICloneable, IDestroyable, IParentChild, Optional} from "@engine/core/declarations";
import {ITexture} from "@engine/renderer/common/texture";
import {Game} from "@engine/core/game";
import {ISize} from "@engine/geometry/size";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {Image} from "@engine/renderable/impl/general/image";
import {AbstractRenderer, IRenderTarget} from "@engine/renderer/abstract/abstractRenderer";
import {Shape} from "@engine/renderable/abstract/shape";
import {Ellipse} from "@engine/renderable/impl/geometry/ellipse";
import {Polygon} from "@engine/renderable/impl/geometry/polygon";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {IMatrixTransformable, MatrixStack} from "@engine/renderer/webGl/base/matrixStack";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {isNumber, isString} from "@engine/misc/object";
import {Font} from "@engine/renderable/impl/general/font/font";
import {DebugError} from "@engine/debug/debugError";
import {WordBrake} from "@engine/renderable/impl/ui/textField/textAlign";
import {TextFieldWithoutCache} from "@engine/renderable/impl/ui/textField/simple/textField";
import {Mat4} from "@engine/geometry/mat4";
import {arcToSvgCurve} from "@engine/renderable/impl/geometry/_internal/arcToSvgCurve";
import {
    EndCapStyle,
    ITriangulatedPathParams,
    JointStyle
} from "@engine/renderable/impl/geometry/_internal/triangulatedPathFromPolyline";
import {SvgPathToVertexArrayBuilder} from "@engine/renderable/impl/geometry/_internal/svgPathToVertexArrayBuilder";
import MAT16 = Mat4.MAT16;


class ContainerForDrawingSurface extends SimpleGameObjectContainer {
    constructor(game: Game, private matrixStack:MatrixStack) {
        super(game);
        this._parentChildDelegate.afterChildAppended = undefined;
        this._parentChildDelegate.afterChildRemoved = undefined;
    }
    public override render(): void {
        const renderer:AbstractRenderer = this.game.getRenderer();
        renderer.transformSave();
        renderer.transformSet(this.matrixStack.getCurrentValue().mat16);
        renderer.transformTranslate(this.pos.x,this.pos.y);
        this.pos.setXY(0);
        this.worldTransformDirty = true;
        super.render();
        this.game.getRenderer().transformRestore();
    }
}

export interface IDrawingSession {
    clear():void;
    drawRoundedRect(x:number,y:number,width:number,height:number, radius:number):void;
    drawRect(x:number,y:number,width:number,height:number):void;
    drawCircle(cx:number,cy:number,radius:number):void;
    drawEllipse(cx:number,cy:number,radiusX:number,radiusY:number):void;
    drawArc(cx:number,cy:number,radius:number,startAngle:number,endAngle:number, anticlockwise?:boolean):void;
    drawText(text:string|number,x:number,y:number):void;
    fillArc(cx:number,cy:number,radius:number,startAngle:number,endAngle:number, anticlockwise?:boolean):void;
    moveTo(x:number,y:number):void;
    lineTo(x:number,y:number):void;
    quadraticCurveTo(x1:number,y1:number,x2:number,y2:number):void;
    closePolyline():void;
    completePolyline():void;
    drawPolygon(pathOrVertices:string|number[]):void;
    drawPolyline(pathOrVertices:string|number[]):void;
}

class DrawingSession implements IDrawingSession {

    private _rect:Rectangle = new Rectangle(this.game);
    private _ellipse:Ellipse = new Ellipse(this.game);
    private _textField:TextFieldWithoutCache;
    private _nullGameObject:SimpleGameObjectContainer = new SimpleGameObjectContainer(this.game);
    private _transformableContainer:ContainerForDrawingSurface = new ContainerForDrawingSurface(this.game,this._matrixStack);
    private _svgPathToVertexArrayBuilder:Optional<SvgPathToVertexArrayBuilder>;

    private readonly _renderTarget:IRenderTarget;
    private _omitSelfOnRendering:boolean = false;

    public pathParams:ITriangulatedPathParams = {
        lineWidth:1
    };
    public fillColor:Color = Color.RGBA(0,0,0,255);
    public drawColor:Color = Color.RGBA(0,0,0,255);

    private readonly canvasImage:Image;

    constructor(private game:Game,private surface:DrawingSurface,private _matrixStack:MatrixStack) {
        this._renderTarget = this.game.getRenderer().getHelper().createRenderTarget(this.game,this.surface.size);
        this.canvasImage = new Image(this.game,this._renderTarget.getTexture());
        this.canvasImage.size.set(surface.size);
        this.canvasImage.revalidate();
    }

    public clear():void{
        this.drawModel(this._nullGameObject,Color.NONE);
    }

    public drawRoundedRect(x:number,y:number,width:number,height:number, radius:number):void {
        this._rect.borderRadius = radius;
        this.drawRect(x,y,width,height);
    }

    public drawRect(x:number,y:number,width:number,height:number):void {
        if (width===0 || height===0) return;
        if (width<0) {
            x-=width;
            width=-width;
        }
        if (height<0) {
            y-=height;
            height=-height;
        }
        this._rect.pos.setXY(x,y);
        this._rect.size.setWH(width,height);
        this.drawSimpleShape(this._rect);
        this._rect.borderRadius = 0;
    }

    public drawCircle(cx:number,cy:number,radius:number):void {
        this.drawEllipse(cx,cy,radius,radius);
    }

    public drawEllipse(cx:number,cy:number,radiusX:number,radiusY:number):void {
        if (radiusX===0 || radiusY===0) return;
        this._ellipse.radiusX = radiusX;
        this._ellipse.radiusY = radiusY;
        this._ellipse.center.setXY(cx,cy);
        this._ellipse.arcAngleFrom = 0;
        this._ellipse.arcAngleTo = 0;
        this._ellipse.anticlockwise = false;
        this.drawSimpleShape(this._ellipse);
    }

    public drawArc(cx:number,cy:number,radius:number,startAngle:number,endAngle:number, anticlockwise:boolean = false):void {
        if (radius===0) return;
        this._ellipse.radiusX = radius;
        this._ellipse.radiusY = radius;
        this._ellipse.center.setXY(cx,cy);
        this._ellipse.arcAngleFrom = startAngle;
        this._ellipse.arcAngleTo = endAngle;
        this._ellipse.anticlockwise = anticlockwise;
        const fillColor:Readonly<IColor> = this.surface.getFillColor();
        this.surface.setFillColor(Color.NONE);
        this.drawSimpleShape(this._ellipse);
        this.surface.setFillColor(fillColor as Color);
    }

    public fillArc(cx:number,cy:number,radius:number,startAngle:number,endAngle:number, anticlockwise:boolean = false):void {
        if (radius===0) return;
        if ( // full circle
            Math.abs(
                Math.abs(startAngle%(Math.PI*2)) -
                Math.abs(endAngle%(Math.PI*2))
            )<=0.001
        ) {
            const lineWidth:number = this.surface.getLineWidth();
            this.surface.setLineWidth(0);
            this.drawCircle(cx,cy,radius);
            this.surface.setLineWidth(lineWidth);
        } else {
            if (anticlockwise) {
                const tmp:number = startAngle;
                startAngle = endAngle;
                endAngle = tmp + 2*Math.PI;
            }
            const path:string = arcToSvgCurve(cx,cy,radius,startAngle,endAngle)+` z`;
            const polygon:Polygon = Polygon.fromSvgPath(this.game,path);
            polygon.fillColor.set(this.surface.getFillColor());
            this.drawModel(polygon);
        }
    }


    public drawText(text:string|number,x:number,y:number):void {
        if (DEBUG && this.surface.getFont()===undefined) {
            throw new DebugError(`font is not set`);
        }
        if (this._textField===undefined) this._textField = new TextFieldWithoutCache(this.game,this.surface.getFont());
        this._textField.setFont(this.surface.getFont());
        this._textField.setAutoSize(true);
        this._textField.setWordBrake(WordBrake.PREDEFINED);
        this._textField.textColor.set(this.surface.getDrawColor());
        this._textField.pos.setXY(x,y);
        this._textField.setText(text);
        this._textField.revalidate();
        this.drawModel(this._textField);
    }

    public moveTo(x:number,y:number):void {
        if (this._svgPathToVertexArrayBuilder===undefined) {
            this._svgPathToVertexArrayBuilder = new SvgPathToVertexArrayBuilder(this.game);
        }
        this._svgPathToVertexArrayBuilder.moveTo(x,y);
    }

    public lineTo(x:number,y:number):void {
        if (this._svgPathToVertexArrayBuilder===undefined) {
            this._svgPathToVertexArrayBuilder = new SvgPathToVertexArrayBuilder(this.game);
            this._svgPathToVertexArrayBuilder.moveTo(x,y);
        } else {
            this._svgPathToVertexArrayBuilder.lineTo(x,y);
        }
    }

    public quadraticCurveTo(x1:number,y1:number,x2:number,y2:number):void {
        if (this._svgPathToVertexArrayBuilder===undefined) {
            this._svgPathToVertexArrayBuilder = new SvgPathToVertexArrayBuilder(this.game);
            this._svgPathToVertexArrayBuilder.moveTo(0,0);
        } else {
            this._svgPathToVertexArrayBuilder.quadraticCurveTo(x1,y1,x2,y2);
        }
    }

    public closePolyline():void {
        this._svgPathToVertexArrayBuilder?.close();
    }

    public completePolyline():void {
        if (this._svgPathToVertexArrayBuilder===undefined) {
            if (DEBUG) throw new DebugError(`can not complete polyline: no path to complete`);
            return;
        }
        const polyLines:PolyLine[] = [];
        const points:number[][] = this._svgPathToVertexArrayBuilder.getResult();
        for (const vertices of points) polyLines.push(PolyLine.fromVertices(this.game,vertices,this.pathParams));
        for (const p of polyLines) {
            p.color.set(this.drawColor);
            this.drawModel(p);
            p.destroy();
        }
        this._svgPathToVertexArrayBuilder = undefined;
    }

    public drawPolygon(pathOrVertices:string|number[]):void{
        if ((pathOrVertices as number[]).push!==undefined) {
            this.drawPolygonFromVertices(pathOrVertices as number[]);
        } else {
            this.drawPolygonFromSvgPath(pathOrVertices as string);
        }
    }

    public drawPolyline(pathOrVertices:string|number[]):void{
        let p:PolyLine;
        if (isString(pathOrVertices)) {
            p = PolyLine.fromSvgPath(this.game,pathOrVertices,this.pathParams);
        } else {
            p = PolyLine.fromVertices(this.game,pathOrVertices,this.pathParams);
        }
        p.color.set(this.surface.getDrawColor());
        this.drawModel(p);
    }

    public drawModel(model:RenderableModel,clearColor?:Color):void{
        if (DEBUG && !model) throw new DebugError(`illegal argument: ${model}`);
        const parent:RenderableModel = model.parent;
        this.surface.appendChild(this._transformableContainer);
        this._transformableContainer.appendChild(model);
        this._omitSelfOnRendering = true;
        this.game.getCurrentScene()._renderingSessionInfo.drawingStackEnabled = false;
        this.surface.renderToTexture(this._renderTarget,clearColor,true);
        this.game.getCurrentScene()._renderingSessionInfo.drawingStackEnabled = !this.game.hasCurrentTransition(); // true if we dont draw transition
        this._omitSelfOnRendering = false;
        this.surface.removeChild(this._transformableContainer);
        this._transformableContainer.removeChild(model);
        (model as IParentChild).parent = parent;
    }

    public _getTexture():ITexture{
        return this.canvasImage.getTexture();
    }

    public _draw():void {
        if (this._omitSelfOnRendering) return;
        this.game.getRenderer().drawImage(this.canvasImage);
    }

    public _destroy():void {
        this._renderTarget.destroy();
    }

    public _setPixelPerfect(val:boolean):void {
        this.canvasImage.setPixelPerfect(val);
    }

    private drawPolygonFromSvgPath(svgPath:string):void {
        const polyLines:PolyLine[] = PolyLine.fromMultiCurveSvgPath(this.game,svgPath,{lineWidth:this.surface.getLineWidth()});
        for (const pl of polyLines) {
            const pg:Polygon = Polygon.fromPolyline(this.game,pl);
            pg.fillColor.set(this.surface.getFillColor());
            this.drawModel(pg);
        }
        if (this.surface.getLineWidth()>0) {
            for (const pl of polyLines) {
                pl.color.set(this.surface.getDrawColor());
                this.drawModel(pl);
            }
        }
    }

    private drawPolygonFromVertices(vertices:number[]):void{
        const pl:PolyLine = PolyLine.fromVertices(this.game,vertices,{lineWidth:this.surface.getLineWidth()},true);
        pl.color.set(this.surface.getDrawColor());
        const pg:Polygon = Polygon.fromPolyline(this.game,pl);
        pg.fillColor.set(this.surface.getFillColor());
        this.drawModel(pg);
        if (this.surface.getLineWidth()>0) {
            this.drawModel(pl);
        }
    }


    private prepareShape(shape:Shape):void{
        shape.fillColor.set(this.surface.getFillColor());
        shape.lineWidth = this.surface.getLineWidth();
        shape.color.set(this.surface.getDrawColor());
    }

    private drawSimpleShape(shape:Shape):void{
        this.prepareShape(shape);
        this.drawModel(shape);
    }

}

export class DrawingSurface
    extends RenderableModel
    implements
        ICloneable<DrawingSurface>,
        IMatrixTransformable, IDestroyable,
        IDrawingSession {

    constructor(game:Game,size:Readonly<ISize>){
        super(game);
        this.size.set(size);
        this._drawingSession = new DrawingSession(this.game,this,this._matrixStack);
    }

    public setResourceLink:never = undefined as unknown as never;
    private _matrixStack:MatrixStack = new MatrixStack();

    private _font:Font;
    private _drawingSession:DrawingSession;

    private static normalizeColor(col:Uint8|number|Color, g?:Uint8, b?:Uint8, a:Uint8 = 255):Color {
        if ((col as Color).type==='Color') { // Color
            return col as Color;
        }
        else if (isNumber(col) && b===undefined) { // numeric with alfa
            const color:Color = Color.fromRGBNumeric(col as number);
            if (g!==undefined) color.a = g as Uint8;
            return color;
        } else { // r g b a
            return new Color(col as Uint8,g!,b!,a);
        }
    }

    public clone(): DrawingSurface {return undefined!;}

    public draw(): void {
        this._drawingSession._draw();
    }

    public getTexture(): ITexture {
        return this._drawingSession._getTexture();
    }

    public setFillColor(col:number,alpha?:Uint8):void;
    public setFillColor(col:Color):void;
    public setFillColor(r:Uint8, g:Uint8, b:Uint8, a?:Uint8):void;
    public setFillColor(col:Uint8|number|Color, g?:Uint8, b?:Uint8, a:Uint8 = 255):void{
        this._drawingSession.fillColor = DrawingSurface.normalizeColor(col,g,b,a);
    }

    public getFillColor():Readonly<IColor>{
        return this._drawingSession.fillColor;
    }

    public getDrawColor():Readonly<IColor>{
        return this._drawingSession.drawColor;
    }

    public setDrawColor(col:number,alpha?:Uint8):void;
    public setDrawColor(col:Color):void;
    public setDrawColor(r:Uint8, g:Uint8, b:Uint8, a?:Uint8):void;
    public setDrawColor(col:Uint8|number|Color, g?:Uint8, b?:Uint8, a:Uint8 = 255):void{
        this._drawingSession.drawColor = DrawingSurface.normalizeColor(col,g,b,a);
    }

    public setLineWidth(v:number):void {
        this._drawingSession.pathParams.lineWidth = v;
    }

    public setLineJoint(style:JointStyle):void {
        this._drawingSession.pathParams.jointStyle = style;
    }

    public setLineCap(style:EndCapStyle):void {
        this._drawingSession.pathParams.endCapStyle = style;
    }

    public getLineWidth():number {
        return this._drawingSession.pathParams.lineWidth!;
    }

    public transformReset(): void {
        this._matrixStack.resetTransform();
    }

    public transformSet(val:Readonly<MAT16>): void {
        this._matrixStack.setMatrix(val);
    }

    public transformRestore(): void {
        this._matrixStack.restore();
    }

    public transformRotateX(angleInRadians: number): void {
        this._matrixStack.rotateX(angleInRadians);
    }

    public transformRotateY(angleInRadians: number): void {
        this._matrixStack.rotateY(angleInRadians);
    }

    public transformRotateZ(angleInRadians: number): void {
        this._matrixStack.rotateZ(angleInRadians);
    }

    public transformSave(): void {
        this._matrixStack.save();
    }

    public transformScale(x: number, y: number, z?: number): void {
        this._matrixStack.scale(x,y,z);
    }

    public transformSkewX(angle: number): void {
        this._matrixStack.skewX(angle);
    }

    public transformSkewY(angle: number): void {
        this._matrixStack.skewY(angle);
    }

    public transformTranslate(x: number, y: number, z?: number): void {
        this._matrixStack.translate(x,y,z);
    }

    public setFont(font:Font):void{
        this._font = font;
    }

    public getFont():Font{
        return this._font;
    }

    public setPixelPerfect(val:boolean):void {
        this._drawingSession._setPixelPerfect(val);
    }

    public drawBatch(fn:(s:IDrawingSession)=>void):void {
        this.game.getRenderer().getHelper().saveRenderTarget();
        fn(this._drawingSession);
        this.game.getRenderer().getHelper().restoreRenderTarget();
    }

    public drawArc(cx: number, cy: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void {
        this.game.getRenderer().getHelper().saveRenderTarget();
        this._drawingSession.drawArc(cx,cy,radius,startAngle,endAngle,anticlockwise);
        this.game.getRenderer().getHelper().restoreRenderTarget();
    }

    public fillArc(cx: number, cy: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void {
        this.game.getRenderer().getHelper().saveRenderTarget();
        this._drawingSession.fillArc(cx,cy,radius,startAngle,endAngle,anticlockwise);
        this.game.getRenderer().getHelper().restoreRenderTarget();
    }

    public drawCircle(cx: number, cy: number, radius: number): void {
        this.game.getRenderer().getHelper().saveRenderTarget();
        this._drawingSession.drawCircle(cx,cy,radius);
        this.game.getRenderer().getHelper().restoreRenderTarget();
    }

    public drawEllipse(cx: number, cy: number, radiusX: number, radiusY: number): void {
        this.game.getRenderer().getHelper().saveRenderTarget();
        this._drawingSession.drawEllipse(cx,cy,radiusX,radiusY);
        this.game.getRenderer().getHelper().restoreRenderTarget();
    }

    public drawPolygon(pathOrVertices: string | number[]): void {
        this.game.getRenderer().getHelper().saveRenderTarget();
        this._drawingSession.drawPolygon(pathOrVertices);
        this.game.getRenderer().getHelper().restoreRenderTarget();
    }

    public drawPolyline(pathOrVertices: string | number[]): void {
        this.game.getRenderer().getHelper().saveRenderTarget();
        this._drawingSession.drawPolyline(pathOrVertices);
        this.game.getRenderer().getHelper().restoreRenderTarget();
    }

    public drawRect(x: number, y: number, width: number, height: number): void {
        this.game.getRenderer().getHelper().saveRenderTarget();
        this._drawingSession.drawRect(x,y,width,height);
        this.game.getRenderer().getHelper().restoreRenderTarget();
    }

    public drawRoundedRect(x: number, y: number, width: number, height: number, radius: number): void {
        this.game.getRenderer().getHelper().saveRenderTarget();
        this._drawingSession.drawRoundedRect(x,y,width,height,radius);
        this.game.getRenderer().getHelper().restoreRenderTarget();
    }

    public drawText(text: string | number, x: number, y: number): void {
        this.game.getRenderer().getHelper().saveRenderTarget();
        this._drawingSession.drawText(text,x,y);
        this.game.getRenderer().getHelper().restoreRenderTarget();
    }

    public lineTo(x: number, y: number): void {
        this._drawingSession.lineTo(x,y);
    }

    public quadraticCurveTo(x1:number,y1:number,x2:number,y2:number):void {
        this._drawingSession.quadraticCurveTo(x1,y1,x2,y2);
    }

    public moveTo(x: number, y: number): void {
        this._drawingSession.moveTo(x,y);
    }

    public closePolyline(): void {
        this._drawingSession.closePolyline();
    }

    public completePolyline():void {
        this.game.getRenderer().getHelper().saveRenderTarget();
        this._drawingSession.completePolyline();
        this.game.getRenderer().getHelper().restoreRenderTarget();
    }

    public drawModel(m:RenderableModel):void {
        this.game.getRenderer().getHelper().saveRenderTarget();
        this._drawingSession.drawModel(m);
        this.game.getRenderer().getHelper().restoreRenderTarget();
    }

    public clear():void {
        this.game.getRenderer().getHelper().saveRenderTarget();
        this._drawingSession.clear();
        this.game.getRenderer().getHelper().restoreRenderTarget();
    }

    public override destroy():void {
        super.destroy();
        this._drawingSession._destroy();
    }

}
