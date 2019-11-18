import {AbstractRenderer} from "./abstractRenderer";
import {Game} from "../../core/game";
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

    public abstract setPixelPerfectMode(mode:boolean):void;


    protected createImageFromData(buffer:ArrayBuffer|string|HTMLImageElement,onCreated:(img:ImageBitmap|HTMLImageElement)=>void):void{

        let imgUrl:string;
        let imgBlob:Blob;
        const isBase64:boolean =  !!((buffer as string).substr);
        const isImageElement = (buffer as HTMLImageElement).src!==undefined;

        if (isImageElement) {
            imgUrl = (buffer as HTMLImageElement).src;
        }
        else if (isBase64) {
            imgUrl = buffer as string;
        } else {
            const arrayBufferView:Uint8Array = new Uint8Array(buffer as ArrayBuffer);
            imgBlob = new Blob( [arrayBufferView], {type: "image/png"}); // todo
            const urlCreator:any = window.URL;
            imgUrl = urlCreator.createObjectURL(imgBlob);
        }

        if (globalThis.createImageBitmap && !isBase64 && !isImageElement) {
            globalThis.createImageBitmap(imgBlob!).
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
                    throw new DebugError(`can not create image. Bad url data: ${img.src}`);
                };
            }
        }



    }

}