import {DebugError} from "../../debug/debugError";
import {Game} from "../../core/game";
import {Rect} from "../../geometry/rect";
import {AbstractCanvasRenderer} from "../abstract/abstractCanvasRenderer";
import {Color} from "../common/color";
import {Size} from "../../geometry/size";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Image} from "@engine/renderable/impl/geometry/image";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Ellipse} from "@engine/renderable/impl/geometry/ellipse";
import {ITexture} from "@engine/renderer/common/texture";
import {TileMap} from "@engine/renderable/impl/general/tileMap";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Mesh} from "@engine/renderable/abstract/mesh";
import {Line} from "@engine/renderable/impl/geometry/line";
import {Optional} from "@engine/core/declarations";
import {RendererHelper} from "@engine/renderer/abstract/rendererHelper";


const getCtx = (el:HTMLCanvasElement):CanvasRenderingContext2D=>{
    return (
        el.getContext("2d") as CanvasRenderingContext2D
    );
};

interface ICanvasTexture extends ITexture{
    source: CanvasImageSource;
}

interface ICanvasRenderingContext2D extends CanvasRenderingContext2D {
    webkitImageSmoothingEnabled:boolean;
    mozImageSmoothingEnabled:boolean;
    msImageSmoothingEnabled:boolean;
}

export class CanvasRenderer extends AbstractCanvasRenderer {

    public readonly type:string = 'CanvasRenderer';

    protected rendererHelper:RendererHelper = new RendererHelper(this.game);

    private readonly ctx:CanvasRenderingContext2D;

    constructor(game:Game){
        super(game);
        this.registerResize();
        this.ctx = getCtx(this.container as HTMLCanvasElement);
    }

    // https://miguelmota.com/blog/pixelate-images-with-canvas/demo/
    public setPixelPerfectMode(){ // todo

        this.container.style.cssText += 'image-rendering: optimizeSpeed;' + // FireFox < 6.0
            'image-rendering: -moz-crisp-edges;' + // FireFox
            'image-rendering: -o-crisp-edges;' +  // Opera
            'image-rendering: -webkit-crisp-edges;' + // Chrome
            'image-rendering: crisp-edges;' + // Chrome
            'image-rendering: -webkit-optimize-contrast;' + // Safari
            'image-rendering: pixelated; ' + // Future browsers
            '-ms-interpolation-mode: nearest-neighbor;'; // IE

        const context:ICanvasRenderingContext2D = this.container.getContext('2d')! as ICanvasRenderingContext2D;
        context.webkitImageSmoothingEnabled = false;
        context.mozImageSmoothingEnabled = false;
        context.msImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false;
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
                dstRect.width + Math.abs(img.offset.x),
                dstRect.height + Math.abs(img.offset.y)
            );
            this.ctx.restore();
        } else {
            this.ctx.drawImage(
                (img.getResourceLink() as ResourceLink<ICanvasTexture>).getTarget().source,
                srcRect.x,
                srcRect.y,
                srcRect.width,
                srcRect.height,
                0,0,
                dstRect.width,
                dstRect.height
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
        this.ctx.rect(rect.x,rect.y,rect.width,rect.height);
        this.ctx.clip();
    }

    public unlockRect():void {
        this.ctx.restore();
    }

    public saveTransform():void {
        this.ctx.save();
    }

    public scale(x:number,y:number):void {
        this.ctx.scale(x,y);
    }

    public resetTransform():void {
        this.ctx.resetTransform();
    }

    public rotateZ(angleInRadians:number):void {
        this.ctx.rotate(angleInRadians);
    }

    public rotateY(angleInRadians:number):void {

    }

    public translate(x:number,y:number):void {
        this.ctx.translate(x,y);
    }


    public restoreTransform():void {
        this.ctx.restore();
    }

    public beginFrameBuffer():void {
        this.saveTransform();
    }
    public flipFrameBuffer():void {
        this.restoreTransform();
    }



    public beforeFrameDraw(color: Color): void {
        this.ctx.fillStyle = color.asCSS();
        this.ctx.fillRect(0,0,this.game.width,this.game.height);
    }


    public createTexture(imgData:ArrayBuffer|string, link:ResourceLink<ITexture>, onLoad:()=>void){

        this.createImageFromData(imgData,(bitmap:ImageBitmap|HTMLImageElement)=>{
            const c:HTMLCanvasElement = document.createElement('canvas');
            c.setAttribute('width',bitmap.width.toString());
            c.setAttribute('height',bitmap.height.toString());
            const ctx:CanvasRenderingContext2D = c.getContext('2d') as CanvasRenderingContext2D;
            ctx.drawImage(bitmap,0,0);
            const size:Size = new Size(bitmap.width,bitmap.height);
            const texture:ICanvasTexture = {size,source:c};
            this.renderableCache[link.getUrl()] = texture;
            link.setTarget(texture);
            onLoad();
        });

    }

    public drawLine(line: Line): void {
    }

    public drawMesh(m: Mesh): void {
    }


    public getCachedTarget(l: ResourceLink<ITexture>): Optional<ITexture> {
        return undefined;
    }

    public getError(): { code: number; desc: string } | undefined {
        return undefined;
    }


    public rotateX(a: number): void {
    }

    public skewX(a: number): void {
    }

    public skewY(a: number): void {
    }




}