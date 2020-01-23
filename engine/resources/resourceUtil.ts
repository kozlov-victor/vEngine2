import {Base64, URI} from "@engine/core/declarations";
import {DebugError} from "@engine/debug/debugError";

export namespace ResourceUtil {

    export const createImageFromData = (
        imageData:ArrayBuffer|Base64|URI,
        onCreated:(img:ImageBitmap|HTMLImageElement)=>void
    )=> {

        let imgUrl: string;
        let imgBlob: Blob;
        const isBase64: boolean = !!((imageData as string).substr) && ((imageData as string).indexOf('data:image/') === 0);
        const isURI = !isBase64 && !!((imageData as string).substr);

        if (isURI || isBase64) {
            imgUrl = imageData as string;
        } else {
            const arrayBufferView: Uint8Array = new Uint8Array(imageData as ArrayBuffer);
            imgBlob = new Blob([arrayBufferView], {type: "image/png"}); // todo
            const urlCreator: any = window.URL;
            imgUrl = urlCreator.createObjectURL(imgBlob);
        }

        if (globalThis.createImageBitmap && !isBase64 && !isURI) {
            globalThis.createImageBitmap(imgBlob!).then((bitmap: ImageBitmap) => {
                onCreated(bitmap);
            }).catch((e: any) => {
                console.error(e);
                if (DEBUG) {
                    setTimeout(() => {
                        throw new DebugError(e);
                    }, 1);
                }
            });
        } else {
            const img: HTMLImageElement = new (window as any).Image() as HTMLImageElement;
            img.src = imgUrl;
            img.onload = () => {
                onCreated(img);
            };
            if (DEBUG) {
                img.onerror = () => {
                    console.error(imageData);
                    throw new DebugError(`can not create image. Bad url data: ${img.src}`);
                };
            }
        }

    };
}
