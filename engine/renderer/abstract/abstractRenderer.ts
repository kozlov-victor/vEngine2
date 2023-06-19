import {Game} from "../../core/game";
import {Rect} from "../../geometry/rect";
import {Color} from "../common/color";
import {ISize, Size} from "../../geometry/size";
import type {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import type {Ellipse} from "@engine/renderable/impl/geometry/ellipse";
import type {Image} from "@engine/renderable/impl/general/image/image";
import {Mesh2d} from "@engine/renderable/abstract/mesh2d";
import type {Line} from "@engine/renderable/impl/geometry/line";
import type {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ICubeMapTexture, ITexture} from "@engine/renderer/common/texture";
import {IDestroyable, Optional} from "@engine/core/declarations";
import {RendererHelper} from "@engine/renderer/abstract/rendererHelper";
import {IMatrixTransformable, MatrixStack} from "@engine/misc/math/matrixStack";
import {Mat4} from "@engine/misc/math/mat4";
import type {Mesh3d} from "@engine/renderable/impl/3d/mesh3d";
import {ScaleStrategyFactory} from "@engine/renderer/abstract/scaleStrategy/factory/ScaleStrategyFactory";
import Mat16Holder = Mat4.Mat16Holder;
import type {BatchedImage} from "@engine/renderable/impl/general/image/batchedImage";
import {IStateStackPointer} from "@engine/renderer/webGl/base/buffer/frameBufferStack";

interface IHTMLElement extends HTMLElement{
    requestFullScreen:()=>Promise<void>;
    mozRequestFullScreen:()=>Promise<void>;
    webkitRequestFullScreen:()=>Promise<void>;
}

interface IDocument extends Document {
    cancelFullScreen?:()=>void;
    mozCancelFullScreen?:()=>void;
    webkitCancelFullScreen?:()=>void;
}

export interface IRenderTarget {
    getTexture():ITexture;
    destroy():void;
    bind():void;
    clear(color:Color,withDepth?:boolean,alphaBlendValue?:number):void;
}

export abstract class AbstractRenderer implements IDestroyable,IMatrixTransformable {

    public abstract type:string;

    public container:HTMLElement;
    public clearBeforeRender:boolean = true;
    public readonly clearColor = Color.RGB(0,0,0);
    public readonly viewPortSize:ISize = new Size(this.game.width,this.game.height);

    protected abstract rendererHelper: RendererHelper;
    protected readonly _matrixStack = new MatrixStack();

    private _fullScreenRequested:boolean = false;
    private _destroyed:boolean = false;

    private _scaleStrategy = ScaleStrategyFactory.getScaleStrategy(this.game.scaleStrategy);

    protected constructor(protected game:Game){
        this.game = game;
    }

    public requestFullScreen():void {
        const canRequest:boolean = this._requestFullScreen();
        if (canRequest) {
            const fn = ()=>{
                if (this._fullScreenRequested) this._requestFullScreen();
                document.body.removeEventListener('click',fn);
            };
            document.body.addEventListener('click',fn);
        }
    }

    public cancelFullScreen():void {
        this._fullScreenRequested =false;
        const doc:IDocument = globalThis.document as IDocument;
        if(doc.cancelFullScreen!==undefined) {
            (doc).cancelFullScreen();
        } else if(doc.mozCancelFullScreen!==undefined) {
            doc.mozCancelFullScreen();
        } else if(doc.webkitCancelFullScreen!==undefined) {
            doc.webkitCancelFullScreen();
        }
    }


    public beforeItemStackDraw(filters:IFilter[],alpha:number,forceDrawChildrenOnNewSurface:boolean):IStateStackPointer {
        return undefined!;
    }

    public afterItemStackDraw(stackPointer:IStateStackPointer):void {}

    public beforeFrameDraw():void {

    }

    public afterFrameDraw():void {}

    public destroy():void {
        globalThis.removeEventListener('resize',this.onResize);
        this._destroyed = true;
    }

    public isDestroyed(): boolean {
        return this._destroyed;
    }

    public abstract getError():Optional<{code:number,desc:string}>;

    public abstract drawImage(img:Image):void;

    public abstract drawBatchedImage(img:BatchedImage):void;

    public abstract drawRectangle(rectangle:Rectangle):void;

    public abstract setLockRect(rect:Rect):void;

    public abstract unsetLockRect():void;

    public abstract drawLine(line:Line):void;

    public abstract drawMesh3d(m:Mesh3d):void;

    public abstract drawMesh2d(m:Mesh2d):void;

    public abstract drawEllipse(ellispe:Ellipse):void;

    public transformSave():void {
        this._matrixStack.save();
    }

    public transformScale(x:number, y:number, z: number = 1):void {
        if (x===1 && y===1 && z===1) return;
        this._matrixStack.scale(x,y,z);
    }

    public transformReset():void{
        this._matrixStack.resetTransform();
    }

    public transformRotateX(angleInRadians:number):void {
        if (angleInRadians===0) return;
        this._matrixStack.rotateX(angleInRadians);
    }

    public transformRotateY(angleInRadians:number):void {
        if (angleInRadians===0) return;
        this._matrixStack.rotateY(angleInRadians);
    }

    public transformRotateZ(angleInRadians:number):void {
        if (angleInRadians===0) return;
        this._matrixStack.rotateZ(angleInRadians);
    }

    public transformTranslate(x:number, y:number, z:number):void{
        if (x===0 && y===0 && z===0) return;
        this._matrixStack.translate(x,y,z);
    }

    public transformRotationReset():void{
        this._matrixStack.rotationReset();
    }

    public transformSkewX(angle:number):void{
        if (angle===0) return;
        this._matrixStack.skewX(angle);
    }

    public transformSkewY(angle:number):void{
        if (angle===0) return;
        this._matrixStack.skewY(angle);
    }

    public transformRestore():void{
        this._matrixStack.restore();
    }

    public transformSet(val:Readonly<Mat16Holder>): void {
        this._matrixStack.setMatrix(val);
    }

    public transformGet(): Readonly<Mat16Holder> {
        return this._matrixStack.getCurrentValue();
    }


    public abstract setRenderTarget(rt:IRenderTarget):void;

    public abstract getRenderTarget():IRenderTarget;

    public killObject(r:RenderableModel):void {}


    public getHelper():RendererHelper{
        return this.rendererHelper;
    }

    public abstract createTexture(bitmap:ImageBitmap|HTMLImageElement|HTMLCanvasElement):ITexture;

    public abstract createCubeTexture(
        imgLeft:ImageBitmap|HTMLImageElement,
        imgRight:ImageBitmap|HTMLImageElement,
        imgTop:ImageBitmap|HTMLImageElement,
        imgBottom:ImageBitmap|HTMLImageElement,
        imgFront:ImageBitmap|HTMLImageElement,
        imgBack:ImageBitmap|HTMLImageElement
    ):ICubeMapTexture;


    protected registerResize():void {
        this.onResize();
        globalThis.addEventListener('resize', () => {
            this.onResize();
            setTimeout(()=>this.onResize(),1000);
        });
        // to prevent zoom on ios
        document.addEventListener('gesturestart', (e:Event)=>e.preventDefault());
        this.container.addEventListener('gesturestart', (e:Event)=>e.preventDefault());
    }

    protected onResize():void {
        const container = this.container as HTMLCanvasElement;
        this._scaleStrategy.onResize(container,this.game,this);
        window.scrollTo(0, 1);
    }

    private _requestFullScreen():boolean {
        const element:IHTMLElement = this.container as IHTMLElement;
        this._fullScreenRequested = true;
        let canRequest:boolean = false;
        if(element.requestFullScreen) {
            element.requestFullScreen();
            canRequest = true;
        } else if(element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
            canRequest = true;
        } else if(element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
            canRequest = true;
        }
        return canRequest;
    }
}
