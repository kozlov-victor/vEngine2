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

const addUrlParameter = (url:string,param:string,value:string|number):string=>{
    if (url.indexOf('?')>-1) url+='&';
    else url+='?';
    return `${url}${param}=${value}`;
};

const loadBase64 = (urlRequest:IURLRequest):Promise<string>=>{
    return Promise.resolve(urlRequest.url);
};

const loadViaXmlHttp = <T>(urlRequest:IURLRequest,onProgress?:(n:number)=>void):Promise<T>=>{

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

    return new Promise<T>((resolve,reject)=>{
        xhr.onload = ()=> {
            if (xhr.readyState === 4) {
                if(xhr.status === 200) {
                    resolve(xhr.response);
                }
                else {
                    const message:string = DEBUG?`can not load resource with url '${urlRequest.url}', status ${xhr.status}`:urlRequest.url;
                    reject(message);
                }
            }
        };
        if (onProgress) {
            xhr.onprogress = (e:ProgressEvent)=>{
                if (e.total!==0) onProgress(e.loaded / e.total);
            };
        }

        xhr.onerror=(e:Event)=> {
            console.error(e);
            const rejectError:string = DEBUG?`can not load resource with url ${urlRequest.url}`:urlRequest.url;
            reject(rejectError);
        };

        xhr.ontimeout=(e)=> {
            console.error(e);
            const rejectError:string = DEBUG?`can not load resource with url ${urlRequest.url}`:urlRequest.url;
            reject(rejectError);
        };

        xhr.send();
    });
};


export class UrlLoader<T extends string|ArrayBuffer> {

    public onProgress:(progress:number)=>void;

    constructor(private urlRequest:IURLRequest){}

    public getUrl():string{
        return this.urlRequest.url;
    }

    public async load():Promise<T>{
        if (this.getUrl().indexOf('data:')===0) return loadBase64(this.urlRequest) as Promise<T>;
        else return loadViaXmlHttp(this.urlRequest,this.onProgress);
    }
}
