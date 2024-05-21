import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ICloneable, IDestroyable, IParentChild, Optional} from "@engine/core/declarations";
import {ITexture} from "@engine/renderer/common/texture";
import {Game} from "@engine/core/game";
import {ISize} from "@engine/geometry/size";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {Image} from "@engine/renderable/impl/general/image/image";
import {AbstractRenderer} from "@engine/renderer/abstract/abstractRenderer";
import {Shape} from "@engine/renderable/abstract/shape";
import {Ellipse} from "@engine/renderable/impl/geometry/ellipse";
import {Polygon} from "@engine/renderable/impl/geometry/polygon";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {IMatrixTransformable, MatrixStack} from "@engine/misc/math/matrixStack";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {isNumber, isString} from "@engine/misc/object";
import {Font} from "@engine/renderable/impl/general/font/font";
import {DebugError} from "@engine/debug/debugError";
import {WordBrake} from "@engine/renderable/impl/ui/textField/textAlign";
import {TextFieldWithoutCache} from "@engine/renderable/impl/ui/textField/simple/textField";
import {Mat4} from "@engine/misc/math/mat4";
import {arcToSvgCurve} from "@engine/renderable/impl/geometry/_internal/arcToSvgCurve";
import {
    EndCapStyle,
    ITriangulatedPathParams,
    JointStyle
} from "@engine/renderable/impl/geometry/_internal/triangulatedPathFromPolyline";
import {SvgPathToVertexArrayBuilder} from "@engine/renderable/impl/geometry/_internal/svgPathToVertexArrayBuilder";
import {BatchedImage} from "@engine/renderable/impl/general/image/batchedImage";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {FrameBufferStack} from "@engine/renderer/webGl/base/buffer/frameBufferStack";
import Mat16Holder = Mat4.Mat16Holder;


class ContainerForDrawingSurface extends SimpleGameObjectContainer {
    constructor(game: Game, private matrixStack:MatrixStack) {
        super(game);
        this._parentChildDelegate.afterChildAppended = undefined;
        this._parentChildDelegate.afterChildRemoved = undefined;
    }
    public override render(): void {
        const renderer:AbstractRenderer = this.game.getRenderer();
        renderer.transformSave();
        renderer.transformSet(this.matrixStack.getCurrentValue());
        renderer.transformTranslate(this.pos.x,this.pos.y,0);
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
    private _batchedImage:BatchedImage = new BatchedImage(this.game);
    private _ellipse:Ellipse = new Ellipse(this.game);
    private _textField:TextFieldWithoutCache;
    private _transformableContainer:ContainerForDrawingSurface = new ContainerForDrawingSurface(this.game,this._matrixStack);
    private _svgPathToVertexArrayBuilder:Optional<SvgPathToVertexArrayBuilder>;

    public readonly _renderTarget:FrameBufferStack;
    public canvasImage:Image;

    public pathParams:ITriangulatedPathParams = {
        lineWidth:1
    };
    public fillColor = Color.RGBA(0,0,0,255);
    public drawColor = Color.RGBA(0,0,0,255);
    public globalAlpha = 1;


    constructor(private game:Game,private surface:DrawingSurface,private _matrixStack:MatrixStack) {
        this._renderTarget =
            this.game.getRenderer().getHelper().createRenderTarget(this.game,this.surface.size) as FrameBufferStack;
    }

    public clear():void{
        this._renderTarget.clear(Color.NONE,true,0);
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
        if (
            this._matrixStack.getCurrentValue().identityFlag &&
            this.pathParams.lineWidth===0 &&
            this._rect.borderRadius===0
        ) {
            this._batchedImage.pos.setXY(x,y);
            this._batchedImage.size.setWH(width, height);
            this._batchedImage.fillColor.setFrom(this.surface.getFillColor());
            this._batchedImage.draw();
        } else {
            this._rect.pos.setXY(x,y);
            this._rect.size.setWH(width,height);
            this.drawSimpleShape(this._rect);
            this._rect.borderRadius = 0;
        }
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

    private _drawArc(cx:number,cy:number,radius:number,startAngle:number,endAngle:number, anticlockwise:boolean,fill:boolean) {
        if (radius===0) return;
        this._ellipse.radiusX = radius;
        this._ellipse.radiusY = radius;
        this._ellipse.center.setXY(cx,cy);
        this._ellipse.arcAngleFrom = startAngle;
        this._ellipse.arcAngleTo = endAngle;
        this._ellipse.anticlockwise = anticlockwise;
        const fillColor = this.surface.getFillColor();
        if (!fill) this.surface.setFillColor(Color.NONE);
        this.drawSimpleShape(this._ellipse);
        if (!fill) this.surface.setFillColor(fillColor as Color);
    }

    public drawArc(cx:number,cy:number,radius:number,startAngle:number,endAngle:number, anticlockwise:boolean = false):void {
        this._drawArc(cx,cy,radius,startAngle,endAngle,anticlockwise,false);
    }

    public fillArc(cx:number,cy:number,radius:number,startAngle:number,endAngle:number, anticlockwise:boolean = false):void {
        this._drawArc(cx,cy,radius,startAngle,endAngle,anticlockwise,true);
    }


    public drawText(text:string|number,x:number,y:number):void {
        if (DEBUG && this.surface.getFont()===undefined) {
            throw new DebugError(`font is not set`);
        }
        if (this._textField===undefined) {
            this._textField = new TextFieldWithoutCache(this.game,this.surface.getFont());
            this._textField.revalidate();
        }
        this._textField.setFont(this.surface.getFont());
        this._textField.setWordBrake(WordBrake.PREDEFINED);
        this._textField.textColor.setFrom(this.surface.getDrawColor());
        this._textField.pos.setXY(x,y);
        this._textField.setText(text);
        this._textField.update();
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
        const groups = this._svgPathToVertexArrayBuilder.getResult();
        for (const group of groups) {
            polyLines.push(
                PolyLine.fromVertices(this.game,group.vertexArray,this.pathParams,group.closed)
            );
        }
        for (const p of polyLines) {
            p.color.setFrom(this.drawColor);
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
        p.color.setFrom(this.surface.getDrawColor());
        this.drawModel(p);
    }

    public drawModel(model:RenderableModel):void{
        if (DEBUG && !model) throw new DebugError(`illegal argument: ${model}`);
        const parent:RenderableModel = model.parent;
        (model as IParentChild).parent = undefined;
        this._transformableContainer.appendChild(model);
        this.game.getCurrentScene()._renderingSessionInfo.drawingStackEnabled = false;
        this._transformableContainer.renderToTexture(this._renderTarget);
        this.game.getCurrentScene()._renderingSessionInfo.drawingStackEnabled = !this.game.hasCurrentTransition(); // true if we dont draw transition
        this._transformableContainer.removeChild(model);
        (model as IParentChild).parent = parent;
    }

    public _getTexture():ITexture{
        return this.canvasImage.getTexture();
    }

    public _draw():void {
        this.canvasImage.alpha = this.surface.alpha;
        this.canvasImage.filters = this.surface.filters;
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
            pg.fillColor.setFrom(this.surface.getFillColor());
            this.drawModel(pg);
        }
        if (this.surface.getLineWidth()>0) {
            for (const pl of polyLines) {
                pl.color.setFrom(this.surface.getDrawColor());
                this.drawModel(pl);
            }
        }
    }

    private drawPolygonFromVertices(vertices:number[]):void{
        const pl:PolyLine = PolyLine.fromVertices(this.game,vertices,{lineWidth:this.surface.getLineWidth()},true);
        pl.color.setFrom(this.surface.getDrawColor());
        const pg:Polygon = Polygon.fromPolyline(this.game,pl);
        pg.fillColor.setFrom(this.surface.getFillColor());
        this.drawModel(pg);
        if (this.surface.getLineWidth()>0) {
            this.drawModel(pl);
        }
    }


    private prepareShape(shape:Shape):void{
        shape.fillColor.setFrom(this.surface.getFillColor());
        shape.lineWidth = this.surface.getLineWidth();
        shape.color.setFrom(this.surface.getDrawColor());
        shape.alpha = this.globalAlpha;
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

    private readonly canvasImage:Image;

    constructor(game:Game,size:Readonly<ISize>){
        super(game);
        if (DEBUG) {
            if (size.width===0 || size.height===0) {
                throw new DebugError(`can not create Drawing surface with zero size: {width:${size.width},height:${size.height}}`)
            }
        }
        this.size.setFrom(size);
        this._drawingSession = new DrawingSession(this.game,this,this._matrixStack);
        this.canvasImage = new Image(this.game,this._drawingSession._renderTarget.getTexture());
        this.canvasImage.size.setFrom(this.size);
        this.canvasImage.revalidate();
        this._drawingSession.canvasImage = this.canvasImage;
    }

    public override type = 'DrawingSurface';

    public setResourceLink:never = undefined as unknown as never;
    private _matrixStack:MatrixStack = new MatrixStack();
    private _font:Font;
    private readonly _drawingSession:DrawingSession;

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

    public override getChildrenCount():number {
        return 0;
    }

    public clone(): DrawingSurface {return undefined!;} // todo

    public override draw(): void {
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

    public setGlobalAlpha(a:number) {
        this._drawingSession.globalAlpha = a;
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

    public transformSet(val:Readonly<Mat16Holder>): void {
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

    private _beforeSession():void {
        this.game.getRenderer().getHelper().saveRenderTarget();
        this.game.getRenderer<WebGlRenderer>().setRenderTarget(this._drawingSession._renderTarget);
        this._drawingSession._renderTarget.bind();
    }

    private _afterSession():void {
        this.game.getRenderer().getHelper().restoreRenderTarget();
    }

    public drawBatch(fn:(s:IDrawingSession)=>void):void {
        this._beforeSession();
        fn(this._drawingSession);
        this._afterSession();
    }

    public drawArc(cx: number, cy: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void {
        this._beforeSession();
        this._drawingSession.drawArc(cx,cy,radius,startAngle,endAngle,anticlockwise);
        this._afterSession();
    }

    public fillArc(cx: number, cy: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void {
        this._beforeSession();
        this._drawingSession.fillArc(cx,cy,radius,startAngle,endAngle,anticlockwise);
        this._afterSession();
    }

    public drawCircle(cx: number, cy: number, radius: number): void {
        this._beforeSession();
        this._drawingSession.drawCircle(cx,cy,radius);
        this._afterSession();
    }

    public drawEllipse(cx: number, cy: number, radiusX: number, radiusY: number): void {
        this._beforeSession();
        this._drawingSession.drawEllipse(cx,cy,radiusX,radiusY);
        this._afterSession();
    }

    public drawPolygon(pathOrVertices: string | number[]): void {
        this._beforeSession();
        this._drawingSession.drawPolygon(pathOrVertices);
        this._afterSession();
    }

    public drawPolyline(pathOrVertices: string | number[]): void {
        this._beforeSession();
        this._drawingSession.drawPolyline(pathOrVertices);
        this._afterSession();
    }

    public drawRect(x: number, y: number, width: number, height: number): void {
        this._beforeSession();
        this._drawingSession.drawRect(x,y,width,height);
        this._afterSession();
    }

    public drawRoundedRect(x: number, y: number, width: number, height: number, radius: number): void {
        this._beforeSession();
        this._drawingSession.drawRoundedRect(x,y,width,height,radius);
        this._afterSession();
    }

    public drawText(text: string | number, x: number, y: number): void {
        this._beforeSession();
        this._drawingSession.drawText(text,x,y);
        this._afterSession();
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
        this._beforeSession();
        this._drawingSession.completePolyline();
        this._afterSession();
    }

    public drawModel(m:RenderableModel):void {
        this._beforeSession();
        this._drawingSession.drawModel(m);
        this._afterSession();
    }

    public clear():void {
        this._beforeSession();
        this._drawingSession.clear();
        this._afterSession();
    }

    public override destroy():void {
        super.destroy();
        this._drawingSession._destroy();
    }

}
