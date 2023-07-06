import {Registry} from "./registry/registry";
import type {IncomingMessage, ServerResponse} from 'http';
import {Static} from "./static/static";
import {ValidationError} from "./type/type";

declare const __non_webpack_require__:any;

const http = __non_webpack_require__('http');
const urlModule = __non_webpack_require__('url');

const guessContentType = (obj:any):string=>{
    if (obj instanceof Buffer) return 'application/octet-stream';
    if (Array.isArray(obj) || typeof obj ==='object') return 'application/json';
    return 'text/plain';
}

const writeResultToResponse = (result:any, res:ServerResponse,contentType?:string):void=>{
    if (!contentType) contentType = guessContentType(result);
    res.setHeader('content-type',contentType);
    if (result.charAt!==undefined) {
        res.end(result);
    } else {
        if (contentType?.includes('json')) res.end(JSON.stringify(result));
        else res.end(result);
    }
}

const writeErrorToResponse = (error:any,status:number,res:ServerResponse):void=>{
    res.writeHead(status);
    try {
        res.end(JSON.stringify(error));
    } catch (e) {
        res.end(error.toString());
    }
    console.log(error);
}

const getReqBody = (request:IncomingMessage):Promise<string>=> {
    return new Promise<string>((resolve, reject) => {
        const body:any[] = [];
        request.on('error', (err:any) => {
            reject(err);
        }).on('data', (chunk:any) => {
            body.push(chunk);
        }).on('end', () => {
            resolve(Buffer.concat(body).toString());
        });
    })
}

const requestListener = async (req:IncomingMessage, res:ServerResponse)=> {
    const headers = req.headers;
    const method = req.method;
    const parsedUrl = urlModule.parse(req.url, true);
    let url:string = parsedUrl.pathname;
    if (!url.endsWith('/')) url = url + '/';

    if (Static.has(url)) {
        const staticResp = Static.get(url);
        writeResultToResponse(staticResp.result,res,staticResp.contentType);
        return;
    }

    const queryObject = parsedUrl.query;
    const bodyRaw = await getReqBody(req);
    let body:Record<string, any> = {};
    if (bodyRaw) body = JSON.parse(bodyRaw);
    const params:Record<string, any> = {};
    Object.keys(queryObject).forEach(k=>params[k]=queryObject[k]);
    Object.keys(body).forEach(k=>params[k]=body[k]);

    for (const registryItem of Registry.getInstance().registry) {
        if (url===registryItem.url && method===registryItem.method) {
            try {
                const result =
                    await registryItem.controllerInstance[registryItem.controllerMethodName].
                    call(registryItem.controllerInstance,params);
                if (!result) {
                    res.writeHead(203);
                    res.end();
                }
                writeResultToResponse(result,res,registryItem.contentType);
                return;
            } catch (e:any) {
                const status = e.type==='ValidationError'?400:500;
                writeErrorToResponse(e, status, res);
                return;
            }
        }
    }
    res.writeHead(404);
    res.end();
}

const PORT = 8088;
export const init = ()=>{
    const server = http.createServer(requestListener);
    server.listen(PORT);
    console.log(`server is running`);
    console.log(`http://localhost:${PORT}`);
}
