
declare const __non_webpack_require__:any;

const fs = __non_webpack_require__('fs');



export namespace Static {

    const getContentType = (url:string):{type?:string,stream:boolean}=>{
        const ext = url.split('.').pop();
        switch (ext) {
            case 'js':
                return {type:'text/javaScript',stream:false};
            case 'otf':
                return {type:'application/octet-stream',stream:true};
            default:
                return {type:undefined,stream:true};
        }
    }

    const getUrl = (url:string):string=>{
        let exactUrl = `.${url}`;
        if (exactUrl.endsWith('/')) {
            exactUrl = exactUrl.substr(0,exactUrl.length-1);
        }
        return exactUrl;
    }

    export const has = (url:string):boolean=>{
        if (!url.includes('.')) return false;
        return fs.existsSync(getUrl(url));
    }

    export const get = (url:string):{contentType?:string,result:any}=>{
        const contentType = getContentType(url);
        const staticUrl = getUrl(url);
        const content = fs.readFileSync(staticUrl,contentType.stream?undefined:'utf8');
        return {
            contentType: contentType.type,
            result: content,
        }
    }

}
