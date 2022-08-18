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

    export const createImageFromData = async (imgUrl:URI|IURLRequest|Base64,progress?:(n:number)=>void):Promise<HTMLImageElement>=>{
        const url:string = (imgUrl as IURLRequest).url?(imgUrl as IURLRequest).url:(imgUrl as string);
        return new Promise<HTMLImageElement>((resolve,reject)=>{
            const img: HTMLImageElement = new window.Image() as HTMLImageElement;
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

}
