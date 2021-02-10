import {BLEND_MODE, RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ICloneable, IDestroyable, IParentChild, IResource} from "@engine/core/declarations";
import {ITexture} from "@engine/renderer/common/texture";
import {IFilter} from "@engine/renderer/common/ifilter";
import {Game} from "@engine/core/game";
import {ISize} from "@engine/geometry/size";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {Image} from "@engine/renderable/impl/general/image";
import {AbstractRenderer, IRenderTarget} from "@engine/renderer/abstract/abstractRenderer";
import {Shape} from "@engine/renderable/abstract/shape";
import {Point2d} from "@engine/geometry/point2d";
import {Line} from "@engine/renderable/impl/geometry/line";
import {Ellipse} from "@engine/renderable/impl/geometry/ellipse";
import {Polygon} from "@engine/renderable/impl/geometry/polygon";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {IMatrixTransformable, MatrixStack} from "@engine/renderer/webGl/base/matrixStack";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {ResourceLink} from "@engine/resources/resourceLink";
import {isNumber, isObject, isString} from "@engine/misc/object";
import {Font} from "@engine/renderable/impl/general/font";
import {DebugError} from "@engine/debug/debugError";
import {WordBrake} from "@engine/renderable/impl/ui/textField/textAlign";
import {TextFieldWithoutCache} from "@engine/renderable/impl/ui/textField/simple/textField";
import {Mat4} from "@engine/geometry/mat4";
import MAT16 = Mat4.MAT16;
import {arcToSvgCurve} from "@engine/renderable/impl/geometry/_internal/arcToSvgCurve";


class ContainerForDrawingSurface extends SimpleGameObjectContainer {
    constructor(protected game: Game, private matrixStack:MatrixStack) {
        super(game);
        this._parentChildDelegate.afterChildAppended = undefined;
        this._parentChildDelegate.afterChildRemoved = undefined;
    }
    render(): void {
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
    drawPolygon(pathOrVertices:string|number[]):void;
    drawPolyline(pathOrVertices:string|number[]):void;
}

class DrawingSession implements IDrawingSession {

    private _rect:Rectangle = new Rectangle(this.game);
    private _ellipse:Ellipse = new Ellipse(this.game);
    private _line:Line = new Line(this.game);
    private _textField:TextFieldWithoutCache;
    private _nullGameObject:SimpleGameObjectContainer = new SimpleGameObjectContainer(this.game);
    private _transformableContainer:ContainerForDrawingSurface = new ContainerForDrawingSurface(this.game,this._matrixStack);
    private _pointMoveTo:Point2d = new Point2d();

    private readonly _renderTarget:IRenderTarget;
    private _omitSelfOnRendering:boolean = false;

    private canvasImage:Image = new Image(this.game);

    constructor(private game:Game,private surface:DrawingSurface,private _matrixStack:MatrixStack) {
        this._renderTarget = this.game.getRenderer().getHelper().createRenderTarget(this.game,this.surface.size);
        this.canvasImage.size.set(surface.size);
        this.canvasImage.setResourceLink(this._renderTarget.getResourceLink());
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
        this._pointMoveTo.setXY(x,y);
    }

    public lineTo(x:number,y:number):void {
        this._line.setXYX1Y1(this._pointMoveTo.x,this._pointMoveTo.y,x,y);
        this.drawSimpleShape(this._line);
        this.moveTo(x,y);
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
            p = PolyLine.fromSvgPath(this.game,pathOrVertices);
        } else {
            p = PolyLine.fromVertices(this.game,pathOrVertices);
        }
        p.fillColor.set(this.surface.getFillColor());
        p.color.set(this.surface.getDrawColor());
        p.lineWidth = this.surface.getLineWidth();
        this.drawModel(p);
    }

    public drawModel(model:RenderableModel,clearColor?:Color):void{
        if (DEBUG && !model) throw new DebugError(`illegal argument`);
        const parent:RenderableModel = model.parent;
        this.surface.appendChild(this._transformableContainer);
        this._transformableContainer.appendChild(model);
        this._omitSelfOnRendering = true;
        this.game.getCurrScene()._renderingSessionInfo.drawingStackEnabled = false;
        this.surface.renderToTexture(this._renderTarget,clearColor,true);
        this.game.getCurrScene()._renderingSessionInfo.drawingStackEnabled = true;
        this._omitSelfOnRendering = false;
        this.surface.removeChild(this._transformableContainer);
        this._transformableContainer.removeChild(model);
        (model as IParentChild).parent = parent;
    }

    public _getResourceLink():ResourceLink<ITexture>{
        return this.canvasImage.getResourceLink();
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
        const polyLines:PolyLine[] = PolyLine.fromMultiCurveSvgPath(this.game,svgPath);
        polyLines.forEach((pl:PolyLine)=>{
            const pg:Polygon = Polygon.fromPolyline(this.game,pl);
            pg.fillColor.set(this.surface.getFillColor());
            this.drawModel(pg);
        });
        if (this.surface.getLineWidth()>0) {
            polyLines.forEach((pl:PolyLine)=>{
                pl.color.set(this.surface.getDrawColor());
                pl.lineWidth = this.surface.getLineWidth();
                this.drawModel(pl);
            });
        }
    }

    private drawPolygonFromVertices(vertices:number[]):void{
        const pl:PolyLine = PolyLine.fromVertices(this.game,vertices,true);
        pl.color.set(this.surface.getDrawColor());
        const pg:Polygon = Polygon.fromPolyline(this.game,pl);
        pg.fillColor.set(this.surface.getFillColor());
        this.drawModel(pg);
        if (this.surface.getLineWidth()>0) {
            pl.lineWidth = this.surface.getLineWidth();
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
        ICloneable<DrawingSurface>,IResource<ITexture>,
        IMatrixTransformable, IDestroyable,
        IDrawingSession {

    constructor(game:Game,size:Readonly<ISize>){
        super(game);
        this.size.set(size);
        this._drawingSession = new DrawingSession(this.game,this,this._matrixStack);
    }

    public filters: IFilter[] = [];
    public setResourceLink:never = undefined as unknown as never;
    private _matrixStack:MatrixStack = new MatrixStack();

    private _font:Font;
    private _drawingSession:DrawingSession;

    private fillColor:Color = Color.RGBA(0,0,0,255);
    private drawColor:Color = Color.RGBA(0,0,0,255);
    private _lineWidth:number = 1;

    private static normalizeColor(col:byte|number|Color, g?:byte, b?:byte, a:byte = 255):Color {
        if (isObject(col)) { // Color
            return col;
        }
        else if (isNumber(col) && b===undefined) { // numeric with alfa
            const color:Color = Color.fromRGBNumeric(col as number);
            if (g!==undefined) color.a = g as byte;
            return color;
        } else { // r g b a
            return new Color(col as byte,g!,b!,a);
        }
    }

    public clone(): DrawingSurface {return undefined!;}

    public draw(): void {
        this._drawingSession._draw();
    }

    public getResourceLink(): ResourceLink<ITexture> {
        return this._drawingSession._getResourceLink();
    }

    public setFillColor(col:number,alpha?:byte):void;
    public setFillColor(col:Color):void;
    public setFillColor(r:byte,g:byte,b:byte,a?:byte):void;
    public setFillColor(col:byte|number|Color,g?:byte,b?:byte,a:byte = 255):void{
        this.fillColor = DrawingSurface.normalizeColor(col,g,b,a);
    }

    public getFillColor():Readonly<IColor>{
        return this.fillColor;
    }

    public getDrawColor():Readonly<IColor>{
        return this.drawColor;
    }

    public setDrawColor(col:number,alpha?:byte):void;
    public setDrawColor(col:Color):void;
    public setDrawColor(r:byte,g:byte,b:byte,a?:byte):void;
    public setDrawColor(col:byte|number|Color,g?:byte,b?:byte,a:byte = 255):void{
        this.drawColor = DrawingSurface.normalizeColor(col,g,b,a);
    }

    public setLineWidth(v:number):void {
        this._lineWidth = v;
    }

    public getLineWidth():number {
        return this._lineWidth;
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
        this.game.getRenderer().getHelper().saveRenderTarget();
        this._drawingSession.lineTo(x,y);
        this.game.getRenderer().getHelper().restoreRenderTarget();
    }

    public moveTo(x: number, y: number): void {
        this.game.getRenderer().getHelper().saveRenderTarget();
        this._drawingSession.moveTo(x,y);
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

    public destroy():void {
        this._drawingSession._destroy();
    }

}
