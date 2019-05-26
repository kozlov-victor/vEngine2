import {DebugError} from "../../debug/debugError";
import {Game} from "../../game";
import {Rect} from "../../geometry/rect";
import {Point2d} from "../../geometry/point2d";
import {AbstractCanvasRenderer} from "../abstract/abstractCanvasRenderer";
import {Color} from "../color";
import {Size} from "../../geometry/size";
import {Rectangle} from "@engine/model/impl/ui/drawable/rectangle";
import {Image} from "@engine/model/impl/ui/drawable/image";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {Ellipse} from "@engine/model/impl/ui/drawable/ellipse";


const getCtx = (el:HTMLCanvasElement):CanvasRenderingContext2D=>{
    return (
        el.getContext("2d") as CanvasRenderingContext2D
    );
};

export class CanvasRenderer extends AbstractCanvasRenderer {

    private ctx:CanvasRenderingContext2D;

    constructor(game:Game){
        super(game);
        this.registerResize();
        this.ctx = getCtx(this.container as HTMLCanvasElement);
    }


    drawImage(img:Image):void{
        if (DEBUG) {
            if (!img.getResourceLink()) throw new DebugError(`image resource link is not set`);
            if (!this.renderableCache[img.getResourceLink().getUrl()]) throw new DebugError(`can not find texture with resource link id ${img.getResourceLink().getUrl()}`);
        }

        const srcRect:Rect = img.getSrcRect();
        const dstRect:Rect = img.getSrcRect();

        if (img.offset.x || img.offset.y) {
            const pattern:CanvasPattern = this.ctx.createPattern((img.getResourceLink().getTarget() as any) as CanvasImageSource, 'repeat');
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
                (img.getResourceLink().getTarget() as any) as CanvasImageSource, // todo
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


    drawRectangle(rectangle:Rectangle):void{
        this.ctx.fillStyle = (rectangle.fillColor as Color).asCSS();
        this.ctx.strokeStyle = rectangle.color.asCSS();
        this.ctx.lineWidth = rectangle.lineWidth;
        //this.ctx.strokeRect(0,0,rectangle.width,rectangle.height);
    }

    drawEllipse(e:Ellipse){
        const ctx:CanvasRenderingContext2D = this.ctx;
        ctx.fillStyle = e.fillColor.asCSS();
        ctx.strokeStyle = e.color.asCSS();
        ctx.beginPath();
        ctx.ellipse(0,0, e.radiusX, e.radiusY, 0, 0, 2 * Math.PI);
        //ctx.arc(e.center.x, e.center.y, e.radiusX,  0, 2 * Math.PI);
        ctx.fill();
    }


    setAlpha(a:number):void{
        this.ctx.globalAlpha = a;
    }

    lockRect(rect:Rect):void {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.rect(rect.point.x,rect.point.y,rect.size.width,rect.size.height);
        this.ctx.clip();
    }

    unlockRect():void {
        this.ctx.restore();
    }

    // clear():void {
    //     this.ctx.clearRect(0,0,this.game.width,this.game.height);
    // }
    //
    // clearColor(color:Color):void {
    //     //this.fillRect(new Rect(0,0,this.game.width,this.game.height),color);
    // }

    save():void {
        this.ctx.save();
    }

    scale(x:number,y:number):void {
        this.ctx.scale(x,y);
    }

    resetTransform():void {
        // @ts-ignore
        //noinspection BadExpressionStatementJS
        this.ctx['resetTransform']();
    }

    rotateZ(angleInRadians:number):void {
        this.ctx.rotate(angleInRadians);
    }

    rotateY(angleInRadians:number):void {
        if (DEBUG) throw new DebugError('rotateY not supported by canvasRenderer');
    }

    translate(x:number,y:number):void {
        this.ctx.translate(x,y);
    }

    restore():void {
        this.ctx.restore();
    }

    beginFrameBuffer():void {
        this.save();
    }
    flipFrameBuffer():void {
        this.restore();
    }



    beforeFrameDraw(color: Color): void {
        this.ctx.fillStyle = color.asCSS();
        this.ctx.fillRect(0,0,this.game.width,this.game.height);
    }


    loadTextureInfo(url:string,link:ResourceLink<Texture>,onLoad:()=>void){
        let img:HTMLImageElement = new (window as any).Image();
        img.src = url;
        this.renderableCache[link.getUrl()] = this.renderableCache[link.getUrl()] || {} as any;
        img.onload = ()=>{
            const c:HTMLCanvasElement = document.createElement('canvas');
            c.setAttribute('width',img.width.toString());
            c.setAttribute('height',img.height.toString());
            let ctx:CanvasRenderingContext2D = c.getContext('2d') as CanvasRenderingContext2D;
            ctx.drawImage(img as HTMLImageElement,0,0);
            let size = new Size(img.width,img.height);

            // todo
            (this.renderableCache as any)[link.getUrl()] = {
                texture: c , // todo
                name: ''
            };
            (c as any).getSize = ()=>size;
            (c as any).size = size;
            (link as any).setTarget(c);
            onLoad();
        }
    }

}