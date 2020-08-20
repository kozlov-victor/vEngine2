import {BLEND_MODE, RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ICloneable, IDestroyable, IResource} from "@engine/core/declarations";
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
import {NullGameObject} from "@engine/renderable/impl/general/nullGameObject";
import {ResourceLink} from "@engine/resources/resourceLink";
import {describeArc} from "@engine/renderable/impl/geometry/helpers/splineFromPoints";

class ContainerForDrawingSurface extends NullGameObject {
    constructor(protected game: Game, private matrixStack:MatrixStack) {super(game);}
    render(): void {
        const renderer:AbstractRenderer = this.game.getRenderer();
        renderer.transformSave();
        renderer.transformTranslateByMatrixValues(...this.matrixStack.getCurrentValue().mat16);
        renderer.transformTranslate(this.pos.x,this.pos.y);
        this.pos.setXY(0);
        this.worldTransformDirty = true;
        super.render();
        this.game.getRenderer().transformRestore();
    }
}


export class DrawingSurface extends RenderableModel implements ICloneable<DrawingSurface>,IResource<ITexture>, IMatrixTransformable, IDestroyable {

    private static normalizeColor(col:byte|number, g?:byte, b?:byte, a:byte = 255):Color {
        if (b===undefined) {
            const color:Color = Color.fromRGBNumeric(col as number);
            color.a = g!;
            return color;
        } else {
            return new Color(col as byte,g!,b!,a);
        }
    }

    public filters: IFilter[] = [];
    public setResourceLink:never = undefined as unknown as never;
    private _matrixStack:MatrixStack = new MatrixStack();

    private canvasImage:Image = new Image(this.game);

    private _rect:Rectangle = new Rectangle(this.game);
    private _ellipse:Ellipse = new Ellipse(this.game);
    private _line:Line = new Line(this.game);
    private _nullGameObject:NullGameObject = new NullGameObject(this.game);
    private _transformableContainer:ContainerForDrawingSurface = new ContainerForDrawingSurface(this.game,this._matrixStack);

    private fillColor:Color = Color.RGBA(0,0,0,255);
    private drawColor:Color = Color.RGBA(0,0,0,255);
    private _lineWidth:number = 1;
    private _pointMoveTo:Point2d = new Point2d();

    private readonly _renderTarget:IRenderTarget;
    private _omitSelfOnRendering:boolean = false;

    constructor(game:Game,size:ISize){
        super(game);
        this.size.set(size);
        this.canvasImage.size.set(this.size);
        this._renderTarget = this.game.getRenderer().getHelper().createRenderTarget(this.game,size);
        this.canvasImage.setResourceLink(this._renderTarget.getResourceLink());
        this.canvasImage.revalidate();
    }

    public clone(): DrawingSurface {return undefined!;}

    public draw(): void {
        if (this._omitSelfOnRendering) return;
        this.game.getRenderer().drawImage(this.canvasImage);
    }

    public getResourceLink(): ResourceLink<ITexture> {
        return this.canvasImage.getResourceLink();
    }

    public setFillColor(col:number,alpha?:byte):void;
    public setFillColor(r:byte,g:byte,b:byte,a?:byte):void;
    public setFillColor(col:byte|number,g?:byte,b?:byte,a:byte = 255){
        this.fillColor.set(DrawingSurface.normalizeColor(col,g,b,a));
    }

    public setDrawColor(col:number,alpha?:number):void;
    public setDrawColor(r:byte,g:byte,b:byte,a?:byte):void;
    public setDrawColor(col:byte|number,g?:byte,b?:byte,a:byte = 255){
        this.drawColor.set(DrawingSurface.normalizeColor(col,g,b,a));
    }

    public setLineWidth(v:number):void {
        this._lineWidth = v;
    }

    public transformReset(): void {
        this._matrixStack.resetTransform();
    }

    public transformSet(
        v0: number, v1: number, v2: number, v3: number,
        v4: number, v5: number, v6: number, v7: number,
        v8: number, v9: number, v10: number, v11: number,
        v12: number, v13: number, v14: number, v15: number): void {
        this._matrixStack.setMatrixValues(v0,v1,v2,v3,v4,v5,v6,v7,v8,v9,v10,v11,v12,v13,v14,v15);
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


    public clear():void{
        this.drawModel(this._nullGameObject,Color.NONE);
    }


    public drawRoundedRect(x:number,y:number,width:number,height:number, radius:number):void {
        this._rect.borderRadius = radius;
        this.drawRect(x,y,width,height);
    }

    public drawRect(x:number,y:number,width:number,height:number):void {
        if (width===0 || height===0) return;
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
        const fillColor:Color = this.fillColor;
        this.fillColor = Color.NONE;
        this.drawSimpleShape(this._ellipse);
        this.fillColor = fillColor;
    }

    public fillArc(cx:number,cy:number,radius:number,startAngle:number,endAngle:number, anticlockwise:boolean = false):void {
        if (radius===0) return;
        if ( // full circle
            Math.abs(
                Math.abs(startAngle%(Math.PI*2)) -
                   Math.abs(endAngle%(Math.PI*2))
            )<=0.001
        ) {
            const lineWidth:number = this._lineWidth;
            this._lineWidth = 0;
            this.drawCircle(cx,cy,radius);
            this._lineWidth = lineWidth;
        } else {
            if (anticlockwise) {
                const tmp:number = startAngle;
                startAngle = endAngle;
                endAngle = tmp + 2*Math.PI;
            }
            const path:string = describeArc(cx,cy,radius,startAngle,endAngle,anticlockwise)+` z`;
            const polygon:Polygon = Polygon.fromSvgPath(this.game,path);
            polygon.fillColor = this.fillColor;
            this.drawModel(polygon);
        }


    }

    public moveTo(x:number,y:number):void {
        this._pointMoveTo.setXY(x,y);
    }

    public lineTo(x:number,y:number):void {
        this._line.setXYX1Y1(this._pointMoveTo.x,this._pointMoveTo.y,x,y);
        this.drawSimpleShape(this._line);
    }

    public drawPolygon(pathOrVertices:string|number[]){
        if ((pathOrVertices as number[]).push!==undefined) {
            this.drawPolygonFromVertices(pathOrVertices as number[]);
        } else {
            this.drawPolygonFromSvgPath(pathOrVertices as string);
        }
    }

    public drawPolyline(pathOrVertices:string|number[]){
        let p:PolyLine;
        if ((pathOrVertices as number[]).push!==undefined) {
            p = PolyLine.fromPoints(this.game,pathOrVertices as number[]);
        } else {
            p = PolyLine.fromSvgPath(this.game,pathOrVertices as string);
        }
        p.fillColor = this.fillColor;
        p.color = this.drawColor;
        p.lineWidth = this._lineWidth;
        this.drawModel(p);
    }

    public drawModel(model:RenderableModel,clearColor?:Color){
        this.appendChild(this._transformableContainer);
        this._transformableContainer.appendChild(model);
        this._omitSelfOnRendering = true;
        this.renderToTexture(this._renderTarget,clearColor);
        this._omitSelfOnRendering = false;
        this.removeChild(this._transformableContainer);
        this._transformableContainer.removeChild(model);
    }

    public destroy() {
        this._renderTarget.destroy();
    }

    private drawPolygonFromSvgPath(svgPath:string) {
        const polyLines:PolyLine[] = PolyLine.fromMultiCurveSvgPath(this.game,svgPath);
        polyLines.forEach((pl:PolyLine)=>{
            const pg:Polygon = Polygon.fromPolyline(this.game,pl);
            pg.fillColor = this.fillColor;
            this.drawModel(pg);
        });
        if (this._lineWidth>0) {
            polyLines.forEach((pl:PolyLine)=>{
                pl.color = this.drawColor;
                pl.lineWidth = this._lineWidth;
                this.drawModel(pl);
            });
        }
    }

    private drawPolygonFromVertices(vertices:number[]){
        const prev:number = vertices[vertices.length-2];
        const last:number = vertices[vertices.length-1];

        const first:number = vertices[0];
        const next:number = vertices[1];

        if (last!==next && prev!==first) vertices = [...vertices,first,next];

        const pl:PolyLine = PolyLine.fromPoints(this.game,vertices);
        pl.color = this.drawColor;
        const pg:Polygon = Polygon.fromPolyline(this.game,pl);
        pg.fillColor = this.fillColor;
        this.drawModel(pg);
        if (this._lineWidth>0) {
            pl.lineWidth = this._lineWidth;
            this.drawModel(pl);
        }
    }


    private prepareShape(shape:Shape){
        shape.fillColor = this.fillColor;
        shape.lineWidth = this._lineWidth;
        shape.color = this.drawColor;
        shape.blendMode = BLEND_MODE.NORMAL_SEPARATE;
    }

    private drawSimpleShape(shape:Shape){
        this.prepareShape(shape);
        this.drawModel(shape);
    }

}
