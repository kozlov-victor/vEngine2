import {DebugError} from "../../../debugError";
import {Game} from "../../game";
import {Rect} from "../../geometry/rect";
import {Point2d} from "../../geometry/point2d";
import {AbstractCanvasRenderer} from "../abstract/abstractCanvasRenderer";
import {Color} from "../color";
import {Size} from "../../geometry/size";
import {Rectangle} from "@engine/model/impl/ui/drawable/rectangle";
import {Image} from "@engine/model/impl/ui/drawable/image";
import {ResourceLink} from "@engine/core/resources/resourceLink";


const getCtx = (el:HTMLCanvasElement):CanvasRenderingContext2D=>{
    return (
        el.getContext("2d")
    );
};

export class CanvasRenderer extends AbstractCanvasRenderer {

    private ctx:CanvasRenderingContext2D;

    constructor(game:Game){
        super(game);
        this.registerResize();
        this.ctx = getCtx(this.container as HTMLCanvasElement);
    }


    drawImage(img:Image){
        if (DEBUG) {
            if (!img.getResourceLink()) throw new DebugError(`image resource link is not set`);
            if (!this.renderableCache[img.getResourceLink().getId()]) throw new DebugError(`can not find texture with resource link id ${img.getResourceLink().getId()}`);
        }
        let srcRect:Rect = img.srcRect;
        let dstRect:Rect = img.getRect();
        this.ctx.drawImage(
            this.renderableCache[img.getResourceLink().getId()].texture,
            srcRect.point.x,
            srcRect.point.y,
            srcRect.size.width,
            srcRect.size.height,
            dstRect.point.x,
            dstRect.point.y,
            dstRect.size.width,
            dstRect.size.height
        );
    }

    drawTiledImage(texturePath:string,
                   srcRect:Rect,
                   dstRect:Rect,
                   offset:Point2d){

    }

    drawRectangle(rectangle:Rectangle){
        this.ctx.fillStyle = (rectangle.fillColor as Color).asCSS();
        this.ctx.strokeStyle = rectangle.color.asCSS();
        this.ctx.lineWidth = rectangle.lineWidth;
        //this.ctx.strokeRect(0,0,rectangle.width,rectangle.height);
    }

    // drawLine(point1:Point2d,point2:Point2d,color){ // todo
    //     this.ctx.fillStyle = color;
    //     this.ctx.beginPath();
    //     this.ctx.moveTo(point1.x,point1.y);
    //     this.ctx.lineTo(point2.x,point2.y);
    //     this.ctx.stroke();
    // }

    // fillCircle(x:number,y:number,r:number,color:Color){
    //     let cssCol:string = color.asCSS();
    //     let ctx = this.ctx;
    //     ctx.beginPath();
    //     ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    //     ctx.fillStyle = cssCol;
    //     ctx.strokeStyle = cssCol;
    //     ctx.fill();
    //     ctx.stroke();
    //     ctx.closePath();
    // }

    setAlpha(a:number){
        this.ctx.globalAlpha = a;
    }

    lockRect(rect:Rect) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.rect(rect.point.x,rect.point.y,rect.size.width,rect.size.height);
        this.ctx.clip();
    }

    unlockRect(){
        this.ctx.restore();
    }

    clear(){
        this.ctx.clearRect(0,0,this.game.width,this.game.height);
    }

    clearColor(color:Color){
        //this.fillRect(new Rect(0,0,this.game.width,this.game.height),color);
    }

    save() {
        this.ctx.save();
    }

    scale(x:number,y:number) {
        this.ctx.scale(x,y);
    }

    resetTransform(){
        // @ts-ignore
        //noinspection BadExpressionStatementJS
        this.ctx['resetTransform']();
    }

    rotateZ(angleInRadians:number) {
        this.ctx.rotate(angleInRadians);
    }

    rotateY(angleInRadians:number) {
        if (DEBUG) throw new DebugError('rotateY not supported by canvasRenderer');
    }

    translate(x:number,y:number){
        this.ctx.translate(x,y);
    }

    restore(){
        this.ctx.restore();
    }

    beginFrameBuffer(){
        this.save();
    }
    flipFrameBuffer(){
        this.restore();
    }


    loadTextureInfo(url:string,link:ResourceLink,onLoad:()=>void){
        let img:HTMLImageElement = new (window as any).Image();
        img.src = url;
        this.renderableCache[link.getId()] = this.renderableCache[link.getId()] || {} as any;
        img.onload = ()=>{
            let c = document.createElement('canvas');
            c.setAttribute('width',img.width.toString());
            c.setAttribute('height',img.height.toString());
            let ctx = c.getContext('2d');
            ctx.drawImage(img as HTMLImageElement,0,0);
            let size = new Size(img.width,img.height);
            this.renderableCache[link.getId()] = {
                texture: c,
                size,
                name: undefined
            };
            (c as any).getSize = ()=>size;
            onLoad();
        }
    }

}