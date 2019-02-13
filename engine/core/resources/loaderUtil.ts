
export class LoaderUtil {
    static loadBinary(url:string,onLoad:(buffer:ArrayBuffer)=>void) {
        let request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        request.setRequestHeader('Accept-Ranges', 'bytes');
        request.setRequestHeader('Content-Range', 'bytes');

        request.onload = function() {
            onLoad(request.response as ArrayBuffer);
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