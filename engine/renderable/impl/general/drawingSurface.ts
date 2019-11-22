import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ICloneable, IFilterable, IResource} from "@engine/core/declarations";
import {ITexture} from "@engine/renderer/common/texture";
import {IFilter} from "@engine/renderer/common/ifilter";
import {Game} from "@engine/core/game";
import {ISize} from "@engine/geometry/size";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {Image} from "@engine/renderable/impl/geometry/image";
import {IRenderTarget} from "@engine/renderer/abstract/abstractRenderer";
import {Shape} from "@engine/renderable/abstract/shape";
import {Point2d} from "@engine/geometry/point2d";
import {Line} from "@engine/renderable/impl/geometry/line";
import {Ellipse} from "@engine/renderable/impl/geometry/ellipse";

export class DrawingSurface extends RenderableModel implements ICloneable<DrawingSurface>,IResource<ITexture>,IFilterable {

    public filters: IFilter[] = [];
    public setResourceLink:never = undefined as unknown as never;

    private canvasImage:Image = new Image(this.game);

    private rect:Rectangle = new Rectangle(this.game);
    private ellipse:Ellipse = new Ellipse(this.game);
    private line:Line = new Line(this.game);

    private fillColor:Color = Color.RGB(0,0);
    private drawColor:Color = Color.RGB(0,0);
    private lineWidth:number = 1;
    private pointMoveTo:Point2d = new Point2d();

    private readonly renderTarget:IRenderTarget;
    private omit:boolean = false;

    constructor(game:Game,size:ISize){
        super(game);
        this.size.set(size);
        this.canvasImage.size.set(this.size);
        this.renderTarget = this.game.getRenderer().getHelper().createRenderTarget(size);
        this.canvasImage.setResourceLink(this.renderTarget.getResourceLink());
        this.canvasImage.revalidate();
    }

    public clone(): DrawingSurface {return undefined!;}

    public draw(): void {
        if (this.omit) return;
        this.game.getRenderer().drawImage(this.canvasImage);
    }

    public getResourceLink(): never {
        return undefined!; // todo
    }

    public setFillColor(r:byte,g:byte,b:byte,a:byte = 255){
        this.fillColor.setRGBA(r,g,b,a);
    }

    public setDrawColor(r:byte,g:byte,b:byte,a:byte = 255){
        this.drawColor.setRGBA(r,g,b,a);
    }

    public setLineWidth(v:number):void {
        this.lineWidth = v;
    }

    public drawRect(x:number,y:number,width:number,height:number):void {
        this.rect.pos.setXY(x,y);
        this.rect.size.setWH(width,height);
        this.doRender(this.rect);
    }

    public drawCircle(cx:number,cy:number,radius:number):void {
        this.drawEllipse(cx,cy,radius,radius);
    }

    public drawEllipse(cx:number,cy:number,radiusX:number,radiusY:number):void {
        this.ellipse.radiusX = radiusX;
        this.ellipse.radiusY = radiusY;
        this.ellipse.center.setXY(cx,cy);
        this.doRender(this.ellipse);
    }

    public moveTo(x:number,y:number):void {
        this.pointMoveTo.setXY(x,y);
    }

    public lineTo(x:number,y:number):void {
        this.line.setXYX1Y1(this.pointMoveTo.x,this.pointMoveTo.y,x,y);
        this.doRender(this.line);
    }

    private doRender(shape:Shape){
        this.prepareShape(shape);
        this.renderShape(shape);
    }

    private prepareShape(shape:Shape){
        shape.fillColor = this.fillColor;
        shape.lineWidth = this.lineWidth;
        shape.color = this.drawColor;
    }

    private renderShape(shape:Shape){
        this.appendChild(shape);
        this.omit = true;
        this.renderToTexture(this.renderTarget);
        this.omit = false;
        this.removeChild(shape);
    }

}