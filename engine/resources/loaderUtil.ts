
export namespace LoaderUtil {
    export const loadRaw = (url:string,responsetype:'arraybuffer'|'blob'|'text',onLoad:(buffer:ArrayBuffer|string)=>void)=> {
        const request:XMLHttpRequest = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = responsetype;

        if (responsetype!=='text') {
            request.setRequestHeader('Accept-Ranges', 'bytes');
            request.setRequestHeader('Content-Range', 'bytes');
        }

        request.onload = function() {
            onLoad(request.response);
        };
        // request.onprogress = function(e){
        //     if (progress) progress(url,e.loaded / e.total);
        // };

        if (DEBUG) {
            request.onerror=function(e){
                console.error(e);
                throw 'can not load resource with url '+url};
        }

        request.send();
    };
}