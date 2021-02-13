import {Base64, URI} from "@engine/core/declarations";
import {IURLRequest, UrlLoader} from "@engine/resources/urlLoader";

export namespace ResourceUtil {

    const loadArrayBuffer = async (req: string|IURLRequest,progress?:(n:number)=>void):Promise<ArrayBuffer>=>{
        let iReq:IURLRequest;
        if ((req as string).substr!==undefined){
            iReq = {url:req as string,responseType:'arraybuffer',method:'GET'};
        } else iReq = req as IURLRequest;
        const loader:UrlLoader<ArrayBuffer> = new UrlLoader(iReq);
        if (progress!==undefined) loader.onProgress = progress;
        return await loader.load();
    };

    const createBitmapFromBlob = async (imgBlob:Blob):Promise<ImageBitmap>=>{
        return globalThis.createImageBitmap(imgBlob);
    };

    const createHTMLImageFromUrl = async (imgUrl:URI|IURLRequest|Base64,progress?:(n:number)=>void):Promise<HTMLImageElement>=>{
        const url:string = (imgUrl as IURLRequest).url?(imgUrl as IURLRequest).url:(imgUrl as string);
        return new Promise<HTMLImageElement>((resolve,reject)=>{
            const img: HTMLImageElement = new (window as any).Image() as HTMLImageElement;
            img.src = url;
            img.onload = () => {
                resolve(img);
            };
            img.onerror = (e:string|Event) => {
                console.error(e);
                const msg:string = DEBUG?`can not create image. Bad url data: ${url}`:url;
                reject(msg);
            };
            img.onprogress = (e:ProgressEvent)=>{
                if (progress!==undefined) progress(e.loaded/e.total);
            };
        });
    };

    export const createImageFromData = async (imageData:Base64|URI|IURLRequest,progress?:(n:number)=>void):Promise<ImageBitmap|HTMLImageElement>=> {

        const isBase64: boolean = (imageData as string).substr!==undefined && (imageData as string).indexOf('data:image/') === 0;

        if (isBase64) return await createHTMLImageFromUrl(imageData as Base64);
        if (globalThis.createImageBitmap===undefined) return await createHTMLImageFromUrl(imageData as URI|IURLRequest);

        const arrayBuffer: ArrayBuffer = await loadArrayBuffer(imageData as (URI|IURLRequest),progress);
        const arrayBufferView: Uint8Array = new Uint8Array(arrayBuffer);
        const imgBlob: Blob = new Blob([arrayBufferView]);
        return  await createBitmapFromBlob(imgBlob);

    };
}
