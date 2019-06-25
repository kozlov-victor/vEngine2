/* tslint:disable:forin */
import {IKeyVal, noop} from "@engine/misc/object";

declare const setTimeout:(f:()=>void,t:number)=>number;


const objectToQuery = (o:IKeyVal<any>)=> {
    if (!o) return '';
    if (o instanceof FormData) return o;
    const paramsArr:any[] = [];
    if (typeof o==='string' || typeof o==='number')
        return o;
    for (const key in o) {
        paramsArr.push([key,encodeURIComponent(o[key])]);
    }
    return paramsArr.map((item:any)=>[item[0]+'='+item[1]]).join('&');
};

interface IRequestData {
    method: string;
    data?: any;
    url: string;
    success?: (arg:any)=>void;
    error?: (opts:{status:number,error:string})=>void;
    requestType?: string;
    timeout?: number;
    ontimeout?: ()=>void;
}

const request = (data:IRequestData)=> {
    let abortTmr:number;
    let resolved = false;
    data.method = data.method || 'get';
    if (data.data && data.method==='get') data.url+='?'+objectToQuery(data.data);
    const xhr=new XMLHttpRequest();
    let resolveFn = noop, rejectFn = noop;
    const promise = new Promise((resolve,reject)=>{
        resolveFn = resolve;
        rejectFn = reject;
    });
    xhr.onreadystatechange=()=> {
        if (xhr.readyState===4) {
            if ( xhr.status===200 || xhr.status===0) {
                let resp = xhr.responseText;
                const contentType = xhr.getResponseHeader("Content-Type")||'';
                if (contentType.toLowerCase().indexOf('json')>-1) resp = JSON.parse(resp);
                if (data.success) {
                    data.success(resp);
                }
                resolveFn(resp);
            } else {
                if (data.error) data.error({status:xhr.status,error:xhr.statusText});
                rejectFn(xhr.statusText);
            }
            clearTimeout(abortTmr);
            resolved = true;
        }
    };
    xhr.open(data.method,data.url,true);
    if (data.requestType) {
        if (data.requestType!=='multipart/form-data') // at this case header needs to be auto generated
            xhr.setRequestHeader("Content-Type", data.requestType);
    } else {
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    }
    if (data.requestType==='application/json')
        data.data = data.data && JSON.stringify(data.data);
    xhr.send(data.data);
    if (data.timeout) {
        abortTmr = setTimeout(()=>{
            if (resolved) return;
            xhr.abort();
            if (data.ontimeout) data.ontimeout();
            rejectFn('timeout');
        },data.timeout);
    }
    return promise;
};




export namespace httpClient {

    export const get = (url:string,data:IKeyVal<any>,success?:(arg:any)=>void,error?:(opts:{status:number,error:string})=>void)=>{
        return request({
            method:'get',
            url,
            data,
            success,
            error
        });
    };

    export const  post = (url:string,data:IKeyVal<any>,success?:(arg:any)=>void,error?:(opts:{status:number,error:string})=>void)=>{
        return request({
            method:'post',
            url,
            data,
            requestType:'application/json',
            success,
            error
        });
    };

    export const  postMultiPart = (url:string,file:File,data:IKeyVal<any>,success?:(arg:any)=>void,error?:(opts:{status:number,error:string})=>void)=>{
        const formData = new FormData();
        Object.keys(data).forEach((key)=>{
            formData.append(key,data[key]);
        });
        formData.append('file',file);
        formData.append('fileName',file.name);
        return request({
            method:'post',
            url,
            data: formData,
            requestType:'multipart/form-data',
            success,
            error
        });
    };

}
