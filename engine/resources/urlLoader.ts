import {DebugError} from "@engine/debug/debugError";

export interface IURLRequestHeader {
    name:string;
    value:string;
}

export interface IURLRequest {
    url:string;
    headers?:IURLRequestHeader[];
    responseType:'arraybuffer'|'blob'|'text';

}

export class UrlLoader {

    public onLoad:(buffer:ArrayBuffer|string)=>void;
    public onError:(e:any)=>void;
    public onProgress:(progress:number)=>void;

    constructor(private urlRequest:IURLRequest|string){}

    public load():void{

        let urlRequest:IURLRequest;
        if ((this.urlRequest as string).substr!==undefined){
            urlRequest = {url:this.urlRequest as string,responseType:'text'};
        } else urlRequest = this.urlRequest as IURLRequest;

        const xhr:XMLHttpRequest = new XMLHttpRequest();
        xhr.open('GET',urlRequest.url, true);
        xhr.responseType = urlRequest.responseType;

        if (xhr.responseType==='blob') {
            xhr.setRequestHeader('Accept-Ranges', 'bytes');
            xhr.setRequestHeader('Content-Range', 'bytes');
        }

        if (urlRequest.headers) {
            for (const header of urlRequest.headers) xhr.setRequestHeader(header.name,header.value);
        }

        xhr.onload = ()=> {
            if (xhr.readyState === 4) {
                if(xhr.status === 200 && this.onLoad!==undefined) this.onLoad(xhr.response);
                else if (DEBUG) {
                    throw new DebugError(`can not load resource with url '${urlRequest.url}', status ${xhr.status}`);
                }
            }
        };
        xhr.onprogress = (e)=>{
            //if (progress) progress(url,e.loaded / e.total);
        };

        if (DEBUG) {
            xhr.onerror=(e)=> {
                console.error(e);
                throw new DebugError(`can not load resource with url ${urlRequest.url}`);
            };
            xhr.ontimeout=(e)=> {
                console.error(e);
                throw new DebugError(`can not load resource with url ${urlRequest.url}, timeout!`);
            };
        }
        xhr.send();
    }

}
