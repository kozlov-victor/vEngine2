import {DebugError} from "@engine/debug/debugError";

export interface IURLRequestHeader {
    name:string;
    value:string;
}

export interface IURLRequest {
    url:string;
    method?:'GET'|'POST';
    headers?:IURLRequestHeader[];
    responseType:'arraybuffer'|'blob'|'text';

}

export class UrlLoader {

    public static addUrlParameter(url:string,param:string,value:string|number):string{
        if (url.indexOf('?')>-1) url+='&';
        else url+='?';
        return `${url}${param}=${value}`;
    }

    public onLoad:(buffer:ArrayBuffer|string)=>void;
    public onError:(e:any)=>void;
    public onProgress:(progress:number)=>void;

    constructor(private urlRequest:IURLRequest|string){}

    public load():void{

        let urlRequest:IURLRequest;
        if ((this.urlRequest as string).substr!==undefined){
            urlRequest = {url:this.urlRequest as string,responseType:'text',method:'GET'};
        } else urlRequest = this.urlRequest as IURLRequest;

        if (!urlRequest.method) urlRequest.method = 'GET';
        const xhr:XMLHttpRequest = new XMLHttpRequest();
        xhr.open(urlRequest.method,UrlLoader.addUrlParameter(urlRequest.url,'modified',BUILD_AT), true);
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
        if (this.onProgress) {
            xhr.onprogress = (e)=>{
                this.onProgress(e.loaded / e.total);
            };
        }

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
