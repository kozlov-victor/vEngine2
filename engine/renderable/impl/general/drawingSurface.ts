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
import {mat4} from "@engine/geometry/mat4";
import Mat16Holder = mat4.Mat16Holder;
import {NullGameObject} from "@engine/renderable/impl/general/nullGameObject";
import {ResourceLink} from "@engine/resources/resourceLink";
import {verify} from "crypto";

const COLOR_TMP = new Color();

export class DrawingSurface extends RenderableModel implements ICloneable<DrawingSurface>,IResource<ITexture>, IMatrixTransformable, IDestroyable {

    private static normalizeColor(col:byte|number, g?:byte, b?:byte, a:byte = 255):Color {
        if (b===undefined) {
            const color:Color = Color.fromRGBNumeric(col as number);
            color.setA(g!);
            return color;
        } else {
            return new Color(col as byte,g!,b!,a);
        }
    }

    public filters: IFilter[] = [];
    public setResourceLink:never = undefined as unknown as never;

    private canvasImage:Image = new Image(this.game);

    private rect:Rectangle = new Rectangle(this.game);
    private ellipse:Ellipse = new Ellipse(this.game);
    private line:Line = new Line(this.game);
    private nullGameObject:NullGameObject = new NullGameObject(this.game);

    private fillColor:Color = Color.RGB(0,0);
    private drawColor:Color = Color.RGB(0,0);
    private lineWidth:number = 1;
    private pointMoveTo:Point2d = new Point2d();

    private _matrixStack:MatrixStack = new MatrixStack();

    private readonly renderTarget:IRenderTarget;
    private omit:boolean = false;

    constructor(game:Game,size:ISize){
        super(game);
        this.size.set(size);
        this.canvasImage.size.set(this.size);
        this.renderTarget = this.game.getRenderer().getHelper().createRenderTarget(this.game,size);
        this.canvasImage.setResourceLink(this.renderTarget.getResourceLink());
        this.canvasImage.revalidate();
    }

    public clone(): DrawingSurface {return undefined!;}

    public draw(): void {
        if (this.omit) return;
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
        this.lineWidth = v;
    }

    public transformPush(m: Mat16Holder): void {
        this._matrixStack.pushMatrix(m);
    }

    public transformReset(): void {
        this._matrixStack.resetTransform();
    }

    public transformRestore(): void {
        this._matrixStack.resetTransform();
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
        const renderer:AbstractRenderer = this.game.getRenderer();
        const clearOrig:boolean = renderer.clearBeforeRender;
        COLOR_TMP.set(renderer.clearColor);
        renderer.clearColor.set(Color.NONE);
        renderer.clearBeforeRender = true;
        this.drawModel(this.nullGameObject,true);
        renderer.clearColor.set(COLOR_TMP);
        renderer.clearBeforeRender = clearOrig;
    }


    public drawRoundedRect(x:number,y:number,width:number,height:number, radius:number):void {
        this.rect.borderRadius = radius;
        this.drawRect(x,y,width,height);
    }

    public drawRect(x:number,y:number,width:number,height:number):void {
        this.rect.pos.setXY(x,y);
        this.rect.size.setWH(width,height);
        this.drawSimpleShape(this.rect);
        this.rect.borderRadius = 0;
    }

    public drawCircle(cx:number,cy:number,radius:number):void {
        this.drawEllipse(cx,cy,radius,radius);
    }

    public drawEllipse(cx:number,cy:number,radiusX:number,radiusY:number):void {
        this.ellipse.radiusX = radiusX;
        this.ellipse.radiusY = radiusY;
        this.ellipse.center.setXY(cx,cy);
        this.drawSimpleShape(this.ellipse);
    }

    public moveTo(x:number,y:number):void {
        this.pointMoveTo.setXY(x,y);
    }

    public lineTo(x:number,y:number):void {
        this.line.setXYX1Y1(this.pointMoveTo.x,this.pointMoveTo.y,x,y);
        this.drawSimpleShape(this.line);
    }

    public drawPolygon(pathOrVertices:string|number[]){
        if ((pathOrVertices as number[]).push!==undefined) {
            this.drawPolygonFromVertices(pathOrVertices as number[]);
        } else {
            this.drawPolygonFromSvgPath(pathOrVertices as string);
        }
    }

    public drawPolyline(svgPath:string){
        const p:PolyLine = new PolyLine(this.game);
        p.fillColor = this.fillColor;
        p.color = this.drawColor;
        p.lineWidth = this.lineWidth;
        p.fromSvgPath(svgPath);
        this.drawModel(p,false);
    }

    public drawModel(model:RenderableModel,clearBeforeRender:boolean = true){
        const renderer:AbstractRenderer = this.game.getRenderer();
        renderer.transformSave();
        renderer.transformPush(this._matrixStack.getCurrentValue());
        this.appendChild(model);
        this.omit = true;
        this.renderToTexture(this.renderTarget,clearBeforeRender);
        this.omit = false;
        this.removeChild(model);
        renderer.transformRestore();
    }

    public destroy() {
        this.renderTarget.destroy();
    }

    private drawPolygonFromSvgPath(svgPath:string) {
        const polyLines:PolyLine[] = PolyLine.fromSvgPath(this.game,svgPath);
        polyLines.forEach((pl:PolyLine)=>{
            const pg:Polygon = new Polygon(this.game);
            pg.fillColor = this.fillColor;
            pg.fromPolyline(pl);
            this.drawModel(pg,false);
        });
        if (this.lineWidth>0) {
            polyLines.forEach((pl:PolyLine)=>{
                pl.color = this.drawColor;
                pl.lineWidth = this.lineWidth;
                this.drawModel(pl,false);
            });
        }
    }

    private drawPolygonFromVertices(vertices:number[]){
        const prev:number = vertices[vertices.length-2];
        const last:number = vertices[vertices.length-1];

        const first:number = vertices[0];
        const next:number = vertices[1];

        if (last!==next && prev!==first) vertices = [...vertices,first,next];

        const pl:PolyLine = new PolyLine(this.game);
        pl.color = this.drawColor;
        pl.fromPoints(vertices);
        const pg:Polygon = new Polygon(this.game);
        pg.fillColor = this.fillColor;
        pg.fromPolyline(pl);
        this.drawModel(pg,false);
        if (this.lineWidth>0) {
            pl.lineWidth = this.lineWidth;
            this.drawModel(pl,false);
        }
    }


    private prepareShape(shape:Shape){
        shape.fillColor = this.fillColor;
        shape.lineWidth = this.lineWidth;
        shape.color = this.drawColor;
        shape.blendMode = BLEND_MODE.NORMAL_SEPARATE;
    }

    private drawSimpleShape(shape:Shape){
        this.prepareShape(shape);
        this.drawModel(shape,false);
    }

}