import {DebugError} from "../../debug/debugError";
import {Game} from "../../core/game";
import {Rect} from "../../geometry/rect";
import {AbstractCanvasRenderer} from "../abstract/abstractCanvasRenderer";
import {Color} from "../color";
import {Size} from "../../geometry/size";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Image} from "@engine/renderable/impl/geometry/image";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Ellipse} from "@engine/renderable/impl/geometry/ellipse";
import {ITexture} from "@engine/renderer/texture";


const getCtx = (el:HTMLCanvasElement):CanvasRenderingContext2D=>{
    return (
        el.getContext("2d") as CanvasRenderingContext2D
    );
};

interface ICanvasTexture extends ITexture{
    source: CanvasImageSource;
}

export class CanvasRenderer extends AbstractCanvasRenderer {

    public readonly type:string = 'CanvasRenderer';

    private readonly ctx:CanvasRenderingContext2D;

    constructor(game:Game){
        super(game);
        this.registerResize();
        this.ctx = getCtx(this.container as HTMLCanvasElement);
        if (DEBUG) console.log('created canvas renderer');
    }


    public drawImage(img:Image):void{
        if (DEBUG) {
            if (!img.getResourceLink()) throw new DebugError(`image resource link is not set`);
            if (!this.renderableCache[img.getResourceLink().getUrl()]) throw new DebugError(`can not find texture with resource link id ${img.getResourceLink().getUrl()}`);
        }


        const srcRect:Rect = img.getSrcRect();
        const dstRect:Rect = img.getSrcRect();

        if (img.offset.x || img.offset.y) {
            const pattern:CanvasPattern = this.ctx.createPattern(
                (img.getResourceLink() as ResourceLink<ICanvasTexture>).getTarget().source,
                'repeat') as CanvasPattern;
            this.ctx.fillStyle = pattern;

            this.ctx.save();
            this.ctx.translate(-img.offset.x,-img.offset.y);

            this.ctx.fillRect(
                0,0,
                dstRect.size.width + Math.abs(img.offset.x),
                dstRect.size.height + Math.abs(img.offset.y)
            );
            this.ctx.restore();
        } else {
            this.ctx.drawImage(
                (img.getResourceLink() as ResourceLink<ICanvasTexture>).getTarget().source,
                srcRect.point.x,
                srcRect.point.y,
                srcRect.size.width,
                srcRect.size.height,
                0,0,
                dstRect.size.width,
                dstRect.size.height
            );
        }


    }


    public drawRectangle(rectangle:Rectangle):void{
        this.ctx.fillStyle = (rectangle.fillColor as Color).asCSS();
        this.ctx.strokeStyle = rectangle.color.asCSS();
        this.ctx.lineWidth = rectangle.lineWidth;
        this.ctx.fillRect(0,0,rectangle.size.width,rectangle.size.height);
        this.ctx.strokeRect(0,0,rectangle.size.width,rectangle.size.height);
    }

    public drawEllipse(e:Ellipse){
        const ctx:CanvasRenderingContext2D = this.ctx;
        ctx.fillStyle = e.fillColor.asCSS();
        ctx.strokeStyle = e.color.asCSS();
        ctx.beginPath();
        ctx.ellipse(0,0, e.radiusX, e.radiusY, 0, 0, 2 * Math.PI);
        //ctx.arc(e.center.x, e.center.y, e.radiusX,  0, 2 * Math.PI);
        ctx.fill();
    }


    public setAlpha(a:number):void{
        this.ctx.globalAlpha = a;
    }

    public lockRect(rect:Rect):void {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.rect(rect.point.x,rect.point.y,rect.size.width,rect.size.height);
        this.ctx.clip();
    }

    public unlockRect():void {
        this.ctx.restore();
    }

    public save():void {
        this.ctx.save();
    }

    public scale(x:number,y:number):void {
        this.ctx.scale(x,y);
    }

    public resetTransform():void {
        // @ts-ignore
        this.ctx.resetTransform();
    }

    public rotateZ(angleInRadians:number):void {
        this.ctx.rotate(angleInRadians);
    }

    public rotateY(angleInRadians:number):void {
        if (DEBUG) throw new DebugError('rotateY not supported by canvasRenderer');
    }

    public translate(x:number,y:number):void {
        this.ctx.translate(x,y);
    }


    public restore():void {
        this.ctx.restore();
    }

    public beginFrameBuffer():void {
        this.save();
    }
    public flipFrameBuffer():void {
        this.restore();
    }



    public beforeFrameDraw(color: Color): void {
        this.ctx.fillStyle = color.asCSS();
        this.ctx.fillRect(0,0,this.game.width,this.game.height);
    }


    public loadTextureInfo(url:string,link:ResourceLink<ITexture>,onLoad:()=>void){
        const img:HTMLImageElement = new (window as any).Image();
        img.src = url;
        if (this.renderableCache[link.getUrl()]) {
            onLoad();
            link.setTarget(this.renderableCache[link.getUrl()]);
            return;
        }
        img.onload = ()=>{
            const c:HTMLCanvasElement = document.createElement('canvas');
            c.setAttribute('width',img.width.toString());
            c.setAttribute('height',img.height.toString());
            const ctx:CanvasRenderingContext2D = c.getContext('2d') as CanvasRenderingContext2D;
            ctx.drawImage(img as HTMLImageElement,0,0);
            const size = new Size(img.width,img.height);
            const texture:ICanvasTexture = {size,source:c};
            this.renderableCache[link.getUrl()] = texture;
            link.setTarget(texture);
            onLoad();
        };
    }

}