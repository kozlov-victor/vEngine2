import {AbstractRenderer} from "./abstractRenderer";
import {Game} from "../../core/game";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/texture";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {DebugError} from "@engine/debug/debugError";


export abstract class AbstractCanvasRenderer extends AbstractRenderer {

    public container:HTMLCanvasElement;

    protected constructor(game:Game) {
        super(game);
        const container:HTMLCanvasElement = document.createElement('canvas');
        document.body.appendChild(container);
        container.setAttribute('width',game.width.toString());
        container.setAttribute('height',game.height.toString());
        container.ondragstart = (e)=>{
            e.preventDefault();
        };
        this.container = container;
    }

    // https://miguelmota.com/blog/pixelate-images-with-canvas/demo/
    public pixelate(){
        // This is what gives us that blocky pixel styling, rather than a blend between pixels.
        this.container.style.cssText += 'image-rendering: optimizeSpeed;' + // FireFox < 6.0
            'image-rendering: -moz-crisp-edges;' + // FireFox
            'image-rendering: -o-crisp-edges;' +  // Opera
            'image-rendering: -webkit-crisp-edges;' + // Chrome
            'image-rendering: crisp-edges;' + // Chrome
            'image-rendering: -webkit-optimize-contrast;' + // Safari
            'image-rendering: pixelated; ' + // Future browsers
            '-ms-interpolation-mode: nearest-neighbor;'; // IE

        // Grab the drawing context object. It's what lets us draw on the canvas.
        const context:any = this.container.getContext('webgl2');

        // Use nearest-neighbor scaling when images are resized instead of the resizing algorithm to create blur.
        context.webkitImageSmoothingEnabled = false;
        context.mozImageSmoothingEnabled = false;
        context.msImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false;
    }


    protected createImageFromData(buffer:ArrayBuffer|string,onCreated:(img:ImageBitmap|HTMLImageElement)=>void):void{

        let imgUrl:string;
        let imgBlob:Blob;
        const isBase64:boolean =  !!((buffer as string).substr);

        if (isBase64) {
            imgUrl = buffer as string;
        } else {
            const arrayBufferView:Uint8Array = new Uint8Array(buffer as ArrayBuffer);
            imgBlob = new Blob( [arrayBufferView], {type: "image/png"}); // todo
            const urlCreator:any = window.URL;
            imgUrl = urlCreator.createObjectURL(imgBlob);
        }

        if (globalThis.createImageBitmap && !isBase64) {
            globalThis.createImageBitmap(imgBlob).
            then((bitmap:ImageBitmap)=>{
                onCreated(bitmap);
            }).catch((e:any)=>{
                console.error(e);
                if (DEBUG) {
                    setTimeout(()=>{
                        throw new DebugError(e);
                    },1);
                }
            });
        } else {
            const img:HTMLImageElement = new (window as any).Image() as HTMLImageElement;
            img.src = imgUrl;
            img.onload = ()=>{
                onCreated(img);
            };
            if (DEBUG) {
                img.onerror = ()=>{
                    console.error(buffer);
                    throw new DebugError(`can not create image. Bad url data`);
                };
            }
        }



    }

}