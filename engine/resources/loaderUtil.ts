
import {DebugError} from "@engine/debug/debugError";
export namespace LoaderUtil {
    export const loadRaw = (url:string,responsetype:'arraybuffer'|'blob'|'text',onLoad:(buffer:ArrayBuffer|string)=>void)=> {
        const request:XMLHttpRequest = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = responsetype;

        if (responsetype!=='text') {
            request.setRequestHeader('Accept-Ranges', 'bytes');
            request.setRequestHeader('Content-Range', 'bytes');
        }

        request.onload = ()=> {
            if (request.readyState == 4) {
                if(request.status == 200) onLoad(request.response);
                else if (DEBUG) {
                    throw new DebugError(`can not load resource with url '${url}', status ${request.status}`);
                }
            }
        };
        request.onprogress = function(e){
            //if (progress) progress(url,e.loaded / e.total);
        };

        if (DEBUG) {
            request.onerror=(e)=> {
                console.error(e);
                throw new DebugError(`can not load resource with url ${url}`);
            };
            request.ontimeout=(e)=> {
                console.error(e);
                throw new DebugError(`can not load resource with url ${url}, timeout!`);
            }
        }
        request.send();
    }
}