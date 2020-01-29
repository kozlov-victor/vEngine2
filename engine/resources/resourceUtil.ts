import {Base64, URI} from "@engine/core/declarations";
import {DebugError} from "@engine/debug/debugError";
import {IURLRequest, UrlLoader} from "@engine/resources/urlLoader";
import {Queue, TaskRef} from "@engine/resources/queue";

export namespace ResourceUtil {

    const loadArrayBuffer = (req: string|IURLRequest,q:Queue,taskRef:TaskRef):Promise<ArrayBuffer>=>{
        return new Promise<ArrayBuffer>((resolve,reject)=>{
            let iReq:IURLRequest;
            if ((req as string).substr!==undefined){
                iReq = {url:req as string,responseType:'arraybuffer',method:'GET'};
            } else iReq = req as IURLRequest;
            const loader:UrlLoader<ArrayBuffer> = new UrlLoader(iReq);
            loader.onProgress = (n:number)=>q.progressTask(taskRef,n);
            loader.onLoad = (buffer:ArrayBuffer)=>{
                resolve(buffer);
            };
            loader.onError = (e:Event|string)=>{
                reject(e);
            };
            loader.load();
        });
    };

    const createBitmapFromBlob = (imgBlob:Blob):Promise<ImageBitmap>=>{
        const p = globalThis.createImageBitmap(imgBlob!);
        p.catch((e: string) => {
            console.error(e);
        });
        return p;
    };

    const createHTMLImageFromUrl = (imgUrl:URI|IURLRequest|Base64):Promise<HTMLImageElement>=>{
        const url:string = (imgUrl as IURLRequest).url?(imgUrl as IURLRequest).url:(imgUrl as string);
        return new Promise<HTMLImageElement>((resolve,reject)=>{
            const img: HTMLImageElement = new (window as any).Image() as HTMLImageElement;
            img.src = url;
            img.onload = () => {
                resolve(img);
            };
            if (DEBUG) {
                img.onerror = (e:string|Event) => {
                    console.error(e);
                    const msg:string = DEBUG?`can not create image. Bad url data: ${url}`:url;
                    reject(msg);
                };
            }
        });
    };

    export const createImageFromData = async (imageData:Base64|URI|IURLRequest, q:Queue,taskRef:TaskRef):Promise<ImageBitmap|HTMLImageElement>=> {

        try {
            const isBase64: boolean = (imageData as string).substr!==undefined && (imageData as string).indexOf('data:image/') === 0;

            if (isBase64) return await createHTMLImageFromUrl(imageData as Base64);
            if (globalThis.createImageBitmap===undefined) return await createHTMLImageFromUrl(imageData as URI|IURLRequest);

            const arrayBuffer: ArrayBuffer = await loadArrayBuffer(imageData as (URI|IURLRequest),q,taskRef);
            const arrayBufferView: Uint8Array = new Uint8Array(arrayBuffer);
            const imgBlob: Blob = new Blob([arrayBufferView]);
            return await createBitmapFromBlob(imgBlob);
        }catch (e) {
            if (DEBUG) {
                setTimeout(()=>{throw new DebugError(e);},0);
            }
            return undefined!;
        }



    };
}
