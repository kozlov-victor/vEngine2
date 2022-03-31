import {Game, SCALE_STRATEGY} from "../../core/game";
import {Rect} from "../../geometry/rect";
import {Color} from "../common/color";
import {ISize, Size} from "../../geometry/size";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Ellipse} from "@engine/renderable/impl/geometry/ellipse";
import {Image} from "@engine/renderable/impl/general/image/image";
import {Mesh2d} from "@engine/renderable/abstract/mesh2d";
import {Line} from "@engine/renderable/impl/geometry/line";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ICubeMapTexture, ITexture} from "@engine/renderer/common/texture";
import {IDestroyable, Optional} from "@engine/core/declarations";
import {RendererHelper} from "@engine/renderer/abstract/rendererHelper";
import {IMatrixTransformable} from "@engine/renderer/webGl/base/matrixStack";
import {IStateStackPointer} from "@engine/renderer/webGl/base/frameBufferStack";
import {Mat4} from "@engine/geometry/mat4";
import MAT16 = Mat4.MAT16;
import {Mesh3d} from "@engine/renderable/impl/3d/mesh3d";

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
}

export abstract class AbstractRenderer implements IDestroyable,IMatrixTransformable {

    public abstract type:string;

    public container:HTMLElement;
    public clearBeforeRender:boolean = true;
    public readonly clearColor:Color = Color.RGB(0,0,0);
    public readonly viewPortSize:ISize = new Size(this.game.width,this.game.height);

    protected abstract rendererHelper: RendererHelper;

    private _fullScreenRequested:boolean = false;

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
    }

    public abstract getError():Optional<{code:number,desc:string}>;

    public abstract drawImage(img:Image):void;

    public abstract drawRectangle(rectangle:Rectangle):void;

    public abstract setLockRect(rect:Rect):void;

    public abstract unsetLockRect():void;

    public abstract drawLine(line:Line):void;

    public abstract drawMesh3d(m:Mesh3d):void;

    public abstract drawMesh2d(m:Mesh2d):void;

    public abstract drawEllipse(ellispe:Ellipse):void;

    public abstract transformReset():void;

    public abstract transformSave():void;

    public abstract transformRestore():void;

    public abstract transformTranslate(x:number, y:number, z?:number):void;

    public abstract transformRotationReset():void;

    public abstract transformScale(x:number, y:number, z?:number):void;

    public abstract transformRotateX(a:number):void;

    public abstract transformSkewX(a:number):void;

    public abstract transformSkewY(a:number):void;

    public abstract transformRotateY(a:number):void;

    public abstract transformRotateZ(a:number):void;

    public abstract transformSet(val:Readonly<MAT16>): void;

    public abstract transformGet():Readonly<MAT16>;

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
            setTimeout(()=>this.onResize(),100);
        });
        // to prevent zoom on ios
        document.addEventListener('gesturestart', (e:Event)=>e.preventDefault());
        this.container.addEventListener('gesturestart', (e:Event)=>e.preventDefault());
    }

    protected onResize():void {
        const container:HTMLElement = this.container;

        const [innerWidth,innerHeight] = AbstractRenderer.getScreenResolution();

        if (this.game.scaleStrategy===SCALE_STRATEGY.NO_SCALE) return;
        else if (this.game.scaleStrategy===SCALE_STRATEGY.STRETCH) {
            container.style.width = `${innerWidth}px`;
            container.style.height = `${innerHeight}px`;
            (this.viewPortSize as Size).setWH(innerWidth,innerHeight);
            this.game.scale.setXY(innerWidth/this.game.size.width,innerHeight/this.game.size.height);
            this.game.pos.setXY(0);
        } else {
            // else FIT
            const canvasRatio:number = this.game.size.height / this.game.size.width;
            const windowRatio:number = innerHeight / innerWidth;
            let width:number;
            let height:number;

            if (windowRatio < canvasRatio) {
                height = innerHeight;
                width = height / canvasRatio;
            } else {
                width = innerWidth;
                height = width * canvasRatio;
            }

            this.game.scale.setXY(width / this.game.size.width, height / this.game.size.height);
            this.game.pos.setXY(
                (innerWidth - width) / 2,
                (innerHeight - height) / 2
            );

            this.container.style.width = width + 'px';
            this.container.style.height = height + 'px';
            this.container.style.marginTop = `${this.game.pos.y}px`;

            (this.viewPortSize as Size).setWH(width,height);
        }

    }

    private static getScreenResolution():[number,number]{
        return [globalThis.innerWidth,globalThis.innerHeight];
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
