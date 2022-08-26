import {DebugError} from "../../debug/debugError";
import {Game} from "../../core/game";
import {Rect} from "../../geometry/rect";
import {AbstractCanvasRenderer} from "../abstract/abstractCanvasRenderer";
import type {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import type {Image} from "@engine/renderable/impl/general/image/image";
import type {Ellipse} from "@engine/renderable/impl/geometry/ellipse";
import {ICubeMapTexture} from "@engine/renderer/common/texture";
import type {Mesh2d} from "@engine/renderable/abstract/mesh2d";
import type {Line} from "@engine/renderable/impl/geometry/line";
import {Mat4} from "@engine/misc/math/mat4";
import type {Mesh3d} from "@engine/renderable/impl/3d/mesh3d";
import {CanvasRendererHelper} from "@engine/renderer/canvas/canvasRendererHelper";
import {CanvasRenderTarget} from "@engine/renderer/canvas/canvasRenderTarget";
import {CanvasTexture} from "@engine/renderer/canvas/canvasTexture";
import Mat16Holder = Mat4.Mat16Holder;


interface ICanvasRenderingContext2DEx extends CanvasRenderingContext2D {
    webkitImageSmoothingEnabled:boolean;
    mozImageSmoothingEnabled:boolean;
    msImageSmoothingEnabled:boolean;
}

export class CanvasRenderer extends AbstractCanvasRenderer {

    public readonly type:string = 'CanvasRenderer';

    protected rendererHelper = new CanvasRendererHelper(this.game);

    private mat = new Mat4.Mat16Holder();

    private renderTarget:CanvasRenderTarget;

    constructor(game:Game){
        super(game);
        this.registerResize();
        Mat4.makeIdentity(this.mat);
        this.renderTarget = new CanvasRenderTarget(this.game,this.game.size,this.container);
    }

    public override setPixelPerfect(val:boolean):void{ // todo val

        this.container.style.cssText += 'image-rendering: optimizeSpeed;' + // FireFox < 6.0
            'image-rendering: -moz-crisp-edges;' + // FireFox
            'image-rendering: -o-crisp-edges;' +  // Opera
            'image-rendering: -webkit-crisp-edges;' + // Chrome
            'image-rendering: crisp-edges;' + // Chrome
            'image-rendering: -webkit-optimize-contrast;' + // Safari
            'image-rendering: pixelated; ' + // Future browsers
            '-ms-interpolation-mode: nearest-neighbor;'; // IE

        const context = this.container.getContext('2d') as ICanvasRenderingContext2DEx;
        context.webkitImageSmoothingEnabled = false;
        context.mozImageSmoothingEnabled = false;
        context.msImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false;
    }

    public drawImage(img:Image):void{

        const srcRect:Rect = img.getSrcRect();
        const dstRect:Rect = img.getSrcRect();

        const ctx = this.renderTarget.getTexture().getContext();
        if (img.offset.x || img.offset.y) {
            const pattern:CanvasPattern = ctx.createPattern(
                (img.getTexture() as CanvasTexture).getCanvas(),
                'repeat') as CanvasPattern;
            ctx.fillStyle = pattern;

            ctx.save();
            ctx.translate(-img.offset.x,-img.offset.y);

            ctx.fillRect(
                0,0,
                dstRect.width + Math.abs(img.offset.x),
                dstRect.height + Math.abs(img.offset.y)
            );
            ctx.restore();
        } else {
            ctx.drawImage(
                (img.getTexture() as CanvasTexture).getCanvas(),
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
        const ctx = this.renderTarget.getTexture().getContext();
        ctx.fillStyle = rectangle.fillColor.asCssRgba();
        ctx.strokeStyle = rectangle.color.asCssRgba();
        ctx.lineWidth = rectangle.lineWidth;
        ctx.fillRect(0,0,rectangle.size.width,rectangle.size.height);
        ctx.strokeRect(0,0,rectangle.size.width,rectangle.size.height);
    }

    public drawEllipse(e:Ellipse):void{
        const ctx = this.renderTarget.getTexture().getContext();
        ctx.fillStyle = e.fillColor.asCssRgba();
        ctx.strokeStyle = e.color.asCssRgba();
        ctx.beginPath();
        ctx.ellipse(0,0, e.radiusX, e.radiusY, 0, 0, 2 * Math.PI);
        //ctx.arc(e.center.x, e.center.y, e.radiusX,  0, 2 * Math.PI);
        ctx.fill();
    }


    public setAlpha(a:number):void{
        const ctx = this.renderTarget.getTexture().getContext();
        ctx.globalAlpha = a;
    }

    public setLockRect(rect:Rect):void {
        const ctx = this.renderTarget.getTexture().getContext();
        ctx.save();
        ctx.beginPath();
        ctx.rect(rect.x,rect.y,rect.width,rect.height);
        ctx.clip();
    }

    public unsetLockRect():void {
        const ctx = this.renderTarget.getTexture().getContext();
        ctx.restore();
    }

    public override transformSave():void {
        super.transformSave();
        const ctx = this.renderTarget.getTexture().getContext();
        ctx.save();
    }

    public override transformScale(x:number, y:number):void {
        super.transformScale(x,y);
        const ctx = this.renderTarget.getTexture().getContext();
        ctx.scale(x,y);
    }

    public override transformReset():void {
        super.transformReset();
        const ctx = this.renderTarget.getTexture().getContext();
        ctx.resetTransform();
    }

    public override transformRotateZ(angleInRadians:number):void {
        super.transformRotateZ(angleInRadians);
        const ctx = this.renderTarget.getTexture().getContext();
        ctx.rotate(angleInRadians);
    }

    public override transformSkewX(a: number): void {
        super.transformSkewX(a);
    }

    public override transformSkewY(a: number): void {
        super.transformSkewY(a);
    }

    public override transformTranslate(x:number, y:number):void {
        super.transformTranslate(x,y);
        const ctx = this.renderTarget.getTexture().getContext();
        ctx.translate(x,y);
    }


    public override transformSet(val:Readonly<Mat16Holder>): void {
        super.transformSet(val);
        const ctx = this.renderTarget.getTexture().getContext();

        // a (m11) Horizontal scaling. A value of 1 results in no scaling.
        // b (m12) Vertical skewing.
        // c (m21) Horizontal skewing.
        // d (m22) Vertical scaling. A value of 1 results in no scaling.
        // e (dx) Horizontal translation (moving).
        // f (dy) Vertical translation (moving).

        const a = val.mat16[0];
        const b = val.mat16[1];
        const c = val.mat16[4];
        const d = val.mat16[5];
        const e = val.mat16[12];
        const f = val.mat16[13];

        ctx.setTransform(a,b,c,d,e,f);
    }


    public override transformRestore():void {
        super.transformRestore();
        const ctx = this.renderTarget.getTexture().getContext();
        ctx.restore();
    }



    public override beforeFrameDraw(): void {
        if (!this.clearBeforeRender) return;
        this.renderTarget.clear(this.clearColor);
    }


    public createTexture(bitmap:HTMLImageElement|ImageBitmap|HTMLCanvasElement):CanvasTexture {
        const texture = new CanvasTexture(this.game,{width:bitmap.width,height:bitmap.height});
        texture.getContext().drawImage(bitmap,0,0);
        return texture;
    }

    public createCubeTexture(
        imgLeft:ImageBitmap|HTMLImageElement,
        imgRight:ImageBitmap|HTMLImageElement,
        imgTop:ImageBitmap|HTMLImageElement,
        imgBottom:ImageBitmap|HTMLImageElement,
        imgFront:ImageBitmap|HTMLImageElement,
        imgBack:ImageBitmap|HTMLImageElement
    ): ICubeMapTexture {
        if (DEBUG) throw new DebugError(`Cube texture is not supported by this renderer`);
        return undefined!;
    }



    public drawLine(line: Line): void {
    }

    public drawMesh3d(m: Mesh3d): void {
    }

    public drawMesh2d(m: Mesh2d): void {
    }

    public getError(): { code: number; desc: string } | undefined {
        return undefined;
    }

    public getRenderTarget(): CanvasRenderTarget {
        return this.renderTarget;
    }

    public setRenderTarget(rt: CanvasRenderTarget): void {
        this.renderTarget = rt;
    }






}
