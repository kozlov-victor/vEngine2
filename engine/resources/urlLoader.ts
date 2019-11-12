import {DebugError} from "@engine/debug/debugError";

export interface IURLRequestHeader {
    name:string;
    value:string;
}

export interface IURLRequest {
    url:string;
    jsonp?:boolean;
    method?:'GET'|'POST';
    headers?:IURLRequestHeader[];
    responseType:'arraybuffer'|'blob'|'text';
}

const addUrlParameter = (url:string,param:string,value:string|number):string=>{
    if (url.indexOf('?')>-1) url+='&';
    else url+='?';
    return `${url}${param}=${value}`;
};

interface IWindow extends Window{
    jsonpHandler: Record<string,(data:ArrayBuffer|string)=>void>;
}

const c_IWindow = ():IWindow=>globalThis as unknown as IWindow;

const loadBase64 = (urlLoader:UrlLoader<string>,urlRequest:IURLRequest)=>{
    urlLoader.onLoad(urlRequest.url);
};

const loadViaXmlHttp = (urlLoader:UrlLoader<ArrayBuffer>,urlRequest:IURLRequest)=>{

    if (!urlRequest.method) urlRequest.method = 'GET';
    const xhr:XMLHttpRequest = new XMLHttpRequest();
    xhr.open(urlRequest.method,addUrlParameter(urlRequest.url,'modified',BUILD_AT), true);
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
            if(xhr.status === 200) {
                if (DEBUG && !urlLoader.onLoad) throw new DebugError(`urlLoader.onLoad not provided for resource with url ${urlLoader.getUrl()}`);
                urlLoader.onLoad(xhr.response);
            }
            else if (DEBUG) {
                throw new DebugError(`can not load resource with url '${urlRequest.url}', status ${xhr.status}`);
            }
        }
    };
    if (urlLoader.onProgress) {
        xhr.onprogress = (e:ProgressEvent)=>{
            urlLoader.onProgress(e.loaded / e.total);
        };
    }

    xhr.onerror=(e:Event)=> {
        console.error(e);
        if (urlLoader.onError) urlLoader.onError(e);
        if (DEBUG) throw new DebugError(`can not load resource with url ${urlRequest.url}`);
    };

    xhr.ontimeout=(e)=> {
        console.error(e);
        if (DEBUG) throw new DebugError(`can not load resource with url ${urlRequest.url}, timeout!`);
    };

    xhr.send();
};

const loadViaJsonp = (urlLoader:UrlLoader<ArrayBuffer|string>,urlRequest:IURLRequest)=>{
    const script:HTMLScriptElement = document.createElement('script');
    script.src = urlLoader.getUrl();
    if (urlLoader.onProgress) {
        script.onprogress = (e:ProgressEvent)=>{
            urlLoader.onProgress(e.loaded / e.total);
        };
    }
    script.onerror=(e:Event|string)=> {
        console.error(e);
        if (urlLoader.onError) urlLoader.onError(e);
        if (DEBUG) throw new DebugError(`can not load resource with url ${urlRequest.url}`);
    };
    const jsonpHandler:{[key:string]:(data:string|ArrayBuffer)=>void} = c_IWindow().jsonpHandler || (c_IWindow().jsonpHandler={});
    document.body.appendChild(script);
    jsonpHandler[urlRequest.url] = (data:ArrayBuffer|string):void=>{
        if (DEBUG && !urlLoader.onLoad) throw new DebugError(`urlLoader.onLoad not provided for resource with url ${urlLoader.getUrl()}`);
        urlLoader.onLoad(data);
    };
    script.onload = ()=>{
        setTimeout(()=>{
            script.remove();
            delete jsonpHandler[urlRequest.url];
        },2000);
    };
};

export class UrlLoader<T extends string|ArrayBuffer> {

    public onLoad:(buffer:T)=>void;
    public onError:(e:Event|string)=>void;
    public onProgress:(progress:number)=>void;

    constructor(private urlRequest:IURLRequest){}

    public getUrl():string{
        return this.urlRequest.url;
    }

    public load():void{
        const self:UrlLoader<string|ArrayBuffer> = this as unknown as UrlLoader<string|ArrayBuffer>;
        if (this.getUrl().indexOf('data:')===0) loadBase64(self,this.urlRequest);
        else if (this.urlRequest.jsonp) loadViaJsonp(self,this.urlRequest);
        else loadViaXmlHttp(self,this.urlRequest);
    }

}
