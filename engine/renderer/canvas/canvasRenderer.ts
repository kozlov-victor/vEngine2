import {DebugError} from "../../debug/debugError";
import {Game} from "../../core/game";
import {Rect} from "../../geometry/rect";
import {AbstractCanvasRenderer} from "../abstract/abstractCanvasRenderer";
import {Color} from "../common/color";
import {Size} from "../../geometry/size";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Image} from "@engine/renderable/impl/general/image";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Ellipse} from "@engine/renderable/impl/geometry/ellipse";
import {ITexture} from "@engine/renderer/common/texture";
import {Mesh} from "@engine/renderable/abstract/mesh";
import {Line} from "@engine/renderable/impl/geometry/line";
import {RendererHelper} from "@engine/renderer/abstract/rendererHelper";
import {AbstractGlFilter} from "@engine/renderer/webGl/filters/abstract/abstractGlFilter";
import {IStateStackPointer} from "@engine/renderer/webGl/base/frameBufferStack";


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

    public setLockRect(rect:Rect):void {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.rect(rect.x,rect.y,rect.width,rect.height);
        this.ctx.clip();
    }

    public unsetLockRect():void {
        this.ctx.restore();
    }

    public transformSave():void {
        this.ctx.save();
    }

    public transformScale(x:number, y:number):void {
        this.ctx.scale(x,y);
    }

    public transformReset():void {
        this.ctx.resetTransform();
    }

    public transformRotateZ(angleInRadians:number):void {
        this.ctx.rotate(angleInRadians);
    }

    public transformRotateY(angleInRadians:number):void {

    }

    public transformTranslate(x:number, y:number):void {
        this.ctx.translate(x,y);
    }

    public transformSet(v0: number, v1: number, v2: number, v3: number, v4: number, v5: number, v6: number, v7: number, v8: number, v9: number, v10: number, v11: number, v12: number, v13: number, v14: number, v15: number): void {
    }

    public transformRestore():void {
        this.ctx.restore();
    }

    public beginFrameBuffer():void {
        this.transformSave();
    }
    public flipFrameBuffer():void {
        this.transformRestore();
    }

    public beforeFrameDraw(filters:AbstractGlFilter[]): IStateStackPointer {
        if (!this.clearBeforeRender) return undefined!;
        this.ctx.fillStyle = this.clearColor.asCSS();
        this.ctx.fillRect(0,0,this.game.size.width,this.game.size.height);
        return undefined!;
    }


    public createTexture(bitmap:HTMLImageElement|ImageBitmap){
        const c:HTMLCanvasElement = document.createElement('canvas');
        c.setAttribute('width',bitmap.width.toString());
        c.setAttribute('height',bitmap.height.toString());
        const ctx:CanvasRenderingContext2D = c.getContext('2d') as CanvasRenderingContext2D;
        ctx.drawImage(bitmap,0,0);
        const size:Size = new Size(bitmap.width,bitmap.height);
        return {size,source:c};
    }

    public drawLine(line: Line): void {
    }

    public drawMesh(m: Mesh): void {
    }


    public getError(): { code: number; desc: string } | undefined {
        return undefined;
    }


    public transformRotateX(a: number): void {
    }

    public transformSkewX(a: number): void {
    }

    public transformSkewY(a: number): void {
    }




}
